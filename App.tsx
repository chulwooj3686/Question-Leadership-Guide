import React, { useState } from 'react';
import { INITIAL_FORM_DATA } from './constants';
import { FormData, QuestionResult } from './types';
import { QuestionForm } from './components/QuestionForm';
import { ResultDisplay } from './components/ResultDisplay';
import { generateQuestions } from './services/geminiService';
import { saveToSpreadsheet } from './services/sheetService';
import { Sparkles, ChevronRight, ChevronLeft, RefreshCcw, Loader2, Save, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [result, setResult] = useState<QuestionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Steps: 
  // 1: User & Target Info
  // 2: Metrics & Situation
  // 3: Result Step 1
  // 4: Result Step 2
  // 5: Result Step 3
  // 6: Result Step 4
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.userCompany || !formData.userPosition || !formData.targetPosition) {
        setError("필수 정보를 모두 입력해주세요.");
        return;
      }
      setError(null);
      setCurrentStep(2);
    } else if (currentStep >= 3 && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const steps = await generateQuestions(formData);
      
      const newResult: QuestionResult = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        formData: { ...formData },
        steps: steps,
      };
      
      setResult(newResult);
      setCurrentStep(3); // Move to first result step
      setIsSaved(false); // Reset saved state for new result
    } catch (err: any) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    
    setIsSaving(true);
    setSaveError(null);
    try {
      await saveToSpreadsheet(result);
      setIsSaved(true);
    } catch (err: any) {
      setSaveError(err.message || "저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setResult(null);
    setCurrentStep(1);
    setError(null);
    setSaveError(null);
    setIsSaved(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-full shadow-lg mb-8">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">AI가 질문을 분석중입니다</h3>
          <p className="text-slate-500 text-center max-w-sm">
            상황에 최적화된 리더십 질문을 생성하고 있습니다.<br/>잠시만 기다려주세요...
          </p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return <QuestionForm formData={formData} onChange={setFormData} step={1} />;
      case 2:
        return <QuestionForm formData={formData} onChange={setFormData} step={2} />;
      case 3:
      case 4:
      case 5:
      case 6:
        return result ? <ResultDisplay result={result} stepIndex={currentStep - 3} /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={handleReset} role="button">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">Question Leadership</span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
             {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
               <div 
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  step === currentStep ? 'bg-indigo-600 w-4' : 
                  step < currentStep ? 'bg-indigo-300' : 'bg-slate-300'
                }`} 
               />
             ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12 pb-24">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 animate-in slide-in-from-top-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}
        
        {saveError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 animate-in slide-in-from-top-2">
             <span className="font-bold">Save Error:</span> {saveError}
          </div>
        )}

        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
          
          <button
            onClick={currentStep === 1 ? handleReset : handlePrevStep}
            disabled={isLoading || isSaving}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
              currentStep === 1 
                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' 
                : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200'
            }`}
          >
            {currentStep === 1 ? (
              <><RefreshCcw className="w-4 h-4" /> 초기화</>
            ) : (
              <><ChevronLeft className="w-4 h-4" /> 이전</>
            )}
          </button>

          {currentStep === 1 && (
            <button
              onClick={handleNextStep}
              className="flex-1 max-w-xs bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2"
            >
              다음 단계 <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {currentStep === 2 && (
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex-1 max-w-xs bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              {isLoading ? (
                <>분석 중...</>
              ) : (
                <>AI 질문 생성하기 <Sparkles className="w-4 h-4" /></>
              )}
            </button>
          )}

          {currentStep >= 3 && currentStep < totalSteps && (
            <button
              onClick={handleNextStep}
              className="flex-1 max-w-xs bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2"
            >
              다음 질문 보기 <ChevronRight className="w-5 h-5" />
            </button>
          )}
          
          {currentStep === totalSteps && (
             <div className="flex gap-2 flex-1 max-w-sm">
                <button
                  onClick={handleSave}
                  disabled={isSaving || isSaved}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2 ${
                    isSaved 
                      ? 'bg-green-600 text-white cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                  } disabled:opacity-70`}
                >
                   {isSaving ? (
                     <Loader2 className="w-4 h-4 animate-spin" />
                   ) : isSaved ? (
                     <><CheckCircle2 className="w-4 h-4" /> 저장됨</>
                   ) : (
                     <><Save className="w-4 h-4" /> DB 저장</>
                   )}
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center"
                  title="새로 시작하기"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
             </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default App;