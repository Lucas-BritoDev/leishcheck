import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { code: 'pt-BR', flag: '🇧🇷', label: 'Português (Brasil)' },
  { code: 'en-US', flag: '🇺🇸', label: 'English (United States)' },
  { code: 'es-419', flag: '🇪🇸', label: 'Español (América Latina)' },
];

interface LanguageSelectorProps {
  className?: string;
  variant?: 'fixed' | 'inline';
}

export function LanguageSelector({ className = '', variant = 'fixed' }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('leishcheck-language', code);
    setOpen(false);
  };

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
    <>
      <button
        onClick={() => setOpen(true)}
        className={`${baseClasses} ${variantClasses} ${className}`}
        style={variantStyles}
        aria-label="Idioma / Language / Idioma"
      >
        <Globe className={`${variant === 'fixed' ? 'h-5 w-5' : 'h-5 w-5'} text-primary`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            {/* Centered modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-md rounded-3xl border border-border/50 p-6"
              style={{
                background: 'hsl(var(--card))',
                x: '-50%',
                y: '-50%',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <h2 className="text-center text-lg font-bold text-foreground mb-5">
                🌐 Idioma / Language / Idioma
              </h2>
              <div className="flex flex-col gap-2">
                {LANGUAGES.map((lang) => {
                  const isActive = i18n.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className={`flex items-center gap-4 rounded-2xl p-4 text-left transition-colors ${
                        isActive
                          ? 'bg-primary/10 border-2 border-primary/30'
                          : 'hover:bg-muted/50 border-2 border-transparent'
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="flex-1 text-base font-medium text-foreground">{lang.label}</span>
                      {isActive && <Check className="h-5 w-5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
