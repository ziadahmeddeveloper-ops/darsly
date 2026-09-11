import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDemoSubsite() {
  const hash = await bcrypt.hash('teacher123', 10);

  // 1. Create or get teacher user
  const teacherUser = await prisma.user.upsert({
    where: { email: 'ahmed.physics@darsly.com' },
    update: {
      name: 'أحمد الفاروق',
      role: 'teacher',
      status: 'approved',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    },
    create: {
      name: 'أحمد الفاروق',
      email: 'ahmed.physics@darsly.com',
      password: hash,
      phone: '01012345678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      role: 'teacher',
      status: 'approved',
    },
  });

  // 2. Create or update teacher profile with custom slug & cover photo
  const profile = await prisma.teacherProfile.upsert({
    where: { userId: teacherUser.id },
    update: {
      title: 'كبير معلمي الفيزياء للثانوية العامة',
      bio: 'خبرة أكثر من 12 عاماً في تدريس مادة الفيزياء وتبسيط أطول المفاهيم والمعادلات لطلاب الثانوية العامة بأسلوب ترفيهي وتفاعلي متطوّر.',
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600',
      customSlug: 'mr-ahmed-physics',
      subjects: JSON.stringify(['فيزياء']),
      grades: JSON.stringify(['الصف الثالث الثانوي', 'الصف الثاني الثانوي']),
      experienceYears: 12,
      whatsapp: '201012345678',
      verified: true,
      rating: 4.9,
      studentCount: 3450,
    },
    create: {
      userId: teacherUser.id,
      title: 'كبير معلمي الفيزياء للثانوية العامة',
      bio: 'خبرة أكثر من 12 عاماً في تدريس مادة الفيزياء وتبسيط أطول المفاهيم والمعادلات لطلاب الثانوية العامة بأسلوب ترفيهي وتفاعلي متطوّر.',
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600',
      customSlug: 'mr-ahmed-physics',
      subjects: JSON.stringify(['فيزياء']),
      grades: JSON.stringify(['الصف الثالث الثانوي', 'الصف الثاني الثانوي']),
      experienceYears: 12,
      whatsapp: '201012345678',
      verified: true,
      rating: 4.9,
      studentCount: 3450,
    },
  });

  // 3. Create Course first
  const course = await prisma.course.create({
    data: {
      teacherId: profile.id,
      title: 'الفيزياء الكهربية الشاملة - 2026',
      slug: 'physics-electricity-2026-' + Date.now(),
      description: 'شرح وتدريبات الجزء الأول من الفيزياء الكهربية وقوانين كيرشوف وأوم مع اختبارات تفاعلية بعد كل جزء.',
      subject: 'فيزياء',
      grade: 'الصف الثالث الثانوي',
      price: 250,
      accessType: 'free',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
      status: 'published',
    },
  });

  // 4. Create Exam linked to Course
  const exam = await prisma.exam.create({
    data: {
      teacherId: profile.id,
      courseId: course.id,
      title: 'اختبار تقييمي لدرس الكهربية وقانون أوم',
      durationMinutes: 15,
      passingScore: 60,
      mode: 'exam',
      status: 'published',
      examQuestions: {
        create: [
          {
            orderIndex: 1,
            question: {
              create: {
                teacherId: profile.id,
                questionText: 'ما هي وحدة قياس المقاومة الكهربية في النظام الدولي؟',
                type: 'mcq',
                subject: 'فيزياء',
                grade: 'الصف الثالث الثانوي',
                explanation: 'الأوم هو وحدة قياس المقاومة الكهربية.',
                options: {
                  create: [
                    { optionKey: 'A', optionText: 'الفولت', isCorrect: false },
                    { optionKey: 'B', optionText: 'الأوم (Ω)', isCorrect: true },
                    { optionKey: 'C', optionText: 'الأمبير', isCorrect: false },
                    { optionKey: 'D', optionText: 'الكولوم', isCorrect: false },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  });

  // 5. Create Multi-part Lesson linked to Course & Exam
  await prisma.lesson.create({
    data: {
      courseId: course.id,
      title: 'المحاضرة الأولى: التيار الكهربي وقانون أوم الشامل',
      description: 'تتضمن هذه المحاضرة شرح مفهوم الشحنات، شدة التيار، فرق الجهد، ومفهوم المقاومة الكهربية.',
      videoProvider: 'youtube',
      videoId: 'L_LUpnjgPso',
      orderIndex: 1,
      parts: {
        create: [
          {
            title: 'الجزء الأول: شرح مفهوم التيار وشدة الشحنة',
            description: 'شرح بصري للفرق بين التيار المستمر والمتردد.',
            videoProvider: 'youtube',
            videoId: 'L_LUpnjgPso',
            orderIndex: 1,
          },
          {
            title: 'الجزء الثاني: قانون أوم والمقاومة النوعية + امتحان',
            description: 'تطبيقات عمل على المقاومات الكهربية متبوعة باختبار تقييمي.',
            videoProvider: 'youtube',
            videoId: 'L_LUpnjgPso',
            orderIndex: 2,
            examId: exam.id,
          },
        ],
      },
    },
  });

  console.log('SUCCESS: Demo teacher subsite seeded!');
  console.log('Platform URL: http://localhost:3000/t/mr-ahmed-physics');
}

seedDemoSubsite()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
