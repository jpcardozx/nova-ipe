import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * WhatsApp Webhook Handler
 * Receives real-time messages, status updates, and events
 */

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'nova-ipe-webhook-token'
const APP_SECRET = process.env.WHATSAPP_APP_SECRET || '1585c69a9a8996d3e9458ca6e182fe36'

interface WebhookMessage {
  id: string
  from: string
  timestamp: string
  type: 'text' | 'image' | 'document' | 'audio' | 'video'
  text?: {
    body: string
  }
  image?: {
    id: string
    mime_type: string
    sha256: string
    caption?: string
  }
  document?: {
    id: string
    filename: string
    mime_type: string
    sha256: string
    caption?: string
  }
}

interface WebhookStatus {
  id: string
  recipient_id: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  timestamp: string
  errors?: Array<{
    code: number
    title: string
    details: string
  }>
}

interface WebhookPayload {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        contacts?: Array<{
          profile: {
            name: string
          }
          wa_id: string
        }>
        messages?: WebhookMessage[]
        statuses?: WebhookStatus[]
      }
      field: string
    }>
  }>
}

/**
 * Verify webhook signature
 */
function verifySignature(payload: string, signature: string): boolean {
  if (!signature || !APP_SECRET) return false

  const expectedSignature = crypto
    .createHmac('sha256', APP_SECRET)
    .update(payload)
    .digest('hex')

  const actualSignature = signature.replace('sha256=', '')

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(actualSignature, 'hex')
  )
}

/**
 * Process incoming message
 */
async function processMessage(message: WebhookMessage, phoneNumberId: string) {
  try {
    console.log('📨 New message received:', {
      id: message.id,
      from: message.from,
      type: message.type,
      timestamp: message.timestamp
    })

    // Store message in database (implement with Supabase)
    const messageData = {
      id: message.id,
      from: message.from,
      to: phoneNumberId,
      content: message.text?.body || `[${message.type}]`,
      type: message.type,
      timestamp: new Date(parseInt(message.timestamp) * 1000),
      isFromMe: false,
      status: 'received' as const,
      metadata: {
        caption: message.image?.caption || message.document?.caption,
        filename: message.document?.filename,
        mimeType: message.image?.mime_type || message.document?.mime_type
      }
    }

    // TODO: Save to Supabase database
    // await supabase.from('whatsapp_messages').insert(messageData)

    // Process auto-responses
    await processAutoResponse(message)

    // Classify contact if new
    await classifyContact(message.from)

    return { success: true, messageId: message.id }

  } catch (error) {
    console.error('Error processing message:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Process message status update
 */
async function processStatus(status: WebhookStatus) {
  try {
    console.log('📊 Status update received:', {
      messageId: status.id,
      recipient: status.recipient_id,
      status: status.status,
      timestamp: status.timestamp
    })

    // Update message status in database
    // TODO: Update in Supabase
    // await supabase
    //   .from('whatsapp_messages')
    //   .update({ status: status.status })
    //   .eq('id', status.id)

    // Handle errors
    if (status.status === 'failed' && status.errors) {
      console.error('Message delivery failed:', status.errors)
      // TODO: Notify admin or retry
    }

    return { success: true, statusId: status.id }

  } catch (error) {
    console.error('Error processing status:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Auto-response logic
 */
async function processAutoResponse(message: WebhookMessage) {
  if (message.type !== 'text' || !message.text?.body) return

  const messageText = message.text.body.toLowerCase()
  const from = message.from

  // Greeting auto-responses
  if (messageText.includes('oi') || messageText.includes('olá') || messageText.includes('bom dia')) {
    await sendAutoResponse(from, `👋 Olá! Bem-vindo(a) à *IPÊ IMÓVEIS*!

🏢 *Praça 9 de Julho, nº 65, Centro*

Como posso ajudá-lo(a) hoje?

🏠 Imóveis para venda/locação
💰 Consultoria financeira
📋 Serviços imobiliários`)
    return
  }

  // Property inquiry auto-responses
  if (messageText.includes('preço') || messageText.includes('valor') || messageText.includes('quanto custa')) {
    await sendAutoResponse(from, `💰 Para informações sobre valores, preciso de mais detalhes:

📍 Qual região te interessa?
🏠 Que tipo de imóvel? (casa/apartamento/comercial)
📐 Quantos quartos?

Assim posso te ajudar melhor!`)
    return
  }

  // Visit scheduling
  if (messageText.includes('visita') || messageText.includes('agendar') || messageText.includes('ver o imóvel')) {
    await sendAutoResponse(from, `📅 Claro! Vamos agendar sua visita.

🕐 Horários disponíveis:
• Manhã: 9h às 12h
• Tarde: 14h às 17h

Qual dia e horário prefere?
Qual imóvel te interessa?`)
    return
  }

  // Default business hours response
  const currentHour = new Date().getHours()
  if (currentHour < 8 || currentHour > 18) {
    await sendAutoResponse(from, `🌙 Obrigado pela mensagem!

Nosso horário de atendimento é de segunda a sexta, das 8h às 18h.

Responderemos em breve! 😊

*IPÊ IMÓVEIS - Seus imóveis, nossa expertise*`)
  }
}

/**
 * Classify and tag contact
 */
async function classifyContact(phoneNumber: string) {
  try {
    // Check if contact exists
    // TODO: Check Supabase for existing contact

    // If new contact, create with basic tags
    const contactData = {
      phone: phoneNumber,
      tags: ['novo_lead', 'whatsapp'],
      source: 'whatsapp_webhook',
      firstContact: new Date(),
      status: 'active'
    }

    // TODO: Save to Supabase
    // await supabase.from('whatsapp_contacts').upsert(contactData)

    console.log('👤 Contact classified:', phoneNumber)

  } catch (error) {
    console.error('Error classifying contact:', error)
  }
}

/**
 * Send auto-response
 */
async function sendAutoResponse(to: string, message: string) {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/1115181027254547/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 1585c69a9a8996d3e9458ca6e182fe36`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: {
          body: message
        }
      })
    })

    if (response.ok) {
      console.log('🤖 Auto-response sent to:', to)
    } else {
      console.error('Failed to send auto-response:', await response.text())
    }

  } catch (error) {
    console.error('Error sending auto-response:', error)
  }
}

/**
 * GET - Webhook verification
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  console.log('🔍 Webhook verification request:', { mode, token })

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully')
    return new NextResponse(challenge, { status: 200 })
  } else {
    console.log('❌ Webhook verification failed')
    return new NextResponse('Forbidden', { status: 403 })
  }
}

/**
 * POST - Webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const signature = headersList.get('x-hub-signature-256')
    const body = await request.text()

    // Verify signature for security
    if (signature && !verifySignature(body, signature)) {
      console.log('❌ Invalid webhook signature')
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const payload: WebhookPayload = JSON.parse(body)

    console.log('📨 Webhook received:', {
      object: payload.object,
      entries: payload.entry?.length || 0
    })

    // Process webhook data
    if (payload.object === 'whatsapp_business_account') {
      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          const { value } = change

          // Process incoming messages
          if (value.messages) {
            for (const message of value.messages) {
              await processMessage(message, value.metadata.phone_number_id)
            }
          }

          // Process status updates
          if (value.statuses) {
            for (const status of value.statuses) {
              await processStatus(status)
            }
          }

          // Process new contacts
          if (value.contacts) {
            for (const contact of value.contacts) {
              console.log('👤 New contact profile:', {
                name: contact.profile.name,
                phone: contact.wa_id
              })
              // TODO: Update contact name in database
            }
          }
        }
      }
    }

    return new NextResponse('OK', { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}