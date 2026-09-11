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
    const type = (formData.get('type') as string) || 'images'; // covers, avatars, images

    if (!file) {
      return NextResponse.json({ success: false, message: 'لم يتم اختيار أي ملف.' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'صيغة الصورة غير مدعومة. يرجى استخدام JPG أو PNG أو WebP.' },
        { status: 400 }
      );
    }

    // Max size: 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'حجم الصورة كبير جداً. الحد الأقصى 10MB.' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    const filepath = path.join(uploadDir, filename);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/${type}/${filename}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'تم رفع الصورة بنجاح! ✅',
    });
  } catch (err) {
    console.error('Image upload error:', err);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء رفع الصورة.' }, { status: 500 });
  }
}
