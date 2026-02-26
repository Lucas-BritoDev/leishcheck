import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { useEffect } from 'react';
import { BookOpen, History, Stethoscope, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoLeishCheck from '@/assets/logo-leishcheck.png';
import AnimatedPage from '@/components/AnimatedPage';

export default function Home() {
  const { audioEnabled, checkConsentValid } = useLeishCheckStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (audioEnabled) {
      speakText('Bem-vindo ao LeishCheck. Cuide da sua saúde. Simples, rápido e gratuito. Toque em Iniciar Triagem para começar.');
    }
  }, [audioEnabled]);

  const handleStart = () => {
    if (checkConsentValid()) {
      navigate('/dados');
    } else {
      navigate('/consentimento');
    }
  };

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-10 text-center max-w-sm">
        <div className="flex h-28 w-28 items-center justify-center rounded-3xl overflow-hidden glow-green">
          <img src={logoLeishCheck} alt="Logo LeishCheck" className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold text-gradient">LeishCheck</h1>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">v1.0</span>
          <p className="mt-2 text-base tracking-wide text-muted-foreground">
            Cuide da sua saúde.<br />Simples, rápido e gratuito.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <button
            onClick={handleStart}
            className="gradient-btn flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-lg font-semibold"
            aria-label="Iniciar triagem de leishmaniose"
          >
            <Stethoscope className="h-5 w-5" />
            Iniciar Triagem
          </button>

          <Button
            onClick={() => navigate('/educacao')}
            variant="secondary"
            className="glass-card h-14 w-full rounded-2xl text-lg font-semibold border-border/30 hover-lift"
            aria-label="Acessar material educativo"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Material Educativo
          </Button>

          <Button
            onClick={() => navigate('/historico')}
            variant="outline"
            className="glass-card h-14 w-full rounded-2xl text-lg font-semibold border-border/30 hover-lift"
            aria-label="Ver histórico de triagens"
          >
            <History className="mr-2 h-5 w-5" />
            Histórico
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <p>Esta ferramenta não substitui consulta médica presencial.</p>
        </div>
      </div>
    </AnimatedPage>
  );
}
