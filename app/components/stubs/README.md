# Component Migration Stubs

This directory contains stub components that redirect to unified implementations. These stubs provide backward compatibility while we migrate from multiple redundant components to consolidated, well-designed implementations.

## Purpose

- **Backward Compatibility**: Existing imports continue to work without breaking
- **Safe Migration**: No immediate breaking changes while we update references
- **Deprecation Warnings**: Console warnings help developers identify outdated imports
- **Documentation**: Each stub includes migration instructions

## Stub Components

### Property Cards
- `ModernPropertyCard.tsx` → `PropertyCardUnified`
- `ElegantPropertyCard.tsx` → `PropertyCardUnified` 
- `PremiumPropertyCard.tsx` → `PropertyCardUnified`

### Hero Components  
- `LuxuryHero.tsx` → `MobileFirstHero`
- `ProfessionalHero.tsx` → `MobileFirstHero`
- `InteractiveHero.tsx` → `MobileFirstHero`

### Property Sections
- `EnhancedPropertySection.tsx` → `CleanPropertySections`
- `PropertyShowcase.tsx` → `CleanPropertySections`

## Migration Process

1. **Phase 1**: Create stubs (current)
2. **Phase 2**: Update all import references gradually
3. **Phase 3**: Remove obsolete files after migration complete
4. **Phase 4**: Remove stub directory

## Usage Example

```typescript
// This still works (with deprecation warning)
import ModernPropertyCard from 'app/components/stubs/ModernPropertyCard';

// Should be migrated to:
import PropertyCardUnified from 'components/ui/property/PropertyCardUnified';
```

## Benefits

- **Zero Breaking Changes**: Existing code continues to work
- **Gradual Migration**: Can be done incrementally
- **Clear Direction**: Developers know exactly what to change
- **Maintainable**: Single source of truth for each component type

## Timeline

- **Week 1**: Create stubs ✅
- **Week 2**: Update imports in critical files
- **Week 3**: Update remaining imports
- **Week 4**: Remove obsolete files and stubs

This approach ensures a smooth transition to our consolidated, professional component architecture.