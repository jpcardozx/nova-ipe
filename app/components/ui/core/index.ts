// Exportações dos componentes core
import { Button, buttonVariants } from '@/components/ui';
// Re-export Button
export { Button };
// Conditionally export buttonVariants if it exists
export { buttonVariants } from '@/components/ui';
// Define ButtonProps interface based on component/ui/button.tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
}
