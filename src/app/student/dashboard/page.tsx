import React from 'react';
import Sidebar from '@/components/Sidebar';
import { requireStudent } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CourseCard from '@/components/CourseCard';
import { BookOpen, PlayCircle, Award, CheckCircle2, ArrowLeft, Clock } from 'lucide-react';

export const revalidate = 0;

export default async function StudentDashboardPage() {
  const user = await requireStudent();

  // Fetch unlocked courses for this student via course_access
  const accesses = await prisma.courseAccess.findMany({
    where: { studentId: user.id, status: 'active' },
    include: {
      course: {
        include: {
          teacher: { include: { user: true } },
          lessons: true,
        },
      },
    },
  });

  const unlockedCourses = accesses.map((a) => a.course);

  // Fetch recent exam attempts
  const attempts = await prisma.examAttempt.findMany({
    where: { studentId: user.id },
    include: { exam: true },
    orderBy: { submittedAt: 'desc' },
    take: 5,
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
      <Sidebar role="student" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950 border border-blue-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-right">
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              مرحباً بك يا بطل 🎓
            </span>
            <h1 className="text-3xl font-black text-white">أهلاً بك، {user.name}</h1>
            <p className="text-xs text-slate-300">واصل رحلة تفوقك الدراسي وشاهد المحاضرات واختبر مستواك.</p>
          </div>

          <Link
            href="/teachers"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 shrink-0"
          >
            <span>استكشف مدرسين جديدين</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>الكورسات المفتوحة</span>
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400 mt-2">{unlockedCourses.length}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>الامتحانات المحلولة</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-black text-amber-400 mt-2">{attempts.length}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>نسبة النجاح العامة</span>
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-blue-400 mt-2">
              {attempts.length > 0
                ? `${Math.round(
                    (attempts.filter((a) => a.passed).length / attempts.length) * 100
                  )}%`
                : '100%'}
            </p>
          </div>
        </div>

        {/* Continue Learning Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-blue-400" />
              كورساتي المفتوحة (تأكيد التفعيل بكود الوصول)
            </h2>
          </div>

          {unlockedCourses.length === 0 ? (
            <div className="text-center py-10 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-3">
              <p className="text-xs text-slate-400">لم تقم بفتح أي كورس بعد.</p>
              <p className="text-xs text-slate-500">اختر كورساً مدفوعاً وأدخل كود الوصول الممنوح لك من المدرس لفتحه فوراً.</p>
              <Link
                href="/teachers"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                تصفح دليل المدرسين
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  thumbnail={course.thumbnail}
                  subject={course.subject}
                  grade={course.grade}
                  price={course.price}
                  accessType={course.accessType as any}
                  teacherName={course.teacher.user.name}
                  teacherAvatar={course.teacher.user.avatar}
                  lessonCount={course.lessons.length}
                  isUnlocked={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
