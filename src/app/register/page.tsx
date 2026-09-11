'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, UserCheck, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'teacher' ? 'teacher' : 'student';

  const [role, setRole] = useState<'student' | 'teacher'>(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('رياضيات');
  const [grade, setGrade] = useState('مدرس ثانوي');
  const [experienceYears, setExperienceYears] = useState('5');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          role,
          subject,
          grade,
          experienceYears,
          bio,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      if (role === 'teacher') {
        // MUST GO TO MANDATORY PENDING GATE PAGE
        router.push('/teacher/pending');
      } else {
        router.push('/student/dashboard');
      }
      router.refresh();
    } catch (err) {
      setError('حدث خطأ أثناء الاتصال بالسيرفر.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="w-16 h-16 rounded-2xl border border-blue-500/40 overflow-hidden bg-slate-950 shadow-xl shadow-blue-500/20">
              <img src="/logo.png" alt="DARSLY Logo" className="w-full h-full object-cover" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white">إنشاء حساب جديد في DARSLY</h1>
          <p className="text-xs text-slate-400">انضم إلى مجتمع التعلم الأكاديمي الرقمي</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'student'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>طالب (Student)</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'teacher'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>مدرس (Teacher)</span>
          </button>
        </div>

        {/* Mandatory Pending Notice for Teacher Selection */}
        {role === 'teacher' && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-2xl text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>تنبيـه هام لإنشاء حساب مدرس:</span>
            </div>
            <p className="leading-relaxed">
              إنشاء حساب المدرس يمر بمرحلة **المراجعة والاعتماد من إدارة DARSLY**. لن تتمكن من دخول لوحة المدرس أو رفع المحتوى إلا بعد الاعتماد الصريح من الأدمن.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">الاسم بالكامل</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أحمد محمد علي"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@darsly.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01012345678"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Teacher Specific Fields */}
          {role === 'teacher' && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">المادة الأساسية</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <optgroup label="المراحل العامة الأساسية">
                      <option value="رياضيات">رياضيات (تفاضل / جبر / هندسة)</option>
                      <option value="علوم">علوم</option>
                      <option value="فيزياء">فيزياء</option>
                      <option value="كيمياء">كيمياء</option>
                      <option value="أحياء">أحياء</option>
                      <option value="جيولوجيا">جيولوجيا وعلوم بيئة</option>
                      <option value="دراسات اجتماعية">دراسات اجتماعية</option>
                      <option value="تاريخ">تاريخ</option>
                      <option value="جغرافيا">جغرافيا</option>
                    </optgroup>
                    <optgroup label="اللغات والعلوم الإنسانية">
                      <option value="لغة عربية">لغة عربية (نحو / بلاغة / أدب)</option>
                      <option value="لغة إنجليزية">لغة إنجليزية (Connect / Connect Plus)</option>
                      <option value="لغة فرنسية">لغة فرنسية</option>
                      <option value="لغة ألمانية">لغة ألمانية</option>
                      <option value="لغة إيطالية">لغة إيطالية</option>
                      <option value="فلسفة ومنطق">فلسفة ومنطق</option>
                      <option value="علم نفس واجتماع">علم نفس واجتماع</option>
                      <option value="تكنولوجيا المعلومات">تكنولوجيا المعلومات (ICT / حاسب آلي)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="مدرس ثانوي">مدرس ثانوي (المرحلة الثانوية)</option>
                    <option value="مدرس إعدادي">مدرس إعدادي (المرحلة الإعدادية)</option>
                    <option value="مدرس ابتدائي">مدرس ابتدائي (المرحلة الابتدائية)</option>
                    <option value="مدرس جامعي">مدرس جامعي (المرحلة الجامعية / الكليات)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">نبذة عنك والمرحلة الدراسية</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="مدرس رياضيات بخبرة 8 سنوات في تدريس مرحلة الثانوية العامة..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>جاري إنشاء الحساب...</span>
            ) : (
              <span>{role === 'teacher' ? 'تقديم طلب الحساب كمدرس' : 'إنشاء حساب طالب'}</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-blue-400 font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
