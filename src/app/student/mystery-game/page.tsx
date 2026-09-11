'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Sparkles, RefreshCw, Trophy, Shield, Zap, Eye, Award, HelpCircle, Star, CheckCircle2 } from 'lucide-react';
import BackButton from '@/components/BackButton';

interface Player {
  id: string;
  name: string;
  rating: number;
  position: string;
  club: string;
  country: string;
  image: string;
  rarity: 'gold' | 'diamond' | 'silver';
  color: string;
}

const PLAYER_POOL: Player[] = [
  {
    id: '1',
    name: 'محمد صلاح',
    rating: 92,
    position: 'RW (مهاجم جناح)',
    club: 'ليفربول',
    country: 'مصر 🇪🇬',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
    rarity: 'diamond',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    id: '2',
    name: 'ليونيل ميسي',
    rating: 94,
    position: 'RW / CAM (صانع ألعاب)',
    club: 'إنتر ميامي',
    country: 'الأرجنتين 🇦🇷',
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=400',
    rarity: 'diamond',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: '3',
    name: 'كريستيانو رونالدو',
    rating: 93,
    position: 'ST (مهاجم صريح)',
    club: 'النصر',
    country: 'البرتغال 🇵🇹',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
    rarity: 'diamond',
    color: 'from-rose-500 to-red-600',
  },
  {
    id: '4',
    name: 'كيليان مبابي',
    rating: 93,
    position: 'ST / LW (مهاجم)',
    club: 'ريال مدريد',
    country: 'فرنسا 🇫🇷',
    image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=400',
    rarity: 'diamond',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: '5',
    name: 'إيرلينج هالاند',
    rating: 92,
    position: 'ST (مهاجم صريح)',
    club: 'مانشستر سيتي',
    country: 'النرويج 🇳🇴',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400',
    rarity: 'gold',
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: '6',
    name: 'فينيسيوس جونيور',
    rating: 91,
    position: 'LW (جناح أيسر)',
    club: 'ريال مدريد',
    country: 'البرازيل 🇧🇷',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400',
    rarity: 'gold',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: '7',
    name: 'جود بيلينجهام',
    rating: 90,
    position: 'CAM / CM (وسط)',
    club: 'ريال مدريد',
    country: 'إنجلترا 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400',
    rarity: 'gold',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: '8',
    name: 'كيفين دي بروين',
    rating: 91,
    position: 'CM (صانع ألعاب)',
    club: 'مانشستر سيتي',
    country: 'بلجيكا 🇧🇪',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    rarity: 'gold',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: '9',
    name: 'لامين يامال',
    rating: 88,
    position: 'RW (جناح أيمن)',
    club: 'برشلونة',
    country: 'إسبانيا 🇪🇸',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
    rarity: 'silver',
    color: 'from-red-500 to-rose-600',
  },
  {
    id: '10',
    name: 'زين الدين زيدان',
    rating: 96,
    position: 'ICON (أسطورة الوسط)',
    club: 'كلاسيك أساطير',
    country: 'فرنسا 🇫🇷',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400',
    rarity: 'diamond',
    color: 'from-yellow-400 to-amber-600',
  },
  {
    id: '11',
    name: 'رونالدينيو',
    rating: 95,
    position: 'ICON (أسطورة المهارة)',
    club: 'كلاسيك أساطير',
    country: 'البرازيل 🇧🇷',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400',
    rarity: 'diamond',
    color: 'from-amber-400 to-yellow-500',
  },
  {
    id: '12',
    name: 'لوكا مودريتش',
    rating: 89,
    position: 'CM (مايسترو الوسط)',
    club: 'ريال مدريد',
    country: 'كرواتيا 🇭🇷',
    image: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=400',
    rarity: 'silver',
    color: 'from-violet-500 to-purple-600',
  },
];

