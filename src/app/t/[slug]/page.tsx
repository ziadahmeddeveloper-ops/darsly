import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import TeacherSubsiteHeader from '@/components/TeacherSubsiteHeader';
import CourseCard from '@/components/CourseCard';
import {
  Star,
  Users,
  BookOpen,
  CheckCircle2,
  Award,
  Calendar,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Building2,
  Video,
  Globe,
  Sparkles,
  ShieldCheck,
  PlayCircle
} from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TeacherSubsiteHomePage({ params }: PageProps) {
  const { slug } = await params;
  const currentUser = await getCurrentUser();

  // Search by customSlug OR userId OR user email
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      OR: [
        { customSlug: slug },
        { userId: slug },
        { user: { email: slug } },
      ],
    },
    include: {
      user: true,
      courses: {
        where: { status: 'published' },
        include: { lessons: true },
      },
      centerSchedules: {
        orderBy: { createdAt: 'desc' },
      },
      exams: {
        where: { status: 'published' },
      },
      reviews: {
        include: { student: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!teacherProfile || !teacherProfile.user) {
    notFound();
  }

  const teacherUser = teacherProfile.user;
  const subjects = teacherProfile.subjects ? JSON.parse(teacherProfile.subjects) : [];
  const grades = teacherProfile.grades ? JSON.parse(teacherProfile.grades) : [];
  const whatsappNum = teacherProfile.whatsapp || teacherUser.phone;
  const coverUrl = teacherProfile.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white dir-rtl">
      {/* ===== SUBSITE HEADER ===== */}
      <TeacherSubsiteHeader
        teacher={{
          id: teacherUser.id,
          name: teacherUser.name,
          avatar: teacherUser.avatar,
          customSlug: teacherProfile.customSlug,
          teacherProfile: {
            title: teacherProfile.title,
            whatsapp: teacherProfile.whatsapp,
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

      {/* ===== HERO BANNER WITH DYNAMIC COVER IMAGE & AVATAR ===== */}
      <div className="relative bg-slate-950 border-b border-slate-800/80 overflow-hidden">
        {/* Cover Photo Backdrop */}
        <div className="h-64 sm:h-80 md:h-96 w-full relative overflow-hidden bg-slate-900">
          <img
            src={coverUrl}
            alt={teacherUser.name}
            className="w-full h-full object-cover opacity-85 scale-105 transition-transform duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/40" />
        </div>

        {/* Floating Teacher Info & Stats Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 sm:-mt-32 pb-12 z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-right">
            
            {/* HUGE AVATAR PROFILE PICTURE */}
            <div className="relative group shrink-0">
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden border-4 border-blue-500/60 shadow-2xl shadow-blue-500/30 bg-slate-900 ring-4 ring-slate-950 transition-all duration-300 group-hover:scale-105">
                <img
                  src={teacherUser.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'}
                  alt={teacherUser.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status Badge */}
              <span className="absolute -bottom-2 -left-2 bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-xl border-2 border-slate-950 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping" />
                الموقع الرسمي المباشر
              </span>
            </div>

            {/* Details & Badges */}
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
                  الأستاذ {teacherUser.name}
                </h1>
                {teacherProfile.verified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> مدرس موثق
                  </span>
                )}
                {teacherProfile.experienceYears > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <Award className="w-4 h-4 text-purple-400" /> خبرة {teacherProfile.experienceYears} سنوات
                  </span>
                )}
              </div>

              <p className="text-lg font-bold text-blue-400">
                {teacherProfile.title || (subjects.length > 0 ? `أستاذ ${subjects.join(' • ')}` : 'معلم معتمد')}
              </p>

              {/* Metrics Pills */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5 font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-2xl shadow-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {teacherProfile.rating.toFixed(1)} / 5.0 ({teacherProfile.reviews.length} تقييم)
                </span>
                <span className="flex items-center gap-1.5 font-semibold bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 shadow-sm">
                  <Users className="w-4 h-4 text-blue-400" />
                  <strong>{teacherProfile.studentCount.toLocaleString()}</strong> طالب مسجل
                </span>
                <span className="flex items-center gap-1.5 font-semibold bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 shadow-sm">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <strong>{teacherProfile.courses.length}</strong> كورسات ومحاضرات
                </span>
                <span className="flex items-center gap-1.5 font-semibold bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 shadow-sm">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <strong>{teacherProfile.centerSchedules.length}</strong> مواعيد بالسناتر
                </span>
              </div>

              {/* Contact Actions */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                {whatsappNum && (
                  <a
                    href={`https://wa.me/${whatsappNum.replace(/\+/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <MessageCircle className="w-4.5 h-4.5" />
                    <span>تواصل مباشر عبر الواتساب</span>
                  </a>
                )}

                {teacherUser.phone && (
                  <a
                    href={`tel:${teacherUser.phone}`}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs px-4 py-3 rounded-2xl border border-slate-800 transition-all flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span>اتصال تلفوني</span>
                  </a>
                )}

                {teacherProfile.youtube && (
                  <a
                    href={teacherProfile.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-bold text-xs px-4 py-3 rounded-2xl border border-rose-500/30 transition-all flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>قناة اليوتيوب</span>
                  </a>
                )}

                {teacherProfile.facebook && (
                  <a
                    href={teacherProfile.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold text-xs px-4 py-3 rounded-2xl border border-blue-500/30 transition-all flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    <span>فيسبوك</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN SUBSITE CONTENT BODY ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 flex-1">
        
        {/* BIO CARD */}
        {teacherProfile.bio && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-xl font-black text-white border-b border-slate-800/80 pb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> نبذة عن الأستاذ {teacherUser.name}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-line">{teacherProfile.bio}</p>

            <div className="pt-2 flex flex-wrap gap-2">
              {grades.map((grade: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl"
                >
                  🎓 مرحلة: {grade}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ===== ONLINE COURSES SECTION ===== */}
        <div id="courses" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-1">
                <BookOpen className="w-4 h-4" />
                <span>الكورسات والمحاضرات الأونلاين</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">منهج وكورسات الأستاذ {teacherUser.name}</h2>
            </div>
          </div>

          {teacherProfile.courses.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm font-bold">لا توجد كورسات أونلاين متاحة حالياً على هذه المنصة.</p>
              <p className="text-xs text-slate-500">تابعنا قريباً لإضافة الحصص والمحاضرات الجديدة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teacherProfile.courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    
                    <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-blue-400 font-bold text-xs px-3 py-1 rounded-xl">
                      {course.grade}
                    </span>

                    <span className="absolute bottom-3 left-3 bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-xl shadow-md">
                      {course.price > 0 ? `${course.price} ج.م` : 'مجاني بالكامل'}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                        <PlayCircle className="w-4 h-4 text-blue-400" />
                        {course.lessons.length} حصة ودورة
                      </span>

                      <Link
                        href={`/t/${slug}/courses/${course.id}`}
                        className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white font-bold text-xs px-4 py-2 rounded-xl border border-blue-500/30 transition-all"
                      >
                        دخول الكورس ←
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== CENTER SCHEDULES SECTION ===== */}
        <div id="schedules" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-1">
                <Building2 className="w-4 h-4" />
                <span>مواعيد الأوفلاين والسناتر</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">جدول حصص الأستاذ {teacherUser.name} بالسناتر</h2>
            </div>
          </div>

          {teacherProfile.centerSchedules.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
              <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-xs font-bold">لا توجد مواعيد سناتر أوفلاين مسجلة حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacherProfile.centerSchedules.map((sch) => (
                <div
                  key={sch.id}
                  className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 space-y-4 shadow-xl transition-all relative group"
                >
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                      <Building2 className="w-4 h-4" />
                      {sch.centerName}
                    </span>
                    {sch.grade && (
                      <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">
                        {sch.grade}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-xs border-t border-b border-slate-800/80 py-3">
                    <div className="flex items-start gap-2 text-slate-200 font-bold">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{sch.location}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <span className="font-bold text-white">{sch.dayOfWeek}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-slate-200">{sch.startTime} - {sch.endTime}</span>
                      </div>
                    </div>
                  </div>

                  {whatsappNum && (
                    <a
                      href={`https://wa.me/${whatsappNum.replace(/\+/g, '')}?text=${encodeURIComponent(
                        `مرحباً أستاذ ${teacherUser.name}، أود استفسار والحجز في ${sch.centerName} (${sch.dayOfWeek} ${sch.startTime})`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-emerald-500/30"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>احجز مكانك في هذا السنتر</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== REVIEWS SECTION ===== */}
        {teacherProfile.reviews.length > 0 && (
          <div id="reviews" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl scroll-mt-24">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              آراء الطلاب ({teacherProfile.reviews.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teacherProfile.reviews.map((rev) => (
                <div key={rev.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.student.avatar || `https://api.dicebear.com/8.x/avataaars/svg?seed=${rev.student.name}`}
                        alt={rev.student.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{rev.student.name}</p>
                        <p className="text-[10px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString('ar-EG')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rev.rating} / 5</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== SUBSITE FOOTER ===== */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-bold text-slate-400">جميع الحقوق محفوظة © {new Date().getFullYear()} لمنصة الأستاذ {teacherUser.name}</p>
        <p className="text-[11px] text-slate-600 flex items-center justify-center gap-1">
          <span>شغّل بواسطة نظام المنصات الخاص</span>
          <span className="text-blue-500 font-bold">DARSLY</span>
        </p>
      </footer>
    </div>
  );
}
