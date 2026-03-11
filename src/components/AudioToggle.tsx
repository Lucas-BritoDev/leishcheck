import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioToggleProps {
  className?: string;
  variant?: 'fixed' | 'inline';
}

export function AudioToggle({ className = '', variant = 'fixed' }: AudioToggleProps) {
  const { audioEnabled, toggleAudio } = useLeishCheckStore();

  const baseClasses = "flex items-center justify-center transition-all hover:scale-110 active:scale-95";
  
  const variantClasses = variant === 'fixed' 
    ? "h-10 w-10 rounded-full shadow-lg border border-border/50"
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
      onClick={toggleAudio}
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={variantStyles}
      aria-label={audioEnabled ? 'Desativar modo áudio' : 'Ativar modo áudio'}
    >
      {audioEnabled ? (
        <Volume2 className={`${variant === 'fixed' ? 'h-6 w-6' : 'h-5 w-5'} text-primary`} />
      ) : (
        <VolumeX className={`${variant === 'fixed' ? 'h-6 w-6' : 'h-5 w-5'} text-foreground`} />
      )}
    </button>
  );
}

export function speakText(text: string, lang?: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || 'pt-BR';
    utterance.rate = 0.8;

    // Prefer local (offline-capable) voices
    const voices = window.speechSynthesis.getVoices();
    const targetLang = utterance.lang.split('-')[0];
    const localVoice = voices.find(v => !v.localService === false && v.lang.startsWith(targetLang))
      || voices.find(v => v.lang.startsWith(targetLang));
    if (localVoice) utterance.voice = localVoice;

    window.speechSynthesis.speak(utterance);
  }
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
