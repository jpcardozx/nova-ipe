/**
 * Script para garantir que a configuração TypeScript é usada
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

console.log(' Configurando Next.js para usar TypeScript config...');

try {
  // Verificar se o TypeScript está instalado
  try {
    execSync('npx tsc --version', { stdio: 'inherit' });
    console.log(' TypeScript já está instalado');
  } catch (e) {
    console.log(' TypeScript não encontrado, instalando...');
    execSync('npm install --no-save typescript @types/node', { stdio: 'inherit' });
  }

  // Verificar se o arquivo next.config.ts existe
  const tsConfigPath = path.join(process.cwd(), 'next.config.ts');

  if (!fs.existsSync(tsConfigPath)) {
    console.error(' Arquivo next.config.ts não encontrado');
    process.exit(1);
  }

  // Compilar o arquivo TypeScript
  console.log(' Compilando next.config.ts...');
  execSync('npx tsc next.config.ts', { stdio: 'inherit' });

  console.log(' Configuração TypeScript compilada com sucesso');

  // Verificar se o next.config.js foi criado
  const jsConfigPath = path.join(process.cwd(), 'next.config.js');

  if (!fs.existsSync(jsConfigPath)) {
    console.error(' Falha ao compilar next.config.ts para next.config.js');
    process.exit(1);
  }

  console.log(' Next.js está configurado para usar o arquivo compilado a partir do TypeScript');
} catch (error) {
  console.error(' Erro ao configurar Next.js TypeScript:', error);
  process.exit(1);
}
