'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import BackButton from '@/components/BackButton';
import { useRouter } from 'next/navigation';
import { BookOpen, Plus, Trash2, CheckCircle2, Video, Gift, DollarSign, Link2, Layers, FileSpreadsheet, Sparkles, Upload, UploadCloud } from 'lucide-react';

import QuickExamModal from '@/components/QuickExamModal';

interface ExamItem {
  id: string;
  title: string;
}

interface LessonPartInput {
  title: string;
  videoId: string;
  examId?: string;
}

interface LessonInput {
  title: string;
  description: string;
  videoId: string;
  isMultiPart: boolean;
  parts: LessonPartInput[];
}

export default function TeacherCreateCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('رياضيات');
  const [grade, setGrade] = useState('الصف الثالث الثانوي');
  const [accessType, setAccessType] = useState<'paid' | 'free'>('paid');
  const [price, setPrice] = useState('350');
  const [availableExams, setAvailableExams] = useState<ExamItem[]>([]);

  const [lessons, setLessons] = useState<LessonInput[]>([
    {
      title: 'المحاضرة الأولى: مقدمة واستعراض المنهج',
      description: '',
      videoId: '',
      isMultiPart: false,
      parts: [
        { title: 'الجزء الأول: شرح الدرس', videoId: '', examId: '' },
        { title: 'الجزء الثاني: التطبيقات والتمارين', videoId: '', examId: '' },
      ],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [uploadingVideoKey, setUploadingVideoKey] = useState<string | null>(null);
  const [quickExamTarget, setQuickExamTarget] = useState<{ lessonIdx: number; partIdx: number; title: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVideoFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (videoUrl: string) => void,
    uploadKey: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideoKey(uploadKey);
    setError(null);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload/video', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (result.success && result.videoUrl) {
        onSuccess(result.videoUrl);
      } else {
        setError(result.message || 'حدث خطأ أثناء رفع الفيديو');
      }
    } catch (err) {
      setError('فشل رفع ملف الفيديو من الجهاز.');
    } finally {
      setUploadingVideoKey(null);
    }
  };

  // Fetch teacher's published exams for linking to lesson parts
  useEffect(() => {
    fetch('/api/teacher/exams')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.exams) {
          setAvailableExams(data.exams);
        }
      })
      .catch(() => {});
  }, []);

  const addLessonField = () => {
    setLessons([
      ...lessons,
      {
        title: `المحاضرة ${lessons.length + 1}`,
        description: '',
        videoId: '',
        isMultiPart: false,
        parts: [
          { title: 'الجزء الأول: الشرح النظرية', videoId: '', examId: '' },
          { title: 'الجزء الثاني: تمارين وامتحان', videoId: '', examId: '' },
        ],
      },
    ]);
  };

  const removeLessonField = (idx: number) => {
    setLessons(lessons.filter((_, i) => i !== idx));
  };

  const updateLesson = (idx: number, field: keyof LessonInput, value: any) => {
    const updated = [...lessons];
    (updated[idx] as any)[field] = value;
    setLessons(updated);
  };

  const addPartField = (lessonIdx: number) => {
    const updated = [...lessons];
    updated[lessonIdx].parts.push({
      title: `الجزء ${updated[lessonIdx].parts.length + 1}`,
      videoId: '',
      examId: '',
    });
    setLessons(updated);
  };

  const removePartField = (lessonIdx: number, partIdx: number) => {
    const updated = [...lessons];
    updated[lessonIdx].parts = updated[lessonIdx].parts.filter((_, i) => i !== partIdx);
    setLessons(updated);
  };

  const updatePartField = (lessonIdx: number, partIdx: number, field: keyof LessonPartInput, value: string) => {
    const updated = [...lessons];
    (updated[lessonIdx].parts[partIdx] as any)[field] = value;
    setLessons(updated);
  };

  const handleAccessTypeChange = (type: 'paid' | 'free') => {
    setAccessType(type);
    if (type === 'free') setPrice('0');
    else if (price === '0') setPrice('350');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format lessons for API
      const formattedLessons = lessons.map((l) => {
        if (l.isMultiPart && l.parts.length > 0) {
          return {
            title: l.title,
            description: l.description,
            videoId: l.parts[0].videoId || '',
            parts: l.parts,
          };
        }
        return {
          title: l.title,
          description: l.description,
          videoId: l.videoId,
          parts: [],
        };
      });

      const res = await fetch('/api/teacher/courses/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          subject,
          grade,
          price: accessType === 'free' ? 0 : parseFloat(price) || 0,
          accessType,
          lessons: formattedLessons,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      router.push('/teacher/courses');
    } catch (err) {
      setError('حدث خطأ أثناء حفظ الكورس.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar role="teacher" teacherStatus="approved" />

      <main className="flex-1 p-6 sm:p-10 space-y-6 max-w-4xl mx-auto">
        <BackButton label="العودة لكورساتي" href="/teacher/courses" />

        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-2">
            <Plus className="w-4 h-4" />
            <span>منشئ الكورسات والحصص المقسمة</span>
          </div>
          <h1 className="text-3xl font-black text-white">إنشاء كورس وحصص متعددة الأجزاء</h1>
          <p className="text-xs text-slate-400 mt-1">يمكنك تقسيم كل حصة لعدة أجزاء فيديو وإلحاق امتحان يظهر للطالب بعد كل جزء</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ===== Section 1: Basic Info ===== */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              1. البيانات الأساسية للكورس
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان الكورس</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="كورس التفاضل والتكامل الشامل - 2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">الوصف والملخص</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="شرح كامل للمنهج وحل مئات الأسئلة والنماذج..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">المادة الدراسية</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <optgroup label="المواد العلمية">
                    <option value="رياضيات">رياضيات</option>
                    <option value="علوم">علوم</option>
                    <option value="فيزياء">فيزياء</option>
                    <option value="كيمياء">كيمياء</option>
                    <option value="أحياء">أحياء</option>
                    <option value="جيولوجيا">جيولوجيا</option>
                  </optgroup>
                  <optgroup label="اللغات والإنسانيات">
                    <option value="لغة عربية">لغة عربية</option>
                    <option value="لغة إنجليزية">لغة إنجليزية</option>
                    <option value="لغة فرنسية">لغة فرنسية</option>
                    <option value="دراسات اجتماعية">دراسات اجتماعية</option>
                    <option value="تاريخ">تاريخ</option>
                    <option value="جغرافيا">جغرافيا</option>
                    <option value="فلسفة ومنطق">فلسفة ومنطق</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الصف / المرحلة الدراسية</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <optgroup label="ثانوي">
                    <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                    <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                    <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                  </optgroup>
                  <optgroup label="إعدادي">
                    <option value="الصف الثالث الإعدادي">الصف الثالث الإعدادي</option>
                    <option value="الصف الثاني الإعدادي">الصف الثاني الإعدادي</option>
                    <option value="الصف الأول الإعدادي">الصف الأول الإعدادي</option>
                  </optgroup>
                  <optgroup label="ابتدائي">
                    <option value="الصف السادس الابتدائي">الصف السادس الابتدائي</option>
                    <option value="الصف الخامس الابتدائي">الصف الخامس الابتدائي</option>
                    <option value="الصف الرابع الابتدائي">الصف الرابع الابتدائي</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* ===== Section 2: Pricing ===== */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              2. نوع الكورس والسعر
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleAccessTypeChange('free')}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-right transition-all ${
                  accessType === 'free'
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-700 bg-slate-950 hover:border-slate-600'
                }`}
              >
                <Gift className={`w-6 h-6 shrink-0 ${accessType === 'free' ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <p className={`text-sm font-bold ${accessType === 'free' ? 'text-emerald-400' : 'text-slate-300'}`}>مجاني تماماً</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">مشاهدة مباشرة بدون كود</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleAccessTypeChange('paid')}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-right transition-all ${
                  accessType === 'paid'
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                    : 'border-slate-700 bg-slate-950 hover:border-slate-600'
                }`}
              >
                <DollarSign className={`w-6 h-6 shrink-0 ${accessType === 'paid' ? 'text-blue-400' : 'text-slate-500'}`} />
                <div>
                  <p className={`text-sm font-bold ${accessType === 'paid' ? 'text-blue-400' : 'text-slate-300'}`}>مدفوع بكود وصول</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">يفتح بكود تولّده أنت</p>
                </div>
              </button>
            </div>

            {accessType === 'paid' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">السعر (جنيه مصري)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="350"
                  />
                  <span className="absolute left-4 top-2.5 text-xs text-slate-500 font-bold">ج.م</span>
                </div>
              </div>
            )}
          </div>

          {/* ===== Section 3: Lessons & Parts ===== */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-400" /> 3. الحصص والمحاضرات ({lessons.length})
              </h3>
              <button
                type="button"
                onClick={addLessonField}
                className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all"
              >
                + إضافة حصة جديدة
              </button>
            </div>

            <div className="space-y-6">
              {lessons.map((lesson, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sm font-black text-blue-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" /> حصة #{idx + 1}
                    </span>
                    {lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLessonField(idx)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> حذف الحصة
                      </button>
                    )}
                  </div>

                  {/* Lesson Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">عنوان الحصة الرئيسي</label>
                    <input
                      type="text"
                      placeholder="مثال: الحصة 1 - الشرح والتمارين المتكاملة"
                      value={lesson.title}
                      onChange={(e) => updateLesson(idx, 'title', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Toggle Single vs Multi Part */}
                  <div className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <div>
                        <p className="text-xs font-bold text-white">تقسيم الحصة إلى كذا جزء (فيديوهات + امتحانات)</p>
                        <p className="text-[10px] text-slate-400">إضافة أجزاء فيديو يتبع كل جزء منها امتحان اختياري</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateLesson(idx, 'isMultiPart', !lesson.isMultiPart)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        lesson.isMultiPart
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lesson.isMultiPart ? 'مفعل (أجزاء متتابعة)' : 'فيديو واحد مباشر'}
                    </button>
                  </div>

                  {/* Single Video Mode */}
                  {!lesson.isMultiPart ? (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300">مصدر الفيديو (رابط YouTube أو رفع ملف من جهازك)</label>
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <div className="relative flex-1 w-full">
                          <Link2 className="w-3.5 h-3.5 text-slate-500 absolute right-3.5 top-3" />
                          <input
                            type="text"
                            placeholder="https://youtu.be/... أو مسار الفيديو"
                            value={lesson.videoId}
                            onChange={(e) => updateLesson(idx, 'videoId', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center hover:scale-105">
                          <Upload className="w-4 h-4" />
                          <span>{uploadingVideoKey === `lesson-${idx}` ? 'جاري رفع الفيديو...' : 'رفع فيديو من الجهاز 📁'}</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => handleVideoFileUpload(e, (url) => updateLesson(idx, 'videoId', url), `lesson-${idx}`)}
                            disabled={uploadingVideoKey === `lesson-${idx}`}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    /* Multi-Part Mode */
                    <div className="space-y-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-indigo-400">أجزاء هذه الحصة ({lesson.parts.length} أجزاء)</span>
                        <button
                          type="button"
                          onClick={() => addPartField(idx)}
                          className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold px-3 py-1 rounded-xl transition-all"
                        >
                          + جزء جديد
                        </button>
                      </div>

                      <div className="space-y-4">
                        {lesson.parts.map((part, pIdx) => (
                          <div key={pIdx} className="bg-slate-950 border border-indigo-500/20 p-4 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Video className="w-3.5 h-3.5 text-indigo-400" />
                                الجزء {pIdx + 1}
                              </span>

                              {lesson.parts.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removePartField(idx, pIdx)}
                                  className="text-rose-400 text-xs font-bold hover:underline"
                                >
                                  حذف الجزء
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] text-slate-400 mb-1">اسم الجزء</label>
                                <input
                                  type="text"
                                  placeholder="مثلاً: الجزء 1 - شرح النظرية"
                                  value={part.title}
                                  onChange={(e) => updatePartField(idx, pIdx, 'title', e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] text-slate-400 mb-1">مصدر الفيديو (YouTube أو رفع من جهازك)</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="https://youtu.be/... أو مسار فيديو محلي"
                                    value={part.videoId}
                                    onChange={(e) => updatePartField(idx, pIdx, 'videoId', e.target.value)}
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono min-w-0"
                                  />
                                  <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>{uploadingVideoKey === `part-${idx}-${pIdx}` ? 'جاري الرفع...' : 'رفع فيديو 📁'}</span>
                                    <input
                                      type="file"
                                      accept="video/*"
                                      className="hidden"
                                      onChange={(e) => handleVideoFileUpload(e, (url) => updatePartField(idx, pIdx, 'videoId', url), `part-${idx}-${pIdx}`)}
                                      disabled={uploadingVideoKey === `part-${idx}-${pIdx}`}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Optional Exam after Part */}
                            <div className="pt-2 border-t border-slate-800/80 space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="block text-[11px] font-bold text-amber-400 flex items-center gap-1">
                                  <FileSpreadsheet className="w-3.5 h-3.5" />
                                  امتحان تقييمي يظهر للطالب فور انتهاء هذا الجزء (اختياري)
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setQuickExamTarget({ lessonIdx: idx, partIdx: pIdx, title: part.title || `الجزء ${pIdx + 1}` })}
                                  className="text-[11px] font-black text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded-xl border border-amber-500/30 transition-all flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>إنشاء وتصميم امتحان لهذا الجزء مباشرة 📝</span>
                                </button>
                              </div>

                              <select
                                value={part.examId || ''}
                                onChange={(e) => updatePartField(idx, pIdx, 'examId', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                              >
                                <option value="">بدون امتحان بعد هذا الجزء</option>
                                {availableExams.map((exam) => (
                                  <option key={exam.id} value={exam.id}>
                                    📝 {exam.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <span className="animate-pulse">جاري الحفظ والنشر...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>حفظ ونشر الكورس بالحصص والأجزاء</span>
              </>
            )}
          </button>
        </form>
      </main>

      {/* Quick Exam Builder Modal */}
      {quickExamTarget && (
        <QuickExamModal
          isOpen={true}
          partTitle={quickExamTarget.title}
          subject={subject}
          grade={grade}
          onClose={() => setQuickExamTarget(null)}
          onSaveExam={(newExamId, newExamTitle) => {
            setAvailableExams((prev) => [...prev, { id: newExamId, title: newExamTitle }]);
            updatePartField(quickExamTarget.lessonIdx, quickExamTarget.partIdx, 'examId', newExamId);
          }}
        />
      )}
    </div>
  );
}
