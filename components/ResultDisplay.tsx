import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Lightbulb, Target, Sparkles } from 'lucide-react';
import { QuestionResult } from '../types';

interface ResultDisplayProps {
  result: QuestionResult;
  stepIndex: number; // 0, 1, or 2
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, stepIndex }) => {
  const stepData = result.steps[stepIndex];

  if (!stepData) {
    return <div>결과를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          추천 질문 {stepIndex + 1}단계
        </h2>
        <p className="text-slate-500">
          {result.formData.situationType} 상황을 위한 맞춤형 가이드입니다.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
        {/* Main Question Card */}
        <div className="p-8 md:p-10 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-indigo-500/30 backdrop-blur-sm px-3 py-1 rounded-full text-indigo-100 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Step {stepIndex + 1}
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold leading-relaxed mb-4 font-serif">
              "{stepData.question}"
            </h3>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8 space-y-8">
          {/* Purpose */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">질문 목적</h4>
              <p className="text-slate-700 leading-relaxed text-lg">
                {stepData.purpose}
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Guide/Tips */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">실행 가이드</h4>
              <div className="text-slate-700 leading-relaxed prose prose-sm prose-slate max-w-none">
                <ReactMarkdown>{stepData.tips}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};