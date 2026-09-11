import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import LessonPlayerClient from '@/components/LessonPlayerClient';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export default async function LessonViewerPage({ params }: PageProps) {
  const { courseId, lessonId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?callback=/courses/${courseId}/lessons/${lessonId}`);
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: { include: { user: true } },
      lessons: {
        orderBy: { orderIndex: 'asc' },
        include: {
          parts: {
            orderBy: { orderIndex: 'asc' },
            include: { exam: true },
          },
        },
      },
      exams: {
        where: { status: 'published' },
        include: { examQuestions: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // STRICT ACCESS CHECK
  let hasAccess = false;
  if (course.accessType === 'free') {
    hasAccess = true;
  } else {
    const access = await prisma.courseAccess.findFirst({
      where: {
        studentId: user.id,
        courseId: course.id,
        status: 'active',
      },
    });
    if (access || user.role === 'admin' || (user.role === 'teacher' && user.teacherId === course.teacherId)) {
      hasAccess = true;
    }
  }

  if (!hasAccess) {
    redirect(`/courses/${courseId}?error=unauthorized`);
  }

  const currentLesson = course.lessons.find((l) => l.id === lessonId);
  if (!currentLesson) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 dir-rtl">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/student/dashboard" className="hover:text-blue-400">
          لوحة التعلم
        </Link>
        <span>/</span>
        <Link href={`/courses/${course.id}`} className="hover:text-blue-400">
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-white font-bold">{currentLesson.title}</span>
      </div>

      <LessonPlayerClient
        courseId={course.id}
        lesson={currentLesson as any}
        allLessons={course.lessons as any}
        teacherName={course.teacher.user.name}
      />
    </div>
  );
}
