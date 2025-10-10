# AWS CLI v2 - Configuração Profissional para Produção

## ⚠️ IMPORTANTE: Site Comercial em Produção

Para uma **imobiliária em produção**, devemos seguir as melhores práticas de segurança da AWS.

---

## 🔒 Opções de Autenticação (Ordem de Segurança)

### Opção 1: IAM Identity Center (SSO) - RECOMENDADO para Produção ✅

**Vantagens:**
- ✅ Credenciais temporárias (expiram automaticamente)
- ✅ Renovação automática
- ✅ Auditoria completa
- ✅ MFA nativo
- ✅ Gerenciamento centralizado

**Quando usar:**
- Produção comercial (seu caso!)
- Múltiplos desenvolvedores
- Compliance e auditoria necessários

**Setup:**
```bash
aws configure sso
```

### Opção 2: IAM User com MFA - Aceitável para Desenvolvimento

**Vantagens:**
- ✓ Mais simples que SSO
- ✓ Funciona sem SSO configurado
- ✓ MFA adiciona camada de segurança

**Desvantagens:**
- ⚠️ Credenciais de longo prazo
- ⚠️ Risco se vazarem
- ⚠️ Não é best practice para produção

**Setup:**
```bash
aws configure
```

---

## 🎯 Recomendação para o Seu Caso

Como você está gerenciando **infraestrutura de produção** de uma imobiliária:

### Curto Prazo (Migração Imediata):
1. Use IAM User com **permissões mínimas** (policy que criamos)
2. **ATIVE MFA** no usuário IAM
3. **Rode credenciais** periodicamente
4. Execute a migração

### Médio/Longo Prazo (Pós-Migração):
1. Configure **IAM Identity Center**
2. Migre autenticação para SSO
3. Desative/delete as Access Keys antigas

---

## 🔐 Melhorando a Segurança da Policy Atual

Sua policy atual (`ipe-lightsail`) dá acesso a **todos** os recursos Lightsail.
Vamos restringi-la ao **mínimo necessário**:

### Policy Restrita (Principle of Least Privilege):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "LightsailReadOnly",
      "Effect": "Allow",
      "Action": [
        "lightsail:GetInstances",
        "lightsail:GetInstance",
        "lightsail:GetInstanceState",
        "lightsail:GetInstanceAccessDetails"
      ],
      "Resource": "arn:aws:lightsail:us-east-1:312865684399:Instance/*"
    },
    {
      "Sid": "LightsailSSHAccess",
      "Effect": "Allow",
      "Action": [
        "lightsail:GetInstanceAccessDetails"
      ],
      "Resource": "arn:aws:lightsail:us-east-1:312865684399:Instance/Ipe-1"
    },
    {
      "Sid": "LightsailSnapshotRead",
      "Effect": "Allow",
      "Action": [
        "lightsail:GetInstanceSnapshots",
        "lightsail:CreateInstanceSnapshot"
      ],
      "Resource": "arn:aws:lightsail:us-east-1:312865684399:InstanceSnapshot/*"
    }
  ]
}
```

**Diferença:**
- ❌ Antes: Acesso a TODOS os recursos (`"Resource": "*"`)
- ✅ Agora: Acesso apenas à instância `Ipe-1` e região específica

---

## 🔑 Configuração com MFA (Recomendado)

### 1. Ativar MFA no Usuário IAM

1. IAM Console → Users → [seu usuário]
2. Security credentials
3. "Assign MFA device"
4. Escolha: Virtual MFA device (Google Authenticator/Authy)
5. Escaneie QR Code
6. Digite dois códigos consecutivos

### 2. Configurar AWS CLI com MFA

No arquivo `~/.aws/config`:

```ini
[profile ipe-migration]
region = us-east-1
output = json
mfa_serial = arn:aws:iam::312865684399:mfa/NOME_DO_USUARIO
```

### 3. Usar com MFA

```bash
# Obter token de sessão com MFA
aws sts get-session-token \
  --serial-number arn:aws:iam::312865684399:mfa/USUARIO \
  --token-code 123456

# Use as credenciais temporárias retornadas
```

---

## 📋 Checklist de Segurança para Produção

- [ ] Usuário IAM criado (não root) ✅
- [ ] Policy com permissões mínimas ✅
- [ ] MFA ativado no usuário IAM
- [ ] Access Keys rotacionadas a cada 90 dias
- [ ] CloudTrail ativado (auditoria)
- [ ] Credenciais nunca commitadas no Git
- [ ] Usar AWS Secrets Manager para credenciais sensíveis
- [ ] Planejar migração para IAM Identity Center

---

## 🚀 Próximos Passos Recomendados

### Agora (Migração):
```bash
# 1. Criar Access Key do usuário IAM
# 2. Ativar MFA
# 3. Configurar:
aws configure

# 4. Testar:
aws lightsail get-instances --region us-east-1

# 5. Executar migração:
./scripts/lightsail-access.sh
```

### Depois (Hardening):
1. Implementar IAM Identity Center
2. Configurar CloudTrail
3. Revisar permissões mensalmente
4. Documentar processos de segurança

---

## 📚 Referências Oficiais AWS

- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [IAM Identity Center Setup](https://docs.aws.amazon.com/singlesignon/latest/userguide/getting-started.html)
- [Principle of Least Privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege)
- [MFA for IAM Users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html)

---

## ✅ Decisão

**Para migração imediata:**
- Use IAM User + MFA
- Policy restrita ao mínimo necessário
- Documente para migrar para SSO depois

**Isso é aceitável?** Sim, desde que:
1. MFA esteja ativo
2. Credenciais sejam rotacionadas
3. Você planeje migrar para SSO em breve

---

Desculpa pela abordagem inicial! Você está 100% certo em exigir 
práticas de segurança adequadas para um negócio real. 🙏
