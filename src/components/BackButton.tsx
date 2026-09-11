'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  href?: string;
}

export default function BackButton({ label = 'رجوع', href }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600 px-3.5 py-2 rounded-xl transition-all duration-200 font-semibold"
    >
      <ArrowRight className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
