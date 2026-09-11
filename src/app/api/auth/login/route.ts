import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'يرجى كتابة البريد الإلكتروني وكلمة المرور.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' }, { status: 401 });
    }

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
      message: 'تم تسجيل الدخول بنجاح.',
      user: payload,
    });
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ غير متوقع أثناء تسجيل الدخول.' }, { status: 500 });
  }
}
