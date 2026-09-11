import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
    }

    // Protect super admin deletion
    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    if (target.email === 'admin@darsly.com') {
      return NextResponse.json({ success: false, message: 'لا يمكن حذف الحساب الرئيسي للأدمن.' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.user.delete({ where: { id: userId } }),
      prisma.adminAction.create({
        data: {
          adminId: admin.id,
          action: 'USER_DELETED',
          targetType: 'USER',
          targetId: userId,
          details: `حذف المستخدم ${target.name} (${target.email})`,
        },
      }),
    ]);

    return NextResponse.json({ success: true, message: `تم حذف المستخدم ${target.name} بنجاح.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error deleting user' }, { status: 500 });
  }
}
