import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { imageBase64, answers, userData } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "Image is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build clinical context from answers
    const answeredYes = (answers || [])
      .filter((a: { answer: boolean }) => a.answer)
      .map((a: { questionIndex: number }) => a.questionIndex);

    const clinicalContext = [
      userData?.age ? `Idade: ${userData.age} anos` : null,
      userData?.gender ? `Gênero: ${userData.gender}` : null,
      userData?.city || userData?.state
        ? `Local: ${[userData.city, userData.state].filter(Boolean).join(", ")}`
        : null,
      answeredYes.includes(0) ? "Mora em área rural ou de mata" : null,
      answeredYes.includes(1) ? "Viajou para locais com casos de leishmaniose" : null,
      answeredYes.includes(2) ? "Possui lesão na pele que não cicatriza" : null,
      answeredYes.includes(3) ? "A lesão está crescendo com o tempo" : null,
      answeredYes.includes(4) ? "A lesão não dói e tem aspecto ulcerado" : null,
      answeredYes.includes(5) ? "Houve contato com animais infectados" : null,
      answeredYes.includes(6) ? "Mora em área endêmica" : null,
      answeredYes.includes(7) ? "Já teve leishmaniose antes" : null,
      answeredYes.includes(8) ? "A ferida tem mais de 2 semanas" : null,
      answeredYes.includes(9) ? "A lesão surgiu após picada de inseto" : null,
    ].filter(Boolean).join("\n");

    const systemPrompt = `Você é um dermatologista tropical especialista em leishmaniose tegumentar americana. 
Analise a imagem da lesão cutânea fornecida junto com o contexto clínico do paciente.

Busque na imagem:
- Bordas elevadas e irregulares (típicas de leishmaniose cutânea)
- Ulceração central com fundo granuloso
- Aspecto de cratera com bordas em moldura
- Presença de crostas ou secreção
- Localização em áreas expostas (face, membros)
- Sinais de infecção secundária

Considere diagnósticos diferenciais: impetigo, carcinoma basocelular, úlcera vascular, esporotricose, paracoccidioidomicose.

Contexto clínico do paciente:
${clinicalContext || "Nenhum dado clínico adicional fornecido."}

Use a ferramenta fornecida para retornar sua análise estruturada.`;

    // Strip data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${base64Data}` },
                },
                {
                  type: "text",
                  text: "Analise esta imagem de lesão cutânea e retorne sua avaliação usando a ferramenta fornecida.",
                },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "analyze_lesion",
                description:
                  "Retorna a análise estruturada da lesão cutânea para triagem de leishmaniose",
                parameters: {
                  type: "object",
                  properties: {
                    riskAdjustment: {
                      type: "number",
                      description:
                        "Ajuste de risco baseado na análise visual, de -20 a +30. Positivo = aumenta suspeita, negativo = diminui.",
                    },
                    confidence: {
                      type: "number",
                      description:
                        "Nível de confiança da análise de 0 a 100. Considere qualidade da imagem e clareza dos achados.",
                    },
                    characteristics: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "Lista de características visuais identificadas na lesão (ex: 'Bordas elevadas', 'Ulceração central', 'Fundo granuloso').",
                    },
                    analysis: {
                      type: "string",
                      description:
                        "Resumo breve da análise visual em português, máximo 2-3 frases.",
                    },
                  },
                  required: [
                    "riskAdjustment",
                    "confidence",
                    "characteristics",
                    "analysis",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "analyze_lesion" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos ao workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro na análise de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Resposta inesperada da IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);

    // Clamp values
    analysisResult.riskAdjustment = Math.max(-20, Math.min(30, analysisResult.riskAdjustment));
    analysisResult.confidence = Math.max(0, Math.min(100, analysisResult.confidence));

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-lesion error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
