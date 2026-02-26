

# Plano: Implementar os 8 Itens Pendentes do PRD

## 1. Termo de Consentimento (Seção 9.1 do PRD)

**Arquivo:** `src/pages/Consent.tsx`

Substituir o `CONSENT_TEXT` atual pelo texto exato da Seção 9.1 do PRD:
- "Ao continuar, você concorda voluntariamente..."
- Seções: OS DADOS UTILIZADOS INCLUEM, FINALIDADE, PRIVACIDADE E SEGURANÇA, SEUS DIREITOS, DECLARAÇÃO, IMPORTANTE

## 2. Perguntas de Triagem (Seção 9.2 do PRD)

**Arquivo:** `src/data/questions.ts`

Substituir as 10 perguntas atuais pelas exatas do PRD (Seção 9.2):

| # | Ícone | Pergunta | Peso |
|---|-------|----------|------|
| Q01 | 🌿 | Você mora em área rural ou de mata? | 10 |
| Q02 | 🌿 | Já viajou para locais com casos de leishmaniose? | 10 |
| Q03 | 🩹 | Possui lesão na pele que não cicatriza? | 20 |
| Q04 | 📈 | A lesão está crescendo com o tempo? | 15 |
| Q05 | 🔍 | A lesão não dói e tem aspecto ulcerado? | 20 |
| Q06 | 🐕 | Houve contato com animais infectados? | 10 |
| Q07 | 🌿 | Mora em área endêmica? | 10 |
| Q08 | 📋 | Já teve leishmaniose antes? | 10 |
| Q09 | 📅 | A ferida tem mais de 2 semanas? | 15 |
| Q10 | 🦟 | A lesão surgiu após picada de inseto? | 15 |

Total: 135 pontos (mesmo valor, perguntas diferentes).

## 3. Regra de Negócio #6 — Aviso de Emergência Antes do Resultado

**Arquivo:** `src/pages/Result.tsx`

Quando o risco for **alto** (>60%), exibir um alerta vermelho em destaque **antes** do círculo de porcentagem e de todo o conteúdo do resultado. Texto: "🚨 ATENÇÃO: Seus sinais são fortemente sugestivos. Procure uma Unidade Básica de Saúde (UBS) urgentemente. O tratamento é gratuito pelo SUS."

## 4. Texto das Orientações por Nível (Tabela 10.2 do PRD)

**Arquivo:** `src/store/useLeishCheckStore.ts`

Ajustar as orientações do `calculateRisk` para os textos exatos da tabela 10.2:
- Baixo: "Sinais pouco sugestivos. Monitorar. Procurar UBS se piorar."
- Médio: "Sinais moderados. Recomendado consulta médica breve."
- Alto: "Sinais fortemente sugestivos. Procure UBS urgentemente."

## 5. Service Worker com vite-plugin-pwa

**Arquivos:** `vite.config.ts`, `src/main.tsx`

- Instalar `vite-plugin-pwa`
- Configurar no `vite.config.ts` com `VitePWA({ registerType: 'autoUpdate', ... })` e manifest inline
- Registrar o SW em `src/main.tsx`
- Remover o `manifest.json` manual (será gerado pelo plugin)

## 6. IndexedDB com Dexie.js

**Arquivos novos:** `src/lib/db.ts`
**Arquivo editado:** `src/store/useLeishCheckStore.ts`

- Instalar `dexie`
- Criar `src/lib/db.ts` com stores: `sessions`, `consent_log`, `user_preferences`
- Atualizar o store para persistir sessões completas no IndexedDB ao calcular resultado
- Manter Zustand persist com localStorage para estado de sessão ativa (consentimento e áudio), mas salvar sessões completas no IndexedDB

## 7. prefers-reduced-motion

**Arquivo:** `src/components/AnimatedPage.tsx`, `src/pages/Questionnaire.tsx`, `src/pages/Result.tsx`

- Criar um hook `useReducedMotion()` que verifica `window.matchMedia('(prefers-reduced-motion: reduce)')`
- Em `AnimatedPage`, desabilitar animações (duration: 0) quando reduzido
- Em `Questionnaire` e `Result`, desabilitar as animações do framer-motion quando a preferência estiver ativa

## 8. Botão "Não aceito" com Mensagem Respeitosa

**Arquivo:** `src/pages/Consent.tsx`

Ao clicar "Não aceito", em vez de simplesmente redirecionar para Home, exibir um dialog/card respeitoso com mensagem:
- "Entendemos sua decisão. Sem o consentimento, não é possível realizar a triagem. Você pode voltar quando quiser."
- Botão "Voltar ao Início"
- Botão "Reconsiderar" para fechar o aviso

---

## Detalhes Técnicos

- **Dependências a instalar:** `vite-plugin-pwa`, `dexie`
- **Arquivos criados:** `src/lib/db.ts`, `src/hooks/useReducedMotion.ts`
- **Arquivos editados:** `src/pages/Consent.tsx`, `src/data/questions.ts`, `src/store/useLeishCheckStore.ts`, `src/pages/Result.tsx`, `src/components/AnimatedPage.tsx`, `src/pages/Questionnaire.tsx`, `vite.config.ts`, `src/main.tsx`
- **Arquivo removido:** `public/manifest.json` (gerenciado pelo vite-plugin-pwa)

