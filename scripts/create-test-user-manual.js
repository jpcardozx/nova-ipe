const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createTestUser() {
  console.log('🔄 Criando usuário de teste...')
  
  const email = 'teste@ipe.com.br'
  const password = '123456'
  
  try {
    // Criar usuário via Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: 'Usuário de Teste'
        }
      }
    })
    
    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError.message)
      return
    }
    
    console.log('✅ Usuário criado no Auth:', authData.user?.id)
    
    // Se o usuário foi criado, criar profile
    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: email,
          full_name: 'Usuário de Teste',
          role: 'user',
          is_active: true,
          is_approved: true
        }])
        .select()
        .single()
      
      if (profileError) {
        console.warn('⚠️  Aviso: Profile não criado automaticamente:', profileError.message)
        console.log('   (Isso é normal, será criado no primeiro login)')
      } else {
        console.log('✅ Profile criado:', profileData.id)
      }
    }
    
    console.log('\n🎉 Usuário de teste criado com sucesso!')
    console.log('📧 Email:', email)
    console.log('🔑 Senha:', password)
    console.log('\nAgora você pode fazer login na aplicação!')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

createTestUser()