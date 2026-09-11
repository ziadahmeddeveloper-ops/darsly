import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        teacherProfile: {
          select: {
            id: true,
            title: true,
            bio: true,
            subjects: true,
            grades: true,
            experienceYears: true,
            whatsapp: true,
            facebook: true,
            youtube: true,
            rating: true,
            studentCount: true,
          },
        },
        studentProfile: true,
      },
    });

    return NextResponse.json({ success: true, user: fullUser });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, phone, avatar, bio, title, whatsapp, facebook, youtube, currentPassword, newPassword } = body;

    // If changing password, verify old one first
    if (newPassword) {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!dbUser) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      const valid = await bcrypt.compare(currentPassword || '', dbUser.password);
      if (!valid) {
        return NextResponse.json({ success: false, message: 'كلمة المرور الحالية غير صحيحة.' }, { status: 400 });
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    await prisma.user.update({ where: { id: user.id }, data: updateData });

    // Update teacher profile extra fields if applicable
    if (user.role === 'teacher') {
      const teacherUpdate: any = {};
      if (bio !== undefined) teacherUpdate.bio = bio;
      if (title !== undefined) teacherUpdate.title = title;
      if (whatsapp !== undefined) teacherUpdate.whatsapp = whatsapp;
      if (facebook !== undefined) teacherUpdate.facebook = facebook;
      if (youtube !== undefined) teacherUpdate.youtube = youtube;

      if (Object.keys(teacherUpdate).length > 0) {
        await prisma.teacherProfile.updateMany({
          where: { userId: user.id },
          data: teacherUpdate,
        });
      }
    }

    return NextResponse.json({ success: true, message: 'تم تحديث بيانات الملف الشخصي بنجاح! ✅' });
  } catch (err) {
    console.error('Profile update error:', err);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء تحديث البيانات.' }, { status: 500 });
  }
}
