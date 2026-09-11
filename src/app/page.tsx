import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import TeacherCard from '@/components/TeacherCard';
import CourseCard from '@/components/CourseCard';
import { Search, Sparkles, ShieldCheck, Award, GraduationCap, PlayCircle, Key, CheckCircle2, ArrowLeft, BookOpen, Users } from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  // Fetch approved teachers
  const teachers = await prisma.user.findMany({
    where: { role: 'teacher', status: 'approved' },
    include: { teacherProfile: true },
    take: 6,
  });

  // Fetch published courses
  const courses = await prisma.course.findMany({
    where: { status: 'published' },
    include: {
      teacher: {
        include: { user: true },
      },
      lessons: true,
    },
    take: 6,
  });

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold shadow-inner">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>المنصة التعليمية الأولى للمدرسين والطلاب في مصر</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.2] tracking-tight">
              اتعلم من أفضل المدرسين في مكان واحد
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              اكتشف المدرسين، افتح الكورسات، تابع المحاضرات، واختبر مستواك في تجربة تعليمية متكاملة.
            </p>

            {/* Search Bar */}
            <form action="/teachers" className="relative max-w-2xl mx-auto lg:mx-0">
              <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 shadow-2xl focus-within:border-blue-500 transition-colors">
                <Search className="w-5 h-5 text-slate-400 mr-3 ml-2" />
                <input
                  type="text"
                  name="q"
                  placeholder="ابحث عن مدرس أو مادة أو كورس..."
                  className="w-full bg-transparent text-white placeholder-slate-400 text-sm font-medium focus:outline-none px-2"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
                >
                  بحث
                </button>
              </div>
            </form>

            {/* Trust Stats */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>مدرسون معتمدون ومراجَعون 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-400" />
                <span>تفعيل فوري بكود الوصول</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>امتحانات وتصحيح تلقائي</span>
              </div>
            </div>
          </div>

          {/* Hero Cinematic Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700/60 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              {/* Top Card Preview */}
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">لوحة التعلم التفاعلية</h4>
                    <p className="text-xs text-blue-400 font-medium">DARSLY SaaS Platform</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">
                  مباشر
                </span>
              </div>

              {/* Course Preview Widget */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                  <span>التفاضل والتكامل - 3 ثانوية</span>
                  <span className="text-blue-400">85% اكتمال</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-gradient-to-r from-blue-600 to-indigo-500" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <PlayCircle className="w-3.5 h-3.5 text-blue-400" /> المحاضرة 3 شغال
                  </span>
                  <span className="text-amber-400 font-bold">درجة الامتحان: 95%</span>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-white">+2,400</p>
                  <p className="text-[11px] text-slate-400">طالب نشط</p>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-emerald-400">4.9 / 5.0</p>
                  <p className="text-[11px] text-slate-400">تقييم الطلاب</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SUBJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">المواد الدراسية الشائعة</h2>
            <p className="text-sm text-slate-400">اختر المادة لتصفح أفضل المدرسين المعتمدين بها</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { name: 'رياضيات', count: 'ابتدائي - إعدادي - ثانوي', icon: '📐', color: 'from-blue-600/20 to-blue-900/10' },
            { name: 'علوم', count: 'ابتدائي وإعدادي', icon: '🔬', color: 'from-cyan-600/20 to-cyan-900/10' },
            { name: 'فيزياء', count: 'المرحلة الثانوية', icon: '⚡', color: 'from-indigo-600/20 to-indigo-900/10' },
            { name: 'كيمياء', count: 'المرحلة الثانوية', icon: '🧪', color: 'from-purple-600/20 to-purple-900/10' },
            { name: 'أحياء', count: 'ثانوي وجيولوجيا', icon: '🧬', color: 'from-rose-600/20 to-rose-900/10' },
            { name: 'لغة عربية', count: 'جميع المراحل', icon: '📖', color: 'from-emerald-600/20 to-emerald-900/10' },
            { name: 'لغة إنجليزية', count: 'Connect & High Level', icon: '🌐', color: 'from-amber-600/20 to-amber-900/10' },
            { name: 'دراسات اجتماعية', count: 'تاريخ وجغرافيا', icon: '🌍', color: 'from-orange-600/20 to-orange-900/10' },
          ].map((sub, i) => (
            <Link
              key={i}
              href={`/teachers?subject=${sub.name}`}
              className={`bg-gradient-to-br ${sub.color} border border-slate-800 hover:border-blue-500/50 rounded-2xl p-3.5 text-center group transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">{sub.icon}</div>
              <h3 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{sub.name}</h3>
              <p className="text-[9px] text-slate-400 mt-1 line-clamp-1">{sub.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* TEACHER DISCOVERY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 mb-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>مدرسون مراجعون ومعتمدون</span>
            </div>
            <h2 className="text-3xl font-black text-white">اكتشف أفضل المدرسين</h2>
            <p className="text-sm text-slate-400 mt-1">تصفح ملفات المدرسين المعتمدين واكتشف الكورسات المتاحة</p>
          </div>

          <Link
            href="/teachers"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 bg-blue-600/10 border border-blue-500/20 px-4 py-2.5 rounded-xl transition-all w-fit"
          >
            <span>عرض كل المدرسين</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Teachers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((t) => {
            const profile = t.teacherProfile;
            const subjects = profile?.subjects ? JSON.parse(profile.subjects) : ['مادة عامة'];
            const grades = profile?.grades ? JSON.parse(profile.grades) : ['الصف الثالث الثانوي'];

            return (
              <TeacherCard
                key={t.id}
                id={t.id}
                name={t.name}
                avatar={t.avatar}
                subject={subjects[0] || 'مادة عامة'}
                grades={grades}
                rating={profile?.rating || 4.9}
                studentCount={profile?.studentCount || 1000}
                courseCount={3}
                verified={profile?.verified || true}
                bio={profile?.bio}
              />
            );
          })}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">الكورسات المتاحة</h2>
            <p className="text-sm text-slate-400 mt-1">اشترك في دورات أفضل المدرسين وافتحها فوراً بكود الوصول</p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 bg-blue-600/10 border border-blue-500/20 px-4 py-2.5 rounded-xl transition-all w-fit"
          >
            <span>جميع الكورسات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
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
      </section>

      {/* HOW DARSLY WORKS */}
      <section id="how-it-works" className="bg-slate-900/60 border-y border-slate-800/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black text-white">كيف تعمل منصة Darsly؟</h2>
            <p className="text-sm text-slate-400">تجربة تعليمية سلسة وآمنة في 3 خطوات بسيطة فقط</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-black text-xl flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-bold text-white">ابحث عن مدرسك المفضّل</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تصفح دليل المدرسين المعتمدين، واطلع على تقييمات الطلاب وسيرتهم الذاتية والكورسات المتاحة.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-black text-xl flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-bold text-white">احصل على كود الوصول</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ادفع للمدرس مباشرة بالطريقة التي يحددها، ثم أدخل كود الوصول المكون من 8 خانات لفتح الكورس فوراً.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-black text-xl flex items-center justify-center">
                3
              </div>
              <h3 className="text-lg font-bold text-white">شاهد واختبر مستواك</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                شاهد الفيديوهات والمحاضرات، وحل الامتحانات الإلكترونية واحصل على تصحيح فوري وإحصائيات دقيقة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEACHER CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/90 via-slate-900 to-indigo-950 border border-blue-500/30 p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              للمدرسين المتميزين
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">انضم لنخبة المدرسين في منصة Darsly</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              أنشئ ملفك التعليمي، ارفع كورساتك، ولدّ أكواد الوصول لطلابك بسهولة، وادرس بدون تعقيدات بنية تحتية متكاملة.
            </p>
          </div>
          <Link
            href="/register?role=teacher"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/40 hover:scale-[1.03] active:scale-[0.98] transition-all shrink-0"
          >
            قدم طلب انضمام كمدرس
          </Link>
        </div>
      </section>
    </div>
  );
}
