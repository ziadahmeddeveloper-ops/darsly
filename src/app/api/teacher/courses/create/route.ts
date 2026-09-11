import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApprovedTeacher } from '@/lib/auth-guard';
import { extractYouTubeVideoId } from '@/lib/video';

export async function POST(request: Request) {
  try {
    const user = await requireApprovedTeacher();
    const body = await request.json();
    const { title, description, subject, grade, price, accessType, thumbnail, lessons } = body;

    if (!title || !description || !subject || !grade) {
      return NextResponse.json({ success: false, message: 'يرجى إدخال جميع البيانات المطلوبة الكورس.' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const course = await prisma.course.create({
      data: {
        teacherId: user.teacherId!,
        title,
        slug,
        description,
        subject,
        grade,
        price: parseFloat(price) || 0,
        accessType: accessType || (parseFloat(price) > 0 ? 'paid' : 'free'),
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600',
        status: 'published',
        lessons: {
          create: (lessons || []).map((l: any, idx: number) => {
            const hasParts = Array.isArray(l.parts) && l.parts.length > 0;
            const mainVideoId = hasParts
              ? extractYouTubeVideoId(l.parts[0].videoId || 'L_LUpnjgPso')
              : extractYouTubeVideoId(l.videoId || 'L_LUpnjgPso');

            return {
              title: l.title || `المحاضرة ${idx + 1}`,
              description: l.description || '',
              videoProvider: l.videoProvider || 'youtube',
              videoId: mainVideoId,
              orderIndex: idx + 1,
              ...(hasParts && {
                parts: {
                  create: l.parts.map((p: any, pIdx: number) => ({
                    title: p.title || `الجزء ${pIdx + 1}`,
                    description: p.description || '',
                    videoProvider: p.videoProvider || 'youtube',
                    videoId: extractYouTubeVideoId(p.videoId || 'L_LUpnjgPso'),
                    orderIndex: pIdx + 1,
                    examId: p.examId || null,
                  })),
                },
              }),
            };
          }),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `تم إنشاء كورس "${course.title}" بنجاح!`,
      courseId: course.id,
    });
  } catch (error: any) {
    console.error('Create Course Error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ في إنشاء الكورس.' }, { status: 500 });
  }
}
