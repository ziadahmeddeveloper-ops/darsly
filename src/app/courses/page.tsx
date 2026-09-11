import React from 'react';
import { prisma } from '@/lib/prisma';
import CourseCard from '@/components/CourseCard';
import { BookOpen, Search } from 'lucide-react';

export const revalidate = 0;

export default async function PublicCoursesPage() {
  const courses = await prisma.course.findMany({
    where: { status: 'published' },
    include: {
      teacher: { include: { user: true } },
      lessons: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold">
          <BookOpen className="w-4 h-4" />
          <span>المحتوى والدورات الكورسات</span>
        </div>
        <h1 className="text-4xl font-black text-white">جميع الكورسات والدورات التعليمية</h1>
        <p className="text-sm text-slate-400">
          تصفح دورات وكورسات نخبة المعلمين المعتمدين واشترك بكود الوصول فوراً.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
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
          />
        ))}
      </div>
    </div>
  );
}
