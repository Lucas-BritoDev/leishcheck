import { useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInstallApp } from '@/hooks/useInstallApp';

export function FloatingPWAButton() {
  const [isDismissed, setIsDismissed] = useState(false);
  const { isInstallable, handleInstallClick } = useInstallApp();

  // Não mostrar se não for instalável ou se foi dispensado
  if (!isInstallable || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3"
      >
        {/* Texto "Instale nosso aplicativo" */}
        <div className="relative">
          <motion.div
            animate={{ 
              opacity: [0.8, 1, 0.8],
              scale: [0.98, 1.02, 0.98],
              y: [0, -2, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-primary text-primary-foreground px-4 py-2.5 rounded-full shadow-xl border border-primary/20 relative"
            style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 4px 20px rgba(22, 163, 74, 0.4)',
            }}
          >
            <span className="text-sm font-semibold whitespace-nowrap text-white">
              Instale nosso aplicativo
            </span>
            {/* Seta apontando para baixo */}
            <div 
              className="absolute -bottom-2 right-6 w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid #15803d',
              }}
            />
          </motion.div>

          {/* Botão de fechar */}
          <motion.button
            onClick={() => setIsDismissed(true)}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-600/80 text-white/90 hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Fechar"
          >
            <X className="h-3 w-3" />
          </motion.button>
        </div>

        {/* Botão principal PWA */}
        <motion.button
          onClick={handleInstallClick}
          animate={{ 
            scale: [1, 1.08, 1],
            boxShadow: [
              '0 6px 25px rgba(22, 163, 74, 0.4)',
              '0 10px 35px rgba(22, 163, 74, 0.6)',
              '0 6px 25px rgba(22, 163, 74, 0.4)'
            ],
            y: [0, -3, 0]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
          whileHover={{ 
            scale: 1.2,
            boxShadow: '0 15px 45px rgba(22, 163, 74, 0.7)'
          }}
          whileTap={{ scale: 0.9 }}
          aria-label="Instalar aplicativo"
        >
          <motion.div
            animate={{ 
              y: [0, -2, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Download className="h-7 w-7 text-white drop-shadow-lg" />
          </motion.div>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}