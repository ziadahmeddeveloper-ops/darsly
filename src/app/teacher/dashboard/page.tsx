import React from 'react';
import Sidebar from '@/components/Sidebar';
import { requireApprovedTeacher } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, Key, Users, Eye, Plus, FileSpreadsheet, CheckCircle2, ArrowLeft, Calendar } from 'lucide-react';

export const revalidate = 0;

export default async function TeacherDashboardPage() {
  // STRICT GUARD: Will redirect to /teacher/pending if user is pending approval!
  const user = await requireApprovedTeacher();

  const profile = await prisma.teacherProfile.findUnique({
    where: { userId: user.id },
    include: {
      courses: {
        include: { lessons: true, accessCodes: true },
      },
    },
  });

  const totalCourses = profile?.courses.length || 0;
  const totalLessons = profile?.courses.reduce((acc, c) => acc + c.lessons.length, 0) || 0;

  const totalAccessCodes = await prisma.accessCode.count({
    where: { teacherId: profile?.id },
  });

  const usedCodes = await prisma.accessCode.count({
    where: { teacherId: profile?.id, status: 'used' },
  });

  const availableCodes = await prisma.accessCode.count({
    where: { teacherId: profile?.id, status: 'available' },
  });

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar role="teacher" teacherStatus="approved" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>مدرس معتمد - Verified Teacher</span>
            </div>
            <h1 className="text-3xl font-black text-white">أهلاً بك أستاذ {user.name}</h1>
            <p className="text-xs text-slate-400 mt-1">لوحة التحكم وإدارة المحتوى التعليمي والكورسات وأكواد الوصول</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/teacher/schedules"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>مواعيد السناتر</span>
            </Link>

            <Link
              href={`/teachers/${user.id}`}
              target="_blank"
              className="bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>معاينة البروفايل الخاص 👁️</span>
            </Link>

            <Link
              href="/teacher/access-codes"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>توليد أكواد الوصول</span>
            </Link>

            <Link
              href="/teacher/courses/create"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء كورس جديد</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>أكواد متاح استخدامها</span>
              <Key className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400">{availableCodes}</p>
            <p className="text-[10px] text-slate-400">جاهزة للبيع والتفعيل</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>أكواد مستخدمة (الطلاب)</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-blue-400">{usedCodes}</p>
            <p className="text-[10px] text-slate-400">طلاب قاموا بفتح الكورسات</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>الكورسات المنشورة</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-black text-white">{totalCourses}</p>
            <p className="text-[10px] text-slate-400">دورة تعليمية</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>المحاضرات</span>
              <FileSpreadsheet className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-black text-white">{totalLessons}</p>
            <p className="text-[10px] text-slate-400">فيديو ومحاضرة</p>
          </div>
        </div>

        {/* My Courses Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">الكورسات الخاصة بك</h2>
            <Link href="/teacher/courses" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
              <span>عرض الجميع</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {profile?.courses.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-3">
              <p>لم تقم بإنشاء أي كورس بعد.</p>
              <Link
                href="/teacher/courses/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-4 py-2 rounded-xl"
              >
                <Plus className="w-4 h-4" /> أنشئ كورسك الأول الآن
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile?.courses.map((course) => (
                <div key={course.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">{course.title}</h4>
                    <p className="text-xs text-slate-400">{course.subject} • {course.price} ج.م</p>
                  </div>
                  <Link
                    href={`/teacher/access-codes?courseId=${course.id}`}
                    className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-xs px-3 py-2 rounded-xl transition-all"
                  >
                    توليد أكواد
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
