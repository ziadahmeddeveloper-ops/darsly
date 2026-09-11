'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { FileSpreadsheet, Plus, CheckCircle2, Clock, Award } from 'lucide-react';

export default function TeacherExamsListPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teacher/exams/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExams(data.exams);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
      <Sidebar role="teacher" teacherStatus="approved" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-2">
              <FileSpreadsheet className="w-4 h-4" />
              <span>منشئ ومراقب الامتحانات الإلكترونية</span>
            </div>
            <h1 className="text-3xl font-black text-white">إدارة الامتحانات والأنشطة</h1>
            <p className="text-xs text-slate-400 mt-1">إنشاء امتحانات MCQ ومقالية وتتبع إحصائيات ودرجات الطلاب</p>
          </div>

          <Link
            href="/teacher/exams/create"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء امتحان جديد</span>
          </Link>
        </div>

        {loading ? (
          <p className="text-center py-20 text-xs text-slate-400">جاري تحميل الامتحانات...</p>
        ) : exams.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-4">
            <FileSpreadsheet className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-bold text-white text-base">لم تقم بإنشاء أي امتحان بعد</p>
            <Link
              href="/teacher/exams/create"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg"
            >
              <Plus className="w-4 h-4" /> أنشئ أول امتحان الآن
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
                      {exam.questionMode === 'mcq' ? 'اختيار من متعدد' : 'سؤال مقالي ومختلط'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{exam.durationMinutes} دقيقة</span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{exam.title}</h3>
                  <p className="text-xs text-blue-400 font-medium">الكورس: {exam.course.title}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>درجة النجاح: <strong className="text-white">{exam.passingScore}%</strong></span>
                  <a
                    href={`/exams/${exam.id}`}
                    target="_blank"
                    className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white font-bold px-3 py-1.5 rounded-xl transition-all"
                  >
                    معاينة وتجربة
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
