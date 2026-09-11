import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApprovedTeacher } from '@/lib/auth-guard';

export async function GET() {
  try {
    const user = await requireApprovedTeacher();
    const attempts = await prisma.examAttempt.findMany({
      where: {
        exam: { teacherId: user.teacherId },
      },
      include: {
        exam: true,
        student: true,
        answers: { include: { question: true } },
      },
      orderBy: { startedAt: 'desc' },
      take: 20,
    });
    return NextResponse.json({ success: true, attempts });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
}
