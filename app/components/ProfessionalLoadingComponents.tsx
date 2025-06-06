import React from 'react';

export const ProfessionalHeroLoading = () => {
    return (
        <section className="relative min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 right-10 w-72 h-72 bg-gray-200 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 left-10 w-64 h-64 bg-gray-200 rounded-full blur-3xl animate-pulse" />
            </div>

            {/* Main Content Skeleton */}
            <div className="relative z-20 container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-7xl mx-auto">

                    {/* Header Section Skeleton */}
                    <div className="text-center mb-16">
                        {/* Badge */}
                        <div className="mb-6">
                            <div className="inline-block w-64 h-8 bg-gray-200 rounded-full animate-pulse mb-4" />
                        </div>

                        {/* Title */}
                        <div className="space-y-4 mb-6">
                            <div className="w-96 h-12 bg-gray-200 rounded-lg mx-auto animate-pulse" />
                            <div className="w-80 h-12 bg-gray-200 rounded-lg mx-auto animate-pulse" />
                        </div>

                        {/* Subtitle */}
                        <div className="space-y-2 mb-4">
                            <div className="w-full max-w-3xl h-6 bg-gray-200 rounded mx-auto animate-pulse" />
                            <div className="w-3/4 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
                        </div>

                        {/* Differentials */}
                        <div className="flex flex-wrap justify-center items-center gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search Section Skeleton */}
                    <div className="mb-16">
                        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 max-w-5xl mx-auto">
                            {/* Search Header */}
                            <div className="text-center mb-6">
                                <div className="w-64 h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
                                <div className="w-96 h-4 bg-gray-200 rounded mx-auto animate-pulse" />
                            </div>

                            <div className="space-y-6">
                                {/* Toggle Buttons */}
                                <div className="flex justify-center">
                                    <div className="flex bg-gray-100 rounded-xl p-1">
                                        <div className="w-24 h-12 bg-gray-200 rounded-lg mx-1 animate-pulse" />
                                        <div className="w-24 h-12 bg-gray-200 rounded-lg mx-1 animate-pulse" />
                                    </div>
                                </div>

                                {/* Search Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-full h-14 bg-gray-200 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Achievement Cards Skeleton */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-lg border border-stone-200">
                                <div className="mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-3 animate-pulse" />
                                </div>
                                <div className="w-16 h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
                                <div className="w-24 h-4 bg-gray-200 rounded mx-auto mb-1 animate-pulse" />
                                <div className="w-20 h-3 bg-gray-200 rounded mx-auto animate-pulse" />
                            </div>
                        ))}
                    </div>

                    {/* CTA Section Skeleton */}
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
                            <div className="w-80 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
                            <div className="space-y-2 mb-6">
                                <div className="w-full max-w-2xl h-4 bg-gray-200 rounded mx-auto animate-pulse" />
                                <div className="w-3/4 h-4 bg-gray-200 rounded mx-auto animate-pulse" />
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <div className="w-48 h-12 bg-gray-200 rounded-xl animate-pulse" />
                                <div className="w-48 h-12 bg-gray-200 rounded-xl animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator Skeleton */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex flex-col items-center">
                    <div className="w-32 h-4 bg-gray-200 rounded mb-3 animate-pulse" />
                    <div className="w-6 h-10 border-2 border-gray-300 rounded-full" />
                </div>
            </div>
        </section>
    );
};

export const ProfessionalNavbarLoading = () => {
    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
            {/* Top Contact Bar */}
            <div className="bg-stone-900 py-2">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <div className="w-40 h-4 bg-gray-700 rounded animate-pulse" />
                        <div className="hidden md:flex space-x-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="py-4">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="w-40 h-12 bg-gray-200 rounded animate-pulse" />

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-8">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="w-36 h-10 bg-gray-200 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    );
};
