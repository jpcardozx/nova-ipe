// Types for property processing
export interface PropertyFeatures {
    minPrice: number;
    maxPrice: number;
    minArea: number;
    maxArea: number;
    bedroomCounts: number[];
    bathroomCounts: number[];
    cities: string[];
    neighborhoods: string[];
}

export interface PropertyProcessingOptions {
    filterByType?: 'Venda' | 'Aluguel';
    sortBy?: 'price' | 'date' | 'area';
    sortDirection?: 'asc' | 'desc';
    limit?: number;
}

export interface ProcessingResult {
    properties: Property[];
    meta: {
        totalCount: number;
        filteredCount: number;
        returnedCount: number;
    };
}

export interface Property {
    _id: string;
    preco?: number;
    finalidade?: string;
    areaUtil?: number;
    dormitorios?: number;
    banheiros?: number;
    vagas?: number;
    status?: string;
    [key: string]: any; // For other potential property fields
}

export type WorkerMessageType =
    | { taskId: string; task: 'process-properties'; data: Property[]; options: PropertyProcessingOptions }
    | { taskId: string; task: 'extract-features'; data: Property[] };

export type WorkerResponseType =
    | { type: 'processed-properties'; taskId: string; result: ProcessingResult }
    | { type: 'extracted-features'; taskId: string; features: PropertyFeatures }
    | { type: 'error'; taskId: string; error: string };
