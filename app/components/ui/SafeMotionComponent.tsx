import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface SafeMotionComponentProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode;
}

const SafeMotionComponent: React.FC<SafeMotionComponentProps> = ({ children, ...props }) => {
  return <motion.div {...props}>{children}</motion.div>;
};

export default SafeMotionComponent;