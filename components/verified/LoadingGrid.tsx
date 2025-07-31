"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoadingGridProps {
  viewMode: 'grid' | 'list'
  count?: number
}

export default LoadingGrid;