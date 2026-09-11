'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Building2,
  BookOpen,
  GraduationCap,
  FileText,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface Schedule {
  id: string;
  centerName: string;
  location: string;
  subject?: string;
  grade?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  notes?: string;
  createdAt: string;
}

export default function TeacherSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form Fields
  const [centerName, setCenterName] = useState('');
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('السبت والثلثاء');
  const [startTime, setStartTime] = useState('04:00 مساءً');
  const [endTime, setEndTime] = useState('06:00 مساءً');
  const [notes, setNotes] = useState('');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/teacher/schedules');
      const data = await res.json();
      if (data.success) {
        setSchedules(data.schedules);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!centerName || !location || !dayOfWeek || !startTime || !endTime) {
      showToast('يرجى ملء كافة الحقول الأساسية لجدول السنتر.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/teacher/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          centerName,
          location,
          subject,
          grade,
          dayOfWeek,
          startTime,
          endTime,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setCenterName('');
        setLocation('');
        setNotes('');
        setShowForm(false);
        fetchSchedules();
      } else {
        showToast(data.message, 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء إضافة الموعد.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('هل أنت تأكد من رغبتك في حذف هذا الموعد؟')) return;

    try {
      const res = await fetch(`/api/teacher/schedules?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setSchedules((prev) => prev.filter((s) => s.id !== id));
      } else {
        showToast(data.message, 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء الحذف.', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar role="teacher" teacherStatus="approved" />

      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          {toast.msg}
        </div>
      )}

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-2">
              <Calendar className="w-4 h-4" />
              <span>جدول الحصص والأوفلاين</span>
            </div>
            <h1 className="text-3xl font-black text-white">مواعيد السناتر والحصص</h1>
            <p className="text-xs text-slate-400 mt-1">
              أضف مواعيدك في مختلف السناتر والأماكن ليتمكن طلابك من معرفة مواعيد الحضور والأماكن المتاحة
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'إلغاء النموذج' : 'إضافة موعد سنتر جديد'}</span>
          </button>
        </div>

        {/* Create Form Modal / Card */}
        {showForm && (
          <form
            onSubmit={handleAddSchedule}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in duration-300"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                بيانات السنتر والموعد
              </h3>
              <span className="text-xs text-slate-400">جميع البيانات تظهر للطلاب في بروفايلك</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم السنتر *</label>
                <input
                  type="text"
                  placeholder="مثال: سنتر التفوق / سنتر الأوائل"
                  value={centerName}
                  onChange={(e) => setCenterName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الموقع والعنوان التفصيلي *</label>
                <input
                  type="text"
                  placeholder="مثال: القاهرة - مدينة نصر - شارع الطيران بجوار مسجد..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">المادة الدراسية</label>
                <input
                  type="text"
                  placeholder="مثال: فيزياء / كيمياء / رياضيات"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الصف الدراسي</label>
                <input
                  type="text"
                  placeholder="مثال: الصف الثالث الثانوي"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">أيام الحضور *</label>
                <input
                  type="text"
                  placeholder="مثال: السبت والأربعاء / الأحد والثلاثاء"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">بداية الحصة *</label>
                  <input
                    type="text"
                    placeholder="04:00 مساءً"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">نهاية الحصة *</label>
                  <input
                    type="text"
                    placeholder="06:00 مساءً"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">ملاحظات الحجز وتفاصيل الحصة (اختياري)</label>
              <textarea
                rows={2}
                placeholder="مثال: الحجز مسبقاً بالسنتر / مراجعة نهائية..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'جاري الحفظ...' : 'حفظ الموعد ف المنصة'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Schedules Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            قائمة مواعيدك المتاحة حالياً ({schedules.length})
          </h2>

          {loading ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-3xl">
              <p className="text-xs text-slate-400 animate-pulse">جاري تحميل مواعيد السناتر...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">لم تقم بإضافة أي مواعيد سناتر بعد.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                أضف مواعيدك في السناتر لتظهر لطلابك في ملفك الشخصي لسهولة التنسيق والحجز.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all mt-2"
              >
                <Plus className="w-4 h-4" />
                إضافة أول موعد سنتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {schedules.map((sch) => (
                <div
                  key={sch.id}
                  className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-xl transition-all relative group"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">
                        <Building2 className="w-3.5 h-3.5" />
                        {sch.centerName}
                      </span>
                      {sch.grade && <p className="text-xs font-bold text-blue-400 mt-1">{sch.grade}</p>}
                    </div>

                    <button
                      onClick={() => handleDeleteSchedule(sch.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                      title="حذف الموعد"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-b border-slate-800/80 py-3">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{sch.location}</span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <span className="font-bold text-white">{sch.dayOfWeek}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>
                          {sch.startTime} - {sch.endTime}
                        </span>
                      </div>
                    </div>

                    {sch.subject && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                        <span>المادة: {sch.subject}</span>
                      </div>
                    )}
                  </div>

                  {sch.notes && (
                    <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
                      💬 {sch.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
