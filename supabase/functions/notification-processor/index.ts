// =====================================================
// EDGE FUNCTION: Notification Processor
// Processa e envia notificações agendadas em tempo real
// Deploy: supabase functions deploy notification-processor
// Invoke: Via cron job a cada 1 minuto
// =====================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('🔄 Processing pending notifications...')

    // Buscar notificações pendentes
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('is_sent', false)
      .lte('scheduled_for', new Date().toISOString())
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
      .order('priority', { ascending: false })
      .order('scheduled_for', { ascending: true })
      .limit(100)

    if (error) throw error

    console.log(`📬 Found ${notifications?.length || 0} pending notifications`)

    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      channels: { app: 0, email: 0, sms: 0, push: 0 }
    }

    // Processar cada notificação
    for (const notification of notifications || []) {
      try {
        results.processed++

        // Verificar preferências do usuário
        const { data: prefs } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', notification.user_id)
          .single()

        // Verificar quiet hours
        if (prefs && !isInQuietHours(prefs)) {
          const channels = notification.channels || { app: true }
          const deliveryStatus: any = {}

          // Enviar via app (sempre)
          if (channels.app) {
            deliveryStatus.app = { sent: true, timestamp: new Date().toISOString() }
            results.channels.app++
          }

          // Enviar via email
          if (channels.email && prefs.email_enabled) {
            const emailSent = await sendEmailNotification(notification)
            deliveryStatus.email = { sent: emailSent, timestamp: new Date().toISOString() }
            if (emailSent) results.channels.email++
          }

          // Enviar via SMS
          if (channels.sms && prefs.sms_enabled) {
            const smsSent = await sendSMSNotification(notification)
            deliveryStatus.sms = { sent: smsSent, timestamp: new Date().toISOString() }
            if (smsSent) results.channels.sms++
          }

          // Enviar via push
          if (channels.push && prefs.push_enabled) {
            const pushSent = await sendPushNotification(notification)
            deliveryStatus.push = { sent: pushSent, timestamp: new Date().toISOString() }
            if (pushSent) results.channels.push++
          }

          // Atualizar status da notificação
          await supabase
            .from('notifications')
            .update({
              is_sent: true,
              sent_at: new Date().toISOString(),
              delivery_status: deliveryStatus
            })
            .eq('id', notification.id)

          results.sent++
          console.log(`✅ Notification sent: ${notification.id}`)
        } else {
          console.log(`⏸️ Skipping notification (quiet hours): ${notification.id}`)
        }

      } catch (error) {
        results.failed++
        console.error(`❌ Failed to send notification ${notification.id}:`, error)
        
        // Log erro
        await supabase.from('webhook_logs').insert({
          webhook_type: 'notification_failed',
          notification_id: notification.id,
          user_id: notification.user_id,
          success: false,
          error_message: error.message,
          created_at: new Date().toISOString()
        })
      }
    }

    console.log('✨ Notification processing complete:', results)

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('❌ Processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function isInQuietHours(prefs: any): boolean {
  if (!prefs.quiet_hours_start || !prefs.quiet_hours_end) return false

  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  const [startHour, startMin] = prefs.quiet_hours_start.split(':').map(Number)
  const [endHour, endMin] = prefs.quiet_hours_end.split(':').map(Number)
  
  const quietStart = startHour * 60 + startMin
  const quietEnd = endHour * 60 + endMin

  // Handle overnight quiet hours
  if (quietStart > quietEnd) {
    return currentTime >= quietStart || currentTime <= quietEnd
  }
  
  return currentTime >= quietStart && currentTime <= quietEnd
}

async function sendEmailNotification(notification: any): Promise<boolean> {
  try {
    const smtpEndpoint = Deno.env.get('SMTP_WEBHOOK_URL')
    if (!smtpEndpoint) {
      console.warn('⚠️ SMTP_WEBHOOK_URL not configured')
      return false
    }

    const response = await fetch(smtpEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: notification.user_email, // Seria necessário fazer join com auth.users
        subject: notification.title,
        html: generateEmailHTML(notification),
        priority: notification.priority
      })
    })

    return response.ok
  } catch (error) {
    console.error('❌ Email send failed:', error)
    return false
  }
}

async function sendSMSNotification(notification: any): Promise<boolean> {
  try {
    const smsEndpoint = Deno.env.get('SMS_WEBHOOK_URL')
    if (!smsEndpoint) return false

    const response = await fetch(smsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: notification.user_phone,
        message: `${notification.title}\n${notification.message || ''}`,
        priority: notification.priority === 'urgent'
      })
    })

    return response.ok
  } catch (error) {
    console.error('❌ SMS send failed:', error)
    return false
  }
}

async function sendPushNotification(notification: any): Promise<boolean> {
  try {
    const pushEndpoint = Deno.env.get('PUSH_WEBHOOK_URL')
    if (!pushEndpoint) return false

    const response = await fetch(pushEndpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('PUSH_API_KEY')}`
      },
      body: JSON.stringify({
        user_id: notification.user_id,
        title: notification.title,
        body: notification.message,
        icon: notification.icon,
        data: {
          notification_id: notification.id,
          action_url: notification.action_url,
          event_id: notification.event_id
        },
        priority: notification.priority === 'urgent' ? 'high' : 'normal'
      })
    })

    return response.ok
  } catch (error) {
    console.error('❌ Push send failed:', error)
    return false
  }
}

function generateEmailHTML(notification: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0066cc; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>${notification.icon || '🔔'} ${notification.title}</h2>
    </div>
    <div class="content">
      <p>${notification.message || 'Você tem uma nova notificação.'}</p>
      ${notification.action_url ? `
        <a href="${notification.action_url}" class="button">${notification.action_label || 'Ver Detalhes'}</a>
      ` : ''}
    </div>
    <div class="footer">
      <p>Imobiliária Ipê - Sistema de Gestão</p>
      <p><small>Para alterar suas preferências de notificação, acesse o painel de configurações.</small></p>
    </div>
  </div>
</body>
</html>
  `
}
