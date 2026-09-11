import React from 'react';
import Sidebar from '@/components/Sidebar';
import { requireStudent } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import CourseCard from '@/components/CourseCard';
import { BookOpen } from 'lucide-react';

export const revalidate = 0;

export default async function StudentCoursesPage() {
  const user = await requireStudent();

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
      <Sidebar role="student" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-2">
            <BookOpen className="w-4 h-4" />
            <span>كورساتي ودوراتي المفضلة</span>
          </div>
          <h1 className="text-3xl font-black text-white">الكورسات المفتوحة المفعّلة بكود الوصول</h1>
        </div>

        {unlockedCourses.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            لم تقم بفتح أي كورس بعد. قم بإدخال كود الوصول الممنوح لك من المدرس لفتح كورس فوراً.
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
      </main>
    </div>
  );
}
