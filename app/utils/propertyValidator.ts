'use client';

/**
 * Utilitário para validar dados de propriedade
 * Ajuda a identificar problemas com os dados antes que cheguem aos componentes
 */

/**
 * Verifica se os dados de um imóvel estão completos e com o formato correto
 * @param property Dados do imóvel para validação
 * @returns Um objeto com resultados da validação
 */
export function validatePropertyData(property: any) {
    const results: Record<string, { valid: boolean; reason?: string }> = {};

    // Verificar campos essenciais
    results.id = {
        valid: !!property.id,
        reason: !property.id ? 'ID ausente' : undefined
    };

    results.title = {
        valid: !!property.title,
        reason: !property.title ? 'Título ausente' : undefined
    };

    results.slug = {
        valid: !!property.slug,
        reason: !property.slug ? 'Slug ausente' : undefined
    };

    results.price = {
        valid: property.price !== undefined && property.price !== null,
        reason: property.price === undefined || property.price === null ? 'Preço ausente' : undefined
    };

    results.propertyType = {
        valid: !!property.propertyType && ['rent', 'sale'].includes(property.propertyType),
        reason: !property.propertyType ? 'Tipo de propriedade ausente' :
            !['rent', 'sale'].includes(property.propertyType) ? `Tipo inválido: ${property.propertyType}` : undefined
    };

    // Verificar imagem principal
    results.mainImage = {
        valid: !!property.mainImage && typeof property.mainImage === 'object',
        reason: !property.mainImage ? 'Imagem principal ausente' :
            typeof property.mainImage !== 'object' ? 'Formato de imagem inválido' : undefined
    };

    if (results.mainImage.valid) {
        results.mainImageUrl = {
            valid: !!property.mainImage.url,
            reason: !property.mainImage.url ? 'URL da imagem principal ausente' : undefined
        };
    }

    // Calcular resultado geral
    const isValid = Object.values(results).every(result => result.valid);

    return {
        isValid,
        results,
        invalidFields: Object.entries(results)
            .filter(([_, result]) => !result.valid)
            .map(([field, result]) => ({ field, reason: result.reason }))
    };
}
