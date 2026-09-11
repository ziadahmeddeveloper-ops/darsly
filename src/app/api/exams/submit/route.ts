import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { examId, answers } = await request.json(); // answers is key-value map: { questionId: { option: 'A', essayText: '' } }

    if (!examId || !answers) {
      return NextResponse.json({ success: false, message: 'بيانات الإجابة غير مكتملة.' }, { status: 400 });
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        examQuestions: {
          include: {
            question: {
              include: { options: true },
            },
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ success: false, message: 'الامتحان غير موجود.' }, { status: 404 });
    }

    let totalMarks = 0;
    let earnedMarks = 0;
    const answerRecords: any[] = [];

    for (const eq of exam.examQuestions) {
      const q = eq.question;
      totalMarks += q.marks;

      const studentAns = answers[q.id] || {};

      if (q.type === 'mcq') {
        const correctOption = q.options.find((opt) => opt.isCorrect);
        const isCorrect = studentAns.option && correctOption && studentAns.option === correctOption.optionKey;
        const awardedMarks = isCorrect ? q.marks : 0;
        earnedMarks += awardedMarks;

        answerRecords.push({
          questionId: q.id,
          selectedOption: studentAns.option || null,
          awardedMarks,
          gradedAt: new Date(),
        });
      } else if (q.type === 'essay') {
        answerRecords.push({
          questionId: q.id,
          essayResponse: studentAns.essayText || '',
          awardedMarks: 0, // Pending manual teacher review
        });
      }
    }

    const percentage = totalMarks > 0 ? (earnedMarks / totalMarks) * 100 : 0;
    const passed = percentage >= exam.passingScore;

    const attempt = await prisma.examAttempt.create({
      data: {
        examId,
        studentId: user.id,
        score: earnedMarks,
        totalMarks,
        passed,
        submittedAt: new Date(),
        answers: {
          create: answerRecords,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'تم تسليم الامتحان وتصحيحه بنجاح!',
      result: {
        attemptId: attempt.id,
        score: earnedMarks,
        totalMarks,
        percentage: Math.round(percentage),
        passed,
      },
    });
  } catch (error: any) {
    console.error('Submit Exam Error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ في تصحيح الامتحان.' }, { status: 500 });
  }
}
