import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

export async function GET() {
  try {
    await requireAdmin();
    const courses = await prisma.course.findMany({
      include: {
        teacher: { include: { user: true } },
        lessons: true,
        accessCodes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin();
    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID required' }, { status: 400 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.course.delete({ where: { id: courseId } }),
      prisma.adminAction.create({
        data: {
          adminId: admin.id,
          action: 'COURSE_DELETED',
          targetType: 'COURSE',
          targetId: courseId,
          details: `حذف الكورس "${course.title}" من الأدمن ${admin.name}`,
        },
      }),
    ]);

    return NextResponse.json({ success: true, message: `تم حذف الكورس "${course.title}" بنجاح.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error deleting course' }, { status: 500 });
  }
}
