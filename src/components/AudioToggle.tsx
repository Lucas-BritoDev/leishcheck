import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { Volume2, VolumeX } from 'lucide-react';

export function AudioToggle() {
  const { audioEnabled, toggleAudio } = useLeishCheckStore();

  return (
    <button
      onClick={toggleAudio}
      className="fixed top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label={audioEnabled ? 'Desativar modo áudio' : 'Ativar modo áudio'}
    >
      {audioEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
    </button>
  );
}

export function speakText(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
