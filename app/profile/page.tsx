'use client'

import { useState } from 'react'
import { useCurrentUserExtended } from '@/lib/hooks/useCurrentUserExtended'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, FileText, User, Settings, Bell, Plus, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function UserProfilePage() {
  const {
    user,
    loading,
    events,
    notes,
    updateProfile,
    addReminder,
    addNote,
    loadEvents,
    loadNotes
  } = useCurrentUserExtended()

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    department: '',
    position: ''
  })

  const [newReminder, setNewReminder] = useState({
    title: '',
    scheduled_at: '',
    description: ''
  })

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    type: 'personal' as const
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Necessário</CardTitle>
            <CardDescription>Você precisa fazer login para acessar seu perfil.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handleEdit = () => {
    setEditForm({
      full_name: user.full_name || '',
      phone: user.phone || '',
      department: user.department || '',
      position: user.position || ''
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      await updateProfile(editForm)
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
    }
  }

  const handleAddReminder = async () => {
    if (!newReminder.title || !newReminder.scheduled_at) return
    
    try {
      await addReminder(
        newReminder.title,
        newReminder.scheduled_at,
        newReminder.description
      )
      setNewReminder({ title: '', scheduled_at: '', description: '' })
      loadEvents()
    } catch (error) {
      console.error('Erro ao criar lembrete:', error)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.title || !newNote.content) return
    
    try {
      await addNote(newNote.title, newNote.content, newNote.type)
      setNewNote({ title: '', content: '', type: 'personal' })
      loadNotes()
    } catch (error) {
      console.error('Erro ao criar nota:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">{user.organization}</p>
              </div>
            </div>
            <Button onClick={handleEdit} disabled={isEditing}>
              <Settings className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Perfil */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Nome Completo</Label>
                      <Input
                        id="full_name"
                        value={editForm.full_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Departamento</Label>
                      <Input
                        id="department"
                        value={editForm.department}
                        onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Cargo</Label>
                      <Input
                        id="position"
                        value={editForm.position}
                        onChange={(e) => setEditForm(prev => ({ ...prev, position: e.target.value }))}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} className="flex-1">Salvar</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Telefone</Label>
                      <p className="text-gray-900">{user.phone || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Departamento</Label>
                      <p className="text-gray-900">{user.department || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Cargo</Label>
                      <p className="text-gray-900">{user.position || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Último acesso</span>
                    <span className="text-sm font-medium">
                      {user.stats?.last_login ? format(new Date(user.stats.last_login), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'Nunca'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total de logins</span>
                    <span className="text-sm font-medium">{user.stats?.login_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Sessões</span>
                    <span className="text-sm font-medium">{user.stats?.total_sessions || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Eventos e Notas */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Lembretes/Eventos */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Lembretes & Eventos
                    </CardTitle>
                    <CardDescription>Gerencie seus lembretes e eventos</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Add new reminder */}
                <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-medium mb-3">Novo Lembrete</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Título do lembrete"
                      value={newReminder.title}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Input
                      type="datetime-local"
                      value={newReminder.scheduled_at}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, scheduled_at: e.target.value }))}
                    />
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Textarea
                      placeholder="Descrição (opcional)"
                      value={newReminder.description}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                      className="flex-1"
                      rows={2}
                    />
                    <Button onClick={handleAddReminder} disabled={!newReminder.title || !newReminder.scheduled_at}>
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>

                {/* Events list */}
                <div className="space-y-3">
                  {events.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Nenhum evento encontrado</p>
                  ) : (
                    events.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{event.title}</h5>
                            <Badge className={getStatusColor(event.status)}>
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {format(new Date(event.scheduled_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </p>
                          {event.description && (
                            <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notas */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Notas Pessoais
                    </CardTitle>
                    <CardDescription>Suas anotações e lembretes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Add new note */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-3">Nova Nota</h4>
                  <div className="space-y-3">
                    <Input
                      placeholder="Título da nota"
                      value={newNote.title}
                      onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Conteúdo da nota"
                      value={newNote.content}
                      onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                      rows={3}
                    />
                    <div className="flex justify-between">
                      <select
                        value={newNote.type}
                        onChange={(e) => setNewNote(prev => ({ ...prev, type: e.target.value as any }))}
                        className="px-3 py-2 border rounded-lg"
                      >
                        <option value="personal">Pessoal</option>
                        <option value="client">Cliente</option>
                        <option value="property">Imóvel</option>
                        <option value="task">Tarefa</option>
                      </select>
                      <Button onClick={handleAddNote} disabled={!newNote.title || !newNote.content}>
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar Nota
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notes list */}
                <div className="space-y-3">
                  {notes.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Nenhuma nota encontrada</p>
                  ) : (
                    notes.slice(0, 3).map((note) => (
                      <div key={note.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{note.title}</h5>
                          <Badge variant="outline">{note.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{note.content.substring(0, 150)}...</p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(note.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            
          </div>
        </div>
      </div>
    </div>
  )
}