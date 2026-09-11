import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApprovedTeacher } from '@/lib/auth-guard';

export async function GET() {
  try {
    const user = await requireApprovedTeacher();
    const questions = await prisma.question.findMany({
      where: { teacherId: user.teacherId },
      include: { options: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
}
