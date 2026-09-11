import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Darsly Database with Full Primary, Prep, and Secondary Curriculums...');

  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 1. Admin Account
  await prisma.user.upsert({
    where: { email: 'admin@darsly.com' },
    update: {
      password: adminPasswordHash,
      role: 'admin',
      status: 'active',
      phone: '01097188298',
    },
    create: {
      name: 'إدارة منصة درسلي',
      email: 'admin@darsly.com',
      password: adminPasswordHash,
      phone: '01097188298',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'admin',
      status: 'active',
    },
  });

  // 2. Approved Teachers for All Stages (Primary, Prep, Secondary)
  const teacher1User = await prisma.user.upsert({
    where: { email: 'ahmed@darsly.com' },
    update: { phone: '01097188298' },
    create: {
      name: 'أحمد محمد',
      email: 'ahmed@darsly.com',
      password: passwordHash,
      phone: '01097188298',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
      role: 'teacher',
      status: 'approved',
      teacherProfile: {
        create: {
          bio: 'خبير تدريس الرياضيات لجميع المراحل (إعدادي وثانوي) بخبرة أكثر من 12 عاماً.',
          subjects: JSON.stringify(['رياضيات', 'تفاضل وتكامل', 'جبر وهندسة']),
          grades: JSON.stringify(['الصف الثالث الثانوي', 'الصف الثالث الإعدادي']),
          experienceYears: 12,
          verified: true,
          rating: 4.9,
          studentCount: 2430,
        },
      },
    },
    include: { teacherProfile: true },
  });

  const teacher2User = await prisma.user.upsert({
    where: { email: 'mohamed@darsly.com' },
    update: { phone: '01097188298' },
    create: {
      name: 'محمد علي',
      email: 'mohamed@darsly.com',
      password: passwordHash,
      phone: '01097188298',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
      role: 'teacher',
      status: 'approved',
      teacherProfile: {
        create: {
          bio: 'أستاذ العلوم للابتدائي والإعدادي والفيزياء للثانوية العامة.',
          subjects: JSON.stringify(['علوم', 'فيزياء']),
          grades: JSON.stringify(['الصف السادس الابتدائي', 'الصف الثالث الإعدادي', 'الصف الثالث الثانوي']),
          experienceYears: 9,
          verified: true,
          rating: 4.85,
          studentCount: 1890,
        },
      },
    },
    include: { teacherProfile: true },
  });

  const teacher3User = await prisma.user.upsert({
    where: { email: 'sara@darsly.com' },
    update: { phone: '01097188298' },
    create: {
      name: 'سارة أحمد',
      email: 'sara@darsly.com',
      password: passwordHash,
      phone: '01097188298',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      role: 'teacher',
      status: 'approved',
      teacherProfile: {
        create: {
          bio: 'مدرسة اللغة العربية والتأسيس لجميع الصفوف من الابتدائي إلى الثانوي.',
          subjects: JSON.stringify(['لغة عربية', 'بلاغة', 'نحو']),
          grades: JSON.stringify(['الصف الرابع الابتدائي', 'الصف الأول الإعدادي', 'الصف الثالث الثانوي']),
          experienceYears: 10,
          verified: true,
          rating: 4.95,
          studentCount: 3100,
        },
      },
    },
    include: { teacherProfile: true },
  });

  // 3. Pending Teachers
  await prisma.user.upsert({
    where: { email: 'mostafa@darsly.com' },
    update: { phone: '01097188298' },
    create: {
      name: 'مصطفى طارق',
      email: 'mostafa@darsly.com',
      password: passwordHash,
      phone: '01097188298',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      role: 'teacher',
      status: 'pending',
      teacherProfile: {
        create: {
          bio: 'مدرس الدراسات الاجتماعية للمرحلة الإعدادية واللغة الألمانية للثانوية.',
          subjects: JSON.stringify(['دراسات اجتماعية', 'لغة ألمانية']),
          grades: JSON.stringify(['الصف الثاني الإعدادي', 'الصف الثالث الثانوي']),
          experienceYears: 4,
          verified: false,
        },
      },
    },
  });

  // 4. Create Secondary Course
  const course1 = await prisma.course.upsert({
    where: { slug: 'calculus-3rd-secondary' },
    update: {},
    create: {
      teacherId: teacher1User.teacherProfile!.id,
      title: 'كورس التفاضل والتكامل الشامل - 3 ثانوية 2026',
      slug: 'calculus-3rd-secondary',
      description: 'شرح وتطبيقات وحل مئات الأسئلة والنماذج الاسترشادية للتفاضل والتكامل مع المدرس أحمد محمد.',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600',
      subject: 'رياضيات',
      grade: 'الصف الثالث الثانوي',
      price: 350.0,
      accessType: 'paid',
      status: 'published',
      lessons: {
        create: [
          {
            title: 'المحاضرة 1: اشتقاق الدوال المثلثية العكسية والمشتقات العليا',
            description: 'في هذه المحاضرة نستعرض القوانين الأساسية والملاحظات الهامة لاشتقاق الدوال.',
            videoProvider: 'youtube',
            videoId: 'L_LUpnjgPso',
            orderIndex: 1,
          },
        ],
      },
    },
  });

  // 5. Create Preparatory (Middle School) Course
  await prisma.course.upsert({
    where: { slug: 'prep-3rd-math-algebra' },
    update: {},
    create: {
      teacherId: teacher1User.teacherProfile!.id,
      title: 'الجبر والهندسة التحليلية - الصف الثالث الإعدادي 2026',
      slug: 'prep-3rd-math-algebra',
      description: 'شرح كامل لمنهج الجبر والإحصاء والهندسة للشهادة الإعدادية بالتفصيل وتوقع أسئلة الامتحانات.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600',
      subject: 'رياضيات',
      grade: 'الصف الثالث الإعدادي',
      price: 200.0,
      accessType: 'paid',
      status: 'published',
      lessons: {
        create: [
          {
            title: 'المحاضرة 1: حاصل الضرب الديكارتي والعلاقات والدوال',
            description: 'حل أكثر من 30 مسألة على حاصل الضرب الديكارتي والدالة.',
            videoProvider: 'youtube',
            videoId: 't36J76vWw7w',
            orderIndex: 1,
          },
        ],
      },
    },
  });

  // 6. Create Primary (Elementary) Course
  await prisma.course.upsert({
    where: { slug: 'primary-4th-science-connect' },
    update: {},
    create: {
      teacherId: teacher2User.teacherProfile!.id,
      title: 'العلوم المطور - الصف الرابع الابتدائي الفصل الدراسي الأول',
      slug: 'primary-4th-science-connect',
      description: 'شرح ممتع وتفاعلي لمنهج العلوم الجديد للصف الرابع الابتدائي بالأشكال والتجارب التوضيحية.',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600',
      subject: 'علوم',
      grade: 'الصف الرابع الابتدائي',
      price: 150.0,
      accessType: 'paid',
      status: 'published',
      lessons: {
        create: [
          {
            title: 'المفهوم الأول: التكيف والبقاء في الكائنات الحية',
            description: 'طرق تكيف الخفافيش وثعلب الفنك وأشجار الكابوك.',
            videoProvider: 'youtube',
            videoId: 'L_LUpnjgPso',
            orderIndex: 1,
          },
        ],
      },
    },
  });

  // 7. Seed Access Codes
  const seedCodes = ['A8K2-X91M', 'P7Q4-L82K', 'X92M-K7PL', 'D5N9-W38R'];
  for (let i = 0; i < seedCodes.length; i++) {
    await prisma.accessCode.upsert({
      where: { code: seedCodes[i] },
      update: {},
      create: {
        code: seedCodes[i],
        courseId: course1.id,
        teacherId: teacher1User.teacherProfile!.id,
        status: 'available',
      },
    });
  }

  console.log('Seeding completed for Primary, Prep, and Secondary stages!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
