import React from 'react';
import { prisma } from '@/lib/prisma';
import TeacherCard from '@/components/TeacherCard';
import { Search, Filter, GraduationCap, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ subject?: string; grade?: string; q?: string }>;
}

export default async function TeachersPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const subjectFilter = resolvedParams.subject || '';
  const gradeFilter = resolvedParams.grade || '';
  const searchQuery = resolvedParams.q || '';

  const teachers = await prisma.user.findMany({
    where: {
      role: 'teacher',
      status: 'approved',
      ...(searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery } },
              { email: { contains: searchQuery } },
            ],
          }
        : {}),
    },
    include: {
      teacherProfile: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const filteredTeachers = teachers.filter((t) => {
    if (!t.teacherProfile) return false;
    const subjects = t.teacherProfile.subjects ? JSON.parse(t.teacherProfile.subjects) : [];
    const grades = t.teacherProfile.grades ? JSON.parse(t.teacherProfile.grades) : [];

    const matchesSubject = !subjectFilter || subjects.includes(subjectFilter);
    const matchesGrade = !gradeFilter || grades.includes(gradeFilter);

    return matchesSubject && matchesGrade;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>نخبة المدرسين المعتمدين</span>
        </div>
        <h1 className="text-4xl font-black text-white">دليل المدرسين المعتمدين</h1>
        <p className="text-sm text-slate-400">
          ابحث واكتشف نخبة المعلمين المعتمدين من إدارة DARSLY في كافة المواد والمراحل الدراسية.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-4">
        <form action="/teachers" method="GET" className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="ابحث باسم المدرس..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              name="subject"
              defaultValue={subjectFilter}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">جميع المواد الدراسية</option>
              <optgroup label="المراحل العامة الأساسية">
                <option value="رياضيات">رياضيات</option>
                <option value="علوم">علوم</option>
                <option value="فيزياء">فيزياء</option>
                <option value="كيمياء">كيمياء</option>
                <option value="أحياء">أحياء</option>
                <option value="جيولوجيا">جيولوجيا</option>
                <option value="دراسات اجتماعية">دراسات اجتماعية</option>
                <option value="تاريخ">تاريخ</option>
                <option value="جغرافيا">جغرافيا</option>
              </optgroup>
              <optgroup label="اللغات والتكنولوجيا">
                <option value="لغة عربية">لغة عربية</option>
                <option value="لغة إنجليزية">لغة إنجليزية</option>
                <option value="لغة فرنسية">لغة فرنسية</option>
                <option value="لغة ألمانية">لغة ألمانية</option>
                <option value="تكنولوجيا المعلومات">تكنولوجيا المعلومات (ICT)</option>
              </optgroup>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              name="grade"
              defaultValue={gradeFilter}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">جميع المراحل الدراسية</option>
              <option value="مدرس ثانوي">مدرس ثانوي (المرحلة الثانوية)</option>
              <option value="مدرس إعدادي">مدرس إعدادي (المرحلة الإعدادية)</option>
              <option value="مدرس ابتدائي">مدرس ابتدائي (المرحلة الابتدائية)</option>
              <option value="مدرس جامعي">مدرس جامعي (المرحلة الجامعية)</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <button
              type="submit"
              className="w-full h-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center p-2.5 shadow-md"
            >
              فلترة
            </button>
          </div>
        </form>
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="font-bold text-white text-base">لم يتم العثور على مدرسين مطبق عليهم الفلتر</p>
          <p className="text-xs text-slate-400">جرّب اختيار مادة أو مرحلة دراسية أخرى.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((t) => {
            const profile = t.teacherProfile;
            const subjects = profile?.subjects ? JSON.parse(profile.subjects) : ['مادة عامة'];
            const grades = profile?.grades ? JSON.parse(profile.grades) : ['الصف الثالث الثانوي'];

            return (
              <TeacherCard
                key={t.id}
                id={t.id}
                name={t.name}
                avatar={t.avatar}
                customSlug={profile?.customSlug}
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
      )}
    </div>
  );
}
