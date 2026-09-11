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
    const type = (formData.get('type') as string) || 'images';

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

    // Max size: 4MB for Base64 cloud storage efficiency
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'حجم الصورة كبير جداً. الحد الأقصى 4MB.' },
        { status: 400 }
      );
    }

    // Convert file buffer to Base64 Data URL for serverless compatibility
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || 'image/jpeg';
    const imageUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

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
