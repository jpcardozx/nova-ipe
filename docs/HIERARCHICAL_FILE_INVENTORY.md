# Nova IPE - Hierarchical File Structure Inventory

## Project Structure Overview

This document provides a comprehensive hierarchical inventory of all source files in the Nova IPE project, categorized by functionality and purpose.

## 📁 Root Level Configuration

### Core Configuration Files
```
├── package.json                 # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration (17 lines - optimized)
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── .prettierrc.json           # Code formatting rules
├── .nvmrc                     # Node.js version specification
├── .npmrc                     # npm configuration
├── .pnpmrc                    # pnpm configuration
└── pnpm-workspace.yaml        # pnpm workspace configuration
```

### Development Tools
```
├── .vscode/settings.json       # VS Code workspace settings
├── .kiro/                      # Kiro specs and requirements
├── .claude/settings.local.json # Claude AI configuration
└── .sanity/runtime/app.js      # Sanity runtime configuration
```

## 📱 Application Source (`/app`)

### Core Application Structure
```
app/
├── layout.tsx                  # Root layout with optimized font loading
├── page.tsx                   # Homepage
├── globals.css               # Global styles
├── loading.tsx               # Global loading component
├── not-found.tsx             # 404 page
└── error.tsx                 # Error boundary
```

### Page Routes
```
app/
├── acesso-negado/             # Access denied page
├── alugar/                    # Rental properties section
├── blog/                      # Blog functionality
├── carla/                     # Team member profile
├── catalogo/                  # Property catalog
├── comprar/                   # Properties for sale
├── contato/                   # Contact page
├── crm-system/               # CRM dashboard
├── dashboard/                # Admin dashboard
├── imovel/[slug]/            # Dynamic property pages
├── jpcardozx/                # Developer profile
├── julia/                    # Team member profile
├── login/                    # Authentication
├── showcase/                 # Project showcase
├── signup/                   # User registration
├── studio/                   # Sanity CMS studio
└── visita/                   # Property visit booking
```

### API Routes (`/app/api`)
```
api/
├── business-metrics/         # Business analytics endpoints
├── component-metrics/        # Component performance metrics
├── contact/                  # Contact form submission
├── debug/sanity/            # Sanity debugging
├── destaques/               # Featured properties
├── imoveis/                 # Property data endpoints
├── imoveis-destaque/        # Featured property data
├── jetimob/                 # Jetimob integration
│   ├── leads/               # Lead management
│   ├── portals/             # Portal integration
│   ├── properties/          # Property sync
│   └── webhook/             # Webhook handling
├── log/image-error/         # Image error logging
├── login/                   # Authentication endpoints
├── logout/                  # Session termination
├── mock/                    # Mock data for development
├── og/                      # Open Graph image generation
├── optimized/               # Optimized data endpoints
├── revalidate/              # Cache revalidation
├── sanity/                  # Sanity CMS integration
│   ├── fix-image/           # Image fixing utilities
│   ├── health/              # Health checks
│   ├── mutate/              # Data mutations
│   └── query/               # Data queries
├── sanity-enhanced/         # Enhanced Sanity integration
├── sanity-proxy/            # Sanity proxy endpoints
├── tailwind-diagnostics/   # Tailwind debugging
└── vitals/                  # Web Vitals collection
```

### Component Library (`/app/components`)

#### Core UI Components (130+ components)
```
components/
├── ui/                       # Reusable UI components
│   ├── property/            # Property-specific components
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyCardUnified.tsx
│   │   ├── PropertyFeatures.tsx
│   │   └── PropertyGallery.tsx
│   ├── forms/               # Form components
│   │   ├── ContactForm.tsx
│   │   ├── SearchForm.tsx
│   │   └── FilterForm.tsx
│   └── layout/              # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
├── optimized/               # Performance-optimized components
├── verified/                # Production-ready components
└── sections/                # Page section components
```

