import React from 'react';
import Sidebar from '@/components/Sidebar';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';
import Link from 'next/link';
import { Users, ShieldAlert, CheckCircle2, BookOpen, CreditCard, Award, ArrowLeft, Activity } from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  await requireAdmin();

  // Aggregate metrics
  const totalTeachers = await prisma.user.count({ where: { role: 'teacher' } });
  const pendingTeachers = await prisma.user.count({ where: { role: 'teacher', status: 'pending' } });
  const approvedTeachers = await prisma.user.count({ where: { role: 'teacher', status: 'approved' } });
  const suspendedTeachers = await prisma.user.count({ where: { role: 'teacher', status: 'suspended' } });
  const totalStudents = await prisma.user.count({ where: { role: 'student' } });
  const totalCourses = await prisma.course.count();
  const activeSubscriptions = await prisma.subscription.count({ where: { status: 'active' } });

  const recentPending = await prisma.user.findMany({
    where: { role: 'teacher', status: 'pending' },
    include: { teacherProfile: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar role="admin" pendingCount={pendingTeachers} />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              الأدمن الرئيسي - Platform Owner
            </span>
            <h1 className="text-3xl font-black text-white mt-2">لوحة التحكم التنفيذية - DARSLY</h1>
            <p className="text-xs text-slate-400 mt-1">نظرة عامة على أداء المنصة واعتمادات المدرسين</p>
          </div>
          <Link
            href="/admin/teachers"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>طلبات الاعتماد ({pendingTeachers})</span>
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>طلبات معلقة</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-black text-amber-400">{pendingTeachers}</p>
            <p className="text-[10px] text-slate-400">بانتظار موافقة الأدمن</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>مدرسون معتمدون</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400">{approvedTeachers}</p>
            <p className="text-[10px] text-slate-400">نشط في المنصة</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>إجمالي الطلاب</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white">{totalStudents.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400">طلاب مسجلين</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>إجمالي الكورسات</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-black text-white">{totalCourses}</p>
            <p className="text-[10px] text-slate-400">كورس منشور</p>
          </div>
        </div>

        {/* Pending Teachers Section Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">طلبات انضمام المدرسين الأخيرة</h3>
                <p className="text-xs text-slate-400">طلبات تحتاج قرار اعتماد من الأدمن</p>
              </div>
            </div>

            <Link href="/admin/teachers" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
              <span>إدارة كافة الطلبات</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {recentPending.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">لا توجد طلبات معلقة بانتظار الموافقة.</p>
          ) : (
            <div className="space-y-3">
              {recentPending.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={teacher.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={teacher.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{teacher.name}</h4>
                      <p className="text-xs text-slate-400">{teacher.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                      قيد المراجعة
                    </span>
                    <Link
                      href="/admin/teachers"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all"
                    >
                      مراجعة واتخاذ قرار
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
