export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  weights: number[];
}

export interface Answer {
  questionId: number;
  answerIndex: number;
}

export interface DimensionScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface TestResult {
  id: number;
  userName: string;
  totalScore: number;
  totalPercentage: number;
  level: string;
  description: string;
  suggestions: string[];
  dimensions: DimensionScore[];
  timestamp: string;
}

export interface TestSubmission {
  userName?: string;
  answers: Answer[];
}
