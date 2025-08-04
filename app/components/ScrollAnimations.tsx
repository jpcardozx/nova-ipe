'use client';

import React from 'react';

interface ScrollAnimationsProps {
  children: React.ReactNode;
}

export default function ScrollAnimations({ children }: ScrollAnimationsProps) {
  return <div className="fade-in-section transition-opacity duration-700 opacity-100">{children}</div>;
}