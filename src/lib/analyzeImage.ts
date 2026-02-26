import { supabase } from '@/integrations/supabase/client';
import { AIAnalysis } from '@/types/leishcheck';
import { QuestionAnswer, UserData } from '@/types/leishcheck';

export async function analyzeImage(
  imageBase64: string,
  answers: QuestionAnswer[],
  userData: UserData
): Promise<AIAnalysis | null> {
  if (!navigator.onLine) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const { data, error } = await supabase.functions.invoke('analyze-lesion', {
      body: { imageBase64, answers, userData },
    });

    clearTimeout(timeout);

    if (error) {
      console.error('AI analysis error:', error);
      return null;
    }

    if (data?.error) {
      console.error('AI analysis returned error:', data.error);
      return null;
    }

    return data as AIAnalysis;
  } catch (err) {
    console.error('AI analysis failed:', err);
    return null;
  }
}
