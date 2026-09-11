import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing course id' }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          include: { user: true },
        },
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
    }

    const user = await getCurrentUser();
    let hasAccess = false;

    if (course.accessType === 'free') {
      hasAccess = true;
    } else if (user) {
      const access = await prisma.courseAccess.findFirst({
        where: {
          studentId: user.id,
          courseId: course.id,
          status: 'active',
        },
      });
      if (access || user.role === 'admin' || (user.role === 'teacher' && user.teacherId === course.teacherId)) {
        hasAccess = true;
      }
    }

    return NextResponse.json({ success: true, course, hasAccess });
  } catch (error: any) {
    console.error('Course Details Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
