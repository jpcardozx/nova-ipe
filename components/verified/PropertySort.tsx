"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, TrendingUp, DollarSign, Calendar, Ruler } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertySortProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const sortOptions = [
  { value: 'relevance', label: 'Relevância', icon: TrendingUp },
  { value: 'price-asc', label: 'Menor preço', icon: DollarSign },
  { value: 'price-desc', label: 'Maior preço', icon: DollarSign },
  { value: 'area', label: 'Maior área', icon: Ruler },
  { value: 'newest', label: 'Mais recentes', icon: Calendar },
]

export default PropertySort;