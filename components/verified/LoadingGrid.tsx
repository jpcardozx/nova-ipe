"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoadingGridProps {
  viewMode: 'grid' | 'list'
  count?: number
}

function LoadingGrid({ viewMode, count = 12 }: LoadingGridProps) {
  return (
    <div
      className={cn(
        "w-full",
        viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "flex flex-col space-y-4"
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            "bg-gray-200 rounded-lg animate-pulse",
            viewMode === 'grid'
              ? "h-80 w-full"
              : "h-32 w-full"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </div>
  )
}

export default LoadingGrid;