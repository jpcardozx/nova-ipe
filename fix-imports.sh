#!/bin/bash

echo "🔧 Fixing missing imports after cleanup..."

# Remove problematic import lines
find app -name "*.tsx" -type f -exec sed -i '/CriticalCssLoader/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/HydrationLoadingFix/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/HydrationGuard/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/ChunkErrorBoundary/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/ChunkErrorRecovery/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/JavaScriptOptimizer/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/DiagnosticTool/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/DebugButton/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/ConsolidatedHero/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/FormularioContatoSubtil/d' {} \;

# Remove component usage (JSX)
find app -name "*.tsx" -type f -exec sed -i '/<CriticalCssLoader/,/\/>/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/<HydrationLoadingFix/,/\/>/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/<HydrationGuard/,/\/>/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/<ChunkErrorBoundary/,/\/>/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/<ChunkErrorRecovery/,/\/>/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/<JavaScriptOptimizer/,/\/>/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/<DiagnosticTool/,/\/>/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/<DebugButton/,/\/>/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/<ConsolidatedHero/,/\/>/d' {} \;
find app -name "*.tsx" -type f -exec sed -i '/<FormularioContatoSubtil/,/\/>/d' {} \;

echo "✅ Import cleanup completed!"