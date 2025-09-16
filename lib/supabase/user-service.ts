import { supabase } from '@/lib/supabase'

export interface User {
    id: string
    email: string
    name?: string // Derivado de full_name ou email
    full_name?: string // Campo real da tabela
    avatar_url?: string
    role?: string
    department?: string
    phone?: string
    is_active?: boolean // Campo real da tabela
    is_approved?: boolean // Campo real da tabela
    approved_by?: string
    approved_at?: string
    created_at: string
    updated_at?: string
}

export class UserService {
    static async getUsers(): Promise<{
        users: User[]
        error: any
    }> {
        try {
            // Buscar usuários do sistema via auth.users (se disponível) ou uma tabela profiles
            const { data, error } = await supabase
                .from('profiles')
                .select('id, email, name, avatar_url, role, created_at')
                .order('name')

            if (error) {
                console.error('Error fetching users:', error)
                return { users: [], error }
            }

            return { users: data || [], error: null }
        } catch (error) {
            console.error('UserService.getUsers error:', error)
            return { users: [], error }
        }
    }

    static async getCurrentUser(): Promise<{
        user: User | null
        error: any
    }> {
        try {
            const { data: authData, error: authError } = await supabase.auth.getUser()
            
            if (authError || !authData.user) {
                return { user: null, error: authError }
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('id, email, name, avatar_url, role, created_at')
                .eq('id', authData.user.id)
                .single()

            if (error) {
                // Se não há profile, criar um básico com dados do auth
                return {
                    user: {
                        id: authData.user.id,
                        email: authData.user.email || '',
                        name: authData.user.user_metadata?.name || authData.user.email?.split('@')[0],
                        created_at: authData.user.created_at
                    },
                    error: null
                }
            }

            return { user: data, error: null }
        } catch (error) {
            console.error('UserService.getCurrentUser error:', error)
            return { user: null, error }
        }
    }

    static async getAllUsers(): Promise<User[]> {
        try {
            console.log('🔍 UserService.getAllUsers: Starting fetch from profiles table...')

            // Verificar autenticação com mais detalhes
            const { data: authData, error: authError } = await supabase.auth.getUser()
            console.log('🔐 Auth status:', {
                isAuthenticated: !!authData?.user,
                userId: authData?.user?.id,
                email: authData?.user?.email,
                error: authError
            })

            // Verificar se há uma sessão válida
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
            console.log('🎫 Session status:', {
                hasSession: !!sessionData?.session,
                expiresAt: sessionData?.session?.expires_at,
                sessionError: sessionError
            })

            if (authError || !authData.user) {
                console.error('❌ User not authenticated:', authError)
                console.log('💡 Possible causes:')
                console.log('   - Session expired')
                console.log('   - Invalid credentials')
                console.log('   - Need to login again')
                return []
            }

            // Buscar da tabela profiles do backend - FORÇANDO CONEXÃO REAL
            console.log('📊 FORCING connection to profiles table...')

            // TENTATIVA 1: Query mais simples possível
            console.log('🔹 Attempt 1: Simplest possible query')
            const { data: simpleData, error: simpleError } = await supabase
                .from('profiles')
                .select('*')
                .limit(5)

            console.log('🔹 Simple query result:', { data: simpleData, error: simpleError, count: simpleData?.length })

            // TENTATIVA 2: Query apenas campos básicos
            console.log('🔹 Attempt 2: Basic fields only')
            const { data: basicData, error: basicError } = await supabase
                .from('profiles')
                .select('id, email, full_name')
                .limit(10)

            console.log('🔹 Basic query result:', { data: basicData, error: basicError, count: basicData?.length })

            // TENTATIVA 3: Query sem filtros
            console.log('🔹 Attempt 3: No filters at all')
            const { data: noFilterData, error: noFilterError } = await supabase
                .from('profiles')
                .select('id, email, full_name, department, role, is_active, is_approved')

            console.log('🔹 No filter query result:', { data: noFilterData, error: noFilterError, count: noFilterData?.length })

            // Usar o melhor resultado disponível
            let profilesData = null
            let profilesError = null

            if (noFilterData && noFilterData.length > 0) {
                console.log('✅ Using no-filter data')
                profilesData = noFilterData
                profilesError = noFilterError
            } else if (basicData && basicData.length > 0) {
                console.log('✅ Using basic data')
                profilesData = basicData
                profilesError = basicError
            } else if (simpleData && simpleData.length > 0) {
                console.log('✅ Using simple data')
                profilesData = simpleData
                profilesError = simpleError
            } else {
                console.log('❌ All queries failed or returned empty')
                profilesData = null
                profilesError = simpleError || basicError || noFilterError
            }

            console.log('📋 Final selected data:', { profilesData, profilesError })

            // Se AINDA não temos dados, algo está muito errado
            if (!profilesData || profilesData.length === 0) {
                console.log('💥 CRITICAL: No data from any query attempt!')
                console.log('🔍 This suggests:')
                console.log('   - Table "profiles" does not exist')
                console.log('   - RLS is blocking ALL access')
                console.log('   - Database connection issues')
                console.log('   - User has no permissions')
            }

            console.log('📋 Raw profiles query result:', {
                data: profilesData,
                error: profilesError,
                count: profilesData?.length || 0
            })

            // Tentar contar registros na tabela
            console.log('🔢 Checking total profiles count...')
            const { count, error: countError } = await supabase
                .from('profiles')
                .select('id', { count: 'exact', head: true })

            console.log('🔢 Total profiles in table:', { count, countError })

            // Verificar se há outros usuários ativos/aprovados
            if (!profilesError && profilesData) {
                if (profilesData.length === 0) {
                    console.log('❌ No profiles returned - you might not be active/approved')
                } else if (profilesData.length === 1 && count && count > 1) {
                    console.log('⚠️ Only 1 profile returned but table has more records')
                    console.log(`📊 Total profiles in table: ${count}`)
                    console.log(`📊 Profiles returned to you: ${profilesData.length}`)
                    console.log('💡 Possible causes:')
                    console.log('   - Other users are not active (is_active = false)')
                    console.log('   - Other users are not approved (is_approved = false)')
                    console.log('   - RLS policies are too restrictive')
                } else {
                    console.log(`✅ Found ${profilesData.length} active/approved profiles`)
                }
            }

            // FORÇAR uso de dados reais se encontrados
            if (profilesData && profilesData.length > 0) {
                console.log('🎯 REAL DATA FOUND! Processing profiles from database...')
                console.log(`📊 Found ${profilesData.length} real profiles in database`)

                const processedUsers = profilesData.map(profile => {
                    console.log('🔄 Processing real profile:', profile)

                    // Processar dados com máxima compatibilidade
                    const processedProfile = {
                        id: profile.id,
                        email: profile.email || '',
                        name: profile.full_name || profile.name || profile.email?.split('@')[0] || 'Usuário',
                        full_name: profile.full_name || profile.name,
                        avatar_url: profile.avatar_url,
                        role: profile.role || 'user',
                        department: profile.department,
                        phone: profile.phone,
                        is_active: profile.is_active !== false, // Default true se undefined
                        is_approved: profile.is_approved !== false, // Default true se undefined
                        approved_by: profile.approved_by,
                        approved_at: profile.approved_at,
                        created_at: profile.created_at || new Date().toISOString(),
                        updated_at: profile.updated_at
                    }

                    console.log('✅ Processed real profile:', processedProfile)
                    return processedProfile
                })

                console.log('🎉 RETURNING REAL DATA FROM DATABASE!')
                console.log(`📋 Final processed users (${processedUsers.length}):`, processedUsers)
                return processedUsers
            }

            // Fallback: incluir usuário atual e alguns dados de exemplo
            console.log('⚠️ No profiles found in DB, using current user + examples')
            const currentUser = {
                id: authData.user.id,
                email: authData.user.email || '',
                name: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'Você',
                full_name: authData.user.user_metadata?.full_name,
                avatar_url: authData.user.user_metadata?.avatar_url,
                role: 'admin',
                department: 'Administração',
                status: 'active' as const,
                created_at: authData.user.created_at
            }

            // Adicionar alguns usuários de exemplo para demonstração
            const exampleUsers = [
                currentUser,
                {
                    id: 'example-1',
                    email: 'gerente@exemplo.com',
                    name: 'Gerente Exemplo',
                    full_name: 'Gerente Exemplo Silva',
                    role: 'gerente',
                    department: 'Administração',
                    status: 'active' as const,
                    created_at: new Date().toISOString()
                },
                {
                    id: 'example-2',
                    email: 'vendedor@exemplo.com',
                    name: 'Vendedor Exemplo',
                    full_name: 'Vendedor Exemplo Santos',
                    role: 'vendedor',
                    department: 'Vendas',
                    status: 'active' as const,
                    created_at: new Date().toISOString()
                }
            ]

            console.log('📝 Returning example users:', exampleUsers)
            return exampleUsers

        } catch (error) {
            console.error('💥 UserService.getAllUsers unexpected error:', error)
            return []
        }
    }

    static async getEmployees(): Promise<User[]> {
        // Alias para getAllUsers com nome mais claro
        return this.getAllUsers()
    }

    // Método para verificar e renovar autenticação
    static async checkAndRefreshAuth(): Promise<boolean> {
        try {
            console.log('🔄 Checking authentication status...')

            // Verificar sessão atual
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

            if (sessionError) {
                console.error('❌ Session error:', sessionError)
                return false
            }

            if (!sessionData?.session) {
                console.log('❌ No active session found')
                return false
            }

            // Verificar se a sessão está expirada
            const expiresAt = sessionData.session.expires_at
            const now = Math.floor(Date.now() / 1000)

            if (expiresAt && expiresAt < now) {
                console.log('⏰ Session expired, attempting refresh...')

                const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()

                if (refreshError) {
                    console.error('❌ Failed to refresh session:', refreshError)
                    return false
                }

                console.log('✅ Session refreshed successfully')
                return true
            }

            console.log('✅ Session is valid')
            return true

        } catch (error) {
            console.error('💥 Auth check error:', error)
            return false
        }
    }

    // Método para diagnosticar problemas de acesso
    static async debugDatabaseAccess(): Promise<void> {
        console.log('🔍 Starting database access debug...')

        try {
            // Primeiro verificar autenticação
            const authOk = await this.checkAndRefreshAuth()
            console.log('🔐 Auth check result:', authOk)

            if (!authOk) {
                console.log('❌ Authentication failed - user needs to login again')
                return
            }
            // Verificar se conseguimos acessar qualquer tabela
            console.log('📊 Testing basic database connectivity...')

            // Tentar listar tabelas (pode não funcionar, mas ajuda no debug)
            const { data: tablesData, error: tablesError } = await supabase
                .from('information_schema.tables')
                .select('table_name')
                .eq('table_schema', 'public')
                .limit(5)

            console.log('📋 Tables query result:', { tablesData, tablesError })

            // Testar acesso específico à tabela profiles
            console.log('👥 Testing profiles table access...')

            // Testar SELECT básico
            const { data: profilesTest, error: profilesTestError } = await supabase
                .from('profiles')
                .select('id, email, name, full_name')
                .limit(1)

            console.log('👥 Basic SELECT result:', { profilesTest, profilesTestError })

            // Testar SELECT com COUNT
            const { count: totalCount, error: countError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })

            console.log('🔢 COUNT result:', { totalCount, countError })

            // Verificar contexto do usuário atual
            const { data: authUser } = await supabase.auth.getUser()

            // Testar SELECT específico por ID (se temos o user ID)
            if (authUser?.user?.id) {
                const { data: ownProfile, error: ownError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.user.id)

                console.log('👤 Own profile access:', { ownProfile, ownError })
            }

            // Testar diferentes filtros para entender o problema
            if (authUser?.user?.id) {
                // Testar sem filtros (todos os perfis)
                const { data: allProfiles, error: allError } = await supabase
                    .from('profiles')
                    .select('id, email, full_name, is_active, is_approved')
                    .limit(10)

                console.log('👥 All profiles (no filters):', { allProfiles, allError })

                // Testar apenas perfis ativos
                const { data: activeProfiles, error: activeError } = await supabase
                    .from('profiles')
                    .select('id, email, full_name, is_active, is_approved')
                    .eq('is_active', true)
                    .limit(10)

                console.log('🟢 Active profiles only:', { activeProfiles, activeError })

                // Testar apenas perfis aprovados
                const { data: approvedProfiles, error: approvedError } = await supabase
                    .from('profiles')
                    .select('id, email, full_name, is_active, is_approved')
                    .eq('is_approved', true)
                    .limit(10)

                console.log('✅ Approved profiles only:', { approvedProfiles, approvedError })

                // Testar perfis ativos E aprovados
                const { data: activeApprovedProfiles, error: activeApprovedError } = await supabase
                    .from('profiles')
                    .select('id, email, full_name, is_active, is_approved')
                    .eq('is_active', true)
                    .eq('is_approved', true)
                    .limit(10)

                console.log('🟢✅ Active AND approved profiles:', { activeApprovedProfiles, activeApprovedError })
            }

            // Verificar RLS policies
            console.log('🔒 Checking if RLS is blocking access...')
            console.log('🔐 Current user context:', {
                userId: authUser?.user?.id,
                email: authUser?.user?.email,
                role: authUser?.user?.role
            })

            // Tentar criar um profile de teste (será rejeitado se RLS bloquear)
            console.log('✏️ Testing profile creation (will likely fail due to RLS)...')
            const { data: createTest, error: createTestError } = await supabase
                .from('profiles')
                .insert({
                    id: 'test-profile-id',
                    email: 'test@example.com',
                    name: 'Test Profile'
                })
                .select()

            console.log('✏️ Profile creation test:', { createTest, createTestError })

            // Se chegou até aqui, cleanup
            if (createTest) {
                await supabase.from('profiles').delete().eq('id', 'test-profile-id')
                console.log('🧹 Cleaned up test profile')
            }

        } catch (error) {
            console.error('💥 Debug error:', error)
        }
    }
}