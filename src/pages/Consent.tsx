import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { Shield, ChevronDown, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AnimatedPage from '@/components/AnimatedPage';

const CONSENT_TEXT = `TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO

Ao continuar, você concorda voluntariamente em fornecer informações pessoais e de saúde para uso exclusivo nesta ferramenta de triagem de risco para Leishmaniose Tegumentar.

OS DADOS UTILIZADOS INCLUEM:
• Idade, gênero e localização geográfica aproximada;
• Respostas ao questionário de sinais e sintomas;
• Imagens opcionais de lesões cutâneas (capturadas pela câmera do dispositivo).

FINALIDADE:
Esses dados serão utilizados exclusivamente para calcular uma estimativa de risco de Leishmaniose Tegumentar e fornecer orientações preliminares de saúde. Esta ferramenta NÃO realiza diagnóstico médico.

PRIVACIDADE E SEGURANÇA:
• Os dados são armazenados APENAS localmente no seu dispositivo (IndexedDB/localStorage).
• Nenhum dado pessoal é enviado para servidores externos.
• As imagens capturadas permanecem exclusivamente no seu aparelho.
• Nenhum dado é compartilhado com terceiros.

SEUS DIREITOS (conforme a LGPD — Lei 13.709/2018):
• Você pode revogar este consentimento a qualquer momento nas configurações do aplicativo.
• Você pode solicitar a exclusão dos seus dados limpando os dados do aplicativo.
• Você tem direito ao acesso, correção e eliminação dos seus dados pessoais.

DECLARAÇÃO:
Declaro que li e compreendi as informações acima, e que aceito voluntariamente participar da triagem, ciente de que posso desistir a qualquer momento sem qualquer prejuízo.

IMPORTANTE:
• Este aplicativo é uma ferramenta auxiliar de triagem e NÃO substitui consulta médica presencial.
• Em caso de suspeita de leishmaniose, procure imediatamente uma Unidade Básica de Saúde (UBS).
• O tratamento para leishmaniose é gratuito pelo Sistema Único de Saúde (SUS).`;

export default function Consent() {
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showDeclineMessage, setShowDeclineMessage] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setConsent, audioEnabled } = useLeishCheckStore();

  useEffect(() => {
    if (audioEnabled) {
      speakText('Sua privacidade é importante. Por favor, leia o termo de consentimento abaixo e role até o final para continuar.');
    }
  }, [audioEnabled]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
    if (atBottom) setScrolledToEnd(true);
  }, []);

  const handleAccept = () => {
    setConsent(true);
    navigate('/dados');
  };

  const handleDecline = () => {
    setShowDeclineMessage(true);
  };

  if (showDeclineMessage) {
    return (
      <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div className="glass-card w-full max-w-md flex flex-col items-center gap-6 p-8 text-center">
          <div className="icon-circle h-20 w-20">
            <HeartHandshake className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Entendemos sua decisão</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Sem o consentimento, não é possível realizar a triagem. Você pode voltar quando quiser.
          </p>
          <div className="flex w-full flex-col gap-3">
            <button
              onClick={() => navigate('/')}
              className="gradient-btn h-14 w-full rounded-2xl text-lg font-semibold"
            >
              Voltar ao Início
            </button>
            <Button
              onClick={() => setShowDeclineMessage(false)}
              variant="ghost"
              className="h-12 w-full rounded-2xl text-muted-foreground"
            >
              Reconsiderar
            </Button>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="icon-circle-blue h-16 w-16">
            <Shield className="h-8 w-8 text-trust" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sua privacidade é importante</h1>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="glass-card h-64 overflow-y-auto p-5 text-sm leading-relaxed text-card-foreground"
        >
          <pre className="whitespace-pre-wrap font-sans">{CONSENT_TEXT}</pre>
        </div>

        {!scrolledToEnd && (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <p className="text-xs">Role até o final para continuar</p>
            <ChevronDown className="h-5 w-5 animate-bounce-down" />
          </div>
        )}

        <div className="flex items-start gap-3 glass-card p-4">
          <Checkbox
            id="consent"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(v === true)}
            disabled={!scrolledToEnd}
            className="mt-0.5 h-6 w-6"
            aria-label="Li e concordo com o termo de consentimento"
          />
          <label htmlFor="consent" className={`text-sm font-medium ${scrolledToEnd ? 'text-foreground' : 'text-muted-foreground'}`}>
            Li e concordo com o termo de consentimento
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAccept}
            disabled={!agreed}
            className="gradient-btn h-14 w-full rounded-2xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            Aceitar e Continuar
          </button>
          <Button
            onClick={handleDecline}
            variant="ghost"
            className="h-12 w-full rounded-2xl text-muted-foreground"
          >
            Não aceito
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4" />
          <p>Esta ferramenta não substitui consulta médica presencial.</p>
        </div>
      </div>
    </AnimatedPage>
  );
}