export default function MysteryPlayerGamePage() {
  const [currentCards, setCurrentCards] = useState<Player[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [myPicksHistory, setMyPicksHistory] = useState<Player[]>([]);

  // Function to pick 3 unique random players from pool
  const generateNewRound = () => {
    const shuffled = [...PLAYER_POOL].sort(() => 0.5 - Math.random());
    const selected3 = shuffled.slice(0, 3);
    setCurrentCards(selected3);
    setSelectedIndex(null);
    setIsRevealed(false);
  };

  useEffect(() => {
    generateNewRound();
  }, []);

  const handlePickCard = (index: number) => {
    if (isRevealed) return;
    setSelectedIndex(index);
    setIsRevealed(true);
    setRoundsPlayed((prev) => prev + 1);

    const pickedPlayer = currentCards[index];
    setMyPicksHistory((prev) => [pickedPlayer, ...prev.slice(0, 4)]);
  };

  const myPlayer = selectedIndex !== null ? currentCards[selectedIndex] : null;

  // Determine if picked player is the highest rating among the 3
  const isBestPick = myPlayer
    ? myPlayer.rating >= Math.max(...currentCards.map((c) => c.rating))
    : false;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar role="student" />

      <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header & Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <BackButton label="رجوع" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>تحدي اللاعب العشوائي والكروت المخفية</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              اختيار اللاعب العشوائي (3 Mystery Cards)
            </h1>
            <p className="text-xs text-slate-400">
              اختر كارت واحد من الـ 3 كروت المخفية، وبمجرد الاختيار سيتم كشف كارتك وكشف الكروت الأخرى لمعرفة ماذا جلب المنافس!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">الجولات اللعوبة</span>
              <span className="text-lg font-black text-purple-400">{roundsPlayed}</span>
            </div>
            <button
              onClick={generateNewRound}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>جولة جديدة</span>
            </button>
          </div>
        </div>

        {/* REVEAL ANNOUNCEMENT BANNER */}
        {isRevealed && myPlayer && (
          <div
            className={`p-6 rounded-3xl border shadow-2xl transition-all animate-fade-in ${
              isBestPick
                ? 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-yellow-950/80 border-amber-500/40 text-amber-300'
                : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-slate-200'
            }`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center md:text-right">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    {isBestPick ? '🔥 اختيار أسطوري ممتاز!' : '✨ حصلت على لاعب جيد!'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    كارتك المختارات: <span className="font-bold text-amber-400">{myPlayer.name} ({myPlayer.rating})</span> — تم كشف الكروت الأخرى لمعرفة اللاعبين المتبقين!
                  </p>
                </div>
              </div>

              <button
                onClick={generateNewRound}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة اللعب 🔄</span>
              </button>
            </div>
          </div>
        )}

        {/* 3 MYSTERY CARDS CONTAINER */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-white">
              {!isRevealed ? '👇 اختر كارت واحد من الكروت الـ 3 المخفية' : '🎉 تم كشف جميع الكروت والمقارنة'}
            </h2>
            <p className="text-xs text-slate-400">
              {!isRevealed ? 'انقر على أي كارت لكشف لاعبك واكتشاف ما جلبته الكروت الأخرى!' : 'شاهد لاعبك واللاعبين المتبقين في الكروت الأخرى'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentCards.map((player, idx) => {
              const isChosen = selectedIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => handlePickCard(idx)}
                  className={`relative group cursor-pointer rounded-3xl transition-all duration-500 transform ${
                    !isRevealed ? 'hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 active:scale-95' : ''
                  } ${isChosen ? 'ring-4 ring-amber-400 shadow-2xl scale-105 z-10' : ''}`}
                >
                  {!isRevealed ? (
                    /* FACE DOWN MYSTERY CARD */
                    <div className="bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border-2 border-purple-500/30 rounded-3xl p-8 h-96 flex flex-col items-center justify-between text-center shadow-xl group-hover:border-purple-400 transition-all overflow-hidden relative">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_70%)]" />

                      <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-sm">
                        كارت #{idx + 1}
                      </div>

                      <div className="space-y-3 relative z-10">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl border-2 border-purple-400/40 group-hover:rotate-6 transition-transform">
                          <HelpCircle className="w-12 h-12 text-white animate-pulse" />
                        </div>
                        <h3 className="text-lg font-black text-white tracking-wide">كارت غامض مخفي</h3>
                        <p className="text-xs text-purple-300 font-semibold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                          اضغط لكشف اللاعب ❓
                        </p>
                      </div>

                      <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                        DARSLY MYSTERY PICK
                      </div>
                    </div>
                  ) : (
                    /* REVEALED CARD FRONT */
                    <div
                      className={`bg-slate-900 border-2 rounded-3xl overflow-hidden h-96 flex flex-col justify-between shadow-2xl transition-all relative ${
                        isChosen
                          ? 'border-amber-400 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900'
                          : 'border-slate-800 opacity-95'
                      }`}
                    >
                      {/* Chosen Badge */}
                      {isChosen && (
                        <div className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> اختيارك!
                        </div>
                      )}

                      {!isChosen && (
                        <div className="absolute top-3 left-3 bg-slate-800/90 text-slate-400 font-bold text-[10px] px-2.5 py-1 rounded-full border border-slate-700 z-20">
                          الكارت المنافس #{idx + 1}
                        </div>
                      )}

                      {/* Rating & Rarity Header */}
                      <div className="p-5 pb-0 flex items-start justify-between relative z-10">
                        <div>
                          <span className="text-3xl font-black text-white tracking-tighter block">
                            {player.rating}
                          </span>
                          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                            {player.position}
                          </span>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg text-white bg-gradient-to-r ${player.color} shadow-md`}>
                          {player.rarity === 'diamond' ? '💎 أسطوري' : player.rarity === 'gold' ? '🥇 ذهبي' : '🥈 فضي'}
                        </span>
                      </div>

                      {/* Player Image */}
                      <div className="relative w-full h-44 flex items-center justify-center my-1 overflow-hidden">
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-36 h-36 rounded-2xl object-cover border-2 border-slate-700 shadow-xl group-hover:scale-105 transition-all"
                        />
                      </div>

                      {/* Player Info Footer */}
                      <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 space-y-2 text-center">
                        <h3 className="text-lg font-black text-white leading-snug">{player.name}</h3>
                        <div className="flex items-center justify-center gap-3 text-xs text-slate-400 font-semibold">
                          <span>{player.club}</span>
                          <span>•</span>
                          <span>{player.country}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RECENT PICKS HISTORY */}
        {myPicksHistory.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              سجل لاعبينك المختارين مؤخراً
            </h3>
            <div className="flex flex-wrap gap-3">
              {myPicksHistory.map((p, i) => (
                <div
                  key={i}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 w-48 shadow-md"
                >
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-amber-400 font-semibold">تقييم {p.rating} • {p.club}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
