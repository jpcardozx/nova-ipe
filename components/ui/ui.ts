'use client';

// UI Components barrel file
// This helps avoid circular dependencies and improves build consistency

// Re-export all UI components from their respective files
export { Badge } from './badge';
export { default as Button, buttonVariants } from './button';
export { default as Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
export { 
  default as Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './carousel';
