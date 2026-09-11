'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Users, Search, Trash2, CheckCircle2, ShieldAlert, UserCheck, GraduationCap, Shield } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher' | 'admin'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${name}"؟`)) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message);
        return;
      }
      setToastMsg(data.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.includes(search) || u.email.includes(search) || (u.phone && u.phone.includes(search));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        {toastMsg && (
          <div className="fixed top-24 left-8 z-50 bg-emerald-600 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-2">
              <Users className="w-4 h-4" />
              <span>إدارة مستخدمي المنصة بالكامل</span>
            </div>
            <h1 className="text-3xl font-black text-white">إدارة حسابات المستخدمين</h1>
            <p className="text-xs text-slate-400 mt-1">الطلاب، المدرسين، والأدمن مع إمكانية البحث والتحكم والحذف</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-lg ${roleFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                الكل ({users.length})
              </button>
              <button
                onClick={() => setRoleFilter('student')}
                className={`px-3 py-1.5 rounded-lg ${roleFilter === 'student' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                الطلاب
              </button>
              <button
                onClick={() => setRoleFilter('teacher')}
                className={`px-3 py-1.5 rounded-lg ${roleFilter === 'teacher' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                المدرسين
              </button>
              <button
                onClick={() => setRoleFilter('admin')}
                className={`px-3 py-1.5 rounded-lg ${roleFilter === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                الأدمن
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو البريد..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-20 text-xs text-slate-400">جاري التحميل...</p>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">المستخدم</th>
                    <th className="px-6 py-4">النوع / الدور</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4">تاريخ التسجيل</th>
                    <th className="px-6 py-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={u.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {u.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                            <Shield className="w-3.5 h-3.5" /> أدمن
                          </span>
                        )}
                        {u.role === 'teacher' && (
                          <span className="inline-flex items-center gap-1 font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                            <GraduationCap className="w-3.5 h-3.5" /> مدرس
                          </span>
                        )}
                        {u.role === 'student' && (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            <UserCheck className="w-3.5 h-3.5" /> طالب
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`font-bold px-2.5 py-1 rounded-lg text-[10px] ${
                            u.status === 'approved' || u.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : u.status === 'pending'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString('ar-EG')}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {u.email !== 'admin@darsly.com' && (
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                            title="حذف المستخدم"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
