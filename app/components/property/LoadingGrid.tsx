"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoadingGridProps {
  viewMode: 'grid' | 'list'
  count?: number
}

export function LoadingGrid({ viewMode, count = 12 }: LoadingGridProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'
            : 'space-y-4'
        )}
      >
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden",
              viewMode === 'list' ? 'flex' : ''
            )}
          >
            {/* Image skeleton */}
            <div
              className={cn(
                "bg-gray-200 animate-pulse",
                viewMode === 'grid' ? 'h-48 w-full' : 'h-32 w-48 flex-shrink-0'
              )}
            />
            
            {/* Content skeleton */}
            <div className={cn("p-4 flex-1", viewMode === 'list' ? 'flex flex-col justify-between' : '')}>
              <div className="space-y-3">
                {/* Title */}
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                
                {/* Price */}
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                
                {/* Location */}
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                
                {/* Features */}
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                </div>
              </div>
              
              {viewMode === 'grid' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="h-9 bg-gray-200 rounded animate-pulse w-full" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
