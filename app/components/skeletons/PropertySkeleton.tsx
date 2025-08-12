'use client';

import { memo } from 'react';

// Skeleton otimizado para Web Vitals
const PropertyCardSkeleton = memo(() => (
    <div className="max-w-sm animate-pulse">
        <div className="bg-white rounded-xl overflow-hidden border border-stone-200/60">
            {/* Image skeleton */}
            <div className="aspect-[4/3] bg-stone-200" />

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-6 bg-stone-200 rounded w-3/4" />

                {/* Location */}
                <div className="h-4 bg-stone-200 rounded w-1/2" />

                {/* Features */}
                <div className="grid grid-cols-4 gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="text-center">
                            <div className="h-4 w-4 bg-stone-200 rounded mx-auto mb-1" />
                            <div className="h-3 bg-stone-200 rounded w-8 mx-auto mb-1" />
                            <div className="h-2 bg-stone-200 rounded w-12 mx-auto" />
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                    <div className="h-3 bg-stone-200 rounded w-16" />
                    <div className="h-4 w-4 bg-stone-200 rounded" />
                </div>
            </div>
        </div>
    </div>
));

PropertyCardSkeleton.displayName = 'PropertyCardSkeleton';

// Loading grid optimizado
const PropertyGridSkeleton = memo(({ count = 6 }: { count?: number }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
            <PropertyCardSkeleton key={i} />
        ))}
    </div>
));

PropertyGridSkeleton.displayName = 'PropertyGridSkeleton';

export { PropertyCardSkeleton, PropertyGridSkeleton };
