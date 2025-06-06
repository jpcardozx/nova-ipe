# Nova Ipê - Stack Optimization Plan

## IMMEDIATE ACTIONS (Week 1)

### 1. Package Manager Migration: npm → pnpm

```bash
# Install pnpm globally
npm install -g pnpm

# Remove npm artifacts
rm -rf node_modules package-lock.json

# Initialize pnpm
pnpm install

# Benefits:
# - 3x faster install speed
# - 50% less disk space
# - Better monorepo support
# - Stricter dependency resolution
```

### 2. Dependency Audit & Reduction (82 → 35 dependencies)

```json
REMOVE IMMEDIATELY:
├── "@next/bundle-analyzer" (use built-in Next.js)
├── "cross-env" (native Node.js support)
├── "rimraf" (use native rm -rf)
├── "styled-components" (conflicts with Tailwind)
├── "@radix-ui/react-*" (over-engineered for needs)
├── "react-virtualized-auto-sizer" (premature optimization)
├── "react-window" (not needed for current data volume)
├── "compression-webpack-plugin" (Next.js handles this)
├── "terser-webpack-plugin" (Next.js built-in)
└── "webpack-bundle-analyzer" (Next.js has built-in)
```

### 3. Sanity CMS Replacement Strategy

```
CURRENT ISSUES:
- Heavy client bundle (+200KB)
- Complex query syntax
- Over-engineered for content needs
- Expensive for scale

RECOMMENDED ALTERNATIVES:
1. **Notion API** (free, simple, collaborative)
2. **Strapi** (self-hosted, full control)
3. **Simple JSON + GitHub** (version controlled, fast)
4. **Supabase** (PostgreSQL + real-time features)
```

## PERFORMANCE TARGETS

### Before vs After:

```
Bundle Size:     2.3MB → 800KB (-65%)
Dependencies:    82 → 35 (-57%)
Build Time:      45s → 15s (-67%)
Install Time:    120s → 20s (-83%)
Dev Server:      8s → 3s (-63%)
```

## ARCHITECTURE SIMPLIFICATION

### Component Structure (Current: 5 dirs → Target: 1)

```
ELIMINATE:
├── /src/components/
├── /app/components/ui/
├── /components/ui/property/
└── /archive/components/

KEEP ONLY:
└── /components/
    ├── ui/           (core primitives)
    ├── layout/       (header, footer, nav)
    ├── property/     (domain components)
    └── forms/        (contact, search)
```

### Technology Stack Optimization

```
CURRENT STACK ISSUES:
├── Next.js 14.2.15 ✅ (keep - solid choice)
├── React 18.3.1 ✅ (keep - latest stable)
├── TypeScript ✅ (keep - essential)
├── Tailwind CSS ✅ (keep - performant)
├── Sanity CMS ❌ (replace - over-engineered)
├── Framer Motion ⚠️ (evaluate - heavy for gains)
├── 15+ Radix components ❌ (replace - over-complex)
└── Custom webpack configs ❌ (remove - unnecessary)

OPTIMIZED STACK:
├── Next.js 14 (App Router)
├── TypeScript
├── Tailwind CSS
├── Notion API / Strapi
├── Minimal custom components
└── Native Next.js optimizations
```

## MIGRATION EXECUTION TIMELINE

### Week 1: Foundation

- [ ] Package manager migration (npm → pnpm)
- [ ] Dependency audit and removal
- [ ] Component directory consolidation
- [ ] Remove all custom webpack configs

### Week 2: CMS Migration

- [ ] Choose new CMS solution
- [ ] Data migration from Sanity
- [ ] Update all API calls
- [ ] Performance testing

### Week 3: Component Cleanup

- [ ] Consolidate duplicate components
- [ ] Remove over-engineered solutions
- [ ] Implement simple custom UI components
- [ ] Update all imports

### Week 4: Testing & Optimization

- [ ] Full application testing
- [ ] Performance benchmarking
- [ ] Bundle analysis
- [ ] Documentation update

## SUCCESS METRICS

```
Build Performance:
├── Dev server startup: <3s (current: 8s)
├── Hot reload: <500ms (current: 2s+)
├── Production build: <15s (current: 45s)
└── Bundle size: <800KB (current: 2.3MB)

Developer Experience:
├── Install time: <20s (current: 2min)
├── Dependencies: 35 (current: 82)
├── Config files: 3 (current: 15+)
└── Component locations: 1 (current: 5)
```

## RISK MITIGATION

1. **Gradual Migration**: Phase by phase to maintain functionality
2. **Feature Parity**: Ensure all current features work post-migration
3. **Performance Monitoring**: Continuous benchmarking during migration
4. **Rollback Plan**: Git branches for each phase with rollback scripts
