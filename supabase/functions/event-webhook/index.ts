// =====================================================
// EDGE FUNCTION: Event Webhook Handler
// Processa webhooks de eventos com estratégias customizadas
// Deploy: supabase functions deploy event-webhook
// =====================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  type: 'event.created' | 'event.updated' | 'event.cancelled' | 'event.reminder'
  event_id: string
  event_data: any
  user_id: string
  timestamp: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const payload: WebhookPayload = await req.json()
    console.log('📥 Webhook received:', payload.type, payload.event_id)

    // Log webhook
    await supabase.from('webhook_logs').insert({
      webhook_type: payload.type,
      event_id: payload.event_id,
      user_id: payload.user_id,
      request_body: payload,
      request_method: 'POST',
      created_at: new Date().toISOString()
    })

    // Estratégias por tipo de webhook
    switch (payload.type) {
      case 'event.created':
        await handleEventCreated(supabase, payload)
        break
      
      case 'event.updated':
        await handleEventUpdated(supabase, payload)
        break
      
      case 'event.cancelled':
        await handleEventCancelled(supabase, payload)
        break
      
      case 'event.reminder':
        await handleEventReminder(supabase, payload)
        break
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// =====================================================
// ESTRATÉGIAS DE WEBHOOK
// =====================================================

async function handleEventCreated(supabase: any, payload: WebhookPayload) {
  console.log('🆕 Processing event.created')

  // 1. Criar notificação para participantes
  const { assigned_to } = payload.event_data
  if (assigned_to && assigned_to.length > 0) {
    for (const userId of assigned_to) {
      await supabase.from('notifications').insert({
        title: '📅 Novo evento agendado',
        message: `Você foi convidado para: ${payload.event_data.title}`,
        type: 'event',
        priority: payload.event_data.priority || 'medium',
        category: 'event',
        user_id: userId,
        event_id: payload.event_id,
        action_url: `/dashboard/agenda?event=${payload.event_id}`,
        action_label: 'Ver Evento'
      })
    }
  }

  // 2. Integração com CRM - registrar interação se houver client_id
  if (payload.event_data.client_id) {
    await supabase.from('client_interactions').insert({
      client_id: payload.event_data.client_id,
      type: 'event_scheduled',
      notes: `Evento agendado: ${payload.event_data.title}`,
      user_id: payload.user_id,
      metadata: { event_id: payload.event_id }
    })
  }

  // 3. Webhook externo (ex: integração com Google Calendar, Zapier)
  await triggerExternalWebhook('event_created', payload)
}

async function handleEventUpdated(supabase: any, payload: WebhookPayload) {
  console.log('✏️ Processing event.updated')

  // Notificar participantes sobre mudanças
  const { assigned_to, title } = payload.event_data
  if (assigned_to && assigned_to.length > 0) {
    for (const userId of assigned_to) {
      await supabase.from('notifications').insert({
        title: '📝 Evento atualizado',
        message: `O evento "${title}" foi modificado`,
        type: 'info',
        priority: 'medium',
        category: 'event',
        user_id: userId,
        event_id: payload.event_id,
        action_url: `/dashboard/agenda?event=${payload.event_id}`,
        action_label: 'Ver Alterações'
      })
    }
  }

  await triggerExternalWebhook('event_updated', payload)
}

async function handleEventCancelled(supabase: any, payload: WebhookPayload) {
  console.log('❌ Processing event.cancelled')

  // Cancelar notificações pendentes do evento
  await supabase
    .from('notifications')
    .delete()
    .eq('event_id', payload.event_id)
    .eq('is_sent', false)

  // Notificar participantes
  const { assigned_to, title } = payload.event_data
  if (assigned_to && assigned_to.length > 0) {
    for (const userId of assigned_to) {
      await supabase.from('notifications').insert({
        title: '🚫 Evento cancelado',
        message: `O evento "${title}" foi cancelado`,
        type: 'warning',
        priority: 'high',
        category: 'event',
        user_id: userId,
        event_id: payload.event_id
      })
    }
  }

  await triggerExternalWebhook('event_cancelled', payload)
}

async function handleEventReminder(supabase: any, payload: WebhookPayload) {
  console.log('⏰ Processing event.reminder')

  const { user_id, title, start_datetime } = payload.event_data
  const minutesUntil = Math.floor((new Date(start_datetime).getTime() - Date.now()) / 60000)

  // Criar notificação de lembrete
  await supabase.from('notifications').insert({
    title: '⏰ Lembrete de Evento',
    message: `"${title}" começa em ${minutesUntil} minutos`,
    type: 'reminder',
    priority: 'high',
    category: 'event',
    user_id: user_id,
    event_id: payload.event_id,
    action_url: `/dashboard/agenda?event=${payload.event_id}`,
    action_label: 'Ver Evento',
    channels: JSON.stringify({ app: true, email: true, push: true })
  })

  // Enviar push notification (se configurado)
  await sendPushNotification(user_id, {
    title: 'Lembrete de Evento',
    body: `"${title}" começa em ${minutesUntil} minutos`,
    data: { event_id: payload.event_id }
  })
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

async function triggerExternalWebhook(event: string, payload: any) {
  // Configurar URLs de webhook externos via env vars
  const webhookUrl = Deno.env.get('EXTERNAL_WEBHOOK_URL')
  if (!webhookUrl) return

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Event': event,
        'X-Webhook-Signature': generateSignature(payload)
      },
      body: JSON.stringify(payload)
    })

    console.log(`📤 External webhook sent: ${event} - Status: ${response.status}`)
  } catch (error) {
    console.error('❌ External webhook failed:', error)
  }
}

async function sendPushNotification(userId: string, notification: any) {
  // Implementar integração com serviço de push (FCM, APNs, OneSignal, etc)
  console.log('📲 Push notification:', userId, notification)
  // TODO: Integrar com Firebase Cloud Messaging ou similar
}

function generateSignature(payload: any): string {
  // Gerar signature HMAC para segurança
  const secret = Deno.env.get('WEBHOOK_SECRET') || 'default-secret'
  // Implementar HMAC-SHA256
  return 'signature-placeholder'
}
