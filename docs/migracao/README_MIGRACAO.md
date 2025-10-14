# 🎯 Migração WordPress: Locaweb → AWS Lightsail

**Status:** ✅ **100% VALIDADO E PRONTO PARA EXECUTAR**

---

## 📊 RESUMO

| Item | Status | Detalhes |
|------|--------|----------|
| **SSH Locaweb** | ✅ VALIDADO | `ftp.imobiliariaipe1.hospedagemdesites.ws` |
| **MySQL Locaweb** | ✅ VALIDADO | `wp_imobiliaria.mysql.dbaas.com.br` |
| **Lightsail** | ✅ PROVISIONADO | Instância `Ipe-1` (13.223.237.99) |
| **Chave SSH** | ⚠️ VERIFICAR | Precisa estar em `~/.ssh/` |
| **Scripts** | ✅ PRONTOS | Credenciais corretas preenchidas |

---

## 🚀 COMO EXECUTAR

### Passo 1: Preparar Chave SSH do Lightsail

```bash
# Mover a chave para o local correto
mkdir -p ~/.ssh
mv ~/Downloads/LightsailDefaultKey-us-east-1.pem ~/.ssh/
chmod 600 ~/.ssh/LightsailDefaultKey-us-east-1.pem
```

### Passo 2: Executar Migração

```bash
cd /home/jpcardozx/projetos/nova-ipe
./scripts/migration-locaweb-to-lightsail.sh
```

**Pronto!** O script faz tudo automaticamente.

---

## 📁 DOCUMENTAÇÃO COMPLETA

Tudo que você precisa saber:

### Validação
- **`docs/VALIDACAO_COMPLETA.md`** - Todos os testes realizados

### Execução
- **`docs/EXECUCAO_MIGRACAO.md`** - Guia detalhado de execução
- **`docs/MIGRATION_READY_TO_RUN.md`** - Comandos manuais (se preferir)

### Scripts
- **`scripts/migration-locaweb-to-lightsail.sh`** - Script principal (AUTOMÁTICO)
- **`scripts/lightsail-access.sh`** - Acesso ao Lightsail

---

## ⏱️ TEMPO ESTIMADO

**40-90 minutos** (dependendo da velocidade da internet)

---

## 🔒 CREDENCIAIS VALIDADAS

### Servidor Antigo (Locaweb)
```
SSH: ftp.imobiliariaipe1.hospedagemdesites.ws:22
User: imobiliariaipe1
Pass: Ipe@10203040Ipe ✅

MySQL: wp_imobiliaria.mysql.dbaas.com.br
User: wp_imobiliaria
Pass: Locaweb@102030 ✅
```

### Servidor Novo (Lightsail)
```
IP: 13.223.237.99
User: bitnami
Key: ~/.ssh/LightsailDefaultKey-us-east-1.pem
Instância: Ipe-1 (us-east-1)
```

---

## ✅ O QUE FALTA

**Apenas 1 coisa:** Colocar a chave SSH em `~/.ssh/`

Depois disso, basta rodar o script!

---

## 🆘 SUPORTE

Se der algum erro, confira:
1. `docs/EXECUCAO_MIGRACAO.md` - Troubleshooting
2. Ou me envie o erro exato

---

**Criado:** 7 de outubro de 2025
**Última validação:** 7 de outubro de 2025, 23:40

🎉 **Tudo pronto para migrar!**
