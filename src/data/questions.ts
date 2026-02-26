import { Question } from '@/types/leishcheck';

export const questions: Question[] = [
  {
    text: 'Você mora ou esteve recentemente em uma área rural ou de mata?',
    icon: '🌳',
    weight: 10,
    audioText: 'Pergunta 1. Você mora ou esteve recentemente em uma área rural ou de mata?',
  },
  {
    text: 'Você notou alguma ferida na pele que não cicatriza há mais de 2 semanas?',
    icon: '🩹',
    weight: 15,
    audioText: 'Pergunta 2. Você notou alguma ferida na pele que não cicatriza há mais de 2 semanas?',
  },
  {
    text: 'A ferida começou como uma pequena elevação (caroço) na pele?',
    icon: '🔴',
    weight: 20,
    audioText: 'Pergunta 3. A ferida começou como uma pequena elevação, um caroço, na pele?',
  },
  {
    text: 'Você costuma ser picado por mosquitos pequenos ao entardecer ou à noite?',
    icon: '🦟',
    weight: 10,
    audioText: 'Pergunta 4. Você costuma ser picado por mosquitos pequenos ao entardecer ou à noite?',
  },
  {
    text: 'A ferida tem bordas elevadas e o centro mais fundo, como uma cratera?',
    icon: '⭕',
    weight: 20,
    audioText: 'Pergunta 5. A ferida tem bordas elevadas e o centro mais fundo, como uma cratera?',
  },
  {
    text: 'Existe algum animal doméstico (cão, gato) com feridas semelhantes na sua região?',
    icon: '🐕',
    weight: 10,
    audioText: 'Pergunta 6. Existe algum animal doméstico, como cão ou gato, com feridas semelhantes na sua região?',
  },
  {
    text: 'Você trabalha ou frequenta áreas com muita vegetação?',
    icon: '🌿',
    weight: 5,
    audioText: 'Pergunta 7. Você trabalha ou frequenta áreas com muita vegetação?',
  },
  {
    text: 'A ferida não dói, mas também não melhora com remédios caseiros?',
    icon: '💊',
    weight: 15,
    audioText: 'Pergunta 8. A ferida não dói, mas também não melhora com remédios caseiros?',
  },
  {
    text: 'Você já teve contato com alguém que foi diagnosticado com leishmaniose?',
    icon: '👥',
    weight: 10,
    audioText: 'Pergunta 9. Você já teve contato com alguém que foi diagnosticado com leishmaniose?',
  },
  {
    text: 'Há presença de lixo, entulho ou galinheiros próximos à sua casa?',
    icon: '🏚️',
    weight: 20,
    audioText: 'Pergunta 10. Há presença de lixo, entulho ou galinheiros próximos à sua casa?',
  },
];

export const MAX_SCORE = questions.reduce((sum, q) => sum + q.weight, 0);
