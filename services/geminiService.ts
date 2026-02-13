import { GoogleGenAI, Type } from "@google/genai";
import { FormData, SituationType, QuestionStep } from "../types";

const createPrompt = (data: FormData): string => {
  const baseContext = `
질문리더십 전문가로서 다음 상황에 맞는 효과적인 질문을 4단계로 추천해주세요.

## 사용자 정보
- 회사: ${data.userCompany}
- 성별: ${data.userGender}
- 나이: ${data.userAge}세
- 직책: ${data.userPosition}

## 대상자 정보  
- 성별: ${data.targetGender}
- 나이: ${data.targetAge}세
- 직책: ${data.targetPosition}
- 친밀도: ${data.intimacy}/5 (1:낯선사이 ~ 5:매우친밀)
- 조직신뢰도: ${data.orgTrust}/5 (1:매우낮음 ~ 5:매우높음)
- 형평민감성: ${data.fairnessSensitivity}/5 (1:둔감함 ~ 5:매우민감)
- 업무능력: ${data.workAbility}/5 (1:부족함 ~ 5:매우우수)
- 팀영향력: ${data.teamInfluence}/5 (1:제한적 ~ 5:매우높음)

## 상황 유형: ${data.situationType}
`;

  let specificInstructions = '';
  
  switch (data.situationType) {
    case SituationType.HUMBLE:
      specificInstructions = `
겸손한 질문은 조언을 구하는 형태로, 상대방의 전문성을 인정하고 도움을 요청하는 질문입니다.
- 1단계: 상황 공유 및 상대방의 전문성 인정
- 2단계: 구체적인 도움 요청 ("도와주실 수 있으세요?")
- 3단계: 상대방의 의견 경청 및 구체화 질문
- 4단계: 감사의 표현 및 상대방의 효능감 강화`;
      break;
      
    case SituationType.CLARIFICATION:
      specificInstructions = `
업무 명확화는 BOSS 프레임워크를 활용하여 4단계 질문을 만듭니다:
- 1단계 B(Background): 업무의 배경과 상황 질문
- 2단계 O(Objectives): 목적과 목표 질문
- 3단계 S(Scope): 업무 범위 질문
- 4단계 S(Schedule): 일정과 마감 질문

대상자의 업무능력 수준(${data.workAbility}/5)을 고려하여 각 단계를 구성해주세요.`;
      break;
      
    case SituationType.EMOTIONAL:
      specificInstructions = `
감정형 질문은 상대방의 감정과 경험을 공유하게 하는 4단계 프로세스입니다:
- 1단계: 감정적 경험 탐색 (감사, 당혹 등)
- 2단계: 구체적인 내용 듣기 및 공감
- 3단계: 감정의 원인이나 배경 심층 파악
- 4단계: 지지 표현 및 긍정적 마무리`;
      break;
      
    case SituationType.CONFIRMATION:
      specificInstructions = `
벤자민 브룸의 인지능력 단계를 활용한 4단계 확인형 질문:
- 1단계 (지식/이해): 사실 관계 및 기본 이해도 확인
- 2단계 (적용): 실제 상황에 어떻게 적용할지 질문
- 3단계 (분석/종합): 예상되는 문제점이나 통합적 사고 질문
- 4단계 (평가): 가치 판단 및 의사결정 관련 질문`;
      break;
      
    case SituationType.ANALYTICAL:
      specificInstructions = `
메타인지를 활용한 4단계 분석형 질문:
- 1단계: 판단이나 결론의 내용 확인
- 2단계: "어떻게 알게 되었나요?" (인식의 근거)
- 3단계: "다른 가능성은 없을까요?" (대안 탐색)
- 4단계: 실행 시나리오 및 검증 방법 질문`;
      break;
      
    case SituationType.CREATIVE:
      specificInstructions = `
창의적 사고유발을 위한 4단계 질문:
- 1단계: 기존 가정이나 제약조건 확인
- 2단계: "만약 ~라면?" (가정 뒤집기)
- 3단계: 연결되지 않은 개념 연결하기 (유추)
- 4단계: 구체적인 아이디어로 발전시키기`;
      break;
  }

  return baseContext + specificInstructions + `

위 가이드를 바탕으로 정확히 4단계의 질문 시퀀스를 생성하세요.
각 단계는 이전 단계와 논리적으로 연결되어야 하며, 실행 가능한 구체적인 팁을 포함해야 합니다.
`;
};

export const generateQuestions = async (formData: FormData): Promise<QuestionStep[]> => {
  const prompt = createPrompt(formData);
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              stepNumber: { type: Type.INTEGER, description: "1, 2, 3, or 4" },
              question: { type: Type.STRING, description: "The specific question to ask" },
              purpose: { type: Type.STRING, description: "Why this question is important" },
              tips: { type: Type.STRING, description: "Advice on tone, timing, or body language" },
            },
            required: ["stepNumber", "question", "purpose", "tips"],
          },
        },
      }
    });
    
    // Parse JSON response
    const jsonStr = response.text || "[]";
    const steps = JSON.parse(jsonStr) as QuestionStep[];
    
    // Ensure we have exactly 4 steps for the UI logic
    return steps.slice(0, 4);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("AI 서비스 연결에 실패했습니다.");
  }
};