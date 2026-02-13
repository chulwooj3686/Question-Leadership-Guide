import { QuestionResult } from "../types";

// 사용자가 제공한 Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwl4FnDFG0exwRI2CXkw_1lNMVt_aysb6eoOIhNOhf-bqb8hHDaQSaXtycUbTQn2k4O/exec"; 

export const saveToSpreadsheet = async (result: QuestionResult): Promise<boolean> => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
    console.warn("Google Script URL is not configured.");
    throw new Error("저장 설정이 완료되지 않았습니다. 관리자에게 문의하세요 (Web App URL Missing).");
  }

  try {
    // Google Apps Script Web App은 CORS 문제 회피를 위해 'no-cors' 모드를 사용하거나
    // text/plain으로 보내는 것이 안정적입니다.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", 
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        formData: result.formData,
        steps: result.steps
      }),
    });
    
    // mode: 'no-cors'를 사용하면 응답 내용을 읽을 수 없지만(opaque), 
    // 에러가 발생하지 않으면 전송 성공으로 간주합니다.
    return true;
  } catch (error) {
    console.error("Failed to save to spreadsheet", error);
    throw new Error("데이터베이스 저장에 실패했습니다.");
  }
};