import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ success: false, message: 'غير مصرح لك access denied' }, { status: 401 });
    }

    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: user.id },
      include: {
        centerSchedules: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ success: false, message: 'ملف المدرس غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true, schedules: profile.centerSchedules });
  } catch (err) {
    console.error('Fetch schedules error:', err);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء جلب المواعيد.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ success: false, message: 'غير مصرح لك' }, { status: 401 });
    }

    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json({ success: false, message: 'ملف المدرس غير موجود' }, { status: 404 });
    }

    const body = await request.json();
    const { centerName, location, subject, grade, dayOfWeek, startTime, endTime, notes } = body;

    if (!centerName || !location || !dayOfWeek || !startTime || !endTime) {
      return NextResponse.json({ success: false, message: 'يرجى إدخال جميع البيانات الأساسية للموعد' }, { status: 400 });
    }

    const schedule = await prisma.centerSchedule.create({
      data: {
        teacherId: profile.id,
        centerName,
        location,
        subject: subject || null,
        grade: grade || null,
        dayOfWeek,
        startTime,
        endTime,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, message: 'تم إضافة موعد السنتر بنجاح! 📍', schedule });
  } catch (err) {
    console.error('Create schedule error:', err);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء حفظ الموعد.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ success: false, message: 'غير مصرح لك' }, { status: 401 });
    }

    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json({ success: false, message: 'ملف المدرس غير موجود' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('id');

    if (!scheduleId) {
      return NextResponse.json({ success: false, message: 'معرف الموعد مطلوب' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.centerSchedule.findFirst({
      where: { id: scheduleId, teacherId: profile.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: 'الموعد غير موجود أو لا تملكه' }, { status: 404 });
    }

    await prisma.centerSchedule.delete({
      where: { id: scheduleId },
    });

    return NextResponse.json({ success: true, message: 'تم حذف الموعد بنجاح.' });
  } catch (err) {
    console.error('Delete schedule error:', err);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء حذف الموعد.' }, { status: 500 });
  }
}
