'use client';

// Este arquivo centraliza todos os componentes UI e os reexporta
// de 'components/ui/' para 'app/components/ui/'

// Importar e reexportar todos os componentes UI principais
export * from '@/components/ui/button';
export * from '@/components/ui/toast';
export * from '@/components/ui/card';
export * from '@/components/ui/carousel';
export * from '@/components/ui/UnifiedComponents';

// Exportar componente padrão
import { UnifiedLoading } from '@/components/ui/UnifiedComponents';
export { UnifiedLoading };

// Outros componentes importados e reexportados serão adicionados aqui conforme necessário
