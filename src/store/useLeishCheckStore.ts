import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserData, QuestionAnswer, RiskResult, RiskLevel } from '@/types/leishcheck';
import { questions, MAX_SCORE } from '@/data/questions';

interface LeishCheckState {
  // Audio
  audioEnabled: boolean;
  toggleAudio: () => void;

  // Consent
  consentGiven: boolean;
  consentDate: string | null;
  setConsent: (given: boolean) => void;
  checkConsentValid: () => boolean;

  // User data
  userData: UserData;
  setUserData: (data: UserData) => void;

  // Questionnaire
  currentQuestion: number;
  answers: QuestionAnswer[];
  setAnswer: (questionIndex: number, answer: boolean) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;

  // Image
  imageBase64: string | null;
  setImage: (base64: string | null) => void;

  // Result
  result: RiskResult | null;
  calculateResult: () => RiskResult;

  // Reset
  resetTriagem: () => void;
}

function calculateRisk(answers: QuestionAnswer[]): RiskResult {
  const score = answers.reduce((sum, a) => {
    if (a.answer) return sum + questions[a.questionIndex].weight;
    return sum;
  }, 0);

  const percentage = Math.round((score / MAX_SCORE) * 100);

  let level: RiskLevel;
  let title: string;
  let description: string;
  let orientation: string;

  if (percentage <= 30) {
    level = 'low';
    title = 'RISCO BAIXO';
    description = 'Com base nas suas respostas, o risco de leishmaniose cutânea é baixo.';
    orientation = 'Continue se protegendo contra picadas de mosquito. Use repelente e telas nas janelas. Se notar qualquer ferida que não cicatriza, procure uma unidade de saúde.';
  } else if (percentage <= 60) {
    level = 'medium';
    title = 'RISCO MODERADO';
    description = 'Suas respostas indicam um risco moderado para leishmaniose cutânea.';
    orientation = 'Recomendamos que procure uma Unidade Básica de Saúde (UBS) para avaliação. Leve este resultado com você. Enquanto isso, proteja-se contra picadas de mosquito.';
  } else {
    level = 'high';
    title = 'RISCO ELEVADO';
    description = 'Suas respostas indicam um risco elevado para leishmaniose cutânea.';
    orientation = 'Procure uma Unidade Básica de Saúde (UBS) o mais rápido possível para avaliação médica. A leishmaniose tem tratamento gratuito pelo SUS. Quanto antes o diagnóstico, melhor o resultado.';
  }

  return { score, percentage, level, title, description, orientation };
}

export const useLeishCheckStore = create<LeishCheckState>()(
  persist(
    (set, get) => ({
      audioEnabled: false,
      toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),

      consentGiven: false,
      consentDate: null,
      setConsent: (given) =>
        set({ consentGiven: given, consentDate: given ? new Date().toISOString() : null }),
      checkConsentValid: () => {
        const { consentGiven, consentDate } = get();
        if (!consentGiven || !consentDate) return false;
        const diff = Date.now() - new Date(consentDate).getTime();
        return diff < 90 * 24 * 60 * 60 * 1000; // 90 days
      },

      userData: {},
      setUserData: (data) => set({ userData: data }),

      currentQuestion: 0,
      answers: [],
      setAnswer: (questionIndex, answer) =>
        set((s) => {
          const filtered = s.answers.filter((a) => a.questionIndex !== questionIndex);
          return { answers: [...filtered, { questionIndex, answer }] };
        }),
      goToQuestion: (index) => set({ currentQuestion: index }),
      nextQuestion: () => set((s) => ({ currentQuestion: Math.min(s.currentQuestion + 1, questions.length - 1) })),
      prevQuestion: () => set((s) => ({ currentQuestion: Math.max(s.currentQuestion - 1, 0) })),

      imageBase64: null,
      setImage: (base64) => set({ imageBase64: base64 }),

      result: null,
      calculateResult: () => {
        const result = calculateRisk(get().answers);
        set({ result });
        return result;
      },

      resetTriagem: () =>
        set({
          userData: {},
          currentQuestion: 0,
          answers: [],
          imageBase64: null,
          result: null,
        }),
    }),
    {
      name: 'leishcheck-storage',
      partialize: (state) => ({
        audioEnabled: state.audioEnabled,
        consentGiven: state.consentGiven,
        consentDate: state.consentDate,
      }),
    }
  )
);
