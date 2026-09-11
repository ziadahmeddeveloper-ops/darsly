import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApprovedTeacher } from '@/lib/auth-guard';

export async function POST(request: Request) {
  try {
    const user = await requireApprovedTeacher();
    const { courseId, title, durationMinutes, passingScore, questions } = await request.json();

    if (!title) {
      return NextResponse.json({ success: false, message: 'يرجى إدخال اسم الامتحان.' }, { status: 400 });
    }

    const createdQuestions: string[] = [];

    for (const q of questions || []) {
      if (q.type === 'mcq') {
        const question = await prisma.question.create({
          data: {
            teacherId: user.teacherId!,
            questionText: q.questionText || (q.imageUrl ? 'انظر الصورة المرفقة للسؤال' : 'سؤال بدون عنوان'),
            imageUrl: q.imageUrl || null,
            type: 'mcq',
            subject: q.subject || 'عام',
            grade: q.grade || 'عام',
            marks: parseFloat(q.marks) || 2.0,
            explanation: q.explanation || null,
            options: {
              create: [
                { optionKey: 'A', optionText: q.optA || '', imageUrl: q.optAImage || null, isCorrect: q.correct === 'A' },
                { optionKey: 'B', optionText: q.optB || '', imageUrl: q.optBImage || null, isCorrect: q.correct === 'B' },
                { optionKey: 'C', optionText: q.optC || '', imageUrl: q.optCImage || null, isCorrect: q.correct === 'C' },
                { optionKey: 'D', optionText: q.optD || '', imageUrl: q.optDImage || null, isCorrect: q.correct === 'D' },
              ],
            },
          },
        });
        createdQuestions.push(question.id);
      } else if (q.type === 'essay') {
        const question = await prisma.question.create({
          data: {
            teacherId: user.teacherId!,
            questionText: q.questionText || (q.imageUrl ? 'انظر الصورة المرفقة للسؤال' : 'سؤال مقالي'),
            imageUrl: q.imageUrl || null,
            type: 'essay',
            subject: q.subject || 'عام',
            grade: q.grade || 'عام',
            marks: parseFloat(q.marks) || 5.0,
            explanation: q.explanation || null,
          },
        });
        createdQuestions.push(question.id);
      }
    }

    const exam = await prisma.exam.create({
      data: {
        courseId: courseId || null,
        teacherId: user.teacherId!,
        title,
        durationMinutes: parseInt(durationMinutes) || 15,
        passingScore: parseInt(passingScore) || 50,
        questionMode: 'mixed',
        mode: 'exam',
        status: 'published',
        examQuestions: {
          create: createdQuestions.map((qId, idx) => ({
            questionId: qId,
            orderIndex: idx + 1,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, message: `تم إنشاء الامتحان "${exam.title}" بنجاح!`, examId: exam.id });
  } catch (error: any) {
    console.error('Create Exam Error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء حفظ الامتحان.' }, { status: 500 });
  }
}
