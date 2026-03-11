import { useState, useEffect, useRef } from 'react';
import { Settings, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DarkModeToggle } from './DarkModeToggle';
import { AudioToggle } from './AudioToggle';
import { LanguageSelector } from './LanguageSelector';

export function SettingsToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current && 
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <>
      {/* Main toggle button */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border/50 shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: 'hsl(var(--card) / 0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Configurações"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Settings className="h-5 w-5 text-foreground" />
          )}
        </motion.div>
      </motion.button>

      {/* Back to landing page button */}
      <motion.button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl border border-border/30 shadow-lg transition-all hover:scale-105 active:scale-95 text-sm font-medium"
        style={{
          background: 'hsl(var(--card) / 0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
        whileHover={{ scale: 1.05, x: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Voltar ao início"
      >
        <ArrowLeft className="h-4 w-4 text-primary" />
        <span className="text-foreground">Voltar ao início</span>
      </motion.button>

      {/* Expanded settings panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.8, x: 20, y: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-20 right-4 z-40 flex flex-col gap-2 p-3 rounded-2xl border border-border/30 shadow-2xl min-w-[60px]"
            style={{
              background: 'hsl(var(--card) / 0.98)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center justify-center p-1">
                <DarkModeToggle variant="inline" />
              </div>
              <div className="flex items-center justify-center p-1">
                <AudioToggle variant="inline" />
              </div>
              <div className="flex items-center justify-center p-1">
                <LanguageSelector variant="inline" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}