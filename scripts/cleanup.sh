#!/bin/bash
# This script helps clean up the project for better performance

echo "🧹 Starting cleanup process for Nova Ipê..."

echo "🔍 Finding duplicate dependencies..."
npx find-duplicate-dependencies

echo "📦 Analyzing unused dependencies..."
npx depcheck

echo "♻️ Cleaning up Next.js cache..."
rm -rf .next

echo "📊 Analyzing bundle size..."
ANALYZE=true npm run build

echo "✅ Cleanup complete! Review the output above for optimization opportunities."
