# Guia de Testes - Otimizações de Loading Nova Ipê

Este guia fornece instruções detalhadas para testar as otimizações de carregamento implementadas no site Nova Ipê.

## 1. Teste em Dispositivos Reais

### Dispositivos Móveis
- **Android:** Teste em pelo menos um dispositivo de entrada e um premium
- **iOS:** Teste em iPhone mais recente e um modelo mais antigo
- **Navegadores:** Chrome, Safari, Firefox
- **Redes:** Teste em Wi-Fi, 4G e emular 3G (instruções abaixo)

### Desktop
- **Navegadores:** Chrome, Firefox, Safari, Edge
- **Sistemas:** Windows 10/11, macOS
- **Conexões:** Fibra e emulação de conexão lenta

## 2. Teste de Simulação de Conexão Lenta

### Chrome DevTools
1. Abra o DevTools (F12)
2. Vá na aba "Network"
3. Selecione "Slow 3G" no dropdown de throttling
4. Desative o cache: marque "Disable cache"
5. Recarregue a página (Ctrl+F5 ou Cmd+Shift+R)
6. Observe:
   - O tempo até a página ficar visível
   - Se o indicador de loading é removido automaticamente
   - Se todos os elementos se tornam interativos

### Throttling Adicional
Para um teste mais rigoroso:
1. Use a extensão "Network Throttling" para Chrome
2. Configure para 150 Kbps (aprox. 2G)
3. Acesse a página e observe o comportamento

## 3. Teste de WhatsApp

### Compartilhamento Real
1. Compartilhe um link do site no WhatsApp para outro dispositivo
2. No dispositivo que recebeu, clique no link para abrir
3. Observe se:
   - A página carrega sem estados intermediários de loading
   - A visualização é imediata ou próxima disso
   - A exibição da prévia no WhatsApp está correta

### Simulação
Se não for possível o compartilhamento real:
1. Adicione `?utm_source=whatsapp` ao final da URL do site
2. Carregue a página com essa URL
3. Verifique se o tratamento especial para WhatsApp é aplicado

## 4. Teste de Diagnóstico de Performance

### Monitoramento Ativo
1. Adicione `?debug=performance` ao final de qualquer URL do site
2. Observe o painel de diagnóstico que aparece no canto inferior direito
3. Verifique as métricas:
   - **FCP (First Contentful Paint):** Ideal < 1.8s
   - **LCP (Largest Contentful Paint):** Ideal < 2.5s
   - **CLS (Cumulative Layout Shift):** Ideal < 0.1
   - **Recursos lentos:** Identifique recursos que demoram mais de 300ms

### Teste de Bloqueio de Thread Principal
Para verificar se o site se recupera de travamentos:
1. No DevTools, vá na aba "Console"
2. Digite e execute: `setTimeout(() => { for(let i=0; i<1000000000; i++) {} }, 1000);`
3. Isso simulará um bloqueio da thread principal
4. Observe se o site se recupera e continua visível após o bloqueio

## 5. Teste de Fallbacks Extremos

### Desligamento de JavaScript
1. No DevTools, vá na aba "Settings"
2. Em "Preferences" > "Debugger", marque "Disable JavaScript"
3. Recarregue a página
4. Verifique se o conteúdo principal ainda é visível e se o CSS crítico foi aplicado

### Interrupção de Carregamento
1. Inicie o carregamento da página
2. Após 1-2 segundos, clique no botão "Stop" do navegador (X)
3. Observe se mesmo com o carregamento interrompido:
   - O conteúdo principal já está visível
   - A página está pelo menos parcialmente utilizável

## 6. Checklist Final

✅ **Visibilidade:** A página fica visível em menos de 3 segundos em 3G
✅ **WhatsApp:** Carregamento especial funciona em compartilhamentos
✅ **Resiliência:** Recuperação automática de falhas de carregamento
✅ **Progressive Enhancement:** Conteúdo essencial visível mesmo sem JS
✅ **Diagnóstico:** Painel de performance exibe dados corretos

## Relato de Problemas

Se encontrar problemas durante os testes, por favor documente:

1. **Dispositivo e navegador** exatos
2. **Condições de rede** no momento do teste
3. **Passos para reproduzir** o problema
4. **Capturas de tela** ou vídeos do comportamento
5. **Logs de console** (se disponíveis)

Envie o relatório para suporte@novaipe.com com o assunto "Teste de Carregamento - [Resumo do problema]"
