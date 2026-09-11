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

    const teacherUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { teacherProfile: true },
    });

    if (!teacherUser || teacherUser.role !== 'teacher') {
      return NextResponse.json({ success: false, message: 'المدرس غير موجود.' }, { status: 404 });
    }

    // Execute Status Change & Audit Action
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { status: 'approved' },
      }),
      prisma.teacherProfile.update({
        where: { userId },
        data: { verified: true },
      }),
      prisma.adminAction.create({
        data: {
          adminId: admin.id,
          action: 'TEACHER_APPROVED',
          targetType: 'TEACHER',
          targetId: userId,
          details: `تم اعتماد المدرس ${teacherUser.name} (${teacherUser.email}) من الأدمن ${admin.name}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `تم اعتماد المدرس ${teacherUser.name} بنجاح. أصبح بإمكانه الآن دخول لوحة التحكم.`,
    });
  } catch (error: any) {
    console.error('Approve Teacher Error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء اعتماد المدرس.' }, { status: 500 });
  }
}
