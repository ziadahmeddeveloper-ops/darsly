import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import TeacherSubsiteHeader from '@/components/TeacherSubsiteHeader';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, CheckCircle2, Lock, PlayCircle, Key, FileText, Gift, Award, Star } from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string; courseId: string }>;
  searchParams: Promise<{ code?: string; error?: string }>;
}

export default async function TeacherSubsiteCourseDetailPage({ params, searchParams }: PageProps) {
  const { slug, courseId } = await params;
  const { code, error } = await searchParams;
  const currentUser = await getCurrentUser();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: { include: { user: true } },
      lessons: {
        orderBy: { orderIndex: 'asc' },
        include: { parts: true },
      },
      exams: { where: { status: 'published' } },
      reviews: { include: { student: true } },
    },
  });

  if (!course) {
    notFound();
  }

  const teacherUser = course.teacher.user;
  const teacherSlug = course.teacher.customSlug || course.teacher.userId;

  // ACCESS CHECK
  let hasAccess = false;
  if (course.accessType === 'free') {
    hasAccess = true;
  } else if (currentUser) {
    if (currentUser.role === 'admin' || (currentUser.role === 'teacher' && currentUser.id === teacherUser.id)) {
      hasAccess = true;
    } else {
      const access = await prisma.courseAccess.findFirst({
        where: {
          studentId: currentUser.id,
          courseId: course.id,
          status: 'active',
        },
      });
      if (access) hasAccess = true;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans dir-rtl">
      {/* Subsite Header */}
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
        currentUser={currentUser ? {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role as any,
          status: currentUser.status,
          avatar: currentUser.avatar,
        } : null}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 flex-1">
        {/* Navigation Link */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href={`/t/${slug}`} className="hover:text-blue-400">
            الرئيسية لمنصة الأستاذ {teacherUser.name}
          </Link>
          <span>/</span>
          <span className="text-white font-bold">{course.title}</span>
        </div>

        {/* Hero Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-500/10 text-blue-400 font-bold text-xs px-3.5 py-1.5 rounded-full border border-blue-500/20">
                  {course.grade} • {course.subject}
                </span>
                {course.accessType === 'free' ? (
                  <span className="bg-emerald-500/10 text-emerald-400 font-bold text-xs px-3.5 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" /> مجاني بالكامل
                  </span>
                ) : (
                  <span className="bg-amber-500/10 text-amber-400 font-bold text-xs px-3.5 py-1.5 rounded-full border border-amber-500/20">
                    كود وصول ({course.price} ج.م)
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white">{course.title}</h1>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">{course.description}</p>

              <div className="flex items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4 text-blue-400" />
                  <strong>{course.lessons.length}</strong> حصة ومحاضرة
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <strong>{course.exams.length}</strong> امتحانات متخصصة
                </span>
              </div>
            </div>

            {/* Thumbnail Box */}
            <div className="w-full lg:w-96 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 aspect-video shrink-0">
              <img src={course.thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600'} alt={course.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Enrollment / Code Access Banner if needed */}
        {!hasAccess && (
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl text-center sm:text-right">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-400" /> أدخل كود الوصول للبدء
                </h3>
                <p className="text-xs text-slate-300">
                  تواصل مع الأستاذ {teacherUser.name} للحصول على كود المشاهدة الخاص بك.
                </p>
              </div>

              <form action="/api/access-codes/verify" method="POST" className="flex items-center gap-3 w-full sm:w-auto">
                <input type="hidden" name="courseId" value={course.id} />
                <input type="hidden" name="redirectUrl" value={`/t/${slug}/courses/${course.id}`} />
                <input
                  type="text"
                  name="code"
                  required
                  placeholder="أدخل كود الوصول هنا..."
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white uppercase tracking-wider font-mono outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all shrink-0">
                  تفعيل الكود
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Curriculum List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            منهج الكورس والحصص ({course.lessons.length})
          </h2>

          <div className="space-y-3">
            {course.lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-5 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-400 text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{lesson.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lesson.parts.length > 0
                        ? `حصة مقسمة إلى ${lesson.parts.length} أجزاء فيديو وامتحانات`
                        : 'حصة فيديو متكاملة'}
                    </p>
                  </div>
                </div>

                {hasAccess ? (
                  <Link
                    href={`/t/${slug}/courses/${course.id}/lessons/${lesson.id}`}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>مشاهدة الحصة ←</span>
                  </Link>
                ) : (
                  <span className="bg-slate-800 text-slate-500 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed">
                    <Lock className="w-4 h-4" /> مغلّق (يلزمه كود)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
