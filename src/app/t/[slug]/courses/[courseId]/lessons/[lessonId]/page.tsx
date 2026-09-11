import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import TeacherSubsiteHeader from '@/components/TeacherSubsiteHeader';
import LessonPlayerClient from '@/components/LessonPlayerClient';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string; courseId: string; lessonId: string }>;
}

export default async function TeacherSubsiteLessonPlayerPage({ params }: PageProps) {
  const { slug, courseId, lessonId } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(`/login?callback=/t/${slug}/courses/${courseId}/lessons/${lessonId}`);
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
      exams: { where: { status: 'published' } },
    },
  });

  if (!course) {
    notFound();
  }

  const teacherUser = course.teacher.user;

  // STRICT ACCESS CHECK
  let hasAccess = false;
  if (course.accessType === 'free') {
    hasAccess = true;
  } else {
    const access = await prisma.courseAccess.findFirst({
      where: {
        studentId: currentUser.id,
        courseId: course.id,
        status: 'active',
      },
    });
    if (access || currentUser.role === 'admin' || (currentUser.role === 'teacher' && currentUser.id === teacherUser.id)) {
      hasAccess = true;
    }
  }

  if (!hasAccess) {
    redirect(`/t/${slug}/courses/${courseId}?error=unauthorized`);
  }

  const currentLesson = course.lessons.find((l) => l.id === lessonId);
  if (!currentLesson) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans dir-rtl">
      <TeacherSubsiteHeader
        teacher={{
          id: teacherUser.id,
          name: teacherUser.name,
          avatar: teacherUser.avatar,
          customSlug: course.teacher.customSlug,
          teacherProfile: {
            title: course.teacher.title,
            whatsapp: course.teacher.whatsapp,
          },
        }}
        currentUser={{
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role as any,
          status: currentUser.status,
          avatar: currentUser.avatar,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Navigation Breadcrumb inside Teacher Subsite */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href={`/t/${slug}`} className="hover:text-blue-400">
            منصة الأستاذ {teacherUser.name}
          </Link>
          <span>/</span>
          <Link href={`/t/${slug}/courses/${course.id}`} className="hover:text-blue-400">
            {course.title}
          </Link>
          <span>/</span>
          <span className="text-white font-bold">{currentLesson.title}</span>
        </div>

        {/* Interactive Multi-Part Lesson Player */}
        <LessonPlayerClient
          courseId={course.id}
          lesson={currentLesson as any}
          allLessons={course.lessons as any}
          subsiteSlug={slug}
          teacherName={teacherUser.name}
        />
      </div>
    </div>
  );
}
