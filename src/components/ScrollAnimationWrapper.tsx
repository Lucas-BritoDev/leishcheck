import { motion } from 'framer-motion';
import { useScrollAnimation, scrollAnimationVariants } from '@/hooks/useScrollAnimation';
import { ReactNode } from 'react';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  animation?: keyof typeof scrollAnimationVariants;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export function ScrollAnimationWrapper({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration,
  className = '',
  threshold = 0.1,
  rootMargin = '0px 0px -100px 0px',
}: ScrollAnimationWrapperProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, rootMargin });

  const variants = {
    ...scrollAnimationVariants[animation],
    visible: {
      ...scrollAnimationVariants[animation].visible,
      transition: {
        ...scrollAnimationVariants[animation].visible.transition,
        delay,
        ...(duration && { duration }),
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Componente para animações em sequência (stagger)
interface StaggerWrapperProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
  rootMargin?: string;
}

export function StaggerWrapper({
  children,
  className = '',
  staggerDelay = 0.1,
  threshold = 0.1,
  rootMargin = '0px 0px -100px 0px',
}: StaggerWrapperProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, rootMargin });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}