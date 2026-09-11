import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApprovedTeacher } from '@/lib/auth-guard';

export async function GET(request: Request) {
  try {
    const user = await requireApprovedTeacher();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'courseId missing' }, { status: 400 });
    }

    const codes = await prisma.accessCode.findMany({
      where: {
        courseId,
        teacherId: user.teacherId,
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    return NextResponse.json({ success: true, codes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
}
