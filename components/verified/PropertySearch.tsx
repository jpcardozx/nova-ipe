"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Search, MapPin, X, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PropertySearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  suggestions?: string[]
  recentSearches?: string[]
}

export default PropertySearch;