#### Performance & Analytics
```
components/
├── WebVitals.tsx            # Custom Web Vitals implementation
├── WebVitalsMonitor.tsx     # Performance monitoring
├── PerformanceMonitor.tsx   # Performance tracking
├── OptimizationProvider.tsx # Performance context
└── LazyLoader.tsx           # Lazy loading utilities
```

#### Specialized Components
```
components/
├── Hero/                    # Hero section variants
├── Navigation/              # Navigation components
├── Property/                # Property display components
├── Contact/                 # Contact form components
├── Dashboard/               # Admin dashboard components
├── CRM/                     # CRM interface components
└── Analytics/               # Analytics visualization
```

## 🎨 Styling & Assets

### Stylesheets
```
├── app/globals.css          # Global styles
├── styles/                  # Additional stylesheets
└── public/css/              # Static CSS files
```

### Static Assets (`/public`)
```
public/
├── images/                  # Image assets
│   ├── properties/          # Property images
│   ├── team/                # Team photos
│   ├── logos/               # Brand assets
│   └── og/                  # Open Graph images
├── icons/                   # Icon files
├── favicon_io/              # Favicon variants
├── js/                      # Client-side scripts
│   ├── critical-preload.js  # Critical resource preloading
│   ├── whatsapp-optimizer.js # WhatsApp integration
│   └── loading-timeout.js   # Loading optimization
└── manifest.json           # PWA manifest
```

## 🗄️ Data & Content Management

### Sanity CMS Integration
```
sanity/
├── lib/
│   ├── client.ts           # Sanity client configuration
│   ├── fetch.ts            # Data fetching utilities
│   ├── queries.ts          # GROQ queries
│   ├── types.ts            # Type definitions
│   └── image.ts            # Image handling
└── studio/                 # Studio configuration
```

### Sanity Studio (`/studio`)
```
studio/
├── schemas/
│   ├── imovel.ts           # Property schema
│   ├── blog-post.ts        # Blog post schema
│   ├── author.ts           # Author schema
│   ├── categorias.ts       # Category schema
│   └── index.ts            # Schema exports
├── [[...index]]/page.tsx   # Studio app
└── customStructure.ts      # Custom studio structure
```

### Database Integration
```
lib/
├── supabase/
│   ├── client.ts           # Supabase client
│   ├── auth.ts             # Authentication
│   ├── database.ts         # Database operations
│   └── storage.ts          # File storage
└── database/
    ├── types.ts            # Database types
    └── migrations/         # Database migrations
```

## 🔧 Utilities & Libraries

### Core Libraries (`/lib`)
```
lib/
├── sanity/                 # Sanity integration
│   ├── index.ts            # Main Sanity client
│   ├── queries.ts          # GROQ queries
│   ├── enhanced-client.ts  # Enhanced client with fallbacks
│   └── upload-helper.ts    # Upload utilities
├── supabase/               # Supabase integration
├── utils/                  # General utilities
├── validations/            # Form validations
├── constants/              # Application constants
└── types/                  # TypeScript definitions
```

### Type Definitions (`/types`)
```
types/
├── imovel.ts              # Property type definitions
├── property.ts            # Property interfaces
├── global.d.ts            # Global type declarations
├── sanity-schema.d.ts     # Sanity schema types
├── gtag.d.ts              # Google Analytics types
└── index.ts               # Type exports
```

### Source Utilities (`/src`)
```
src/
├── hooks/                  # Custom React hooks
│   ├── useImoveis.ts       # Property data hook
│   ├── useImageOptimization.ts # Image optimization
│   ├── useProgressiveImage.ts # Progressive loading
│   └── useToast.ts         # Toast notifications
├── lib/
│   ├── utils.ts            # General utilities
│   ├── sanity.ts           # Sanity configuration
│   └── mapImovelToClient.ts # Data mapping
└── types/                  # Additional type definitions
```

## 🚀 Build & Development

