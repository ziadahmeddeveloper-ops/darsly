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

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { status: 'rejected' },
      }),
      prisma.adminAction.create({
        data: {
          adminId: admin.id,
          action: 'TEACHER_REJECTED',
          targetType: 'TEACHER',
          targetId: userId,
          details: `تم رفض طلب انضمام المدرس ${teacherUser.name} (${teacherUser.email})`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `تم رفض طلب المدرس ${teacherUser.name}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء رفض الطلب.' }, { status: 500 });
  }
}
