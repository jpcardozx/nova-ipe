// Script para criar uma imagem placeholder diretamente
const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

// Caminho do arquivo
const jpgPath = path.join(__dirname, '..', 'public', 'images', 'property-placeholder.jpg');

console.log('Criando imagem property-placeholder.jpg...');

try {
    // Tentar registrar fonte Arial (depende do sistema)
    try {
        registerFont('Arial', { family: 'Arial' });
    } catch (fontError) {
        console.log('Aviso: Não foi possível registrar a fonte Arial, usando fonte padrão.');
    }

    // Criar uma imagem simples com fundo cinza e texto
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    // Desenhar fundo
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 800, 600);

    // Desenhar borda
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 780, 580);

    // Desenhar texto
    ctx.fillStyle = '#888888';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Imagem não disponível', 400, 280);
    ctx.font = '30px Arial';
    ctx.fillText('Ipê Imóveis', 400, 330);

    // Salvar como JPG
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
    fs.writeFileSync(jpgPath, buffer);

    console.log(`Arquivo ${jpgPath} criado com sucesso!`);
} catch (error) {
    console.error(`Erro ao criar arquivo de placeholder:`, error);
    process.exit(1);
}
