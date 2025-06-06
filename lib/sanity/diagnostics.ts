import { serverClient } from "./sanity.server";

/**
 * Diagnostic function to test Sanity connection and queries
 * Can be used in development or on production to debug Sanity issues
 */
export async function testSanityConnection() {
    try {
        // Simple query to test connection
        const result = await serverClient.fetch(`*[_type == "imovel"][0...1]{ _id, _type }`);
        return {
            success: true,
            message: 'Sanity connection successful',
            data: result
        };
    } catch (error) {
        return {
            success: false,
            message: `Sanity connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error: error instanceof Error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : 'Unknown error type'
        };
    }
}

/**
 * Test a specific Sanity query with robust error handling
 * @param query The GROQ query to test
 * @param params Optional parameters for the query as a Record<string, any>
 *               When used with the API route, this accepts string values from URL params
 * @returns Result object with status and data/error
 */
export async function testSanityQuery(query: string, params: Record<string, any> = {}) {
    try {
        // Set a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Query timeout after 15 seconds')), 15000);
        });

        // Execute query with timeout
        const result = await Promise.race([
            serverClient.fetch(query, params),
            timeoutPromise
        ]);

        return {
            success: true,
            message: 'Query executed successfully',
            data: result,
            query,
            params
        };
    } catch (error) {
        return {
            success: false,
            message: `Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            query,
            params,
            error: error instanceof Error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : 'Unknown error type'
        };
    }
}

/**
 * Test all common Sanity queries used in the application
 * Useful for validating after schema changes or during debugging
 */
export async function testAllQueries() {
    const results: Record<string, any> = {};

    try {
        // Test basic connection
        results.connection = await testSanityConnection();

        // Test imovel queries with different finalidade values to check case-sensitivity
        results.imoveisAluguel = await testSanityQuery(`*[_type == "imovel" && finalidade == "Aluguel" && status == "disponivel"][0...2]`);
        results.imoveisVenda = await testSanityQuery(`*[_type == "imovel" && finalidade == "Venda" && status == "disponivel"][0...2]`);

        // Test image references
        results.images = await testSanityQuery(`*[_type == "imovel" && defined(imagem)][0...2]{ _id, imagem { asset-> } }`);

        return {
            success: true,
            results
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to run diagnostic tests: ${error instanceof Error ? error.message : 'Unknown error'}`,
            results,
            error
        };
    }
}
