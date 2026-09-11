'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Key, Plus, Download, CheckCircle2, Copy, Search, Filter, Lock } from 'lucide-react';

export default function TeacherAccessCodesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [codeCount, setCodeCount] = useState<number>(100);
  const [expirationDays, setExpirationDays] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'used'>('all');

  useEffect(() => {
    // Fetch teacher courses
    fetch('/api/teacher/courses/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.courses.length > 0) {
          setCourses(data.courses);
          setSelectedCourseId(data.courses[0].id);
        }
      });
  }, []);

  const fetchCodes = async () => {
    if (!selectedCourseId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/teacher/access-codes/list?courseId=${selectedCourseId}`);
      const data = await res.json();
      if (data.success) {
        setCodes(data.codes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, [selectedCourseId]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    setGenerating(true);

    try {
      const res = await fetch('/api/teacher/access-codes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourseId,
          count: codeCount,
          expirationDays: expirationDays || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message);
        fetchCodes();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const exportCodesTxt = () => {
    const textContent = codes.map((c) => `${c.code}\tStatus: ${c.status}`).join('\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `darsly-access-codes-${Date.now()}.txt`;
    link.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage(`تم نسخ الكود: ${text}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredCodes = codes.filter((c) => {
    const matchesSearch = c.code.includes(searchTerm.toUpperCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableCount = codes.filter((c) => c.status === 'available').length;
  const usedCount = codes.filter((c) => c.status === 'used').length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
      <Sidebar role="teacher" teacherStatus="approved" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-24 left-8 z-50 bg-emerald-600 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400/40 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-2">
              <Key className="w-4 h-4" />
              <span>نظام تفعيل الكورسات والأكواد</span>
            </div>
            <h1 className="text-3xl font-black text-white">مولد أكواد الوصول (Access Codes Generator)</h1>
            <p className="text-xs text-slate-400 mt-1">
              توليد وتصقيل أكواد عشوائية فريدة لاستخدامها مرة واحدة لفتح الكورسات المدفوعة للطلاب.
            </p>
          </div>

          <button
            onClick={exportCodesTxt}
            disabled={codes.length === 0}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-3 rounded-xl border border-slate-700 transition-all flex items-center gap-2 w-fit"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>تصدير الأكواد (Export TXT)</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs text-slate-400 font-bold">إجمالي الأكواد</span>
            <p className="text-2xl font-black text-white mt-1">{codes.length}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs text-slate-400 font-bold">الأكواد المتاحة (Unused)</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{availableCount}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs text-slate-400 font-bold">الأكواد المستخدمة (Redeemed)</span>
            <p className="text-2xl font-black text-blue-400 mt-1">{usedCount}</p>
          </div>
        </div>

        {/* Generate Section Form */}
        <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            توليد دفعة أكواد جديدة
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">اختر الكورس</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.price} ج.م)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">عدد الأكواد المطلوبة</label>
              <input
                type="number"
                min={1}
                max={1000}
                value={codeCount}
                onChange={(e) => setCodeCount(parseInt(e.target.value) || 10)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">صلاحية الأكواد (أيام)</label>
              <input
                type="number"
                placeholder="بدون تاريخ انتهاء (اختياري)"
                value={expirationDays}
                onChange={(e) => setExpirationDays(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={generating || !selectedCourseId}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
          >
            {generating ? (
              <span>جاري التوليد...</span>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>توليد {codeCount} كود جديد</span>
              </>
            )}
          </button>
        </form>

        {/* Codes Table List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-white">قائمة الأكواد لهذه المادة</h3>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs font-bold">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setStatusFilter('available')}
                  className={`px-3 py-1 rounded-lg ${statusFilter === 'available' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                >
                  المتاحة
                </button>
                <button
                  onClick={() => setStatusFilter('used')}
                  className={`px-3 py-1 rounded-lg ${statusFilter === 'used' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                >
                  المستخدمة
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="ابحث عن كود..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-center py-10 text-xs text-slate-400">جاري التحميل...</p>
          ) : filteredCodes.length === 0 ? (
            <p className="text-center py-10 text-xs text-slate-400">لا توجد أكواد مطابقة لخيارات البحث.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredCodes.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-mono transition-all ${
                    item.status === 'used'
                      ? 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-75'
                      : 'bg-slate-950 border-slate-800 text-emerald-400 font-bold hover:border-emerald-500/50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-sm tracking-wider">{item.code}</span>
                    <span className="block text-[9px] font-sans text-slate-400">
                      {item.status === 'used' ? 'تم الاستخدام' : 'متاح للتفعيل'}
                    </span>
                  </div>

                  {item.status === 'available' && (
                    <button
                      onClick={() => copyToClipboard(item.code)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                      title="نسخ الكود"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
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
