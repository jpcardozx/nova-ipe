/**
 * Script de Validação Completa do Sistema WhatsApp
 * Testa todas as funcionalidades e identifica gaps
 */

const fs = require('fs')
const path = require('path')

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`)
}

function header(title) {
  console.log('\n' + '='.repeat(60))
  log(colors.bold + colors.blue, `📱 ${title}`)
  console.log('='.repeat(60))
}

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, '..', filePath)
  const exists = fs.existsSync(fullPath)

  if (exists) {
    const stats = fs.statSync(fullPath)
    log(colors.green, `✅ ${description}`)
    log(colors.blue, `   📁 ${filePath} (${Math.round(stats.size/1024)}KB)`)
    return true
  } else {
    log(colors.red, `❌ ${description}`)
    log(colors.red, `   📁 ${filePath} - ARQUIVO NÃO ENCONTRADO`)
    return false
  }
}

function analyzeFileContent(filePath, checks) {
  const fullPath = path.join(__dirname, '..', filePath)
  if (!fs.existsSync(fullPath)) return false

  const content = fs.readFileSync(fullPath, 'utf8')
  let score = 0

  checks.forEach(check => {
    if (content.includes(check.pattern)) {
      log(colors.green, `   ✅ ${check.description}`)
      score++
    } else {
      log(colors.red, `   ❌ ${check.description}`)
    }
  })

  return score / checks.length
}

// ===============================
// INÍCIO DA VALIDAÇÃO
// ===============================

header('VALIDAÇÃO SISTEMA WHATSAPP - NOVA IPÊ')

// 1. ARQUIVOS CORE
header('1. ARQUIVOS PRINCIPAIS')

const coreFiles = [
  ['lib/services/whatsapp-business-api.ts', 'WhatsApp Business API Service'],
  ['lib/hooks/useWhatsApp.ts', 'Hook personalizado WhatsApp'],
  ['lib/stores/whatsapp-store.ts', 'Zustand Store'],
  ['app/providers/ReactQueryProvider.tsx', 'React Query Provider'],
  ['app/dashboard/whatsapp/page.tsx', 'Página principal WhatsApp'],
  ['app/dashboard/whatsapp/components/WhatsAppStatus.tsx', 'Status Component'],
  ['app/dashboard/whatsapp/components/BroadcastManager.tsx', 'Broadcast Manager'],
  ['app/dashboard/whatsapp/components/MediaManager.tsx', 'Media Manager'],
  ['app/dashboard/whatsapp/components/VirtualContactList.tsx', 'Virtual Contact List']
]

let coreScore = 0
coreFiles.forEach(([file, desc]) => {
  if (checkFile(file, desc)) coreScore++
})

log(colors.bold, `\n📊 CORE FILES: ${coreScore}/${coreFiles.length} (${Math.round(coreScore/coreFiles.length*100)}%)`)

// 2. FUNCIONALIDADES API
header('2. FUNCIONALIDADES API')

const apiChecks = [
  { pattern: 'sendTextMessage', description: 'Envio de mensagem de texto' },
  { pattern: 'sendImage', description: 'Envio de imagens' },
  { pattern: 'sendDocument', description: 'Envio de documentos' },
  { pattern: 'sendTemplate', description: 'Templates de mensagem' },
  { pattern: 'getMessageStatus', description: 'Status de mensagens' },
  { pattern: 'formatPhoneNumber', description: 'Formatação de números' },
  { pattern: 'fallbackToWebWhatsApp', description: 'Fallback WhatsApp Web' },
  { pattern: 'healthCheck', description: 'Health check da API' },
  { pattern: 'process.env.META_WHATSAPP_PHONE_NUMBER_ID', description: 'Phone Number ID via env var' },
  { pattern: 'process.env.META_WHATSAPP_ACCESS_TOKEN', description: 'Access Token via env var' }
]

const apiScore = analyzeFileContent('lib/services/whatsapp-business-api.ts', apiChecks)
log(colors.bold, `\n📊 API FUNCIONALIDADES: ${Math.round(apiScore*100)}%`)

// 3. SISTEMA DE MENSAGENS
header('3. SISTEMA DE MENSAGENS INTERNO')

const messagingChecks = [
  { pattern: 'WhatsAppMessage', description: 'Interface de mensagem' },
  { pattern: 'WhatsAppConversation', description: 'Sistema de conversas' },
  { pattern: 'messages: WhatsAppMessage[]', description: 'Histórico de mensagens' },
  { pattern: 'addMessage', description: 'Adicionar mensagem' },
  { pattern: 'updateMessageStatus', description: 'Atualizar status' },
  { pattern: 'markConversationAsRead', description: 'Marcar como lida' },
  { pattern: 'draftMessage', description: 'Rascunho de mensagem' },
  { pattern: 'isTyping', description: 'Indicador digitando' },
  { pattern: 'localStorage', description: 'Persistência local' }
]

const messagingScore = analyzeFileContent('lib/stores/whatsapp-store.ts', messagingChecks)
log(colors.bold, `\n📊 SISTEMA MENSAGENS: ${Math.round(messagingScore*100)}%`)

// 4. GESTÃO DE CONTATOS
header('4. GESTÃO DE CONTATOS')

const contactChecks = [
  { pattern: 'WhatsAppContact', description: 'Interface de contato' },
  { pattern: 'addContact', description: 'Adicionar contato' },
  { pattern: 'updateContact', description: 'Atualizar contato' },
  { pattern: 'removeContact', description: 'Remover contato' },
  { pattern: 'tags: string[]', description: 'Sistema de tags' },
  { pattern: 'unreadCount', description: 'Contador não lidas' },
  { pattern: 'isPinned', description: 'Fixar contatos' },
  { pattern: 'isArchived', description: 'Arquivar contatos' },
  { pattern: 'lastMessageTime', description: 'Última mensagem' },
  { pattern: 'getFilteredContacts', description: 'Filtros de contato' }
]

const contactScore = analyzeFileContent('lib/stores/whatsapp-store.ts', contactChecks)
log(colors.bold, `\n📊 GESTÃO CONTATOS: ${Math.round(contactScore*100)}%`)

// 5. CAMPANHAS E BROADCASTS
header('5. CAMPANHAS E BROADCASTS')

const campaignChecks = [
  { pattern: 'BroadcastCampaign', description: 'Interface de campanha' },
  { pattern: 'targetTags', description: 'Segmentação por tags' },
  { pattern: 'metrics', description: 'Métricas de campanha' },
  { pattern: 'sent:', description: 'Contador enviadas' },
  { pattern: 'delivered:', description: 'Contador entregues' },
  { pattern: 'read:', description: 'Contador lidas' },
  { pattern: 'replied:', description: 'Contador respostas' },
  { pattern: 'createCampaign', description: 'Criar campanha' },
  { pattern: 'scheduledAt', description: 'Agendamento' }
]

const campaignScore = analyzeFileContent('app/dashboard/whatsapp/components/BroadcastManager.tsx', campaignChecks)
log(colors.bold, `\n📊 SISTEMA CAMPANHAS: ${Math.round(campaignScore*100)}%`)

// 6. PERFORMANCE
header('6. PERFORMANCE E OTIMIZAÇÃO')

const perfChecks = [
  { pattern: '@tanstack/react-virtual', description: 'Virtual Scrolling' },
  { pattern: '@tanstack/react-query', description: 'React Query' },
  { pattern: 'zustand', description: 'State Management' },
  { pattern: 'useMutation', description: 'Mutations otimizadas' },
  { pattern: 'useQuery', description: 'Queries com cache' },
  { pattern: 'staleTime', description: 'Cache strategy' },
  { pattern: 'retry', description: 'Retry automático' }
]

const perfScore = analyzeFileContent('lib/hooks/useWhatsApp.ts', perfChecks)
log(colors.bold, `\n📊 PERFORMANCE: ${Math.round(perfScore*100)}%`)

// ===============================
// ANÁLISE DE GAPS
// ===============================

header('🔍 ANÁLISE DE GAPS E MELHORIAS')

console.log('\n🚨 FUNCIONALIDADES CRÍTICAS FALTANTES:')

// Webhooks
if (!fs.existsSync(path.join(__dirname, '..', 'app/api/whatsapp/webhook/route.ts'))) {
  log(colors.red, '❌ WEBHOOKS - Recebimento de mensagens em tempo real')
  log(colors.yellow, '   📋 Necessário para: mensagens recebidas, status de entrega, novos contatos')
}

// Database Integration
if (!fs.existsSync(path.join(__dirname, '..', 'lib/services/whatsapp-db.ts'))) {
  log(colors.red, '❌ DATABASE INTEGRATION - Persistência em banco')
  log(colors.yellow, '   📋 Necessário para: histórico permanente, sincronização entre dispositivos')
}

// Auto Responses
const autoResponseContent = fs.existsSync(path.join(__dirname, '..', 'lib/services/auto-responses.ts'))
if (!autoResponseContent) {
  log(colors.red, '❌ AUTO RESPONSES - Respostas automáticas inteligentes')
  log(colors.yellow, '   📋 Necessário para: atendimento 24h, qualificação de leads')
}

// Lead Management
if (!fs.existsSync(path.join(__dirname, '..', 'lib/services/lead-management.ts'))) {
  log(colors.red, '❌ LEAD MANAGEMENT - Gestão de leads automática')
  log(colors.yellow, '   📋 Necessário para: scoring, pipeline, conversão')
}

console.log('\n⚠️  MELHORIAS RECOMENDADAS:')

log(colors.yellow, '🔄 REAL-TIME SYNC - Sincronização em tempo real via Supabase')
log(colors.yellow, '🎯 SMART TEMPLATES - Templates dinâmicos baseados no contexto')
log(colors.yellow, '📊 ADVANCED ANALYTICS - Dashboard com métricas avançadas')
log(colors.yellow, '🔐 MESSAGE ENCRYPTION - Criptografia end-to-end')
log(colors.yellow, '📱 MOBILE APP - Aplicativo mobile nativo')
log(colors.yellow, '🤖 AI INTEGRATION - ChatGPT/Claude para respostas inteligentes')
log(colors.yellow, '🎵 VOICE MESSAGES - Suporte a mensagens de áudio')
log(colors.yellow, '📹 VIDEO CALLS - Integração com chamadas de vídeo')

// ===============================
// SCORE FINAL
// ===============================

header('📊 SCORE FINAL DO SISTEMA')

const totalScore = (coreScore/coreFiles.length + apiScore + messagingScore + contactScore + campaignScore + perfScore) / 6

log(colors.bold, `\n🎯 SCORE GERAL: ${Math.round(totalScore*100)}%`)

if (totalScore >= 0.9) {
  log(colors.green + colors.bold, '🏆 TIER S - SISTEMA PROFISSIONAL')
  log(colors.green, '✅ Pronto para produção com funcionalidades avançadas')
} else if (totalScore >= 0.7) {
  log(colors.yellow + colors.bold, '🥉 TIER A - SISTEMA SÓLIDO')
  log(colors.yellow, '⚠️  Algumas funcionalidades podem ser melhoradas')
} else if (totalScore >= 0.5) {
  log(colors.red + colors.bold, '🥉 TIER B - SISTEMA BÁSICO')
  log(colors.red, '❌ Precisa de melhorias significativas')
} else {
  log(colors.red + colors.bold, '💥 TIER C - SISTEMA INCOMPLETO')
  log(colors.red, '🚨 Muitas funcionalidades críticas faltando')
}

console.log('\n' + '='.repeat(60))
log(colors.bold + colors.blue, '🚀 VALIDAÇÃO COMPLETA FINALIZADA')
console.log('='.repeat(60) + '\n')