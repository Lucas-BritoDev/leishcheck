import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { Volume2, VolumeX } from 'lucide-react';

export function AudioToggle() {
  const { audioEnabled, toggleAudio } = useLeishCheckStore();

  return (
    <button
      onClick={toggleAudio}
      className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 border border-border/50"
      style={{
        background: 'hsl(var(--card) / 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      aria-label={audioEnabled ? 'Desativar modo áudio' : 'Ativar modo áudio'}
    >
      {audioEnabled ? <Volume2 className="h-6 w-6 text-primary" /> : <VolumeX className="h-6 w-6 text-muted-foreground" />}
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
