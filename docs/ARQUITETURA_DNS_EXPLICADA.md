========================================
ARQUITETURA ATUAL: VERCEL + LOCAWEB
========================================

🌐 CONFIGURAÇÃO DNS ATUAL:
========================================

1. DOMÍNIO PRINCIPAL (Vercel):
   ✅ imobiliariaipe.com.br → 76.76.21.21 (Vercel)
   ✅ www.imobiliariaipe.com.br → 76.76.21.21 (Vercel)

2. SUBDOMÍNIO PORTAL (Locaweb):
   ✅ portal.imobiliariaipe.com.br → 187.45.193.173 (Locaweb)

3. SUBDOMÍNIO FTP (PROBLEMA):
   ❌ ftp.imobiliariaipe.com.br → NÃO EXISTE (deveria ser Locaweb)

========================================
🎯 PROBLEMA IDENTIFICADO:
========================================

ANTES (DNS na Locaweb):
- Todos os subdomínios funcionavam automaticamente
- ftp.imobiliariaipe.com.br → 187.45.193.173 ✅
- portal.imobiliariaipe.com.br → 187.45.193.173 ✅

AGORA (DNS na Vercel):
- Domínio principal → Vercel ✅
- portal → Locaweb (configurado manualmente) ✅  
- ftp → NÃO CONFIGURADO ❌

========================================
📋 CAMINHOS DE RESOLUÇÃO:
========================================

OPÇÃO 1 - CRIAR REGISTRO DNS FTP:
Na Vercel, adicionar:
- Tipo: A
- Nome: ftp
- Valor: 187.45.193.173
- TTL: 300

OPÇÃO 2 - USAR IP DIRETO (MAIS RÁPIDO):
No FileZilla:
- Host: 187.45.193.173
- Usuário: imobiliariaipe1
- Senha: [sua senha]
- Porta: 21

OPÇÃO 3 - USAR HOSTNAME LOCAWEB:
No FileZilla:
- Host: hm2662.locaweb.com.br
- Usuário: imobiliariaipe1
- Senha: [sua senha]
- Porta: 21

========================================
🚀 RECOMENDAÇÃO:
========================================

IMEDIATO: Use OPÇÃO 2 (IP direto)
FUTURO: Configure OPÇÃO 1 (DNS FTP)

O WordPress está funcionando, só precisa corrigir as URLs!

========================================