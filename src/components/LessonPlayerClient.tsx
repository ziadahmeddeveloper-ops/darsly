'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { extractYouTubeVideoId } from '@/lib/video';
import {
  PlayCircle,
  CheckCircle2,
  FileText,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  Award,
  Clock,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

interface LessonPart {
  id: string;
  title: string;
  description?: string | null;
  videoProvider: string;
  videoId: string;
  orderIndex: number;
  examId?: string | null;
  exam?: {
    id: string;
    title: string;
    durationMinutes: number;
    passingScore: number;
  } | null;
}

interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  videoProvider: string;
  videoId: string;
  attachmentUrl?: string | null;
  parts: LessonPart[];
}

interface LessonPlayerClientProps {
  courseId: string;
  lesson: Lesson;
  allLessons: Lesson[];
  subsiteSlug?: string;
  teacherName: string;
}

export default function LessonPlayerClient({
  courseId,
  lesson,
  allLessons,
  subsiteSlug,
  teacherName,
}: LessonPlayerClientProps) {
  const [activePartIndex, setActivePartIndex] = useState(0);

  const parts = lesson.parts && lesson.parts.length > 0 ? lesson.parts : [];
  const currentPart = parts.length > 0 ? parts[activePartIndex] : null;

  const currentVideoId = currentPart ? currentPart.videoId : lesson.videoId;
  const currentTitle = currentPart ? currentPart.title : lesson.title;
  const currentVideoProvider = currentPart ? currentPart.videoProvider : lesson.videoProvider;

  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const getLessonUrl = (lId: string) => {
    return subsiteSlug
      ? `/t/${subsiteSlug}/courses/${courseId}/lessons/${lId}`
      : `/courses/${courseId}/lessons/${lId}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start dir-rtl">
      {/* Main Video & Part Controls */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Multi-Part Stepper Tabs Banner */}
        {parts.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                هذه الحصة مقسمة إلى {parts.length} أجزاء تفاعلية:
              </span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                الجزء {activePartIndex + 1} من {parts.length}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {parts.map((part, idx) => (
                <button
                  key={part.id || idx}
                  onClick={() => setActivePartIndex(idx)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border ${
                    activePartIndex === idx
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30 scale-[1.02]'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-lg text-[10px] flex items-center justify-center font-black ${
                    activePartIndex === idx ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <span>{part.title}</span>
                  {part.exam && (
                    <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-md font-black">
                      امتحان
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Video Player Frame */}
        <div className="relative aspect-video w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {currentVideoProvider === 'html5' || currentVideoId.startsWith('/uploads/') || currentVideoId.match(/\.(mp4|webm|mov|mkv)$/i) ? (
            <video
              src={currentVideoId}
              controls
              controlsList="nodownload"
              playsInline
              className="w-full h-full object-contain bg-slate-950"
            >
              متصفحك لا يدعم تشغيل عناصر الفيديو المباشر.
            </video>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeVideoId(currentVideoId)}?rel=0&modestbranding=1&autoplay=0`}
              title={currentTitle}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* POST-PART QUIZ CALLOUT CARD */}
        {currentPart && currentPart.exam && (
          <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/90 border-2 border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black">
                  <Award className="w-4 h-4" />
                  <span>اختبار تقييمي عقب مشاهدة {currentPart.title}</span>
                </div>
                <h3 className="text-xl font-black text-white">{currentPart.exam.title}</h3>
                <p className="text-xs text-slate-300">
                  اختبر مدى فهمك لما تم شرحه في هذا الجزء قبل الانتقال للجزء التالي!
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-4 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    مدة الامتحان: {currentPart.exam.durationMinutes} دقيقة
                  </span>
                  <span>•</span>
                  <span>درجة النجاح: {currentPart.exam.passingScore}%</span>
                </div>
              </div>

              <Link
                href={`/exams/${currentPart.exam.id}`}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 hover:scale-105 shrink-0"
              >
                <span>ابدأ امتحان هذا الجزء الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Lesson Info Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-black text-white">{currentTitle}</h1>
              <p className="text-xs text-blue-400 font-bold mt-1">
                الأستاذ {teacherName} • {lesson.title}
              </p>
            </div>

            {/* Prev / Next Part & Lesson controls */}
            <div className="flex items-center gap-2">
              {parts.length > 0 ? (
                <>
                  <button
                    onClick={() => setActivePartIndex(Math.max(0, activePartIndex - 1))}
                    disabled={activePartIndex === 0}
                    className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" /> الجزء السابق
                  </button>

                  <button
                    onClick={() => setActivePartIndex(Math.min(parts.length - 1, activePartIndex + 1))}
                    disabled={activePartIndex === parts.length - 1}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1 disabled:cursor-not-allowed"
                  >
                    الجزء التالي <ChevronLeft className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  {prevLesson ? (
                    <Link
                      href={getLessonUrl(prevLesson.id)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1"
                    >
                      <ChevronRight className="w-4 h-4" /> المحاضرة السابقة
                    </Link>
                  ) : null}

                  {nextLesson ? (
                    <Link
                      href={getLessonUrl(nextLesson.id)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1"
                    >
                      المحاضرة التالية <ChevronLeft className="w-4 h-4" />
                    </Link>
                  ) : null}
                </>
              )}
            </div>
          </div>

          {lesson.description && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400">ملخص وشرح المحاضرة:</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{lesson.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Lessons & Parts List */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-blue-400" />
          فهرس الكورس ({allLessons.length} حصة)
        </h3>

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {allLessons.map((l, idx) => {
            const isCurrent = l.id === lesson.id;
            return (
              <div key={l.id} className="space-y-1">
                <Link
                  href={getLessonUrl(l.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                    isCurrent
                      ? 'bg-blue-600/15 border-blue-500/50 text-white font-bold'
                      : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 ${
                        isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className="truncate">{l.title}</span>
                  </div>

                  {isCurrent && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
                </Link>

                {/* Subparts list if current lesson */}
                {isCurrent && l.parts && l.parts.length > 0 && (
                  <div className="mr-6 pr-2 border-r-2 border-blue-500/30 space-y-1 pt-1">
                    {l.parts.map((p, pIdx) => (
                      <button
                        key={p.id || pIdx}
                        onClick={() => setActivePartIndex(pIdx)}
                        className={`w-full text-right p-2 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-between ${
                          activePartIndex === pIdx
                            ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="truncate">الجزء {pIdx + 1}: {p.title}</span>
                        {p.exam && <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">امتحان</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
