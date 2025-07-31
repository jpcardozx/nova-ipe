"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, RefreshCw } from 'lucide-react'

interface EmptyStateProps {
  searchQuery?: string
  hasFilters: boolean
  onClearFilters: () => void
}

export default EmptyState;