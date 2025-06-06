import { ReactNode, CSSProperties } from 'react';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

// Basic component props
export interface BaseProps {
  className?: string
  children?: ReactNode
}

// Props with ref forwarding
export interface BasePropsWithRef<T = HTMLDivElement> extends DetailedHTMLProps<HTMLAttributes<T>, T> {
  children?: ReactNode
}

// Form input props
export interface BaseInputProps extends DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string
  error?: string
  touched?: boolean
}

// Image props with proper types
export interface BaseImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  loading?: 'lazy' | 'eager'
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  onLoad?: () => void
  onError?: () => void
}

// Properties specific to your domain
export interface ImovelBaseProps {
  id: string
  titulo: string
  descricao?: string
  preco?: number
  area?: number
  quartos?: number
  suites?: number
  vagas?: number
  imagens?: Array<{
    url: string
    alt?: string
  }>
  endereco?: {
    rua?: string
    numero?: string
    bairro?: string
    cidade?: string
    estado?: string
    cep?: string
  }
  caracteristicas?: string[]
  destaque?: boolean
}
