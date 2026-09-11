import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import { validateAndRedeemAccessCode } from '@/lib/access-codes';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { code, courseId } = await request.json();

    if (!code || !courseId) {
      return NextResponse.json({ success: false, message: 'يرجى إدخال كود الوصول ومعرف الكورس.' }, { status: 400 });
    }

    const result = await validateAndRedeemAccessCode(code, courseId, user.id);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error: any) {
    console.error('Access Code Verification Error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ في النظام أثناء التحقق من الكود.' }, { status: 500 });
  }
}
