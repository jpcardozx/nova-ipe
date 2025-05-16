#!/bin/bash

# Script para fazer push das correções para o GitHub

# Garantir que as principais alterações estão no staging
git add package.json postcss.config.js scripts/* public/fonts/* Montserrat-*.ttf VERCEL-BUILD-FIX-UPDATE.md app/api/og/route.tsx

# Confirmar que os arquivos estão no staging
echo "Arquivos que serão commitados:"
git status --short

# Perguntar se o usuário deseja continuar
read -p "Deseja continuar com o commit e push? (s/n) " resposta
if [ "$resposta" != "s" ]; then
  echo "Operação cancelada."
  exit 1
fi

# Commit das alterações
git commit -m "fix: Implementa correções completas para build na Vercel"

# Push para o repositório remoto
git push origin main

echo "Push realizado com sucesso!"
