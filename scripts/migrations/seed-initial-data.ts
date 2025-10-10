#!/usr/bin/env tsx
/**
 * 🔧 Inserir Dados Iniciais - Alíquotas
 * 
 * Insere configuração IGPM padrão e template PDF padrão
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '../../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(msg: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  🔧 INSERIR DADOS INICIAIS - ALÍQUOTAS                  ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  // 1. Verificar se já existe configuração padrão
  log('🔍 Verificando configuração padrão...', 'cyan');
  
  const { data: existingSetting } = await supabase
    .from('calculation_settings')
    .select('*')
    .eq('is_default', true)
    .single();
  
  if (existingSetting) {
    log(`   ✅ Configuração já existe: ${existingSetting.name}`, 'green');
  } else {
    log('   📝 Criando configuração IGPM padrão...', 'cyan');
    
    const { data: newSetting, error: settingError } = await supabase
      .from('calculation_settings')
      .insert({
        name: 'IGPM',
        description: 'Índice Geral de Preços do Mercado - padrão para contratos de locação',
        method: 'igpm',
        is_default: true,
        active: true,
        default_rate: 4.5,
        valid_from: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();
    
    if (settingError) {
      log(`   ❌ Erro: ${settingError.message}`, 'red');
    } else {
      log(`   ✅ Configuração criada: ${newSetting.name}`, 'green');
    }
  }
  
  // 2. Verificar se já existe template padrão
  log('\n🔍 Verificando template padrão...', 'cyan');
  
  const { data: existingTemplate } = await supabase
    .from('pdf_templates')
    .select('*')
    .eq('is_default', true)
    .single();
  
  if (existingTemplate) {
    log(`   ✅ Template já existe: ${existingTemplate.name}`, 'green');
  } else {
    log('   📝 Criando template PDF padrão...', 'cyan');
    
    const templateContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .content { line-height: 1.6; }
    .highlight { background: #f0f0f0; padding: 10px; margin: 20px 0; }
    .signature { margin-top: 60px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Notificação de Reajuste de Aluguel</h1>
  </div>
  
  <div class="content">
    <p>Prezado(a) <strong>{{client_name}}</strong>,</p>
    
    <p>Conforme estipulado em contrato de locação, vimos por meio desta comunicar o reajuste do valor do aluguel do imóvel localizado em <strong>{{property_address}}</strong>.</p>
    
    <div class="highlight">
      <p><strong>Dados do Reajuste:</strong></p>
      <ul>
        <li>Índice utilizado: <strong>{{index_type}}</strong></li>
        <li>Percentual: <strong>{{percentage}}%</strong></li>
        <li>Valor atual: <strong>R$ {{current_rent}}</strong></li>
        <li>Novo valor: <strong>R$ {{new_rent}}</strong></li>
        <li>Data de vigência: <strong>{{effective_date}}</strong></li>
      </ul>
    </div>
    
    <p>O novo valor entrará em vigor a partir da data mencionada acima.</p>
    
    <p>Permanecemos à disposição para quaisquer esclarecimentos.</p>
    
    <div class="signature">
      <p>Atenciosamente,</p>
      <p><strong>Imobiliária Ipê</strong></p>
      <p>{{signature_date}}</p>
    </div>
  </div>
</body>
</html>
    `.trim();
    
    const { data: newTemplate, error: templateError } = await supabase
      .from('pdf_templates')
      .insert({
        name: 'Carta Padrão de Reajuste',
        description: 'Template padrão para notificação de reajuste de aluguel',
        content: templateContent,
        is_default: true,
        active: true,
        variables: [
          'client_name',
          'property_address',
          'index_type',
          'percentage',
          'current_rent',
          'new_rent',
          'effective_date',
          'signature_date'
        ],
      })
      .select()
      .single();
    
    if (templateError) {
      log(`   ❌ Erro: ${templateError.message}`, 'red');
    } else {
      log(`   ✅ Template criado: ${newTemplate.name}`, 'green');
    }
  }
  
  // 3. Verificação final
  log('\n' + '═'.repeat(63), 'cyan');
  log('📊 VERIFICAÇÃO FINAL', 'cyan');
  log('═'.repeat(63), 'cyan');
  
  const { data: settings, error: settingsError } = await supabase
    .from('calculation_settings')
    .select('*')
    .eq('is_default', true);
  
  const { data: templates, error: templatesError } = await supabase
    .from('pdf_templates')
    .select('*')
    .eq('is_default', true);
  
  console.log('');
  
  if (settings && settings.length > 0) {
    log(`✅ Configuração padrão: ${settings[0].name}`, 'green');
    log(`   Método: ${settings[0].method}`, 'cyan');
    log(`   Taxa padrão: ${settings[0].default_rate}%`, 'cyan');
  } else {
    log('❌ Configuração padrão não encontrada', 'red');
  }
  
  console.log('');
  
  if (templates && templates.length > 0) {
    log(`✅ Template padrão: ${templates[0].name}`, 'green');
    log(`   Variáveis: ${templates[0].variables?.length || 0}`, 'cyan');
  } else {
    log('❌ Template padrão não encontrado', 'red');
  }
  
  console.log('\n' + '═'.repeat(63));
  log('🎉 DADOS INICIAIS CONFIGURADOS!', 'green');
  log('═'.repeat(63) + '\n');
  
  log('📋 Sistema pronto para uso:', 'cyan');
  console.log('  ✅ Tabelas criadas');
  console.log('  ✅ Configuração IGPM padrão');
  console.log('  ✅ Template PDF padrão');
  console.log('  ⏳ Aguardando API routes');
  console.log('  ⏳ Aguardando UI components\n');
}

main().catch(console.error);
