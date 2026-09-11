'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { ShieldAlert, CheckCircle2, XCircle, Ban, Eye, Search, Filter, AlertTriangle } from 'lucide-react';

export default function AdminTeachersPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'suspended'>('pending');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [confirmModal, setConfirmModal] = useState<'approve' | 'reject' | 'suspend' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/teachers/list?status=${activeTab}`);
      const data = await res.json();
      if (data.success) {
        setTeachers(data.teachers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [activeTab]);

  const handleApprove = async () => {
    if (!selectedTeacher) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/teachers/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedTeacher.id }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message);
        setConfirmModal(null);
        setSelectedTeacher(null);
        fetchTeachers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTeacher) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/teachers/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedTeacher.id }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message);
        setConfirmModal(null);
        setSelectedTeacher(null);
        fetchTeachers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedTeacher) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/teachers/suspend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedTeacher.id }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message);
        setConfirmModal(null);
        setSelectedTeacher(null);
        fetchTeachers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto overflow-x-hidden">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-24 left-8 z-50 bg-emerald-600 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400/40 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>لوحة التحكم المركزية للأدمن</span>
            </div>
            <h1 className="text-3xl font-black text-white">طلبات اعتماد المدرسين (Teacher Requests)</h1>
            <p className="text-xs text-slate-400 mt-1">
              إدارة طلبات الانضمام، مراجعة بيانات المدرسين، واتخاذ قرار الاعتماد الصريح أو الرفض أو التعليق.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
          <div className="flex items-center gap-2">
            {[
              { id: 'pending', label: 'طلبات قيد الانتظار', icon: ShieldAlert, color: 'text-amber-400' },
              { id: 'approved', label: 'المدرسون المعتمدون', icon: CheckCircle2, color: 'text-emerald-400' },
              { id: 'rejected', label: 'الطلبات المرفوضة', icon: XCircle, color: 'text-rose-400' },
              { id: 'suspended', label: 'الحسابات المعلقة', icon: Ban, color: 'text-purple-400' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو البريد..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Teachers Cards List */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">جاري تحميل البيانات...</div>
        ) : teachers.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-bold text-white text-base">لا توجد طلبات في هذا القسم حالياً</p>
            <p className="text-xs">جميع الطلبات في هذه الفئة تم معالجتها بالكامل.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teachers
              .filter((t) => t.name.includes(search) || t.email.includes(search))
              .map((t) => {
                const profile = t.teacherProfile;
                const subjects = profile?.subjects ? JSON.parse(profile.subjects) : [];
                const grades = profile?.grades ? JSON.parse(profile.grades) : [];

                return (
                  <div
                    key={t.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* User Header */}
                      <div className="flex items-start gap-4">
                        <img
                          src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={t.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shrink-0"
                        />
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-lg font-bold text-white truncate">{t.name}</h3>
                          <p className="text-xs text-blue-400 font-medium truncate">{t.email}</p>
                          <p className="text-xs text-slate-400">هاتف: <span dir="ltr">{t.phone || 'غير مدخل'}</span></p>
                        </div>
                      </div>

                      {/* Bio & Details */}
                      {profile?.bio && (
                        <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                          {profile.bio}
                        </p>
                      )}

                      {/* Metadata tags */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">المواد:</span>
                          <span className="font-bold text-slate-200">{subjects.join(', ') || 'عام'}</span>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">سنوات الخبرة:</span>
                          <span className="font-bold text-slate-200">{profile?.experienceYears || 0} سنوات</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedTeacher(t);
                          setConfirmModal('approve');
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 text-center"
                      >
                        اعتماد المدرس
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTeacher(t);
                          setConfirmModal('reject');
                        }}
                        className="bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 text-rose-300 hover:text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all text-center"
                      >
                        رفض
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTeacher(t);
                          setConfirmModal('suspend');
                        }}
                        className="bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-purple-300 hover:text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all text-center"
                      >
                        تعليق
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* APPROVAL CONFIRMATION MODAL (Section 2 Requirement) */}
        {confirmModal === 'approve' && selectedTeacher && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">اعتماد حساب المدرس</h3>
                <p className="text-base font-bold text-emerald-400">هل أنت متأكد من اعتماد هذا المدرس؟</p>
                <p className="text-xs text-slate-400">
                  سيتم تغيير حالة الحساب إلى **APPROVED** ومنحه صلاحيات كاملة لدخول لوحة التحكم وإنشاء الكورسات.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl text-xs text-slate-300 text-right space-y-1">
                <div>المدرس: <strong className="text-white">{selectedTeacher.name}</strong></div>
                <div>البريد: <strong className="text-white">{selectedTeacher.email}</strong></div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setConfirmModal(null)}
                  disabled={actionLoading}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-xl transition-colors"
                >
                  إلغاء [ Cancel ]
                </button>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
                >
                  {actionLoading ? 'جاري الاعتماد...' : 'اعتماد المدرس [ Approve Teacher ]'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REJECT / SUSPEND MODALS */}
        {confirmModal === 'reject' && selectedTeacher && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">رفض طلب المدرس</h3>
              <p className="text-xs text-slate-400">سيتم رفض هذا الطلب ولن يتمكن المدرس من دخول لوحة التحكم.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setConfirmModal(null)} className="bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold">إلغاء</button>
                <button onClick={handleReject} className="bg-rose-600 text-white py-2.5 rounded-xl text-xs font-bold">تأكيد الرفض</button>
              </div>
            </div>
          </div>
        )}

        {confirmModal === 'suspend' && selectedTeacher && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
                <Ban className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">تعليق حساب المدرس</h3>
              <p className="text-xs text-slate-400">سيتم تجميد حساب المدرس ومنعه من إنشاء المحتوى فوراً.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setConfirmModal(null)} className="bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold">إلغاء</button>
                <button onClick={handleSuspend} className="bg-purple-600 text-white py-2.5 rounded-xl text-xs font-bold">تأكيد التعليق</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
