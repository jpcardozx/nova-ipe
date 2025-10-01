/**
 * Exportações centralizadas dos componentes do catálogo
 * Facilita importações e manutenção
 */

// Main Components
export { default as ModularCatalog } from './ModularCatalog';
export { default as CatalogWrapper } from './CatalogWrapper';

// Filter Components
export { default as HorizontalFilters } from './filters/HorizontalFilters';
export type { FilterState } from './filters/HorizontalFilters';

// Grid Components
export { default as PropertyGrid } from './grid/PropertyGrid';
export { default as PropertyCard } from './grid/PropertyCard';
export { default as PropertyListItem } from './grid/PropertyListItem';
export { default as ViewControls } from './grid/ViewControls';

// Types
export type { ViewMode, SortMode } from './grid/PropertyGrid';

// Legacy (para compatibilidade)
export { default as PropertyCatalogClean } from './PropertyCatalogClean';
export { default as CatalogoHero } from './CatalogoHero';
export { default as CatalogoHeroClean } from './CatalogoHeroClean';
export { default as CatalogoHeroEnhanced } from './CatalogoHeroEnhanced';
