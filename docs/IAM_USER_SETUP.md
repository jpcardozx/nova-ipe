# Guia: Criar Usuário IAM para Lightsail (Jeito Certo)

## ⚠️ NUNCA use chaves do usuário root!

A AWS bloqueou você de criar chaves root por segurança. Isso é BUROCRACIA TÉCNICA.

---

## ✅ Passo a Passo - Criar Usuário IAM

### 1️⃣ Acessar IAM
```
https://console.aws.amazon.com/iam/
```

### 2️⃣ Criar Usuário

1. No menu lateral, clique em **"Users"** (Usuários)
2. Clique em **"Create user"** (Criar usuário)
3. Preencha:
   - **User name**: `lightsail-admin` (ou qualquer nome)
   - ✅ Marque: **"Provide user access to the AWS Management Console"** (opcional)
   - Clique em **"Next"**

### 3️⃣ Definir Permissões

Você tem 2 opções:

#### Opção A: Permissões Completas Lightsail (RECOMENDADO)

1. Selecione: **"Attach policies directly"**
2. Na busca, digite: `Lightsail`
3. Marque: **`AmazonLightsailFullAccess`**
4. Clique em **"Next"**

#### Opção B: Permissões Mínimas (Mais Seguro)

1. Selecione: **"Attach policies directly"**
2. Clique em **"Create policy"** (abre nova aba)
3. Clique em **"JSON"**
4. Cole esta política:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lightsail:GetInstances",
        "lightsail:GetInstance",
        "lightsail:GetInstanceAccessDetails",
        "lightsail:GetInstancePortStates",
        "lightsail:GetStaticIps",
        "lightsail:GetStaticIp",
        "lightsail:CreateInstanceSnapshot",
        "lightsail:GetInstanceSnapshots",
        "lightsail:AllocateStaticIp",
        "lightsail:AttachStaticIp"
      ],
      "Resource": "*"
    }
  ]
}
```

5. Clique em **"Next"**
6. Nome da policy: `LightsailReadWriteAccess`
7. Clique em **"Create policy"**
8. Volte para a aba do usuário, clique no botão refresh
9. Busque e marque sua policy `LightsailReadWriteAccess`
10. Clique em **"Next"**

### 4️⃣ Revisar e Criar

1. Revise as informações
2. Clique em **"Create user"**

### 5️⃣ Criar Access Key

1. Clique no usuário recém-criado (`lightsail-admin`)
2. Vá na aba **"Security credentials"**
3. Role até **"Access keys"**
4. Clique em **"Create access key"**
5. Selecione: **"Command Line Interface (CLI)"**
6. ✅ Marque o checkbox de confirmação
7. Clique em **"Next"**
8. (Opcional) Adicione uma descrição: `Lightsail WordPress Migration`
9. Clique em **"Create access key"**

### 6️⃣ SALVAR AS CREDENCIAIS! ⚠️

A tela mostrará:
- **Access key ID**: `AKIAXXXXXXXXXXXXXXXX`
- **Secret access key**: `wJalrXUtnFEMI/K7MDENG/...`

**COPIE AGORA! Você não poderá ver o Secret novamente!**

Opções:
- Download .csv file (recomendado)
- Copiar manualmente

---

## 🚀 Configurar AWS CLI

Com as credenciais em mãos, execute:

```bash
aws configure
```

Forneça:
```
AWS Access Key ID [None]: AKIAXXXXXXXXXXXXXXXX
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/...
Default region name [None]: us-east-1
Default output format [None]: json
```

---

## ✅ Testar Configuração

```bash
# Verificar identidade
aws sts get-caller-identity

# Listar instâncias Lightsail
aws lightsail get-instances --region us-east-1
```

Se funcionar, você verá suas instâncias listadas! 🎉

---

## 🔒 Segurança

✅ **Faça**:
- Use usuário IAM com permissões específicas
- Crie chaves separadas para cada finalidade
- Rotacione chaves periodicamente
- Mantenha chaves em local seguro

❌ **NÃO faça**:
- Usar usuário root
- Compartilhar chaves
- Commitar chaves no Git
- Dar permissões além do necessário

---

## 🆘 Problemas?

### "Access Denied" ao listar instâncias
→ Volte no IAM e adicione a policy `AmazonLightsailFullAccess`

### "Region not found"
→ Verifique se usou `us-east-1` (ou a região onde sua instância está)

### Esqueci de copiar a Secret Key
→ Delete a access key e crie uma nova (sem problemas)

---

## 📞 Quando Estiver Pronto

Execute:
```bash
./scripts/lightsail-access.sh
```

E o script pegará a senha do WordPress automaticamente! 🚀
