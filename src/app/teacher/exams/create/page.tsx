'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { FileSpreadsheet, Plus, Trash2, CheckCircle2, HelpCircle } from 'lucide-react';

export default function TeacherCreateExamPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [passingScore, setPassingScore] = useState('50');

  const [questions, setQuestions] = useState<any[]>([
    {
      type: 'mcq',
      questionText: 'ما هي المشتقة الأولى للدالة ص = س²؟',
      imageUrl: '',
      marks: '2',
      optA: '2س',
      optB: 'س',
      optC: '2',
      optD: 'س²',
      correct: 'A',
      explanation: 'مشتقة س² هي 2س حسب قانون القوى.',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/teacher/courses/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.courses.length > 0) {
          setCourses(data.courses);
          setCourseId(data.courses[0].id);
        }
      });
  }, []);

  const addMcqQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: 'mcq',
        questionText: '',
        imageUrl: '',
        marks: '2',
        optA: '',
        optB: '',
        optC: '',
        optD: '',
        correct: 'A',
        explanation: '',
      },
    ]);
  };

  const addEssayQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: 'essay',
        questionText: '',
        imageUrl: '',
        marks: '5',
        explanation: '',
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, field: string, value: string) => {
    const updated = [...questions];
    updated[idx][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !title) {
      setError('يرجى كتابة عنوان الامتحان واختيار الكورس.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/teacher/exams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          title,
          durationMinutes,
          passingScore,
          questions,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      router.push('/teacher/exams');
    } catch (err) {
      setError('حدث خطأ أثناء حفظ الامتحان.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
      <Sidebar role="teacher" teacherStatus="approved" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-2">
            <Plus className="w-4 h-4" />
            <span>منشئ الامتحانات التفاعلي (MCQ & Essay)</span>
          </div>
          <h1 className="text-3xl font-black text-white">إنشاء امتحان جديد</h1>
          <p className="text-xs text-slate-400 mt-1">بناء امتحانات الاختيار من متعدد والأسئلة المقالية وتحديد الإجابة الصحيحة والتصحيح التلقائي</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Details */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">1. إعدادات الامتحان العامة</h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان الامتحان</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="اختبار منتصف الفصل - التفاضل والتكامل"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">اختر الكورس التابع له</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">مدة الامتحان (بالدقائق)</label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">درجة النجاح (%)</label>
                <input
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Questions Builder */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" /> 2. أسئلة الامتحان ({questions.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addMcqQuestion}
                  className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all"
                >
                  + سؤال اختيار من متعدد (MCQ)
                </button>
                <button
                  type="button"
                  onClick={addEssayQuestion}
                  className="bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all"
                >
                  + سؤال مقالي (Essay)
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-indigo-400">
                      سؤال #{idx + 1} ({q.type === 'mcq' ? 'اختيار من متعدد' : 'سؤال مقالي'})
                    </span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(idx)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-bold"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">نص السؤال</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="اكتب نص السؤال هنا..."
                      value={q.questionText}
                      onChange={(e) => updateQuestion(idx, 'questionText', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {/* MCQ Options */}
                  {q.type === 'mcq' && (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-bold text-slate-300">خيارات الإجابة والتصحيح التلقائي:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['A', 'B', 'C', 'D'].map((optKey) => (
                          <div key={optKey} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${idx}`}
                              checked={q.correct === optKey}
                              onChange={() => updateQuestion(idx, 'correct', optKey)}
                              className="accent-blue-600"
                            />
                            <span className="text-xs font-bold text-slate-400">{optKey}:</span>
                            <input
                              type="text"
                              required
                              placeholder={`الخيار ${optKey}`}
                              value={q[`opt${optKey}`] || ''}
                              onChange={(e) => updateQuestion(idx, `opt${optKey}`, e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-emerald-400">الإجابة الصحيحة المحددة: الاختيار ({q.correct})</p>
                    </div>
                  )}

                  {/* Explanation */}
                  <div>
                    <input
                      type="text"
                      placeholder="تفسير وشرح الإجابة (تظهر للطالب بعد التسليم)"
                      value={q.explanation || ''}
                      onChange={(e) => updateQuestion(idx, 'explanation', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <span>جاري الحفظ والإنشاء...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>حفظ ونشر الامتحان بنجاح</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
