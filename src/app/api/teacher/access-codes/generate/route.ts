import { NextResponse } from 'next/server';
import { requireApprovedTeacher } from '@/lib/auth-guard';
import { generateBulkAccessCodes } from '@/lib/access-codes';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const user = await requireApprovedTeacher();
    const { courseId, count = 500, expirationDays } = await request.json();

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'يرجى اختيار الكورس.' }, { status: 400 });
    }

    // Verify course belongs to this approved teacher
    const course = await prisma.course.findFirst({
      where: { id: courseId, teacherId: user.teacherId },
    });

    if (!course) {
      return NextResponse.json({ success: false, message: 'الكورس غير موجود أو غير تابع لك.' }, { status: 403 });
    }

    const generatedCodes = await generateBulkAccessCodes(
      courseId,
      user.teacherId!,
      Math.min(count, 1000), // Max 1000 per request
      expirationDays ? parseInt(expirationDays) : undefined
    );

    return NextResponse.json({
      success: true,
      message: `تم توليد ${generatedCodes.length} كود وصول بنجاح للكورس "${course.title}".`,
      count: generatedCodes.length,
      sampleCodes: generatedCodes.slice(0, 10),
    });
  } catch (error: any) {
    console.error('Generate Access Codes Error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء توليد أكواد الوصول.' }, { status: 500 });
  }
}
