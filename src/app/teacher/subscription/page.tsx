import React from 'react';
import Sidebar from '@/components/Sidebar';
import { requireApprovedTeacher } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { CreditCard, CheckCircle2, Zap } from 'lucide-react';

export const revalidate = 0;

export default async function TeacherSubscriptionPage() {
  const user = await requireApprovedTeacher();

  const sub = await prisma.subscription.findFirst({
    where: { teacherId: user.teacherId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar role="teacher" teacherStatus="approved" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-2">
              <CreditCard className="w-4 h-4" />
              <span>اشتراك المدرس بالمنصة</span>
            </div>
            <h1 className="text-3xl font-black text-white">تفاصيل باقة اشتراكك في DARSLY</h1>
            <p className="text-xs text-slate-400 mt-1">متابعة حالة الباقة الشهرية وتواريخ التجديد</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Plan Card */}
          <div className="bg-gradient-to-tr from-blue-900/60 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                باقات منصة DARSLY
              </span>
              <Zap className="w-5 h-5 text-amber-400" />
            </div>

            <h3 className="text-2xl font-black text-white">الباقة المفعّلة: {sub?.plan || 'Pro'}</h3>
            <p className="text-xs text-slate-300">تتيح لك توليد حتى 10,000 كود وصول شهرياً ورفع محاضرات غير محدودة.</p>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>حالة الاشتراك:</span>
                <strong className="text-emerald-400 font-bold">{sub?.status || 'نشط'}</strong>
              </div>
              <div className="flex justify-between">
                <span>تاريخ التجديد القادم:</span>
                <strong className="text-white font-bold">
                  {sub?.renewalDate ? new Date(sub.renewalDate).toLocaleDateString('ar-EG') : '30 سبتمبر 2026'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
