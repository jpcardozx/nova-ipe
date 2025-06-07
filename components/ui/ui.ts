'use client';

// UI Components barrel file
// This helps avoid circular dependencies and improves build consistency

// Re-export all UI components from their respective files
export { Badge } from './badge';
export { Button, buttonVariants } from './button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
export { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './carousel';
