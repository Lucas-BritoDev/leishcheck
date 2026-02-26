export interface UserData {
  age?: number;
  gender?: string;
  city?: string;
  state?: string;
}

export interface QuestionAnswer {
  questionIndex: number;
  answer: boolean;
}

export interface Question {
  text: string;
  icon: string;
  weight: number;
  audioText: string;
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface AIAnalysis {
  riskAdjustment: number;  // -20 to +30
  confidence: number;      // 0-100
  characteristics: string[];
  analysis: string;
}

export interface RiskResult {
  score: number;
  percentage: number;
  level: RiskLevel;
  title: string;
  description: string;
  orientation: string;
  aiAnalysis?: AIAnalysis;
}

export interface Session {
  id: string;
  consentGiven: boolean;
  consentDate?: string;
  userData: UserData;
  answers: QuestionAnswer[];
  imageBase64?: string;
  result?: RiskResult;
  completedAt?: string;
}
