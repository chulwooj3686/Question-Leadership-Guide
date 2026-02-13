import { MetricConfig, SituationType } from "./types";

export const SITUATION_TYPES = Object.values(SituationType);

export const GENDER_OPTIONS = ['남성', '여성', '기타'];

export const METRICS_CONFIG: Record<string, MetricConfig> = {
  intimacy: {
    label: "친밀도",
    minLabel: "낯선 사이",
    maxLabel: "매우 친밀",
  },
  orgTrust: {
    label: "조직 신뢰도",
    minLabel: "매우 낮음",
    maxLabel: "매우 높음",
  },
  fairnessSensitivity: {
    label: "형평 민감성",
    minLabel: "둔감함",
    maxLabel: "매우 민감",
  },
  workAbility: {
    label: "업무 능력",
    minLabel: "부족함",
    maxLabel: "매우 우수",
  },
  teamInfluence: {
    label: "팀 영향력",
    minLabel: "제한적",
    maxLabel: "매우 높음",
  },
};

export const INITIAL_FORM_DATA = {
  userCompany: '',
  userGender: '남성',
  userAge: '' as const, // Type safe empty state
  userPosition: '',
  targetGender: '여성',
  targetAge: '' as const,
  targetPosition: '',
  intimacy: 3,
  orgTrust: 3,
  fairnessSensitivity: 3,
  workAbility: 3,
  teamInfluence: 3,
  situationType: SituationType.HUMBLE,
};