### Scripts (`/scripts`)
```
scripts/
├── diagnostic-simple.js    # Architecture diagnostics
├── enterprise/             # Enterprise tooling
│   ├── auto-remediation.js # Automated fixes
│   ├── architecture-validator.js # Architecture validation
│   └── performance-monitor.js # Performance monitoring
├── migration/              # Migration utilities
├── automation/             # Automation scripts
├── setup-supabase.js      # Database setup
├── test-*.js              # Testing utilities
└── verification/          # System verification
```

### Configuration & Documentation
```
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md     # Architecture documentation
│   ├── SANITY_SETUP.md     # CMS setup guide
│   ├── NEXT-STEPS.md       # Development roadmap
│   └── remediation/        # Optimization guides
├── sql/                    # Database schemas
├── tests/                  # Test files
└── polyfills/              # Browser polyfills
```

## 📊 Dashboard & CRM

### Dashboard Pages (`/app/dashboard`)
```
dashboard/
├── page.tsx               # Dashboard home
├── analytics/             # Analytics dashboard
├── appointments/          # Appointment management
├── calculator/            # Financial calculators
├── campaigns/             # Marketing campaigns
├── clients/               # Client management
├── cloud/                 # Cloud storage management
├── commissions/           # Commission tracking
├── documents/             # Document management
├── educational/           # Educational content
├── finance/               # Financial management
├── funil/                 # Sales funnel
├── jetimob/               # Jetimob integration
├── leads/                 # Lead management
├── mail/                  # Email management
├── properties/            # Property management
├── reports/               # Reporting dashboard
├── reviews/               # Review management
├── settings/              # System settings
├── tasks/                 # Task management
└── users/                 # User management
```

## 🔄 Performance Optimizations

### Code Splitting & Lazy Loading
- **Dynamic Imports**: 50+ components with lazy loading
- **Route-based Splitting**: Automatic code splitting per page
- **Component-level Splitting**: Heavy components loaded on demand

### Bundle Analysis
- **Current Bundle Size**: ~800KB target
- **Dependency Count**: 54 total (optimized from 62)
- **Static Pages**: 80 pre-rendered pages

### Performance Monitoring
- **Web Vitals**: Custom native implementation
- **Error Boundaries**: Comprehensive error handling
- **Progressive Loading**: Image and component optimization

## 📈 Recent Optimizations

### Dependency Cleanup (Current Session)
- ✅ Removed `react-virtualized-auto-sizer` - Replaced with simple grid
- ✅ Removed `react-window` - Native CSS grid implementation  
- ✅ Removed `lru-cache` - Using Next.js built-in caching
- ✅ Removed `web-vitals` - Native PerformanceObserver implementation
- ✅ Removed `critters` - Deprecated dependency
- ✅ Removed `@tailwindcss/typography` - Over-engineered for usage
- ✅ Removed `dotenv` - Built into Next.js
- ✅ Fixed font loading - Fallback strategy implemented

### Build Improvements
- ✅ **100% Build Success Rate** after fixes
- ✅ **Package Manager Migration** to pnpm
- ✅ **Performance Score**: 70/100 (Good)
- ✅ **Type Safety**: Full TypeScript coverage

---

## File Statistics

| Category | Count | Purpose |
|----------|-------|---------|
| **Components** | 130+ | UI components and layouts |
| **Pages** | 25+ | Application routes |
| **API Routes** | 30+ | Backend endpoints |
| **Utility Files** | 50+ | Helpers and configurations |
| **Type Definitions** | 25+ | TypeScript interfaces |
| **Scripts** | 40+ | Automation and tooling |
| **Documentation** | 15+ | Project documentation |
| **Total Source Files** | 300+ | Active development files |

---

*Last Updated: 2025-09-28*  
*Total Dependencies: 54 (Production: 43, Development: 11)*  
*Architecture Score: 70/100*  
*Build Status: ✅ Successful*