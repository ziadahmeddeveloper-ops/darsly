'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function MainContainerWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute =
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/student') ||
    pathname.startsWith('/admin') ||
    pathname === '/profile';

  return <main className={`flex-1 ${isDashboardRoute ? 'pt-0' : 'pt-20'}`}>{children}</main>;
}
