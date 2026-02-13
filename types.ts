export interface FormData {
  userCompany: string;
  userGender: string;
  userAge: number | '';
  userPosition: string;
  targetGender: string;
  targetAge: number | '';
  targetPosition: string;
  intimacy: number;
  orgTrust: number;
  fairnessSensitivity: number;
  workAbility: number;
  teamInfluence: number;
  situationType: SituationType;
}

export enum SituationType {
  HUMBLE = '겸손한 질문',
  CLARIFICATION = '업무 명확화',
  EMOTIONAL = '감정형 질문',
  CONFIRMATION = '확인형 질문',
  ANALYTICAL = '분석형 질문',
  CREATIVE = '창의적 사고유발 질문',
}

export interface QuestionStep {
  stepNumber: number;
  question: string;
  purpose: string;
  tips: string;
}

export interface QuestionResult {
  id: string;
  timestamp: Date;
  formData: FormData;
  steps: QuestionStep[];
}

export interface MetricConfig {
  label: string;
  minLabel: string;
  maxLabel: string;
}