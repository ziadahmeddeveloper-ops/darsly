'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Trash2, CheckCircle2, Upload, X, HelpCircle, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

interface QuickQuestionInput {
  questionText: string;
  imageUrl: string;
  type: 'mcq' | 'essay';
  optA: string;
  optAImage: string;
  optB: string;
  optBImage: string;
  optC: string;
  optCImage: string;
  optD: string;
  optDImage: string;
  correct: 'A' | 'B' | 'C' | 'D';
}

interface QuickExamModalProps {
  isOpen: boolean;
  partTitle: string;
  subject?: string;
  grade?: string;
  onClose: () => void;
  onSaveExam: (examId: string, examTitle: string) => void;
}

export default function QuickExamModal({
  isOpen,
  partTitle,
  subject = 'عام',
  grade = 'عام',
  onClose,
  onSaveExam,
}: QuickExamModalProps) {
  const [examTitle, setExamTitle] = useState(`امتحان تقييمي: ${partTitle || 'الجزء'}`);
  const [durationMinutes, setDurationMinutes] = useState('15');
  const [passingScore, setPassingScore] = useState('50');

  const [questions, setQuestions] = useState<QuickQuestionInput[]>([
    {
      questionText: '',
      imageUrl: '',
      type: 'mcq',
      optA: '',
      optAImage: '',
      optB: '',
      optBImage: '',
      optC: '',
      optCImage: '',
      optD: '',
      optDImage: '',
      correct: 'A',
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        imageUrl: '',
        type: 'mcq',
        optA: '',
        optAImage: '',
        optB: '',
        optBImage: '',
        optC: '',
        optCImage: '',
        optD: '',
        optDImage: '',
        correct: 'A',
      },
    ]);
  };

  const removeQuestion = (qIdx: number) => {
    setQuestions(questions.filter((_, i) => i !== qIdx));
  };

  const updateQuestion = (qIdx: number, field: keyof QuickQuestionInput, value: any) => {
    const updated = [...questions];
    (updated[qIdx] as any)[field] = value;
    setQuestions(updated);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
    key: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKey(key);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('type', 'questions');

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (result.success && result.imageUrl) {
        onSuccess(result.imageUrl);
      } else {
        setError(result.message || 'حدث خطأ في رفع الصورة.');
      }
    } catch {
      setError('فشل رفع الصورة من الجهاز.');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/teacher/exams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: examTitle,
          durationMinutes: parseInt(durationMinutes) || 15,
          passingScore: parseInt(passingScore) || 50,
          subject,
          grade,
          questions,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'حدث خطأ أثناء حفظ الامتحان');
        setSaving(false);
        return;
      }

      onSaveExam(data.examId, examTitle);
      onClose();
    } catch (err) {
      setError('فشل حفظ الامتحان التقييمي.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto dir-rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">منشئ الامتحان التقييمي لـ ({partTitle})</h2>
              <p className="text-xs text-slate-400 mt-0.5">يمكنك كتابة الأسئلة يدوياً أو رفعها كصور وإضافة الخيارات نصاً أو كصور</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exam Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-300 mb-1">اسم/عنوان الامتحان</label>
              <input
                type="text"
                required
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">المدة بالدقائق</label>
              <input
                type="number"
                min="1"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">درجة النجاح (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Questions Builder */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                أسئلة الامتحان ({questions.length})
              </span>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all"
              >
                + إضافة سؤال جديد
              </button>
            </div>

            <div className="space-y-6 max-h-[450px] overflow-y-auto pr-1">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-slate-950 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-xl">
                  {/* Header Question Row */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="text-xs font-bold text-amber-400">سؤال #{qIdx + 1}</span>

                    <div className="flex items-center gap-3">
                      {/* MCQ vs Essay Toggle */}
                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => updateQuestion(qIdx, 'type', 'mcq')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            q.type === 'mcq' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          اختيار من متعدد
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQuestion(qIdx, 'type', 'essay')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            q.type === 'essay' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          سؤال مقالي
                        </button>
                      </div>

                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIdx)}
                          className="text-rose-400 text-xs font-bold hover:underline"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Text & Question Image Upload */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">نص السؤال (يدوياً)</label>
                      <input
                        type="text"
                        placeholder="أدخل عنوان أو صيغة السؤال..."
                        value={q.questionText}
                        onChange={(e) => updateQuestion(qIdx, 'questionText', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>

                    {/* Question Image Input/Upload */}
                    <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1 w-full">
                        <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="أو أدخل رابط صورة السؤال..."
                          value={q.imageUrl}
                          onChange={(e) => updateQuestion(qIdx, 'imageUrl', e.target.value)}
                          className="bg-transparent text-xs text-white font-mono flex-1 outline-none"
                        />
                      </div>

                      <label className="cursor-pointer bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 border border-emerald-500/30">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingKey === `q-img-${qIdx}` ? 'جاري الرفع...' : 'رفع صورة السؤال 🖼️'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, (url) => updateQuestion(qIdx, 'imageUrl', url), `q-img-${qIdx}`)}
                          disabled={uploadingKey === `q-img-${qIdx}`}
                        />
                      </label>
                    </div>

                    {q.imageUrl && (
                      <div className="max-w-xs rounded-xl overflow-hidden border border-slate-800 bg-black">
                        <img src={q.imageUrl} alt="معاينة صورة السؤال" className="w-full max-h-32 object-contain" />
                      </div>
                    )}
                  </div>

                  {/* MCQ Options with Image and Text Support */}
                  {q.type === 'mcq' && (
                    <div className="space-y-3 pt-2 border-t border-slate-800/80">
                      <label className="block text-xs font-bold text-slate-300">الخيارات الأربعة (حدد الإجابة الصحيحة):</label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(['A', 'B', 'C', 'D'] as const).map((key) => {
                          const textKey = `opt${key}` as keyof QuickQuestionInput;
                          const imgKey = `opt${key}Image` as keyof QuickQuestionInput;
                          const isCorrect = q.correct === key;

                          return (
                            <div
                              key={key}
                              className={`p-3 rounded-2xl border space-y-2 transition-all ${
                                isCorrect
                                  ? 'bg-emerald-500/10 border-emerald-500/50'
                                  : 'bg-slate-900 border-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-white bg-slate-800 px-2 py-0.5 rounded-lg">
                                  خيار ({key})
                                </span>

                                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-emerald-400">
                                  <input
                                    type="radio"
                                    name={`correct-${qIdx}`}
                                    checked={isCorrect}
                                    onChange={() => updateQuestion(qIdx, 'correct', key)}
                                    className="accent-emerald-500"
                                  />
                                  <span>الإجابة الصحيحة</span>
                                </label>
                              </div>

                              <input
                                type="text"
                                placeholder={`نص خيار (${key}) يدوياً`}
                                value={q[textKey] as string}
                                onChange={(e) => updateQuestion(qIdx, textKey, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                              />

                              <div className="flex items-center justify-between gap-2 pt-1">
                                <input
                                  type="text"
                                  placeholder="رابط صورة الخيار"
                                  value={q[imgKey] as string}
                                  onChange={(e) => updateQuestion(qIdx, imgKey, e.target.value)}
                                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-[11px] text-white font-mono flex-1 min-w-0"
                                />

                                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 shrink-0">
                                  <Upload className="w-3 h-3 text-emerald-400" />
                                  <span>{uploadingKey === `opt-${key}-${qIdx}` ? 'جاري الرفع' : 'رفع صورة 🖼️'}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e, (url) => updateQuestion(qIdx, imgKey, url), `opt-${key}-${qIdx}`)}
                                    disabled={uploadingKey === `opt-${key}-${qIdx}`}
                                  />
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-5 py-3 rounded-2xl transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-7 py-3.5 rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'جاري الحفظ والربط...' : 'حفظ الامتحان وربطه بهذا الجزء ⚡'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
