'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { FileCheck2, CheckCircle2, Award } from 'lucide-react';

export default function TeacherGradingPage() {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teacher/grading/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAttempts(data.attempts);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar role="teacher" teacherStatus="approved" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-2">
              <FileCheck2 className="w-4 h-4" />
              <span>التصحيح اليدوي للإجابات المقالية</span>
            </div>
            <h1 className="text-3xl font-black text-white">تصحيح إجابات الطلاب المقالية</h1>
            <p className="text-xs text-slate-400 mt-1">مراجعة إجابات الطلاب للأسئلة المقالية وإضافة الدرجات والملاحظات</p>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-20 text-xs text-slate-400">جاري التحميل...</p>
        ) : attempts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-2">
            <FileCheck2 className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-bold text-white text-base">لا توجد إجابات مقالية بانتظار التصحيح حالياً</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <div key={attempt.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{attempt.exam.title}</h4>
                    <p className="text-xs text-blue-400">الطالب: {attempt.student.name} ({attempt.student.email})</p>
                  </div>
                  <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
                    النتيجة الحالية: {attempt.score} / {attempt.totalMarks}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
