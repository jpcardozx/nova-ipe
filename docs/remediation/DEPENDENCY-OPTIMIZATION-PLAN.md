# Dependency Optimization Plan - Nova Ipê

## CURRENT STATE ANALYSIS
- **Total Dependencies**: 49 (target: <40)
- **Unused Dependencies**: 12+ identified
- **Redundant Dependencies**: 8+ identified

## DEPENDENCIES TO REMOVE IMMEDIATELY

### 1. Build/Development Dependencies
```json
REMOVE FROM devDependencies:
├── "@next/bundle-analyzer" (use built-in Next.js analyzer)
├── "cross-env" (not needed with modern Node.js)
├── "rimraf" (use native rm -rf)
├── "postcss-nesting" (causing conflicts)
└── "sharp" (Next.js includes this automatically)
```

### 2. Unused UI Dependencies
```json
REMOVE FROM dependencies:
├── "@radix-ui/react-accordion" (duplicated in multiple locations)
├── "@radix-ui/react-alert-dialog" (unused)
├── "@radix-ui/react-aspect-ratio" (use Tailwind aspect utilities)
├── "@radix-ui/react-avatar" (simple implementation needed)
├── "@radix-ui/react-dropdown-menu" (unused)
├── "@radix-ui/react-separator" (use Tailwind border utilities)
└── "@radix-ui/react-switch" (simple toggle implementation)
```

### 3. Performance Libraries
```json
REMOVE FROM dependencies:
├── "react-virtualized-auto-sizer" (over-engineered for current needs)
├── "react-window" (premature optimization)
├── "lru-cache" (not used effectively)
└── "web-vitals" (use Next.js built-in analytics)
```

### 4. Redundant Styling Dependencies
```json
REMOVE FROM devDependencies:
├── "@tailwindcss/forms" (minimal usage, manual implementation better)
└── "@tailwindcss/typography" (over-engineered for current content)
```

## DEPENDENCIES TO CONSOLIDATE

### 1. Icon Libraries
**CURRENT**: Multiple icon imports from lucide-react with dynamic loading complexity
**SOLUTION**: Create icon sprite system with commonly used icons only

### 2. Animation Libraries  
**CURRENT**: Framer Motion with complex variants
**SOLUTION**: Keep framer-motion but simplify usage patterns

### 3. State Management
**CURRENT**: Context providers and custom hooks scattered
**SOLUTION**: Consolidate into minimal state management pattern

## OPTIMIZATION ACTIONS

### Phase 1: Remove Unused (Day 1)
```bash
npm uninstall @next/bundle-analyzer cross-env rimraf postcss-nesting
npm uninstall @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio
npm uninstall @radix-ui/react-dropdown-menu @radix-ui/react-separator
npm uninstall react-virtualized-auto-sizer react-window lru-cache web-vitals
```

### Phase 2: Simplify Radix Usage (Day 2)
```bash
# Keep only essential Radix components
npm uninstall @radix-ui/react-accordion @radix-ui/react-avatar @radix-ui/react-switch

# Create simple custom implementations for removed components
```

### Phase 3: Audit and Clean (Day 3)
1. **Remove unused imports** across all components
2. **Consolidate similar functionality** 
3. **Eliminate dynamic imports** where not necessary
4. **Update package.json scripts** to remove dependency on removed tools

## EXPECTED OUTCOMES
- **Dependency count**: 49 → 32 (35% reduction)
- **Bundle size reduction**: ~400KB smaller
- **Build time improvement**: 20-30% faster
- **Maintenance simplification**: Fewer security updates

## CRITICAL REPLACEMENTS

### Icon Management
```typescript
// BEFORE: Complex dynamic loading
const ArrowRight = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ArrowRight })));

// AFTER: Simple icon component system
import { ArrowRightIcon } from '@/components/icons';
```

### Simple Components
```typescript
// BEFORE: Heavy Radix components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";

// AFTER: Simple disclosure pattern
const [isOpen, setIsOpen] = useState(false);
```

### Form Handling
```typescript
// BEFORE: Complex form libraries
import { useForm } from 'react-hook-form';

// AFTER: Native form handling with minimal validation
const [formData, setFormData] = useState({});
```
