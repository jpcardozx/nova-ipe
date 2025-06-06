'use client';

import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Heart, TrendingUp, Map, MapPin, AreaChart, Building, Lock, Camera, Home, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
    id: string;
    name: string;
    icon: React.ReactNode;
    premium?: boolean;
    highlight?: boolean;
}

interface PropertyFeatureTabsProps {
    features: {
        id: string;
        title: string;
        description: string;
        image?: string;
        icon?: React.ReactNode;
        premium?: boolean;
        highlight?: boolean;
        items?: Feature[];
    }[];
    defaultTab?: string;
    className?: string;
    variant?: 'default' | 'cards';
    orientation?: 'horizontal' | 'vertical';
}

// Memo-ized feature tab button for better performance
const TabButton = memo(({
    feature,
    isActive,
    onClick,
    isCards,
    isVertical
}: {
    feature: PropertyFeatureTabsProps['features'][0],
    isActive: boolean,
    onClick: () => void,
    isCards: boolean,
    isVertical: boolean
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "transition-all outline-none",
                isCards
                    ? cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg border min-w-[140px] hover:border-primary-300 hover:shadow-sm",
                        isActive
                            ? "bg-primary-50 border-primary-300 shadow-sm"
                            : "border-neutral-200 bg-white"
                    )
                    : cn(
                        isVertical
                            ? "flex items-center gap-3 p-3 text-left border-l-2"
                            : "px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap",
                        isActive
                            ? cn(
                                "text-primary-600",
                                isVertical
                                    ? "border-l-primary-500 bg-primary-50"
                                    : "border-b-primary-500"
                            )
                            : cn(
                                "text-neutral-600 hover:text-neutral-900",
                                isVertical
                                    ? "border-l-transparent hover:bg-neutral-50 hover:border-l-neutral-300"
                                    : "border-b-transparent hover:border-b-neutral-300"
                            )
                    )
            )}
            aria-selected={isActive}
        >
            <div className={isCards ? "mb-2" : ""}>
                {feature.icon || (
                    <div className={cn(
                        "rounded-full p-2",
                        isCards ? "bg-primary-50" : ""
                    )}>
                        <Star
                            size={isCards ? 24 : 18}
                            className={cn(
                                isCards ? "text-primary-500" : isActive ? "text-primary-500" : "text-neutral-400"
                            )}
                        />
                    </div>
                )}
            </div>
            <span className={cn(
                isCards ? "text-center" : "truncate",
                feature.premium && "inline-flex items-center gap-1"
            )}>
                {feature.title}
                {feature.premium && (
                    <Sparkles size={14} className="text-amber-500" />
                )}
            </span>
        </button>
    )
});

TabButton.displayName = 'TabButton';

// Memo-ized feature item for better performance
const FeatureItem = memo(({ item }: { item: Feature }) => {
    return (
        <div
            key={item.id}
            className={cn(
                "flex items-center gap-3 p-3 rounded-lg border border-neutral-200",
                item.premium && "bg-amber-50 border-amber-200",
                item.highlight && "bg-primary-50 border-primary-200"
            )}
        >
            <div className={cn(
                "flex items-center justify-center w-9 h-9 rounded-full",
                item.premium ? "bg-amber-100 text-amber-600" : "bg-primary-100 text-primary-600"
            )}>
                {item.icon || <Check size={18} />}
            </div>
            <span className="font-medium text-neutral-900">{item.name}</span>
        </div>
    );
});

FeatureItem.displayName = 'FeatureItem';

export default function PropertyFeatureTabs({
    features,
    defaultTab,
    className,
    variant = 'default',
    orientation = 'horizontal',
}: PropertyFeatureTabsProps) {
    const [activeTab, setActiveTab] = useState<string>(defaultTab || (features[0]?.id || ''));

    const activeFeature = features.find(feature => feature.id === activeTab);

    const isVertical = orientation === 'vertical';
    const isCards = variant === 'cards';

    const handleTabChange = useCallback((tabId: string) => {
        setActiveTab(tabId);
    }, []);

    // Animation variants
    const contentVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };

    return (
        <div className={cn(
            "w-full",
            isVertical ? "flex flex-col md:flex-row gap-8" : "",
            className
        )}>
            {/* Tabs navigation */}
            <div className={cn(
                "flex overflow-x-auto scrollbar-hide",
                isVertical
                    ? "md:flex-col md:w-1/3 md:overflow-y-auto md:overflow-x-visible"
                    : isCards
                        ? "gap-4 pb-2"
                        : "border-b border-neutral-200"
            )}>
                <div className={cn(
                    "flex",
                    isVertical
                        ? "md:flex-col w-full"
                        : isCards
                            ? "gap-4"
                            : "gap-1"
                )}>
                    {features.map((feature) => (
                        <TabButton
                            key={feature.id}
                            feature={feature}
                            isActive={activeTab === feature.id}
                            onClick={() => handleTabChange(feature.id)}
                            isCards={isCards}
                            isVertical={isVertical}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className={cn(
                "mt-4",
                isVertical ? "md:mt-0 md:w-2/3" : "",
                isCards ? "mt-8" : ""
            )}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={contentVariants}
                        transition={{ duration: 0.2 }}
                    >
                        {activeFeature && (
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-neutral-900">{activeFeature.title}</h3>
                                    <p className="text-neutral-600 mt-1">{activeFeature.description}</p>
                                </div>

                                {activeFeature.image && (
                                    <div className="mb-6 overflow-hidden rounded-lg">
                                        <img
                                            src={activeFeature.image}
                                            alt={activeFeature.title}
                                            className="w-full h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-700"
                                            loading="lazy"
                                        />
                                    </div>
                                )}

                                {/* Feature items list */}
                                {activeFeature.items && activeFeature.items.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                        {activeFeature.items.map((item) => (
                                            <FeatureItem key={item.id} item={item} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
} 