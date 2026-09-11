'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, BookOpen, Calendar, Star, User, LogOut, ChevronDown, LayoutDashboard, ShieldCheck, Menu, X } from 'lucide-react';

interface TeacherSubsiteHeaderProps {
  teacher: {
    id: string;
    name: string;
    avatar?: string | null;
    customSlug?: string | null;
    teacherProfile?: {
      title?: string | null;
      whatsapp?: string | null;
    } | null;
  };
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    status: string;
    avatar?: string;
  } | null;
}

export default function TeacherSubsiteHeader({ teacher, currentUser }: TeacherSubsiteHeaderProps) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const teacherSlug = teacher.customSlug || teacher.id;
  const whatsappNum = teacher.teacherProfile?.whatsapp;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Teacher Brand & Avatar */}
          <Link href={`/t/${teacherSlug}`} className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-blue-500/50 shadow-lg shadow-blue-500/20 bg-slate-900 ring-2 ring-blue-500/30 group-hover:scale-105 transition-all">
                <img
                  src={teacher.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
                  alt={teacher.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-sm" />
            </div>

            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                منصة الأستاذ {teacher.name}
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              </span>
              <span className="text-xs text-blue-400 font-semibold truncate max-w-[160px] sm:max-w-[220px]">
                {teacher.teacherProfile?.title || 'الموقع التعليمي الرسمي'}
              </span>
            </div>
          </Link>

          {/* Subsite Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold">
            <Link
              href={`/t/${teacherSlug}`}
              className="text-slate-200 hover:text-blue-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-xl transition-all"
            >
              الرئيسية
            </Link>
            <Link
              href={`/t/${teacherSlug}#courses`}
              className="text-slate-300 hover:text-blue-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              الكورسات والمحاضرات
            </Link>
            <Link
              href={`/t/${teacherSlug}#schedules`}
              className="text-slate-300 hover:text-blue-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              جدول السناتر
            </Link>
            <Link
              href={`/t/${teacherSlug}#reviews`}
              className="text-slate-300 hover:text-blue-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              آراء الطلاب
            </Link>
          </nav>

          {/* User Account / Contact Button */}
          <div className="flex items-center gap-3">
            {whatsappNum && (
              <a
                href={`https://wa.me/${whatsappNum.replace(/\+/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-emerald-500/30 transition-all items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </a>
            )}

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-3 py-1.5 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center overflow-hidden">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white max-w-[80px] sm:max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800/80">
                      <p className="text-[10px] text-slate-400">حسابك في Darsly</p>
                      <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    </div>

                    {currentUser.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-200 hover:bg-blue-600/20 hover:text-blue-400"
                      >
                        <ShieldCheck className="w-4 h-4 text-blue-400" /> لوحة الأدمن
                      </Link>
                    )}

                    {currentUser.role === 'teacher' && (
                      <Link
                        href="/teacher/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-200 hover:bg-blue-600/20 hover:text-blue-400"
                      >
                        <LayoutDashboard className="w-4 h-4 text-blue-400" /> لوحة التحكم للمدرس
                      </Link>
                    )}

                    {currentUser.role === 'student' && (
                      <Link
                        href="/student/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-200 hover:bg-blue-600/20 hover:text-blue-400"
                      >
                        <BookOpen className="w-4 h-4 text-blue-400" /> لوحة تعلمي
                      </Link>
                    )}

                    <div className="border-t border-slate-800 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 text-right"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" /> تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={`/login?callback=/t/${teacherSlug}`}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 sm:px-4 py-2 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
                >
                  تسجيل الدخول
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-blue-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href={`/t/${teacherSlug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-white bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl"
            >
              الرئيسية
            </Link>
            <Link
              href={`/t/${teacherSlug}#courses`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-bold text-slate-200 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              الكورسات والمحاضرات
            </Link>
            <Link
              href={`/t/${teacherSlug}#schedules`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-bold text-slate-200 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              جدول السناتر
            </Link>
            <Link
              href={`/t/${teacherSlug}#reviews`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-bold text-slate-200 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              آراء الطلاب
            </Link>

            {whatsappNum && (
              <a
                href={`https://wa.me/${whatsappNum.replace(/\+/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-600/20 text-emerald-400 font-bold text-xs p-3 rounded-xl border border-emerald-500/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>التواصل عبر واتساب</span>
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
