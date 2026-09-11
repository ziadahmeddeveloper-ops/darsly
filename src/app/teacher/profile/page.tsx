'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Sparkles, Globe, Image as ImageIcon, Save, CheckCircle2, AlertCircle, ExternalLink, MessageCircle, Video, Award, User, Upload, UploadCloud } from 'lucide-react';

export default function TeacherProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    coverImage: '',
    customSlug: '',
    avatar: '',
    whatsapp: '',
    facebook: '',
    youtube: '',
    experienceYears: 0,
  });

  useEffect(() => {
    fetch('/api/teacher/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          const p = data.profile;
          setFormData({
            name: p.user?.name || '',
            title: p.title || '',
            bio: p.bio || '',
            coverImage: p.coverImage || '',
            customSlug: p.customSlug || '',
            avatar: p.user?.avatar || '',
            whatsapp: p.whatsapp || '',
            facebook: p.facebook || '',
            youtube: p.youtube || '',
            experienceYears: p.experienceYears || 0,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/teacher/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.message || 'حدث خطأ أثناء الحفظ' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل الاتصال بالخادم.' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: 'coverImage' | 'avatar',
    type: 'covers' | 'avatars'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (targetField === 'coverImage') setUploadingCover(true);
    if (targetField === 'avatar') setUploadingAvatar(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('type', type);

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (result.success && result.imageUrl) {
        setFormData((prev) => ({ ...prev, [targetField]: result.imageUrl }));
        setMessage({
          type: 'success',
          text: `تم رفع ${targetField === 'coverImage' ? 'صورة الغلاف' : 'صورة البروفايل'} من جهازك بنجاح! 🎉`,
        });
      } else {
        setMessage({ type: 'error', text: result.message || 'حدث خطأ أثناء رفع الصورة.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل رفع الملف من الجهاز.' });
    } finally {
      setUploadingCover(false);
      setUploadingAvatar(false);
    }
  };

  const platformSlug = formData.customSlug || 'teacher-id';

  const defaultCovers = [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200',
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar role="teacher" />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-5xl">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>إعدادات منشئ المنصات</span>
            </div>
            <h1 className="text-2xl font-black text-white">تخصيص موقعك الإلكتروني الخاص</h1>
            <p className="text-xs text-slate-400 mt-1">قم بإعداد صورة الغلاف ورابط منصتك الفريد ليمتلك طلابك مساحة خاصة بهم</p>
          </div>

          <a
            href={`/t/${platformSlug}`}
            target="_blank"
            rel="noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 shrink-0 hover:scale-105"
          >
            <Globe className="w-4 h-4" />
            <span>معاينة منصتك المستقلة</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {message && (
          <div
            className={`p-4 rounded-2xl border text-sm font-bold flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">جاري تحميل إعدادات المنصة...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Live Cover & Avatar Preview Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0">
              <div className="h-48 sm:h-64 relative bg-slate-950 border-b border-slate-800/80">
                <img
                  src={formData.coverImage || defaultCovers[0]}
                  alt="Cover Banner"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                <span className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-xs font-bold text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800">
                  معاينة صورة الغلاف الحالية
                </span>
              </div>

              <div className="p-6 relative -mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-5">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-slate-950 shadow-2xl bg-slate-900 shrink-0">
                  <img
                    src={formData.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200'}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1 text-center sm:text-right flex-1">
                  <h2 className="text-xl font-black text-white">{formData.name || 'اسم الأستاذ'}</h2>
                  <p className="text-xs font-bold text-blue-400">{formData.title || 'عنوان المدرس المعلم'}</p>
                  <p className="text-[11px] text-slate-400">رابط المنصة: <code className="text-emerald-400">darsly.com/t/{formData.customSlug || 'رابط-مخصص'}</code></p>
                </div>
              </div>
            </div>

            {/* Custom URL Slug Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Globe className="w-5 h-5 text-blue-400" />
                رابط منصتك الإلكترونية المستقلة (Platform Slug)
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">اسم الرابط الفريد (Slug)</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs dir-ltr">
                  <span className="text-slate-500 font-bold">darsly.com/t/</span>
                  <input
                    type="text"
                    value={formData.customSlug}
                    onChange={(e) => setFormData({ ...formData, customSlug: e.target.value })}
                    placeholder="mr-ahmed-physics"
                    className="bg-transparent text-white font-bold flex-1 outline-none text-left"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  سيكون هذا الرابط هو المساحة المخصصة لك على الإنترنت (مثال: mr-ahmed). عند إرساله لطلابك، يدخلون فوراً لمنصتك المستقلة.
                </p>
              </div>
            </div>

            {/* Cover Photo Selection */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                صورة الغلاف (Cover Banner)
              </h3>

              <div className="space-y-5">
                {/* Local Device Upload Box */}
                <div className="bg-slate-950 border border-dashed border-emerald-500/40 hover:border-emerald-500 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
                  <div className="space-y-1 text-center sm:text-right">
                    <p className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                      <UploadCloud className="w-4.5 h-4.5 text-emerald-400" />
                      رفع صورة غلاف من جهازك مباشرة (JPG, PNG, WebP)
                    </p>
                    <p className="text-[11px] text-slate-400">سيتم حفظ الصورة وعرضها على غلاف منصتك المستقلة فوراً</p>
                  </div>

                  <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 shrink-0 hover:scale-105">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingCover ? 'جاري رفع الملف...' : 'اختيار صورة غلاف من جهازك 📁'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'coverImage', 'covers')}
                      disabled={uploadingCover}
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">أو أدخل رابط صورة الغلاف (URL)</label>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400">أو اختر غلافاً جاهزاً لمنصتك:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {defaultCovers.map((imgUrl, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setFormData({ ...formData, coverImage: imgUrl })}
                        className={`relative h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                          formData.coverImage === imgUrl ? 'border-blue-500 ring-2 ring-blue-500/50 scale-105' : 'border-slate-800 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information & Socials */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <User className="w-5 h-5 text-purple-400" />
                البيانات التعريفية ووسائل التواصل
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">الاسم الكامل</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Profile Picture (Avatar) with Device Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">صورة البروفايل الشخصية (Avatar)</label>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="رابط أو مسار الصورة"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500 w-full"
                    />
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center hover:scale-105">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingAvatar ? 'جاري الرفع...' : 'رفع من جهازك 📁'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'avatar', 'avatars')}
                        disabled={uploadingAvatar}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">المسمى الوظيفي / التخصص</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: خبير مادة الفيزياء للثانوية العامة"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">النبذة التعريفية (Bio)</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="اكتب نبذة عن خبرتك وأسلوبك في الشرح لتشجيع الطلاب..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-400" /> رقم الواتساب للتواصل
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="201000000000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" /> عدد سنوات الخبرة
                  </label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-rose-400" /> رابط قناة اليوتيوب
                  </label>
                  <input
                    type="text"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    placeholder="https://youtube.com/@..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-400" /> رابط صفحة الفيسبوك
                  </label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-105"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'جاري حفظ التغييرات...' : 'حفظ إعدادات المنصة الشخصية'}</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
