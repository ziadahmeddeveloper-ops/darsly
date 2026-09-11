import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Convert file buffer to Base64 Data URL for serverless compatibility
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || 'image/jpeg';
    const avatarUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

    // Persist the URL to the user record
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
