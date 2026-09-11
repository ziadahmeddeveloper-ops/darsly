import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApprovedTeacher } from '@/lib/auth-guard';

export async function GET() {
  try {
    const user = await requireApprovedTeacher();

    const courses = await prisma.course.findMany({
      where: { teacherId: user.teacherId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
}
