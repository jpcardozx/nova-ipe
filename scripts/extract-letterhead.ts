/**
 * Script para extrair topo e rodapé do PDF do timbre
 * 
 * Converte PDF → PNG e faz crop nas regiões de cabeçalho e rodapé
 */

import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

async function extractLetterhead() {
  try {
    console.log('🎨 Extraindo timbre do PDF...\n');
    
    // Caminho do PDF
    const pdfPath = '/home/jpcardozx/Downloads/timbre.pdf';
    const outputDir = '/home/jpcardozx/projetos/nova-ipe/public/letterhead';
    
    // Criar diretório se não existir
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`✅ Diretório criado: ${outputDir}\n`);
    }
    
    // Ler PDF
    console.log('📄 Lendo PDF...');
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const page = pdfDoc.getPage(0);
    
    const { width, height } = page.getSize();
    console.log(`📐 Dimensões da página: ${width}x${height}px\n`);
    
    // Como não podemos renderizar PDF diretamente, vamos criar instruções
    console.log('⚠️  PDF detectado. Precisamos converter para imagem primeiro.\n');
    console.log('🔧 PRÓXIMOS PASSOS:\n');
    console.log('1. Abra o timbre.pdf no seu visualizador');
    console.log('2. Tire screenshot da página completa');
    console.log('3. Salve como: /home/jpcardozx/Downloads/timbre-full.png');
    console.log('4. Execute este script novamente\n');
    console.log('OU use este comando no terminal:\n');
    console.log('  pdftoppm -png -r 300 /home/jpcardozx/Downloads/timbre.pdf /home/jpcardozx/Downloads/timbre\n');
    
    // Verificar se já existe uma versão PNG
    const pngPath = '/home/jpcardozx/Downloads/timbre-full.png';
    const pngAltPath = '/home/jpcardozx/Downloads/timbre-1.png';
    
    let imagePath: string | null = null;
    
    if (fs.existsSync(pngPath)) {
      imagePath = pngPath;
    } else if (fs.existsSync(pngAltPath)) {
      imagePath = pngAltPath;
    }
    
    if (imagePath) {
      console.log(`✅ Imagem PNG encontrada: ${imagePath}\n`);
      await processImage(imagePath, outputDir);
    } else {
      console.log('❌ Nenhuma imagem PNG encontrada ainda.\n');
      console.log('💡 Dica: Use este comando para converter o PDF:\n');
      console.log('  convert -density 300 /home/jpcardozx/Downloads/timbre.pdf /home/jpcardozx/Downloads/timbre-full.png\n');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
}

async function processImage(imagePath: string, outputDir: string) {
  try {
    console.log('🖼️  Processando imagem...\n');
    
    // Carregar imagem
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    console.log(`📐 Dimensões originais: ${metadata.width}x${metadata.height}px\n`);
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Não foi possível obter dimensões da imagem');
    }
    
    const width = metadata.width;
    const height = metadata.height;
    
    // Calcular regiões (aproximadamente)
    // Topo: primeiros 15% da página
    const headerHeight = Math.floor(height * 0.15);
    
    // Rodapé: últimos 10% da página
    const footerHeight = Math.floor(height * 0.10);
    const footerTop = height - footerHeight;
    
    console.log('✂️  Fazendo crops...\n');
    
    // Extrair topo
    console.log(`📤 Topo: 0, 0, ${width}, ${headerHeight}`);
    await image
      .clone()
      .extract({
        left: 0,
        top: 0,
        width: width,
        height: headerHeight,
      })
      .toFile(path.join(outputDir, 'timbre-topo.png'));
    
    console.log(`✅ Salvo: ${outputDir}/timbre-topo.png\n`);
    
    // Extrair rodapé
    console.log(`📤 Rodapé: 0, ${footerTop}, ${width}, ${footerHeight}`);
    await image
      .clone()
      .extract({
        left: 0,
        top: footerTop,
        width: width,
        height: footerHeight,
      })
      .toFile(path.join(outputDir, 'timbre-rodape.png'));
    
    console.log(`✅ Salvo: ${outputDir}/timbre-rodape.png\n`);
    
    // Estatísticas dos arquivos
    const topoStats = fs.statSync(path.join(outputDir, 'timbre-topo.png'));
    const rodapeStats = fs.statSync(path.join(outputDir, 'timbre-rodape.png'));
    
    console.log('📊 RESULTADO:\n');
    console.log(`   Topo:   ${width}x${headerHeight}px - ${formatBytes(topoStats.size)}`);
    console.log(`   Rodapé: ${width}x${footerHeight}px - ${formatBytes(rodapeStats.size)}\n`);
    
    console.log('🎉 SUCESSO! Imagens extraídas:\n');
    console.log(`   📁 ${outputDir}/timbre-topo.png`);
    console.log(`   📁 ${outputDir}/timbre-rodape.png\n`);
    
    console.log('🚀 PRÓXIMO PASSO:\n');
    console.log('   Agora vou atualizar o template do banco de dados!\n');
    
  } catch (error) {
    console.error('❌ Erro ao processar imagem:', error);
    throw error;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Executar
extractLetterhead().catch(console.error);
