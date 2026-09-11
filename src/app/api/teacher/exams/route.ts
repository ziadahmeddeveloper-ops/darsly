import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApprovedTeacher } from '@/lib/auth-guard';

export async function GET() {
  try {
    const user = await requireApprovedTeacher();
    const exams = await prisma.exam.findMany({
      where: {
        teacherId: user.teacherId!,
        status: 'published',
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, exams });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'حدث خطأ في استجابة امتحانات المدرس.' }, { status: 500 });
  }
}
