'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Award, Clock, CheckCircle2, AlertCircle, HelpCircle, ArrowLeft, Send } from 'lucide-react';

export default function ExamExecutionPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, { option?: string; essayText?: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 mins default

  useEffect(() => {
    fetch(`/api/exams/details?id=${examId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExam(data.exam);
          setTimeLeft(data.exam.durationMinutes * 60);
        }
      })
      .finally(() => setLoading(false));
  }, [examId]);

  // Countdown timer
  useEffect(() => {
    if (!exam || result || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [exam, result, timeLeft]);

  const handleSelectOption = (questionId: string, optionKey: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        option: optionKey,
      },
    }));
  };

  const handleEssayChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        essayText: text,
      },
    }));
  };

  const handleSubmitExam = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId,
          answers,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-32 text-slate-400 text-sm">جاري تحميل الامتحان...</div>;
  if (!exam) return <div className="text-center py-32 text-white font-bold">الامتحان غير موجود.</div>;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Sticky Header with Timer */}
      <div className="sticky top-20 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-2xl">
        <div>
          <h1 className="text-lg font-bold text-white">{exam.title}</h1>
          <p className="text-xs text-blue-400">درجة النجاح المطلوبة: {exam.passingScore}%</p>
        </div>

        {!result && (
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 font-mono text-sm font-bold text-amber-400">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Result Card after Submission */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border ${
              result.passed
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}
          >
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">
              {result.passed ? 'مبروك! لقد اجتزت الامتحان بنجاح 🎓' : 'للأسف لم تتجاوز درجة النجاح المطلوب'}
            </h2>
            <p className="text-4xl font-black text-blue-400 mt-2">{result.percentage}%</p>
            <p className="text-xs text-slate-400">
              حصلت على {result.score} من إجمالي {result.totalMarks} درجة (الأسئلة المقالية في انتظار تصحيح المدرس).
            </p>
          </div>

          <button
            onClick={() => router.push('/student/dashboard')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
          >
            العودة إلى لوحة الطالب
          </button>
        </div>
      )}

      {/* Questions List */}
      {!result && (
        <div className="space-y-6">
          {exam.examQuestions.map((eq: any, index: number) => {
            const q = eq.question;
            const currentAns = answers[q.id] || {};

            return (
              <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg">
                    السؤال {index + 1} ({q.type === 'mcq' ? 'اختيار من متعدد' : 'سؤال مقالي'})
                  </span>
                  <span className="text-xs font-bold text-slate-400">{q.marks} درجات</span>
                </div>

                {/* Question Prompt */}
                <h3 className="text-base font-bold text-white leading-relaxed">{q.questionText}</h3>

                {/* Optional Image */}
                {q.imageUrl && (
                  <div className="max-w-md rounded-2xl overflow-hidden border border-slate-800">
                    <img src={q.imageUrl} alt="شكل السؤال" className="w-full object-cover" />
                  </div>
                )}

                {/* MCQ Choices */}
                {q.type === 'mcq' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {q.options.map((opt: any) => {
                      const isSelected = currentAns.option === opt.optionKey;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.optionKey)}
                          className={`p-3.5 rounded-2xl border text-right text-xs font-semibold transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-lg shadow-blue-500/10'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {opt.optionKey}
                          </span>
                          <div className="flex-1">
                            {opt.optionText && <div>{opt.optionText}</div>}
                            {opt.imageUrl && (
                              <img src={opt.imageUrl} alt={`خيار ${opt.optionKey}`} className="mt-1 max-h-32 rounded-lg object-contain border border-slate-800" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Essay Field */}
                {q.type === 'essay' && (
                  <div className="pt-2 space-y-2">
                    <textarea
                      rows={4}
                      placeholder="اكتب إجابتك المقالية بالتفصيل هنا..."
                      value={currentAns.essayText || ''}
                      onChange={(e) => handleEssayChange(q.id, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Action */}
          <button
            onClick={handleSubmitExam}
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {submitting ? (
              <span>جاري تسليم الامتحان والتصحيح التلقائي...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>تسليم الامتحان الآن</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
