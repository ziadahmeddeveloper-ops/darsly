import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

    // Max size: 200MB
    const maxSize = 200 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'حجم ملف الفيديو كبير جداً. الحد الأقصى 200MB.' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop() || 'mp4';
    const filename = `lesson-video-${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    const filepath = path.join(uploadDir, filename);

    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const videoUrl = `/uploads/videos/${filename}`;

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
