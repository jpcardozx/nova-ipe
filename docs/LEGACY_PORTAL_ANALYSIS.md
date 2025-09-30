# ANÁLISE DO PROBLEMA DO SITE LEGADO

## Situação Atual
- **Site Novo**: `imobiliariaipe.com.br` (SSL pelo Vercel) ✅
- **Site Legado**: `portal.imobiliariaipe.com.br` (problemas de servidor) ❌

## Problemas Identificados no Site Legado
1. **SSL**: Certificado é para `*.websiteseguro.com` (não cobre o domínio)
2. **suPHP**: Erro de UID (provavelmente permissões de arquivos)
3. **HTTP 500**: Servidor retornando erro interno

## Opções de Solução

### Opção 1: Corrigir o Servidor Legado (Recomendada para curto prazo)
**Para o provedor de hospedagem/administrador do servidor:**

1. **Certificado SSL**:
   - Instalar certificado SSL válido para `portal.imobiliariaipe.com.br`
   - Ou configurar um redirecionamento HTTPS → HTTP temporário

2. **Problema suPHP**:
   ```bash
   # Verificar configuração atual
   grep min_uid /etc/suphp/suphp.conf
   
   # Verificar UID dos arquivos
   ls -la /home/httpd/html/
   
   # Corrigir proprietário dos arquivos (como root)
   chown -R [usuario_correto]:[grupo_correto] /home/httpd/html/
   
   # Ou ajustar min_uid no suphp.conf se necessário
   ```

### Opção 2: Migração Progressiva (Recomendada para longo prazo)
1. Manter acesso ao legado funcionando para transição
2. Migrar funcionalidades críticas para o novo sistema
3. Gradualmente direcionar usuários para o novo portal

### Opção 3: Solução Temporária no Front-end
Se o legado não puder ser corrigido rapidamente, podemos:
1. Adicionar aviso sobre manutenção
2. Oferecer acesso alternativo via HTTP (menos seguro)
3. Direcionar para funcionalidades equivalentes no novo sistema

## Próximos Passos
1. **Imediato**: Contatar provedor/admin do servidor legado
2. **Curto prazo**: Implementar correções SSL e suPHP
3. **Médio prazo**: Planejar migração completa
4. **Longo prazo**: Descomissionar servidor legado

## Comandos de Diagnóstico para o Admin
```bash
# Verificar status do Apache
systemctl status apache2

# Verificar logs de erro
tail -f /var/log/apache2/error.log

# Verificar permissões
ls -la /home/httpd/html/index.php

# Verificar configuração suPHP
cat /etc/suphp/suphp.conf | grep -E "(min_uid|docroot)"
```