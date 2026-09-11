import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'يجب تسجيل الدخول أولاً.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'لم يتم اختيار أي ملف.' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WebP.' },
        { status: 400 }
      );
    }

    // Validate file size (max 3MB)
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'حجم الصورة كبير جداً. الحد الأقصى 3MB.' },
        { status: 400 }
      );
    }

    // Build unique filename: userId-timestamp.ext
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${user.id}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    const filepath = path.join(uploadDir, filename);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write the file
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    // Persist the public URL to the user record
    const avatarUrl = `/uploads/avatars/${filename}`;
    await prisma.user.update({
      where: { id: user.id },
      data: { avatar: avatarUrl },
    });

    return NextResponse.json({
      success: true,
      avatarUrl,
      message: 'تم رفع الصورة وحفظها بنجاح! ✅',
    });
  } catch (err) {
    console.error('Avatar upload error:', err);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء رفع الصورة.' }, { status: 500 });
  }
}
