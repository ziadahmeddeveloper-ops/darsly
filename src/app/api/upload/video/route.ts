import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'يجب تسجيل الدخول أولاً.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'لم يتم اختيار أي ملف فيديو.' }, { status: 400 });
    }

    // Validate video MIME type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-matroska', 'video/avi'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|mkv|avi|ogg)$/i)) {
      return NextResponse.json(
        { success: false, message: 'صيغة الفيديو غير مدعومة. استخدم صيغ MP4 أو WebM أو MOV.' },
        { status: 400 }
      );
    }

    // Serverless cloud storage check: Large direct video files cannot be saved to serverless memory
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'على السيرفر السحابي المجاني، يرجى إدخال رابط فيديو يوتيوب مباشرة للحصول على أداء ممتاز وبدون حدود للحجم.' 
        },
        { status: 400 }
      );
    }

    // Small video fallback as Data URL
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || 'video/mp4';
    const videoUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      videoUrl,
      message: 'تم رفع فيديو الشرح بنجاح! 🎬',
    });
  } catch (err) {
    console.error('Video upload error:', err);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء رفع ملف الفيديو.' }, { status: 500 });
  }
}
