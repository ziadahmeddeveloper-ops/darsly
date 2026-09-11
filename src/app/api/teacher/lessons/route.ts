import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }

    const { lessonId } = await request.json();
    if (!lessonId) {
      return NextResponse.json({ success: false, message: 'معرف الدرس مطلوب' }, { status: 400 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson) {
      return NextResponse.json({ success: false, message: 'الدرس غير موجود' }, { status: 404 });
    }

    if (user.role === 'admin') {
      await prisma.lesson.delete({ where: { id: lessonId } });
      return NextResponse.json({ success: true, message: `تم حذف الدرس "${lesson.title}" بنجاح.` });
    }

    if (user.role === 'teacher') {
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { userId: user.id },
      });

      if (!teacherProfile || lesson.course.teacherId !== teacherProfile.id) {
        return NextResponse.json({ success: false, message: 'غير مسموح لك بحذف هذا الفيديو' }, { status: 403 });
      }

      await prisma.lesson.delete({ where: { id: lessonId } });
      return NextResponse.json({ success: true, message: `تم حذف الدرس "${lesson.title}" بنجاح.` });
    }

    return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'خطأ أثناء حذف الدرس' }, { status: 500 });
  }
}
