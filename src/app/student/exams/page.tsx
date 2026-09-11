import React from 'react';
import Sidebar from '@/components/Sidebar';
import { requireStudent } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { Award, CheckCircle2, XCircle } from 'lucide-react';

export const revalidate = 0;

export default async function StudentExamsPage() {
  const user = await requireStudent();

  const attempts = await prisma.examAttempt.findMany({
    where: { studentId: user.id },
    include: { exam: true },
    orderBy: { submittedAt: 'desc' },
  });

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar role="student" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-2">
            <Award className="w-4 h-4" />
            <span>سجل امتحاناتي ونتائجي</span>
          </div>
          <h1 className="text-3xl font-black text-white">النتائج والدرجات السابقة</h1>
        </div>

        {attempts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            لم تقم بأداء أي امتحان بعد.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attempts.map((attempt) => {
              const percentage = attempt.totalMarks > 0 ? Math.round((attempt.score / attempt.totalMarks) * 100) : 0;
              return (
                <div key={attempt.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">{attempt.exam.title}</h4>
                    <p className="text-xs text-slate-400">
                      التاريخ: {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleDateString('ar-EG') : ''}
                    </p>
                  </div>

                  <div className="text-left space-y-1">
                    <p className={`text-xl font-black ${attempt.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {percentage}%
                    </p>
                    <span className="text-[10px] text-slate-400 block">
                      {attempt.score} / {attempt.totalMarks} درجة
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
