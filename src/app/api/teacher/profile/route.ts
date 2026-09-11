import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApprovedTeacher } from '@/lib/auth-guard';

export async function GET() {
  try {
    const user = await requireApprovedTeacher();
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: user.id },
      include: { user: true },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireApprovedTeacher();
    const body = await request.json();
    const { title, bio, coverImage, customSlug, whatsapp, facebook, youtube, experienceYears, name, avatar } = body;

    // Validate slug uniqueness if provided
    let cleanSlug = customSlug ? customSlug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-') : null;

    if (cleanSlug) {
      const existingSlug = await prisma.teacherProfile.findFirst({
        where: {
          customSlug: cleanSlug,
          NOT: { userId: user.id },
        },
      });

      if (existingSlug) {
        return NextResponse.json(
          { success: false, message: 'عفواً، رابط المنصة (Slug) مستخدم بالفعل من قبل مدرس آخر. اختر رابطاً آخر.' },
          { status: 400 }
        );
      }
    }

    // Update User details if name or avatar provided
    if (name || avatar) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(name && { name }),
          ...(avatar && { avatar }),
        },
      });
    }

    // Update TeacherProfile
    const updatedProfile = await prisma.teacherProfile.update({
      where: { userId: user.id },
      data: {
        ...(title !== undefined && { title }),
        ...(bio !== undefined && { bio }),
        ...(coverImage !== undefined && { coverImage }),
        ...(cleanSlug !== undefined && { customSlug: cleanSlug }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(facebook !== undefined && { facebook }),
        ...(youtube !== undefined && { youtube }),
        ...(experienceYears !== undefined && { experienceYears: parseInt(experienceYears) || 0 }),
      },
      include: { user: true },
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات منصتك الخاصة بنجاح!',
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error('Update teacher profile error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء تحديث الملف الشخصي.' }, { status: 500 });
  }
}
