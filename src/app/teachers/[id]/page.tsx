import React from 'react';
import { prisma } from '@/lib/prisma';
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
  Share2,
  Sparkles
} from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TeacherProfilePage({ params }: PageProps) {
  const { id } = await params;

  const teacherUser = await prisma.user.findFirst({
    where: {
      OR: [{ id }, { email: id }],
      role: 'teacher',
    },
    include: {
      teacherProfile: {
        include: {
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
      },
    },
  });

  if (!teacherUser || !teacherUser.teacherProfile) {
    notFound();
  }

  const profile = teacherUser.teacherProfile;
  const subjects = profile.subjects ? JSON.parse(profile.subjects) : [];
  const grades = profile.grades ? JSON.parse(profile.grades) : [];
  const whatsappNum = profile.whatsapp || teacherUser.phone;

  return (
    <div className="pb-24 space-y-12 bg-slate-950 text-slate-100">
      {/* ===== HERO COVER & LARGE AVATAR PROFILE BANNER ===== */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 border-b border-slate-800/80 pt-8 pb-12 overflow-hidden shadow-2xl">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          {/* Back Button */}
          <div className="flex items-center justify-between">
            <BackButton label="الرجوع لدليل المدرسين" href="/teachers" />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-right">
            {/* HUGE AVATAR IMAGE */}
            <div className="relative group shrink-0">
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-blue-500/50 shadow-2xl shadow-blue-500/20 bg-slate-900 ring-4 ring-slate-900 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={teacherUser.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'}
                  alt={teacherUser.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status Badge */}
              <span className="absolute -bottom-2 -left-2 bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg border-2 border-slate-900 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                متاح بالسناتر والأونلاين
              </span>
            </div>

            {/* Teacher Details & Badges */}
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {teacherUser.name}
                </h1>
                {profile.verified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" /> مدرس معتمد
                  </span>
                )}
                {profile.experienceYears > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <Award className="w-4 h-4 text-purple-400" /> خبرة {profile.experienceYears} سنوات
                  </span>
                )}
              </div>

              <p className="text-base font-bold text-blue-400">
                {profile.title || (subjects.length > 0 ? `أستاذ ${subjects.join(' • ')}` : 'معلم معتمد')}
              </p>

              {/* Metrics */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5 font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {profile.rating.toFixed(1)} / 5.0 ({profile.reviews.length} تقييم)
                </span>
                <span className="flex items-center gap-1.5 font-semibold bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
                  <Users className="w-4 h-4 text-blue-400" />
                  <strong>{profile.studentCount.toLocaleString()}</strong> طالب مسجل
                </span>
                <span className="flex items-center gap-1.5 font-semibold bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <strong>{profile.courses.length}</strong> كورسات أونلاين
                </span>
                <span className="flex items-center gap-1.5 font-semibold bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <strong>{profile.centerSchedules.length}</strong> سناتر أوفلاين
                </span>
              </div>

              {/* Action Buttons (WhatsApp, Call, Socials) */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                {whatsappNum && (
                  <a
                    href={`https://wa.me/${whatsappNum.replace(/\+/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>تواصل عبر الواتساب</span>
                  </a>
                )}

                {teacherUser.phone && (
                  <a
                    href={`tel:${teacherUser.phone}`}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700/80 transition-all flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span>اتصال هاتفي</span>
                  </a>
                )}

                {profile.youtube && (
                  <a
                    href={profile.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-rose-500/30 transition-all flex items-center gap-1.5"
                  >
                    <Video className="w-4 h-4" />
                    <span>قناة اليوتيوب</span>
                  </a>
                )}

                {profile.facebook && (
                  <a
                    href={profile.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-blue-500/30 transition-all flex items-center gap-1.5"
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

      {/* ===== MAIN CONTENT BODY ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* BIO CARD */}
        {profile.bio && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" /> نبذة عن الأستاذ {teacherUser.name}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-line">{profile.bio}</p>

            <div className="pt-2 flex flex-wrap gap-2">
              {grades.map((grade: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl"
                >
                  🎓 المرحلة: {grade}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ===== CENTER SCHEDULES & OFFLINE CLASSES SECTION ===== */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-1">
                <Building2 className="w-4 h-4" />
                <span>مواعيد الأوفلاين والسناتر</span>
              </div>
              <h2 className="text-2xl font-black text-white">جدول حصص الأستاذ {teacherUser.name} بالسناتر</h2>
            </div>
            <span className="text-xs text-slate-400 hidden sm:block">احجز مكانك في أقرب سنتر لك</span>
          </div>

          {profile.centerSchedules.length === 0 ? (
            <div className="text-center py-10 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
              <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-xs font-bold">لا توجد مواعيد سناتر أوفلاين مسجلة حالياً.</p>
              <p className="text-[11px] text-slate-500">يمكنك متابعة الكورسات الأونلاين المتاحة بالأسفل.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.centerSchedules.map((sch) => (
                <div
                  key={sch.id}
                  className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 space-y-4 shadow-xl transition-all relative group hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                      <Building2 className="w-4 h-4" />
                      {sch.centerName}
                    </span>
                    {sch.grade && <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">{sch.grade}</span>}
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

                    {sch.subject && (
                      <p className="text-slate-400 font-medium">المادة: <strong className="text-white">{sch.subject}</strong></p>
                    )}
                  </div>

                  {sch.notes && (
                    <p className="text-[11px] text-slate-400 bg-slate-950 p-3 rounded-2xl border border-slate-800/60 leading-relaxed">
                      💡 {sch.notes}
                    </p>
                  )}

                  {whatsappNum && (
                    <a
                      href={`https://wa.me/${whatsappNum.replace(/\+/g, '')}?text=${encodeURIComponent(
                        `مرحباً، أود استفسار والحجز في ${sch.centerName} (${sch.dayOfWeek} ${sch.startTime})`
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

        {/* ===== ONLINE COURSES SECTION ===== */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-1">
                <BookOpen className="w-4 h-4" />
                <span>الكورسات والمحاضرات الأونلاين</span>
              </div>
              <h2 className="text-2xl font-black text-white">كورسات ودورات الأستاذ {teacherUser.name}</h2>
            </div>
          </div>

          {profile.courses.length === 0 ? (
            <p className="text-slate-400 text-xs text-center py-10 bg-slate-900 border border-slate-800 rounded-3xl">
              لا توجد كورسات أونلاين متاحة حالياً لهذا المدرس.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  thumbnail={course.thumbnail}
                  subject={course.subject}
                  grade={course.grade}
                  price={course.price}
                  accessType={course.accessType as any}
                  teacherName={teacherUser.name}
                  teacherAvatar={teacherUser.avatar}
                  lessonCount={course.lessons.length}
                />
              ))}
            </div>
          )}
        </div>

        {/* ===== REVIEWS SECTION ===== */}
        {profile.reviews.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              آراء وتقييمات الطلاب ({profile.reviews.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.reviews.map((rev) => (
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
    </div>
  );
}
