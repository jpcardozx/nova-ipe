// debug-component-exports.js
// Simple script to validate component exports
console.log('=== DEBUGGING COMPONENT EXPORTS ===');

try {
  // Import and validate key components
  const PropertyCardUnified = require('./app/components/ui/property/PropertyCardUnified').default;
  console.log('✅ PropertyCardUnified imported successfully:', typeof PropertyCardUnified);
  
  const PropertyAdapter = require('./app/components/adapters/PropertyAdapter').default;
  console.log('✅ PropertyAdapter imported successfully:', typeof PropertyAdapter);
  
  const ImovelDetalhes = require('./app/imovel/[slug]/ImovelDetalhes').default;
  console.log('✅ ImovelDetalhes imported successfully:', typeof ImovelDetalhes);
  
  // Test if the components are properly exported as React components
  console.log('PropertyCardUnified.$$typeof:', PropertyCardUnified.$$typeof);
  console.log('PropertyAdapter.$$typeof:', PropertyAdapter.$$typeof);
  console.log('ImovelDetalhes.$$typeof:', ImovelDetalhes.$$typeof);
} catch (error) {
  console.error('❌ Error during component validation:', error);
}

console.log('=== END OF COMPONENT VALIDATION ===');
