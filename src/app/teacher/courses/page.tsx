'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { BookOpen, Plus, Key, PlayCircle, Search, Eye, Trash2, CheckCircle2 } from 'lucide-react';

export default function TeacherCoursesListPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchCourses = () => {
    setLoading(true);
    fetch('/api/teacher/courses/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCourses(data.courses);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف كورس "${title}" بكافة دروسه وأكواده؟`)) return;
    try {
      const res = await fetch('/api/teacher/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(data.message);
        setTimeout(() => setToastMsg(null), 4000);
        fetchCourses();
      } else {
        alert(data.message || 'حدث خطأ أثناء الحذف');
      }
    } catch (err) {
      console.error(err);
      alert('خطأ في الاتصال بالخادم');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar role="teacher" teacherStatus="approved" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        {toastMsg && (
          <div className="fixed top-24 left-8 z-50 bg-emerald-600 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-2">
              <BookOpen className="w-4 h-4" />
              <span>دورة الكورسات الخاصة بك</span>
            </div>
            <h1 className="text-3xl font-black text-white">إدارة كورساتي المنشورة</h1>
            <p className="text-xs text-slate-400 mt-1">عرض الكورسات، إضافة محاضرات جديدة، وتوليد أكواد الوصول للطلاب</p>
          </div>

          <Link
            href="/teacher/courses/create"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء كورس جديد</span>
          </Link>
        </div>

        {loading ? (
          <p className="text-center py-20 text-xs text-slate-400">جاري تحميل كورساتك...</p>
        ) : courses.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-bold text-white text-base">لم تقم بإنشاء أي كورس بعد</p>
            <Link
              href="/teacher/courses/create"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg"
            >
              <Plus className="w-4 h-4" /> إنشئ أول كورس الآن
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-5 space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950">
                    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600'} alt={course.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 text-[10px] font-bold bg-slate-950/80 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg">
                      {course.subject}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-2">{course.title}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>{course.grade}</span>
                    <span className="font-bold text-white">{course.price === 0 ? 'مجاني' : `${course.price} ج.م`}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    href={`/teacher/access-codes?courseId=${course.id}`}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-1 shadow-md"
                  >
                    <Key className="w-3.5 h-3.5" /> توليد أكواد
                  </Link>

                  <a
                    href={`/courses/${course.id}`}
                    target="_blank"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2 px-3 rounded-xl transition-all"
                    title="معاينة الكورس والدروس"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleDeleteCourse(course.id, course.title)}
                    className="bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 text-rose-400 hover:text-white font-bold text-xs py-2 px-3 rounded-xl transition-all"
                    title="حذف الكورس بالكامل"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
