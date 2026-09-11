import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const teachers = await prisma.user.findMany({
      where: {
        role: 'teacher',
        status,
      },
      include: {
        teacherProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, teachers });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
}
