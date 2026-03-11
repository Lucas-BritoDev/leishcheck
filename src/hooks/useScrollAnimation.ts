import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce && !hasTriggered) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { ref, isVisible };
}

// Variantes de animação pré-definidas
export const scrollAnimationVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number] 
      } 
    },
  },
  
  fadeInLeft: {
    hidden: { opacity: 0, x: -80 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number] 
      } 
    },
  },
  
  fadeInRight: {
    hidden: { opacity: 0, x: 80 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number] 
      } 
    },
  },
  
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number] 
      } 
    },
  },
  
  slideInFromBottom: {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.9, 
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number] 
      } 
    },
  },
};