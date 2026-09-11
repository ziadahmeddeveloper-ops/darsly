'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { CreditCard, CheckCircle2, Search, Calendar, Shield } from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/subscriptions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubscriptions(data.subscriptions);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-2">
              <CreditCard className="w-4 h-4" />
              <span>إدارة اشتراكات المعلمين</span>
            </div>
            <h1 className="text-3xl font-black text-white">اشتراكات المدرسين في Darsly</h1>
            <p className="text-xs text-slate-400 mt-1">متابعة الباقات (Starter, Pro, Premium) وتواريخ التجديد</p>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-20 text-xs text-slate-400">جاري التحميل...</p>
        ) : subscriptions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            لا توجد اشتراكات مدرسين مسجلة حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={sub.teacher.user.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100'}
                      alt={sub.teacher.user.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{sub.teacher.user.name}</h4>
                      <p className="text-[11px] text-slate-400">{sub.teacher.user.email}</p>
                    </div>
                  </div>
                  <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">
                    باقة {sub.plan}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>حالة الاشتراك:</span>
                    <strong className="text-emerald-400">{sub.status}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>تاريخ البداية:</span>
                    <span>{new Date(sub.startDate).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تاريخ التجديد القادم:</span>
                    <span className="font-bold text-white">{new Date(sub.renewalDate).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
