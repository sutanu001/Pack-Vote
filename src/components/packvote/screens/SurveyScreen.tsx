'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { GlassCard } from '@/components/packvote/shared/GlassCard';
import { cn } from '@/lib/utils';
import type { SurveyQuestion } from '@/lib/types';

export function SurveyScreen() {
  const { surveyQuestions, surveyResponses, setSurveyResponse, submitSurvey, navigate, goBack } = useAppStore();
  const [currentQ, setCurrentQ] = useState(0);
  const total = surveyQuestions.length;

  const question = surveyQuestions[currentQ];
  const currentAnswer = surveyResponses[question?.id];
  const canGoNext = question?.required
    ? currentAnswer !== undefined && currentAnswer !== '' &&
      !(Array.isArray(currentAnswer) && currentAnswer.length === 0)
    : true;

  const goNext = () => {
    if (currentQ < total - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      submitSurvey();
      navigate('trip-detail');
    }
  };

  const goPrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
    else goBack();
  };

  const handleSingleSelect = (value: string) => {
    setSurveyResponse(question.id, value);
  };

  const handleMultiToggle = (value: string) => {
    const current = (Array.isArray(currentAnswer) ? currentAnswer : []) as string[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setSurveyResponse(question.id, next);
  };

  if (!question) return null;

  return (
    <div className="screen-container animate-slide-up px-4 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={goPrev}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold flex-1">Travel Preferences</h1>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-1.5 bg-purple-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-purple rounded-full"
            animate={{ width: `${((currentQ + 1) / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs text-muted-foreground font-medium shrink-0">
          {currentQ + 1}/{total}
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <GlassCard className="mb-6">
            <p className="text-base font-semibold leading-relaxed">{question.question}</p>
            {question.required && (
              <span className="text-[10px] text-rose-400 font-medium mt-1 inline-block">* Required</span>
            )}
          </GlassCard>

          {/* Single Choice */}
          {question.type === 'single' && question.options && (
            <div className="space-y-2.5">
              {question.options.map((opt) => {
                const isSelected = currentAnswer === opt;
                return (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSingleSelect(opt)}
                    className={cn(
                      'w-full rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition-all border-2',
                      isSelected
                        ? 'gradient-purple text-white border-purple-500 shadow-lg shadow-purple-200'
                        : 'glass-card border-transparent text-foreground hover:border-purple-200'
                    )}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Multi Choice */}
          {question.type === 'multi' && question.options && (
            <div className="grid grid-cols-2 gap-2.5">
              {question.options.map((opt) => {
                const isChecked = Array.isArray(currentAnswer) && currentAnswer.includes(opt);
                return (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleMultiToggle(opt)}
                    className={cn(
                      'rounded-2xl px-3 py-3 text-left text-xs font-medium transition-all border-2 flex items-start gap-2',
                      isChecked
                        ? 'bg-purple-50 border-purple-300 text-purple-700'
                        : 'glass-card border-transparent text-foreground hover:border-purple-200'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                      isChecked ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                    )}>
                      {isChecked && (
                        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Slider */}
          {question.type === 'slider' && (
            <div className="py-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span>Not Important</span>
                <span className="text-purple-700 font-bold text-base">
                  {currentAnswer || (question.min ?? 1)}
                </span>
                <span>Very Important</span>
              </div>
              <Slider
                min={question.min ?? 1}
                max={question.max ?? 5}
                step={1}
                value={[Number(currentAnswer || question.min || 1)]}
                onValueChange={([v]) => setSurveyResponse(question.id, v)}
                className="py-2"
              />
              <div className="flex justify-between mt-2">
                {Array.from({ length: (question.max ?? 5) - (question.min ?? 1) + 1 }, (_, i) => {
                  const val = (question.min ?? 1) + i;
                  return (
                    <span key={val} className={cn(
                      'text-xs font-medium',
                      Number(currentAnswer || question.min) >= val ? 'text-purple-600' : 'text-gray-300'
                    )}>
                      {val}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Text */}
          {question.type === 'text' && (
            <Textarea
              placeholder="Share any specific requirements..."
              value={typeof currentAnswer === 'string' ? currentAnswer : ''}
              onChange={(e) => setSurveyResponse(question.id, e.target.value)}
              className="rounded-2xl min-h-[140px] bg-white border-purple-200 focus:border-purple-500 resize-none text-sm"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#f8f7ff] via-[#f8f7ff] to-transparent safe-bottom z-30">
        <div className="mx-auto max-w-md flex gap-3">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentQ === 0}
            className="h-12 rounded-full border-purple-200 w-12 p-0 shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            onClick={goNext}
            disabled={!canGoNext}
            className={cn(
              'flex-1 h-12 rounded-full font-semibold text-base transition-all',
              'gradient-purple text-white shadow-lg shadow-purple-300/30',
              'disabled:opacity-40 disabled:shadow-none'
            )}
          >
            {currentQ === total - 1 ? 'Submit Survey' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}