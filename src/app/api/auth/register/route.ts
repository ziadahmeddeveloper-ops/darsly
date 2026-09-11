import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role, subject, grade, bio, subjects, grades, experienceYears } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, message: 'يرجى إدخال جميع البيانات المطلوبة.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'البريد الإلكتروني مستخدم بالفعل.' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // STRICT BUSINESS RULE:
    // If role == 'teacher', status MUST BE 'pending'
    // If role == 'student', status MUST BE 'active'
    const status = role === 'teacher' ? 'pending' : 'active';

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: role === 'teacher' ? 'teacher' : 'student',
        status,
        ...(role === 'teacher'
          ? {
              teacherProfile: {
                create: {
                  bio: bio || 'مدرس في منصة درسلي التعليمية',
                  subjects: JSON.stringify(subjects || (subject ? [subject] : ['مادة عامة'])),
                  grades: JSON.stringify(grades || (grade ? [grade] : ['مدرس ثانوي'])),
                  experienceYears: experienceYears ? parseInt(experienceYears) : 1,
                  verified: false,
                },
              },
            }
          : {
              studentProfile: {
                create: {
                  grade: grade || 'المرحلة الثانوية',
                },
              },
            }),
      },
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
    });

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'student' | 'teacher' | 'admin',
      status: user.status as any,
      teacherId: user.teacherProfile?.id,
      studentId: user.studentProfile?.id,
    };

    await setSessionCookie(payload);

    return NextResponse.json({
      success: true,
      message: role === 'teacher' ? 'تم إنشاء حساب المدرس بنجاح. حسابك قيد المراجعة حالياً.' : 'تم إنشاء الحساب بنجاح.',
      user: payload,
    });
  } catch (error: any) {
    console.error('Register API Error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ غير متوقع أثناء إنشاء الحساب.' }, { status: 500 });
  }
}
