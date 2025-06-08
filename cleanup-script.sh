#!/bin/bash

# Nova Ipê - Component Consolidation Script
echo "🧹 Starting Nova Ipê component cleanup..."

# Remove duplicate Hero components (keep PremiumHero.tsx)
echo "Removing duplicate Hero components..."
rm -f app/components/PremiumHero-improved.tsx
rm -f app/components/PremiumHero.new.tsx
rm -f app/components/PremiumHero.tsx.backup
rm -f app/components/EnhancedPremiumHero.tsx
rm -f app/components/ProfessionalHero.tsx
rm -f app/components/ProfessionalHeroImproved.tsx
rm -f app/components/InstitutionalHero.tsx
rm -f app/components/CriticalHero.tsx
rm -f app/components/EnhancedHero.tsx
rm -f app/components/ConsolidatedHero.client.tsx
rm -f app/components/ConsolidatedHero.server.tsx
rm -f app/components/ConsolidatedHero.tsx

# Remove duplicate Form components (keep FormularioContatoUnified.tsx)
echo "Removing duplicate Form components..."
rm -f app/components/FormularioContato.tsx
rm -f app/components/FormularioContatoAprimorado.tsx
rm -f app/components/FormularioContatoEnhanced.tsx
rm -f app/components/FormularioContatoModerno.tsx
rm -f app/components/FormularioContatoPremium.tsx
rm -f app/components/FormularioContatoSubtil.tsx

# Remove duplicate Navbar components (keep ModernNavbar.tsx)
echo "Removing duplicate Navbar components..."
rm -f app/components/CleanNavbar.tsx
rm -f app/components/SimpleNavbar.tsx
rm -f app/components/ProfessionalNavbar.tsx
rm -f app/components/EnhancedNavbar.tsx
rm -f app/components/NavbarFixed.tsx
rm -f app/components/NavbarResponsive.tsx
rm -f app/components/NavbarParticles.tsx
rm -f app/components/ClientOnlyNavbar.tsx
rm -f app/components/CriticalNavBar.tsx

# Remove duplicate Image components
echo "Removing duplicate Image components..."
rm -f app/components/SanityImage.consolidated.tsx
rm -f app/components/DiagnosticImage.tsx
rm -f app/components/ImageDiagnostic.tsx
rm -f app/components/ImageAnalyzer.tsx
rm -f app/components/ImageFixDemo.tsx
rm -f app/components/ImageOptimizer.tsx
rm -f app/components/ImageWithFallback.tsx

# Remove duplicate Loading components
echo "Removing duplicate Loading components..."
rm -f app/components/OptimizedLoading.tsx
rm -f app/components/ProfessionalLoadingComponents.tsx
rm -f app/components/HomepageLoadingOptimizer.tsx
rm -f app/components/StrategicPropertySectionsLoading.tsx
rm -f app/components/HydrationLoadingFix.tsx

# Remove performance/diagnostic components
echo "Removing diagnostic/debug components..."
rm -f app/components/PerformanceDiagnostic.tsx
rm -f app/components/PerformanceMonitor.tsx
rm -f app/components/PerformanceOptimizer.tsx
rm -f app/components/TailwindDiagnostic.tsx
rm -f app/components/DiagnosticPanel.tsx
rm -f app/components/DiagnosticTool.tsx
rm -f app/components/DebugButton.tsx

# Remove redundant Error/Hydration components
echo "Removing redundant Error/Hydration components..."
rm -f app/components/ChunkErrorBoundary.tsx
rm -f app/components/ChunkErrorHandler.tsx
rm -f app/components/ChunkErrorRecovery.tsx
rm -f app/components/EnhancedChunkErrorHandler.tsx
rm -f app/components/HydrationBoundary.tsx
rm -f app/components/HydrationErrorBoundary.tsx
rm -f app/components/HydrationGuard.tsx
rm -f app/components/HydrationSafeBoundary.tsx

# Remove redundant Optimization components
echo "Removing optimization components..."
rm -f app/components/CSSOptimizer.tsx
rm -f app/components/FontOptimizer.tsx
rm -f app/components/JavaScriptOptimizer.tsx
rm -f app/components/OptimizationProvider.tsx
rm -f app/components/CriticalCssLoader.tsx
rm -f app/components/CriticalStyleLoader.tsx

echo "✅ Component cleanup completed!"
echo "📊 Cleaned up ~50 redundant component files"
