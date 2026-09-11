'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import { Camera, CheckCircle2, User, Phone, Lock, BookOpen, ChevronDown, Upload } from 'lucide-react';

// Pre-built avatar options (diverse, professional cartoon avatars)
const AVATAR_OPTIONS = [
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Aneka&backgroundColor=ffd5dc',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Milo&backgroundColor=d1f4cc',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Sara&backgroundColor=ffe4b5',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Ahmed&backgroundColor=c0e8ff',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Mohamed&backgroundColor=f0e6ff',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Nour&backgroundColor=fce4ec',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Hassan&backgroundColor=e8f5e9',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Fatima&backgroundColor=fff3e0',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Omar&backgroundColor=e3f2fd',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Layla&backgroundColor=fce4ec',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Karim&backgroundColor=f3e5f5',
  // Real-looking avatars via Unsplash
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
];

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [title, setTitle] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [facebook, setFacebook] = useState('');
  const [youtube, setYoutube] = useState('');
  const [avatar, setAvatar] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append('avatar', file);

      const res = await fetch('/api/upload/avatar', { method: 'POST', body: form });
      const data = await res.json();

      if (data.success) {
        setAvatar(data.avatarUrl);
        showToast(data.message, 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء رفع الصورة.', 'error');
    } finally {
      setUploading(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setUserData(data.user);
          setName(data.user.name || '');
          setPhone(data.user.phone || '');
          setAvatar(data.user.avatar || '');
          setBio(data.user.teacherProfile?.bio || '');
          setTitle(data.user.teacherProfile?.title || '');
          setWhatsapp(data.user.teacherProfile?.whatsapp || '');
          setFacebook(data.user.teacherProfile?.facebook || '');
          setYoutube(data.user.teacherProfile?.youtube || '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      showToast('كلمة المرور الجديدة وتأكيدها غير متطابقتين!', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          bio,
          title,
          whatsapp,
          facebook,
          youtube,
          avatar,
          currentPassword: newPassword ? currentPassword : undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordSection(false);
      } else {
        showToast(data.message, 'error');
      }
    } catch {
      showToast('حدث خطأ في الاتصال بالخادم.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
        <Sidebar role={userData?.role || 'student'} teacherStatus={userData?.status} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-400 text-sm animate-pulse">جاري تحميل الملف الشخصي...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
      <Sidebar role={userData?.role || 'student'} teacherStatus={userData?.status} />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          {toast.msg}
        </div>
      )}

      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-2">
            <User className="w-4 h-4" />
            <span>تعديل بياناتي الشخصية</span>
          </div>
          <h1 className="text-3xl font-black text-white">الملف الشخصي</h1>
          <p className="text-xs text-slate-400 mt-1">غيّر اسمك وصورتك ورقم هاتفك وكلمة مرورك بسهولة</p>
        </div>

        {/* Avatar Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Camera className="w-5 h-5 text-blue-400" /> الصورة الشخصية
          </h3>

          {/* Current Avatar Preview */}
          <div className="flex items-center gap-5">
            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="relative">
              <img
                src={avatar || `https://api.dicebear.com/8.x/avataaars/svg?seed=${name}`}
                alt="الصورة الشخصية"
                className="w-24 h-24 rounded-3xl object-cover border-4 border-blue-500/40 shadow-xl"
              />
              {uploading && (
                <div className="absolute inset-0 rounded-3xl bg-slate-950/70 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute -bottom-2 -left-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-1.5 shadow-lg transition-all"
                title="اختر من المكتبة"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-bold text-white">{name}</p>
                <p className="text-xs text-blue-400">{userData?.email}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {userData?.role === 'teacher' ? '👨‍🏫 مدرس معتمد' : userData?.role === 'admin' ? '🛡️ مدير المنصة' : '🎓 طالب'}
                </p>
              </div>

              {/* Upload from device button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-emerald-600/30 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                {uploading ? 'جاري الرفع...' : 'رفع صورة من جهازك'}
              </button>
              <p className="text-[10px] text-slate-500">JPG / PNG / WebP · أقصى حجم 3MB</p>
            </div>
          </div>

          {/* Avatar Grid Picker */}
          {showAvatarPicker && (
            <div className="space-y-4 pt-2">
              <p className="text-xs font-bold text-slate-300">اختر صورتك من المكتبة:</p>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {AVATAR_OPTIONS.map((av, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAvatar(av);
                      setShowAvatarPicker(false);
                    }}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                      avatar === av ? 'border-blue-500 scale-110 shadow-lg shadow-blue-600/30' : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <img src={av} alt={`avatar-${i}`} className="w-full aspect-square object-cover" />
                    {avatar === av && (
                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom URL input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="أو الصق رابط صورتك الشخصية هنا..."
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    if (customAvatarUrl.startsWith('http')) {
                      setAvatar(customAvatarUrl);
                      setCustomAvatarUrl('');
                      setShowAvatarPicker(false);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  تطبيق
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Personal Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-5 h-5 text-emerald-400" /> البيانات الشخصية
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">الاسم الكامل</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم الهاتف (واتساب)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 01012345678"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني (لا يمكن تعديله)</label>
            <input
              type="email"
              value={userData?.email || ''}
              disabled
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Teacher Extra Fields */}
          {userData?.role === 'teacher' && (
            <div className="space-y-4 pt-2 border-t border-slate-800/80">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">بيانات المدرس والبروفايل العام</h4>
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  المسمى الوظيفي / التخصص (يظهر تحت اسمك)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: خبير مادة الفيزياء للثانوية العامة"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم الواتساب للتواصل المباشر</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="مثال: 201012345678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">رابط صفحة الفيسبوك</label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">رابط قناة اليوتيوب</label>
                  <input
                    type="text"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/@..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  <BookOpen className="inline w-3.5 h-3.5 mr-1" /> نبذة تعريفية (تظهر في ملفك الشخصي للطلاب)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="اكتب نبذة مختصرة عن نفسك وخبرتك التدريسية..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="flex items-center justify-between w-full"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" /> تغيير كلمة المرور
            </h3>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showPasswordSection ? 'rotate-180' : ''}`} />
          </button>

          {showPasswordSection && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور الحالية</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="اكتب كلمة مرورك الحالية"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="كلمة مرور قوية"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">تأكيد كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد كتابة كلمة المرور"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm"
        >
          {saving ? (
            <span className="animate-pulse">جاري حفظ التغييرات...</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>حفظ جميع التغييرات</span>
            </>
          )}
        </button>
      </main>
    </div>
  );
}
