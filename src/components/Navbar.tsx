'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, User, LogOut, ShieldCheck, GraduationCap, LayoutDashboard, Menu, X, ChevronDown, LogIn } from 'lucide-react';

interface NavbarProps {
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    status: string;
    avatar?: string;
  } | null;
}

export default function Navbar({ currentUser }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  // Hide Navbar completely on dashboard workspace routes to give a clean full-screen experience
  const isDashboardRoute =
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/student') ||
    pathname.startsWith('/admin') ||
    pathname === '/profile';

  if (isDashboardRoute) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-blue-500/30 shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform bg-slate-900 flex items-center justify-center">
              <img src="/logo.png" alt="DARSLY Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                DARSLY<span className="text-blue-500 text-3xl leading-none">.</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 -mt-1 hidden sm:block">
                مكانك للتعلم من أفضل المدرسين
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-slate-200 hover:text-blue-400 transition-colors">
              الرئيسية
            </Link>
            <Link href="/teachers" className="text-slate-300 hover:text-blue-400 transition-colors">
              المدرسين
            </Link>
            <Link href="/courses" className="text-slate-300 hover:text-blue-400 transition-colors">
              الكورسات
            </Link>
            <Link href="/#how-it-works" className="text-slate-300 hover:text-blue-400 transition-colors">
              كيف تعمل المنصة
            </Link>
            <Link href="/#about" className="text-slate-300 hover:text-blue-400 transition-colors">
              عن Darsly
            </Link>
          </nav>

          {/* Action Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl px-3.5 py-2 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center overflow-hidden">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white max-w-[120px] truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-blue-400 font-medium">
                      {currentUser.role === 'admin'
                        ? 'أدمن المنصة'
                        : currentUser.role === 'teacher'
                        ? currentUser.status === 'approved'
                          ? 'مدرس معتمد'
                          : 'مدرس قيد المراجعة'
                        : 'طالب'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-800/80">
                      <p className="text-xs text-slate-400">مسجل كـ</p>
                      <p className="text-sm font-semibold text-white truncate">{currentUser.email}</p>
                    </div>

                    {/* Dynamic Dashboard Link based on Role and Status */}
                    {currentUser.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-blue-600/20 hover:text-blue-400 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        لوحة تحكم الأدمن
                      </Link>
                    )}

                    {currentUser.role === 'teacher' && (
                      <>
                        {currentUser.status === 'approved' ? (
                          <Link
                            href="/teacher/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-blue-600/20 hover:text-blue-400 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-400" />
                            لوحة تحكم المدرس
                          </Link>
                        ) : (
                          <Link
                            href="/teacher/pending"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-400" />
                            حالة الطلب (قيد المراجعة)
                          </Link>
                        )}
                      </>
                    )}

                    {currentUser.role === 'student' && (
                      <Link
                        href="/student/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-blue-600/20 hover:text-blue-400 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        لوحة التعلم الخاصة بي
                      </Link>
                    )}

                    <div className="border-t border-slate-800/80 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-right"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  <LogIn className="w-4 h-4 text-blue-400" />
                  <span>تسجيل الدخول</span>
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 font-medium">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 py-1">
              الرئيسية
            </Link>
            <Link href="/teachers" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 py-1">
              المدرسين
            </Link>
            <Link href="/courses" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 py-1">
              الكورسات
            </Link>
          </nav>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            {currentUser ? (
              <>
                <div className="text-xs text-slate-400">أهلاً، {currentUser.name}</div>
                {currentUser.role === 'admin' && (
                  <Link href="/admin/dashboard" className="text-blue-400 font-semibold text-sm">
                    لوحة تحكم الأدمن
                  </Link>
                )}
                {currentUser.role === 'teacher' && (
                  <Link
                    href={currentUser.status === 'approved' ? '/teacher/dashboard' : '/teacher/pending'}
                    className="text-blue-400 font-semibold text-sm"
                  >
                    لوحة المدرس
                  </Link>
                )}
                {currentUser.role === 'student' && (
                  <Link href="/student/dashboard" className="text-blue-400 font-semibold text-sm">
                    لوحة الطالب
                  </Link>
                )}
                <button onClick={handleLogout} className="text-rose-400 text-sm font-semibold text-right">
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full text-center bg-slate-800 text-white font-medium py-2.5 rounded-xl"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center bg-blue-600 text-white font-semibold py-2.5 rounded-xl"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
