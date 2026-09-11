import React from 'react';
import Link from 'next/link';
import { BookOpen, Lock, Unlock, ArrowLeft } from 'lucide-react';

export interface CourseCardProps {
  id: string;
  title: string;
  thumbnail?: string | null;
  subject: string;
  grade: string;
  price: number;
  accessType: 'free' | 'paid';
  teacherName: string;
  teacherAvatar?: string | null;
  lessonCount?: number;
  isUnlocked?: boolean;
}

export default function CourseCard({
  id,
  title,
  thumbnail,
  subject,
  grade,
  price,
  accessType,
  teacherName,
  teacherAvatar,
  lessonCount = 0,
  isUnlocked = false,
}: CourseCardProps) {
  return (
    <div className="group relative bg-slate-900/90 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-blue-500/10 hover:-translate-y-1 flex flex-col justify-between">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg">
            {subject}
          </span>
          <span className="text-[11px] font-medium bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700/50 px-2.5 py-1 rounded-lg">
            {grade}
          </span>
        </div>

        {/* Access status badge */}
        <div className="absolute bottom-3 left-3">
          {accessType === 'free' ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md px-2.5 py-1 rounded-lg">
              <Unlock className="w-3 h-3" /> مجاني
            </span>
          ) : isUnlocked ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md px-2.5 py-1 rounded-lg">
              <Unlock className="w-3 h-3" /> مفتوح
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-md px-2.5 py-1 rounded-lg">
              <Lock className="w-3 h-3" /> كود وصول
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-3">
            {title}
          </h3>

          {/* Teacher snippet */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
              <img
                src={teacherAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100'}
                alt={teacherName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-slate-300 font-medium">{teacherName}</span>
          </div>
        </div>

        {/* Footer: Lessons & Price & Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>{lessonCount} محاضرة</span>
          </div>

          <div className="flex items-center gap-3">
            {accessType === 'paid' && (
              <span className="text-sm font-black text-white">{price} <span className="text-xs text-blue-400 font-normal">ج.م</span></span>
            )}
            <Link
              href={`/courses/${id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3.5 py-2 rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              <span>تصفح</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
