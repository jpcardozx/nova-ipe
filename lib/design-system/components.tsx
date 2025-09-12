// Design System Components - IPÊ Imóveis Dashboard
// Componentes base reutilizáveis

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Card Component - Base para todos os cards do dashboard
const cardVariants = cva(
  'bg-white rounded-md border border-neutral-200 transition-all duration-150',
  {
    variants: {
      variant: {
        default: 'shadow-sm hover:shadow-md',
        elevated: 'shadow-md hover:shadow-lg',
        interactive: 'shadow-sm hover:shadow-md cursor-pointer hover:border-primary-200',
        flat: 'shadow-none border-neutral-100',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)

export interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding, className }))} {...props} />
  )
}

// Metric Card - Para exibir métricas do dashboard
const metricCardVariants = cva(
  'bg-white rounded-md border transition-all duration-150',
  {
    variants: {
      status: {
        default: 'border-neutral-200 hover:border-primary-200',
        positive: 'border-success-200 bg-success-50/50',
        negative: 'border-error-200 bg-error-50/50',
        warning: 'border-warning-200 bg-warning-50/50',
        info: 'border-info-200 bg-info-50/50',
      },
      size: {
        sm: 'p-4',
        md: 'p-5',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      status: 'default',
      size: 'md',
    },
  }
)

export interface MetricCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  description?: string
}

export function MetricCard({ 
  className, 
  status, 
  size, 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  description,
  ...props 
}: MetricCardProps) {
  const changeColors = {
    positive: 'text-success-600',
    negative: 'text-error-600',
    neutral: 'text-neutral-500',
  }

  return (
    <div className={cn(metricCardVariants({ status, size, className }))} {...props}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-600 truncate">{title}</p>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-neutral-900">{value}</p>
            {change && (
              <p className={cn('ml-2 text-sm font-medium', changeColors[changeType])}>
                {change}
              </p>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-neutral-500">{description}</p>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex-shrink-0">
            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Button Component - Sistema de botões padronizado
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 border border-neutral-200',
        outline: 'border border-primary-300 bg-transparent text-primary-700 hover:bg-primary-50 active:bg-primary-100',
        ghost: 'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
        danger: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// Badge Component - Para status e tags
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-neutral-100 text-neutral-800',
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-success-100 text-success-800',
        warning: 'bg-warning-100 text-warning-800',
        error: 'bg-error-100 text-error-800',
        info: 'bg-info-100 text-info-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, className }))} {...props} />
  )
}

// Loading Skeleton - Para estados de carregamento
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-neutral-100',
        className
      )}
      {...props}
    />
  )
}

// Page Header - Header padronizado para páginas
export interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function PageHeader({ title, subtitle, children, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="border-b border-neutral-200 bg-white px-6 py-6">
      {breadcrumbs && (
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-neutral-400">/</span>}
                {breadcrumb.href ? (
                  <a 
                    href={breadcrumb.href}
                    className="text-neutral-500 hover:text-neutral-700 transition-colors"
                  >
                    {breadcrumb.label}
                  </a>
                ) : (
                  <span className="text-neutral-900">{breadcrumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-lg text-neutral-600">{subtitle}</p>
          )}
        </div>
        
        {children && (
          <div className="ml-6 flex flex-shrink-0 items-center space-x-3">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

// Empty State - Para páginas/seções vazias
export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
          <div className="h-6 w-6 text-neutral-400">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-neutral-500 max-w-md">{description}</p>
      )}
      {action && (
        <div className="mt-6">{action}</div>
      )}
    </div>
  )
}

// Grid responsivo padronizado para métricas
export interface MetricsGridProps {
  children: React.ReactNode
  className?: string
}

export function MetricsGrid({ children, className }: MetricsGridProps) {
  return (
    <div className={cn(
      'grid gap-4 sm:gap-6',
      // Mobile: 1 coluna (cards ocupam largura total)
      'grid-cols-1',
      // Tablet: 2 colunas
      'sm:grid-cols-2',
      // Desktop: 3 colunas (máximo recomendado para escaneabilidade)
      'lg:grid-cols-3',
      // Large desktop: 4 colunas apenas se necessário
      'xl:grid-cols-4',
      className
    )}>
      {children}
    </div>
  )
}