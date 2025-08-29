'use client';

import React, { ReactNode, Suspense } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;

  // Header props
  title?: string;
  subtitle?: string;
  badge?: string;

  // Layout props
  fullWidth?: boolean;
  noPadding?: boolean;
  background?: 'white' | 'gray' | 'amber' | 'gradient' | 'transparent';

  // Animation props
  animate?: boolean;
  animationDelay?: number;

  // Loading props
  loading?: boolean;
  loadingHeight?: string;
  loadingTitle?: string;
}

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  centered = true
}) => {
  if (!title && !subtitle && !badge) return null;

  return (
    <div
      className={cn(
        "mb-12 space-y-4 animate-fade-in-up",
        centered && "text-center"
      )}
    >
      {badge && (
        <div className="inline-flex">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200 shadow-sm">
            {badge}
          </span>
        </div>
      )}

      {title && (
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight transition-all duration-300 hover:text-amber-700">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

const SectionLoading: React.FC<{ height?: string; title?: string }> = ({
  height = "400px",
  title = "Carregando..."
}) => (
  <div
    className="flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg"
    style={{ height }}
  >
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-amber-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
        </div>
      </div>
      <p className="text-gray-600 font-medium">{title}</p>
    </div>
  </div>
);

const backgroundVariants = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  amber: 'bg-gradient-to-b from-amber-50 to-orange-50',
  gradient: 'bg-gradient-to-br from-amber-50 via-white to-orange-50',
  transparent: 'bg-transparent'
};

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  className,
  id,
  title,
  subtitle,
  badge,
  fullWidth = false,
  noPadding = false,
  background = 'white',
  animate = true,
  animationDelay = 0,
  loading = false,
  loadingHeight = "400px",
  loadingTitle = "Carregando seção..."
}) => {
  const sectionContent = (
    <>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        badge={badge}
      />

      {loading ? (
        <SectionLoading height={loadingHeight} title={loadingTitle} />
      ) : (
        <div className="relative">
          {children}
        </div>
      )}
    </>
  );

  const wrapperContent = fullWidth ? sectionContent : (
    <div className="max-w-7xl mx-auto px-6">
      {sectionContent}
    </div>
  );

  return (
    <section
      id={id}
      className={cn(
        // Base styles
        "relative overflow-hidden",

        // Background
        backgroundVariants[background],

        // Padding
        !noPadding && "py-12 md:py-16 lg:py-20",

        // Animation
        animate && "animate-fade-in-up",

        // Custom className
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-radial from-amber-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-orange-100/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {fullWidth || loading ? (
          <Suspense fallback={<SectionLoading height={loadingHeight} title={loadingTitle} />}>
            {wrapperContent}
          </Suspense>
        ) : (
          wrapperContent
        )}
      </div>
    </section>
  );
};

export default SectionWrapper;
export { SectionHeader, SectionLoading };
export type { SectionWrapperProps };