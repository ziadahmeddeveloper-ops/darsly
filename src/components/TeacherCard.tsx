import React from 'react';
import Link from 'next/link';
import { Star, Users, BookOpen, CheckCircle2, ArrowLeft } from 'lucide-react';

export interface TeacherCardProps {
  id: string;
  name: string;
  avatar?: string | null;
  customSlug?: string | null;
  subject: string;
  grades: string[];
  rating: number;
  studentCount: number;
  courseCount: number;
  verified: boolean;
  bio?: string | null;
}

export default function TeacherCard({
  id,
  name,
  avatar,
  customSlug,
  subject,
  grades,
  rating,
  studentCount,
  courseCount,
  verified,
  bio,
}: TeacherCardProps) {
  const targetUrl = `/t/${customSlug || id}`;

  return (
    <div className="group relative bg-slate-900/90 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-blue-500/10 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
      {/* Subtle background glow on hover */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all pointer-events-none" />

      <div>
        {/* Top Info Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700/80 group-hover:border-blue-500/80 transition-colors shrink-0">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={name}
              className="w-full h-full object-cover"
            />
            {verified && (
              <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-tl-lg p-0.5" title="مدرس معتمد">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                {name}
              </h3>
              {verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  معتمد
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-blue-400 mb-1">{subject}</p>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Bio snippet if available */}
        {bio && <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{bio}</p>}

        {/* Grades badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {grades.map((grade, idx) => (
            <span key={idx} className="text-[11px] font-medium bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/50">
              {grade}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Footer & CTA */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <strong className="text-white font-bold">{studentCount.toLocaleString()}</strong> طالب
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <strong className="text-white font-bold">{courseCount}</strong> كورس
          </span>
        </div>

        <Link
          href={targetUrl}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:text-white bg-blue-600/10 group-hover:bg-blue-600 px-3.5 py-2 rounded-xl border border-blue-500/20 transition-all"
        >
          <span>زيارة المنصة 🌐</span>
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
