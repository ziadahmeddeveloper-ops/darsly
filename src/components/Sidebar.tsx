'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileSpreadsheet,
  Key,
  GraduationCap,
  HelpCircle,
  CreditCard,
  Settings,
  ShieldAlert,
  Award,
  Bell,
  CheckCircle,
  FileCheck2,
  UserCircle,
  MapPin,
  Wifi,
  Calendar,
  Eye,
  LogOut,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  role: 'student' | 'teacher' | 'admin';
  teacherStatus?: string;
  pendingCount?: number;
}

export default function Sidebar({ role, teacherStatus = 'approved', pendingCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setUserData(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    window.location.href = '/login';
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const roleLabel = {
    admin: { label: 'مدير المنصة', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', dot: 'bg-purple-400' },
    teacher: {
      label: teacherStatus === 'approved' ? 'مدرس معتمد ✓' : 'قيد المراجعة',
      color: teacherStatus === 'approved' ? 'text-blue-400' : 'text-amber-400',
      bg: teacherStatus === 'approved' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-amber-500/10 border-amber-500/20',
      dot: teacherStatus === 'approved' ? 'bg-emerald-400' : 'bg-amber-400',
    },
    student: { label: 'طالب نشط', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  }[role];

  return (
    <aside className="w-64 bg-slate-900 border-l border-slate-800/80 min-h-screen p-4 flex flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto">
      <div className="space-y-5">

        {/* ===== TOP BRAND & BACK BUTTON ===== */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-blue-500/30 bg-slate-950 flex items-center justify-center">
              <img src="/logo.png" alt="DARSLY" className="w-full h-full object-cover" />
            </div>
            <span className="text-base font-black tracking-tight text-white">
              DARSLY<span className="text-blue-500">.</span>
            </span>
          </Link>

          <button
            onClick={handleGoBack}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-700/60 text-xs font-bold transition-all"
            title="الرجوع للخلف"
          >
            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            <span>رجوع</span>
          </button>
        </div>

        {/* ===== USER CARD ===== */}
        <Link href="/profile" className="block group">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 hover:border-blue-500/40 rounded-2xl p-3.5 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-600/10">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={userData?.avatar || `https://api.dicebear.com/8.x/avataaars/svg?seed=${userData?.name || 'user'}`}
                  alt={userData?.name || 'المستخدم'}
                  className="w-11 h-11 rounded-xl object-cover border-2 border-slate-600 group-hover:border-blue-500/50 transition-all"
                />
                {/* Online dot */}
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${roleLabel.dot} rounded-full border-2 border-slate-900 animate-pulse`} />
              </div>

              {/* Name + status */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate leading-tight">
                  {userData?.name || '...'}
                </p>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${roleLabel.bg} ${roleLabel.color}`}>
                  {roleLabel.label}
                </span>
              </div>
            </div>

            {/* Location / subject hint for teachers */}
            {role === 'teacher' && userData?.teacherProfile?.subjects && (
              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="truncate">
                  {(() => {
                    try { return JSON.parse(userData.teacherProfile.subjects).slice(0, 2).join(' • '); }
                    catch { return userData.teacherProfile.subjects; }
                  })()}
                </span>
              </div>
            )}

            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400">
              <Wifi className="w-3 h-3" />
              <span>متصل الآن</span>
            </div>
          </div>
        </Link>

        {/* Links Navigation */}
        <nav className="space-y-1">
          {/* ADMIN NAV */}

          {role === 'admin' && (
            <>
              <Link
                href="/admin/dashboard"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/admin/dashboard')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>نظرة عامة</span>
              </Link>

              <Link
                href="/admin/teachers"
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/admin/teachers')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>طلبات المدرسين</span>
                </div>
                {pendingCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>

              <Link
                href="/admin/courses"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/admin/courses')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>إدارة الكورسات</span>
              </Link>

              <Link
                href="/admin/users"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/admin/users')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>إدارة المستخدمين</span>
              </Link>

              <Link
                href="/admin/subscriptions"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/admin/subscriptions')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>اشتراكات المدرسين</span>
              </Link>

              <Link
                href="/profile"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/profile')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <UserCircle className="w-4 h-4 text-sky-400" />
                <span>ملفي الشخصي</span>
              </Link>
            </>
          )}

          {/* TEACHER NAV (ONLY IF APPROVED) */}
          {role === 'teacher' && teacherStatus === 'approved' && (
            <>
              <Link
                href="/teacher/dashboard"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/teacher/dashboard')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>الرئيسية</span>
              </Link>

              <Link
                href="/teacher/profile"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/teacher/profile')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>تخصيص منصتي المستقلة 🌐</span>
              </Link>

              <Link
                href="/teacher/courses"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/teacher/courses')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>كورساتي</span>
              </Link>

              <Link
                href="/teacher/schedules"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/teacher/schedules')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>مواعيد السناتر والأوفلاين</span>
              </Link>

              <Link
                href="/teacher/access-codes"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/teacher/access-codes')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Key className="w-4 h-4 text-emerald-400" />
                <span>مولد أكواد الوصول</span>
              </Link>

              <Link
                href="/teacher/exams"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/teacher/exams')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                <span>منشئ الامتحانات</span>
              </Link>

              <Link
                href="/teacher/questions"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/teacher/questions')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>بنك الأسئلة</span>
              </Link>

              <Link
                href="/teacher/grading"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/teacher/grading')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>تصحيح الأسئلة المقالية</span>
              </Link>

              {userData?.id && (
                <Link
                  href={`/teachers/${userData.id}`}
                  target="_blank"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-sky-400 hover:bg-sky-500/10 transition-all border border-sky-500/20"
                >
                  <Eye className="w-4 h-4 text-sky-400" />
                  <span>معاينة البروفايل العام 👁️</span>
                </Link>
              )}

              <Link
                href="/teacher/subscription"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/teacher/subscription')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>اشتراكي بالمنصة</span>
              </Link>

              <Link
                href="/profile"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/profile')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <UserCircle className="w-4 h-4 text-sky-400" />
                <span>ملفي الشخصي</span>
              </Link>
            </>
          )}

          {/* STUDENT NAV */}
          {role === 'student' && (
            <>
              <Link
                href="/student/dashboard"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/student/dashboard')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>الرئيسية</span>
              </Link>

              <Link
                href="/student/courses"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/student/courses')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>كورساتي المفتوحة</span>
              </Link>

              <Link
                href="/teachers"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/teachers')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>دليل المدرسين</span>
              </Link>

              <Link
                href="/student/exams"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/student/exams')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>امتحاناتي ونتائجي</span>
              </Link>

              <Link
                href="/profile"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/profile')
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <UserCircle className="w-4 h-4 text-sky-400" />
                <span>ملفي الشخصي</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Footer & Logout */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white font-bold py-2.5 px-3 rounded-xl border border-rose-500/30 hover:border-rose-500 transition-all text-xs shadow-md"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>

        <div className="text-xs text-slate-400 text-center">
          <p className="font-bold text-slate-300">DARSLY SaaS v1.0</p>
          <p className="text-[10px] mt-0.5">منصة تعليمية متكاملة</p>
        </div>
      </div>
    </aside>
  );
}
