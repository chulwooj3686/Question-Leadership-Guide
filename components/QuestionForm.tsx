import React from 'react';
import { FormData, SituationType } from '../types';
import { GENDER_OPTIONS, METRICS_CONFIG, SITUATION_TYPES } from '../constants';
import { MetricInput } from './MetricInput';
import { User, Users, Briefcase, MessageSquare } from 'lucide-react';

interface QuestionFormProps {
  formData: FormData;
  onChange: (data: FormData) => void;
  step: 1 | 2;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ formData, onChange, step }) => {
  const handleChange = (field: keyof FormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  if (step === 1) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">기본 정보 입력</h2>
          <p className="text-slate-500">사용자와 대상자의 정보를 입력해주세요.</p>
        </div>

        {/* Section 1: User Info */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-lg">사용자 정보 (나)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">회사명</label>
              <input
                type="text"
                value={formData.userCompany}
                onChange={(e) => handleChange('userCompany', e.target.value)}
                placeholder="예: ABC 테크"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">직책</label>
              <input
                type="text"
                value={formData.userPosition}
                onChange={(e) => handleChange('userPosition', e.target.value)}
                placeholder="예: 팀장"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">성별</label>
                <select
                  value={formData.userGender}
                  onChange={(e) => handleChange('userGender', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  {GENDER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">나이</label>
                <input
                  type="number"
                  value={formData.userAge}
                  onChange={(e) => handleChange('userAge', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="세"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Target Info */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-lg">대상자 정보 (상대방)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">직책</label>
              <input
                type="text"
                value={formData.targetPosition}
                onChange={(e) => handleChange('targetPosition', e.target.value)}
                placeholder="예: 팀원"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">성별</label>
                <select
                  value={formData.targetGender}
                  onChange={(e) => handleChange('targetGender', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  {GENDER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">나이</label>
                <input
                  type="number"
                  value={formData.targetAge}
                  onChange={(e) => handleChange('targetAge', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="세"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">관계 및 상황 진단</h2>
        <p className="text-slate-500">현재 상황과 관계 수준을 진단합니다.</p>
      </div>

      {/* Section 3: Relationship & Context Metrics */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-slate-800">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-lg">관계 진단 지표</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          <MetricInput
            config={METRICS_CONFIG.intimacy}
            value={formData.intimacy}
            onChange={(val) => handleChange('intimacy', val)}
          />
          <MetricInput
            config={METRICS_CONFIG.orgTrust}
            value={formData.orgTrust}
            onChange={(val) => handleChange('orgTrust', val)}
          />
          <MetricInput
            config={METRICS_CONFIG.fairnessSensitivity}
            value={formData.fairnessSensitivity}
            onChange={(val) => handleChange('fairnessSensitivity', val)}
          />
          <MetricInput
            config={METRICS_CONFIG.workAbility}
            value={formData.workAbility}
            onChange={(val) => handleChange('workAbility', val)}
          />
          <MetricInput
            config={METRICS_CONFIG.teamInfluence}
            value={formData.teamInfluence}
            onChange={(val) => handleChange('teamInfluence', val)}
          />
        </div>
      </section>

      {/* Section 4: Situation Type */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-slate-800">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-lg">상황 유형 선택</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SITUATION_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleChange('situationType', type)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 text-left ${
                formData.situationType === type
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};