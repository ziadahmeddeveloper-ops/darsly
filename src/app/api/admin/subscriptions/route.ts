import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

export async function GET() {
  try {
    await requireAdmin();
    const subscriptions = await prisma.subscription.findMany({
      include: {
        teacher: { include: { user: true } },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, subscriptions });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
}
