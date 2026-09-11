import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Clock, ShieldAlert, CheckCircle2, LogOut, PhoneCall } from 'lucide-react';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function TeacherPendingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Double check DB status in real-time
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { teacherProfile: true },
  });

  if (!dbUser) {
    redirect('/login');
  }

  // If approved, automatically redirect to Teacher Dashboard
  if (dbUser.role === 'teacher' && dbUser.status === 'approved') {
    redirect('/teacher/dashboard');
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 text-center relative overflow-hidden">
        {/* Glowing aura background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Status Badge */}
        <div className="space-y-4 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
            <Clock className="w-10 h-10 text-amber-400 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>الحالة: PENDING APPROVAL (قيد المراجعة)</span>
          </div>
        </div>

        {/* Exact Prompts Required for Pending Teacher Activation */}
        <div className="space-y-4 relative z-10">
          <h1 className="text-3xl font-black text-white">طلبك قيد المراجعة والانتظار</h1>
          <h2 className="text-lg font-bold text-amber-300">تم استلام طلب إنشاء حساب مدرس جديد بنجاح.</h2>
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-amber-200 text-xs leading-relaxed max-w-lg mx-auto space-y-2">
            <p className="font-black text-amber-400 text-sm">⚠️ خطوة هامة جداً لتفعيل حسابك:</p>
            <p>
              سيتم مراجعة بياناتك من إدارة منصة **DARSLY** قبل تفعيل حسابك. للتفعيل الفوري ودخول لوحة التحكم بدون انتظار، يرجى التواصل مباشرة مع الإدارة عبر الواتساب على الرقم: <strong className="text-white font-mono" dir="ltr">01097188298</strong>.
            </p>
          </div>
        </div>

        {/* Details Summary Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-right space-y-3 text-xs relative z-10">
          <h4 className="font-bold text-slate-300 border-b border-slate-800 pb-2">تفاصيل حساب المدرس المُقدم:</h4>
          <div className="grid grid-cols-2 gap-2 text-slate-400">
            <div>الاسم: <strong className="text-white">{dbUser.name}</strong></div>
            <div>البريد: <strong className="text-white">{dbUser.email}</strong></div>
            <div>الهاتف: <strong className="text-white">{dbUser.phone || '01097188298'}</strong></div>
            <div>تاريخ التسجيل: <strong className="text-white">{new Date(dbUser.createdAt).toLocaleDateString('ar-EG')}</strong></div>
          </div>
        </div>

        {/* Info Alert Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2 text-right">
          <p className="flex items-center gap-2 font-bold text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ماذا ينبغي أن تفعل الآن لتفعيل الحساب؟
          </p>
          <p className="leading-relaxed">
            اضغط على زر التواصل عبر الواتساب بالأسفل لإرسال بيانتك للإدارة، وسيتم اعتماد حسابك وتحويلك فوراً للوحة التحكم.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <a
            href={`https://wa.me/201097188298?text=${encodeURIComponent(`أهلاً إدارة منصة Darsly، أرغب في تفعيل حساب المدرس الخاص بي:\nالاسم: ${dbUser.name}\nالبريد: ${dbUser.email}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/30 hover:scale-[1.03] active:scale-[0.98]"
          >
            <PhoneCall className="w-5 h-5 animate-bounce" />
            <span>تواصل فوراً مع الإدارة لتفعيل الحساب (واتساب)</span>
          </a>

          <form action="/api/auth/logout" method="POST" className="w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm px-6 py-4 rounded-2xl transition-all border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
