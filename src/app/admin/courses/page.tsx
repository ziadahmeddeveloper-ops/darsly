'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { BookOpen, Search, Trash2, CheckCircle2, ShieldAlert, Eye, Lock, Unlock } from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف الكورس "${title}" بالكامل؟`)) return;
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(data.message);
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.title.includes(search) ||
      c.subject.includes(search) ||
      c.teacher.user.name.includes(search)
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
      <Sidebar role="admin" />

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
              <span>الإشراف العام على الكورسات</span>
            </div>
            <h1 className="text-3xl font-black text-white">إدارة الكورسات بالمنصة</h1>
            <p className="text-xs text-slate-400 mt-1">عرض ومراقبة وحذف جميع الكورسات والدورات التعليمية المنشورة</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
            <input
              type="text"
              placeholder="ابحث باسم الكورس أو المدرس..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center py-20 text-xs text-slate-400">جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-2">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-bold text-white text-base">لا توجد كورسات مطابقة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-5 space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950">
                    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600'} alt={course.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 text-[10px] font-bold bg-slate-950/80 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg">
                      {course.subject}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-blue-400 font-medium">المدرس: {course.teacher.user.name}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>{course.grade}</span>
                    <span className="font-bold text-white">{course.price === 0 ? 'مجاني' : `${course.price} ج.م`}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={`/courses/${course.id}`}
                    target="_blank"
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> معااينة
                  </a>
                  <button
                    onClick={() => handleDelete(course.id, course.title)}
                    className="bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 text-rose-400 hover:text-white font-bold text-xs py-2 px-3 rounded-xl transition-all"
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
