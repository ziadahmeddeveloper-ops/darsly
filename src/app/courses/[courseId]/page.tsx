'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Lock, Unlock, PlayCircle, Key, CheckCircle2, ShieldCheck, ArrowLeft, Star, Gift, Trash2 } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Access Code Verification State
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCurrentUser(d.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!courseId) return;
    fetch(`/api/courses/details?id=${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCourse(data.course);
          setHasAccess(data.hasAccess);
        }
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleDeleteLesson = async (lessonId: string, lessonTitle: string) => {
    if (!confirm(`هل أنت متأكد من حذف فيديو/درس "${lessonTitle}"؟`)) return;
    try {
      const res = await fetch('/api/teacher/lessons', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      });
      const data = await res.json();
      if (data.success) {
        setCourse((prev: any) => ({
          ...prev,
          lessons: prev.lessons.filter((l: any) => l.id !== lessonId),
        }));
      } else {
        alert(data.message || 'حدث خطأ أثناء الحذف');
      }
    } catch {
      alert('خطأ في الاتصال بالخادم');
    }
  };

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCodeInput.trim()) return;

    setVerifying(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/access-codes/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: accessCodeInput,
          courseId: courseId,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.message);
        setVerifying(false);
        return;
      }

      setSuccessMsg(data.message);
      setHasAccess(true);
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      setErrorMsg('حدث خطأ أثناء التحقق من الكود.');
      setVerifying(false);
    }
  };

  if (loading) {
    return <div className="text-center py-32 text-slate-400 text-sm">جاري تحميل بيانات الكورس...</div>;
  }

  if (!course) {
    return <div className="text-center py-32 text-white font-bold">الكورس غير موجود.</div>;
  }

  const teacher = course.teacher.user;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Back Navigation */}
      <BackButton label="العودة لقائمة الكورسات" href="/courses" />

      {/* Top Course Header Banner */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-lg">
                {course.subject}
              </span>
              <span className="text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-lg">
                {course.grade}
              </span>
              {course.accessType === 'free' && (
                <span className="text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" /> مجاني بالكامل
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white leading-snug">{course.title}</h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">{course.description}</p>

            <div className="flex items-center gap-3 pt-2">
              <img
                src={teacher.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100'}
                alt={teacher.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <p className="text-xs font-bold text-white">{teacher.name}</p>
                <p className="text-[11px] text-blue-400">مدرس معتمد في DARSLY</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 p-6 rounded-2xl space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold">رسوم الاشتراك</span>
              <p className="text-3xl font-black text-white">
                {course.accessType === 'free' ? 'مجاني' : `${course.price} ج.م`}
              </p>
            </div>

            {hasAccess || course.accessType === 'free' ? (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl w-full justify-center">
                  <Unlock className="w-4 h-4" />
                  <span>الكورس مفتوح لك بالكامل</span>
                </div>
                {course.lessons.length > 0 && (
                  <Link
                    href={`/courses/${course.id}/lessons/${course.lessons[0].id}`}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <PlayCircle className="w-5 h-5" />
                    <span>ابدأ مشاهدة المحاضرات</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4 text-right">
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-300 space-y-1">
                  <p className="font-bold text-amber-400">تعليمات تفعيل الكورس:</p>
                  <p className="leading-relaxed">
                    للحصول على الكورس، قم بالدفع للمدرس بالطريقة التي يحددها المدرس، ثم أدخل كود الوصول الذي حصلت عليه.
                  </p>
                </div>

                {errorMsg && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-2.5 rounded-xl text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-xl text-xs font-semibold">
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleRedeemCode} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">أدخل كود الوصول (8 خانات)</label>
                    <input
                      type="text"
                      required
                      placeholder="A8K2-X91M"
                      value={accessCodeInput}
                      onChange={(e) => setAccessCodeInput(e.target.value.toUpperCase())}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-center font-mono text-base font-bold text-white focus:outline-none focus:border-blue-500 tracking-widest"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={verifying}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {verifying ? (
                      <span>جاري التحقق...</span>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        <span>فتح الكورس</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum Syllabus */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          جدول المحاضرات والدروس ({course.lessons.length})
        </h3>

        <div className="space-y-3">
          {course.lessons.map((lesson: any, index: number) => (
            <div
              key={lesson.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-black text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{lesson.title}</h4>
                  {lesson.description && <p className="text-xs text-slate-400">{lesson.description}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {(currentUser?.role === 'admin' || (currentUser?.role === 'teacher' && currentUser?.teacherProfile?.id === course.teacherId)) && (
                  <button
                    onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                    className="bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 text-rose-400 hover:text-white p-2 rounded-xl transition-all"
                    title="حذف هذا الدرس/الفيديو"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {hasAccess || course.accessType === 'free' || currentUser?.role === 'admin' || (currentUser?.role === 'teacher' && currentUser?.teacherProfile?.id === course.teacherId) ? (
                  <Link
                    href={`/courses/${course.id}/lessons/${lesson.id}`}
                    className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <PlayCircle className="w-4 h-4" /> مشاهدة
                  </Link>
                ) : (
                  <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                    <Lock className="w-3.5 h-3.5" /> مقفل بكود
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
