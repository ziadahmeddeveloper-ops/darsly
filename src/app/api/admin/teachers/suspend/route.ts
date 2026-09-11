import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'معرف المدرس غير محدد.' }, { status: 400 });
    }

    const teacherUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!teacherUser) {
      return NextResponse.json({ success: false, message: 'المدرس غير موجود.' }, { status: 404 });
    }

    const newStatus = teacherUser.status === 'suspended' ? 'approved' : 'suspended';
    const actionName = newStatus === 'suspended' ? 'TEACHER_SUSPENDED' : 'TEACHER_UNSUSPENDED';

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { status: newStatus },
      }),
      prisma.adminAction.create({
        data: {
          adminId: admin.id,
          action: actionName,
          targetType: 'TEACHER',
          targetId: userId,
          details: `تم تغيير حالة حساب المدرس ${teacherUser.name} إلى ${newStatus}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: newStatus === 'suspended' ? `تم تعليق حساب المدرس ${teacherUser.name}.` : `تم فك تعليق حساب المدرس ${teacherUser.name}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء تعديل حالة المدرس.' }, { status: 500 });
  }
}
