import { prisma } from './prisma';

/**
 * Generates a random unique uppercase alphanumeric 8-character access code in format: XXXX-XXXX
 * Example: A8K2-X91M
 */
export function generateSingleCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude ambiguous chars like 0, 1, O, I
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${part1}-${part2}`;
}

/**
 * Generates bulk unique access codes for a specific course & teacher.
 */
export async function generateBulkAccessCodes(
  courseId: string,
  teacherId: string,
  count: number = 500,
  expirationDays?: number
) {
  const existingCodes = new Set(
    (await prisma.accessCode.findMany({ select: { code: true } })).map((c) => c.code)
  );

  const newCodes: string[] = [];
  while (newCodes.length < count) {
    const code = generateSingleCode();
    if (!existingCodes.has(code)) {
      existingCodes.add(code);
      newCodes.push(code);
    }
  }

  const expiresAt = expirationDays
    ? new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000)
    : null;

  const dataToInsert = newCodes.map((code) => ({
    code,
    courseId,
    teacherId,
    status: 'available',
    expiresAt,
  }));

  await prisma.accessCode.createMany({
    data: dataToInsert,
  });

  return newCodes;
}

/**
 * Validates and redeems an access code for a student.
 */
export async function validateAndRedeemAccessCode(
  rawCode: string,
  courseId: string,
  studentUserId: string
) {
  const formattedCode = rawCode.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');

  const accessCode = await prisma.accessCode.findUnique({
    where: { code: formattedCode },
    include: { course: true },
  });

  if (!accessCode) {
    return { success: false, message: 'كود الوصول غير صحيح أو غير متاح.' };
  }

  if (accessCode.courseId !== courseId) {
    return { success: false, message: 'هذا الكود لا ينتمي لهذا الكورس.' };
  }

  if (accessCode.status === 'used') {
    return { success: false, message: 'هذا الكود تم استخدامه بالفعل.' };
  }

  if (accessCode.status === 'expired' || (accessCode.expiresAt && new Date() > accessCode.expiresAt)) {
    return { success: false, message: 'انتهت صلاحية هذا الكود.' };
  }

  // Check if student already has access to this course
  const existingAccess = await prisma.courseAccess.findFirst({
    where: {
      studentId: studentUserId,
      courseId: courseId,
      status: 'active',
    },
  });

  if (existingAccess) {
    return { success: true, message: 'أنت مشترك بالفعل في هذا الكورس.' };
  }

  // Redeem code transaction: update code status + insert course_access
  await prisma.$transaction([
    prisma.accessCode.update({
      where: { id: accessCode.id },
      data: {
        status: 'used',
        usedByStudentId: studentUserId,
        usedAt: new Date(),
      },
    }),
    prisma.courseAccess.create({
      data: {
        studentId: studentUserId,
        courseId: courseId,
        accessCodeId: accessCode.id,
        status: 'active',
      },
    }),
  ]);

  return { success: true, message: 'تم فتح الكورس بنجاح! استمتع بالدورة.' };
}
