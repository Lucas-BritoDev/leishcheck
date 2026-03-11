import { Moon, Sun } from 'lucide-react';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';

interface DarkModeToggleProps {
  className?: string;
  variant?: 'fixed' | 'inline';
}

export function DarkModeToggle({ className = '', variant = 'fixed' }: DarkModeToggleProps) {
  const { darkMode, toggleDarkMode } = useLeishCheckStore();

  const baseClasses = "flex items-center justify-center transition-all hover:scale-110 active:scale-95";
  
  const variantClasses = variant === 'fixed' 
    ? "h-10 w-10 rounded-full border border-border/50 shadow-lg"
    : "h-10 w-10 rounded-xl border border-border/30 hover:border-border/60 hover:bg-muted/50";

  const variantStyles = variant === 'fixed' 
    ? {
        background: 'hsl(var(--card) / 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }
    : {
        background: 'hsl(var(--muted) / 0.3)',
      };

  return (
    <button
      onClick={toggleDarkMode}
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={variantStyles}
      aria-label={darkMode ? 'Light mode' : 'Dark mode'}
    >
      {darkMode ? (
        <Sun className={`${variant === 'fixed' ? 'h-5 w-5' : 'h-5 w-5'} text-warning`} />
      ) : (
        <Moon className={`${variant === 'fixed' ? 'h-5 w-5' : 'h-5 w-5'} text-foreground`} />
      )}
    </button>
  );
}
