import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, Shield, Bug } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';

const mosquitoContent = {
  title: 'O Mosquito-Palha',
  text: 'A leishmaniose cutânea é transmitida pela picada de um inseto muito pequeno chamado mosquito-palha (Lutzomyia). Ele é menor que um mosquito comum e costuma picar ao entardecer e à noite. Vive em áreas com muita vegetação, lixo, entulho e próximo a animais domésticos.',
  prevention: 'Para se proteger: use repelente, coloque telas nas janelas e portas, evite acúmulo de lixo e entulho no quintal, e mantenha animais domésticos limpos e protegidos.',
};

const lesionPhases = [
  {
    phase: 'Fase Inicial (Pápula)',
    description: 'Aparece uma pequena elevação avermelhada na pele, parecida com uma picada de inseto que não melhora. Pode coçar um pouco.',
    color: 'border-l-warning',
  },
  {
    phase: 'Fase Ulcerada',
    description: 'A elevação cresce e forma uma ferida aberta com bordas elevadas. O centro fica mais fundo, como uma cratera. Geralmente não dói.',
    color: 'border-l-danger',
  },
  {
    phase: 'Fase Avançada',
    description: 'Sem tratamento, a ferida pode crescer bastante e durar meses ou anos. Pode aparecer mais de uma ferida em diferentes partes do corpo.',
    color: 'border-l-destructive',
  },
];

export default function Education() {
  const navigate = useNavigate();
  const { audioEnabled } = useLeishCheckStore();

  useEffect(() => {
    if (audioEnabled) {
      speakText('Material educativo sobre leishmaniose cutânea. Aqui você encontra informações sobre o mosquito-palha e as fases da doença.');
    }
  }, [audioEnabled]);

  const speakSection = (text: string) => {
    if (audioEnabled) speakText(text);
  };

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/80 hover-lift"
            aria-label="Voltar à tela inicial"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Material Educativo</h1>
        </div>

        {/* Mosquito section */}
        <div className="glass-card p-6 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="icon-circle h-10 w-10">
                <Bug className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">{mosquitoContent.title}</h2>
            </div>
            {audioEnabled && (
              <button
                onClick={() => speakSection(`${mosquitoContent.title}. ${mosquitoContent.text}. ${mosquitoContent.prevention}`)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 hover-lift"
                aria-label="Ouvir sobre o mosquito-palha"
              >
                <Volume2 className="h-5 w-5 text-primary" />
              </button>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mosquitoContent.text}</p>
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-primary/5 p-4">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Prevenção</p>
              <p className="mt-1 text-sm text-muted-foreground">{mosquitoContent.prevention}</p>
            </div>
          </div>
        </div>

        {/* Lesion phases */}
        <h2 className="text-xl font-bold text-foreground">Fases da Lesão</h2>
        {lesionPhases.map((phase, i) => (
          <div key={i} className={`glass-card p-6 border-l-4 ${phase.color}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                  {i + 1}
                </span>
                <h3 className="text-base font-semibold text-foreground">{phase.phase}</h3>
              </div>
              {audioEnabled && (
                <button
                  onClick={() => speakSection(`${phase.phase}. ${phase.description}`)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 hover-lift"
                  aria-label={`Ouvir sobre ${phase.phase}`}
                >
                  <Volume2 className="h-5 w-5 text-primary" />
                </button>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{phase.description}</p>
          </div>
        ))}

        <div className="glass-card flex items-center gap-3 p-4">
          <Shield className="h-5 w-5 text-warning shrink-0" />
          <p className="text-sm font-medium text-muted-foreground">
            Se você identificou alguma ferida parecida, procure uma Unidade Básica de Saúde. O tratamento é gratuito pelo SUS.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="gradient-btn h-14 w-full rounded-2xl text-lg font-semibold"
        >
          Voltar ao Início
        </button>
      </div>
    </AnimatedPage>
  );
}
