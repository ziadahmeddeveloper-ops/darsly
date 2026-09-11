'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  const isDashboardRoute =
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/student') ||
    pathname.startsWith('/admin') ||
    pathname === '/profile';

  if (isDashboardRoute) {
    return null;
  }
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden border border-blue-500/30 shadow-lg shadow-blue-500/20 bg-slate-900 flex items-center justify-center">
                <img src="/logo.png" alt="DARSLY Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                DARSLY<span className="text-blue-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              المنصة التعليمية الأولى للربط بين الطلاب وأفضل المدرسين المعتمدين في مصر والوطن العربي لتجربة تعلم استثنائية.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              جميع المدرسين مراجَعين ومعتمدين من إدارة المنصة
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/teachers" className="hover:text-blue-400 transition-colors">
                  دليل المدرسين المعتمدين
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-blue-400 transition-colors">
                  جميع الكورسات والدورات
                </Link>
              </li>
              <li>
                <Link href="/register?role=teacher" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  الانضمام كمدرس في Darsly
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Subjects */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">المواد الدراسية</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/teachers?subject=رياضيات" className="hover:text-blue-400 transition-colors">
                  الرياضيات والتفاضل
                </Link>
              </li>
              <li>
                <Link href="/teachers?subject=فيزياء" className="hover:text-blue-400 transition-colors">
                  الفيزياء الكهربية والحديثة
                </Link>
              </li>
              <li>
                <Link href="/teachers?subject=لغة عربية" className="hover:text-blue-400 transition-colors">
                  اللغة العربية والبلاغة
                </Link>
              </li>
              <li>
                <Link href="/teachers?subject=كيمياء" className="hover:text-blue-400 transition-colors">
                  الكيمياء العضوية
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@darsly.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <span dir="ltr">+20 109 718 8298</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 DARSLY Platform. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-300">
              الشروط والأحكام
            </Link>
            <Link href="/privacy" className="hover:text-slate-300">
              سياسة الخصوصية
            </Link>
            <span className="flex items-center gap-1">
              صُنع بكل <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> لخدمة التعليم العربي
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
