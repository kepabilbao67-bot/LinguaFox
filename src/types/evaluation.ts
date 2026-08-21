export type EvaluationConfidence = 'high' | 'medium' | 'low';
export type EvaluationSource = 'local_deterministic' | 'rules' | 'voice_stt' | 'ai_assisted' | 'unverifiable';

export interface DimensionScore {
  max: number;
  earned: number;
  evaluated: boolean;
  notes?: string;
}

export interface ActivityEvaluation {
  id: string;
  activityId: string;
  userId: string;
  timestamp: string;
  source: EvaluationSource;
  dimensions: {
    comprehension: DimensionScore;
    grammar: DimensionScore;
    vocabulary: DimensionScore;
    pronunciation: DimensionScore;
    fluency: DimensionScore;
    mission: DimensionScore;
  };
  recalculatedTotal: number; // 0 to 100
  confidence: EvaluationConfidence;
  recommendation?: string;
  expectedAnswer?: string;
  userAnswer?: string;
  skillEvaluated?: string;
  cefrLevel?: string;
}
