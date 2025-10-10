/**
 * Serviço de Armazenamento de PDFs
 * 
 * Gerencia upload de PDFs gerados para R2 (Cloudflare)
 * Integração com storage já configurado no projeto
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cliente S3 (R2)
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'nova-ipe';
const PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://cdn.nova-ipe.com';

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  uploaded_at: Date;
}

/**
 * Upload de PDF para R2
 */
export async function uploadPDFToR2(
  buffer: Buffer,
  filename: string,
  metadata?: Record<string, string>
): Promise<UploadResult> {
  try {
    const key = `aliquotas/pdfs/${filename}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: 'application/pdf',
      ContentDisposition: `inline; filename="${filename}"`,
      Metadata: metadata,
      CacheControl: 'public, max-age=31536000', // 1 ano
    });
    
    await s3Client.send(command);
    
    const url = `${PUBLIC_URL}/${key}`;
    
    return {
      url,
      key,
      size: buffer.length,
      uploaded_at: new Date(),
    };
  } catch (error) {
    console.error('Error uploading PDF to R2:', error);
    throw new Error(`Failed to upload PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete PDF do R2
 */
export async function deletePDFFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting PDF from R2:', error);
    throw new Error(`Failed to delete PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Gera URL assinada temporária (para acesso privado)
 */
export async function generateSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error(`Failed to generate signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Upload de imagem (logo, timbre, assinatura)
 */
export async function uploadImage(
  buffer: Buffer,
  filename: string,
  contentType: string = 'image/png'
): Promise<UploadResult> {
  try {
    const key = `aliquotas/images/${filename}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000',
    });
    
    await s3Client.send(command);
    
    const url = `${PUBLIC_URL}/${key}`;
    
    return {
      url,
      key,
      size: buffer.length,
      uploaded_at: new Date(),
    };
  } catch (error) {
    console.error('Error uploading image to R2:', error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Gera caminho organizado por cliente e data
 */
export function generateStoragePath(
  client_id: string,
  tenant_name: string,
  adjustment_id?: string
): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  const slug = tenant_name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const timestamp = Date.now();
  const id_suffix = adjustment_id ? `-${adjustment_id}` : '';
  
  return `aliquotas/pdfs/${year}/${month}/${client_id}/reajuste-${slug}-${timestamp}${id_suffix}.pdf`;
}

/**
 * Verifica se R2 está configurado
 */
export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ENDPOINT &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

/**
 * Calcula tamanho formatado
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
