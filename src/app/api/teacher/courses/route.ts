import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApprovedTeacher } from '@/lib/auth-guard';

export async function DELETE(request: Request) {
  try {
    const user = await requireApprovedTeacher();
    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID required' }, { status: 400 });
    }

    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: user.id },
    });

    if (!teacherProfile) {
      return NextResponse.json({ success: false, message: 'Teacher profile not found' }, { status: 404 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
    }

    if (course.teacherId !== teacherProfile.id) {
      return NextResponse.json({ success: false, message: 'غير مسموح لك بحذف هذا الكورس' }, { status: 403 });
    }

    await prisma.course.delete({ where: { id: courseId } });

    return NextResponse.json({ success: true, message: `تم حذف الكورس "${course.title}" بنجاح.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error deleting course' }, { status: 500 });
  }
}
