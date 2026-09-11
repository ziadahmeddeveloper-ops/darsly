'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { HelpCircle, Search, Plus, CheckCircle2 } from 'lucide-react';

export default function TeacherQuestionsBankPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teacher/questions/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setQuestions(data.questions);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar role="teacher" teacherStatus="approved" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>مخزن الأسئلة التراكمي</span>
            </div>
            <h1 className="text-3xl font-black text-white">بنك الأسئلة (Question Bank)</h1>
            <p className="text-xs text-slate-400 mt-1">تصفح وإضافة أسئلة الاختيار من متعدد والأسئلة المقالية لإدراجها في الامتحانات</p>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-20 text-xs text-slate-400">جاري تحميل بنك الأسئلة...</p>
        ) : questions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-2">
            <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-bold text-white text-base">لا توجد أسئلة مسجلة في بنك الأسئلة حالياً</p>
            <p className="text-xs">الأسئلة التي تنشئها في الامتحانات تظهر هنا تلقائياً.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-purple-400">
                    سؤال #{idx + 1} ({q.type === 'mcq' ? 'اختيار من متعدد' : 'مقالي'}) • {q.subject}
                  </span>
                  <span className="text-xs text-slate-400">{q.marks} درجات</span>
                </div>
                <h4 className="text-sm font-bold text-white leading-relaxed">{q.questionText}</h4>
                {q.explanation && <p className="text-xs text-slate-400">التفسير: {q.explanation}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
