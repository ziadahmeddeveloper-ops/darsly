import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing exam id' }, { status: 400 });
    }

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        examQuestions: {
          include: {
            question: {
              include: {
                // Return options without revealing correct answer to client for Exam Mode
                options: {
                  select: { id: true, optionKey: true, optionText: true },
                },
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ success: false, message: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, exam });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
