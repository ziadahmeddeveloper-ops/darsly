import './globals.css';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MainContainerWrapper from '@/components/MainContainerWrapper';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: 'DARSLY | مكانك للتعلم من أفضل المدرسين',
  description: 'المنصة التعليمية الأولى للربط بين الطلاب وأفضل المدرسين المعتمدين في مصر والوطن العربي.',
  keywords: 'درسلي, Darsly, تعليم, دروس خاصة, ثانوية عامة, تفاضل, فيزياء, كورس, امتحانات',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <Navbar currentUser={currentUser} />
        <MainContainerWrapper>{children}</MainContainerWrapper>
        <Footer />
      </body>
    </html>
  );
}
