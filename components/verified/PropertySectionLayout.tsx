import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface PropertySectionLayoutProps extends PropsWithChildren {
    id: string;
    title: string;
    description: string;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    badge?: string;
    titleHighlight?: string;
    viewAllLink?: string;
    viewAllLabel?: string;
}

export default PropertySectionLayout;