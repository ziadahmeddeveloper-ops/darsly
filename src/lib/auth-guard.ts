import { getCurrentUser, UserTokenPayload } from './auth';
import { prisma } from './prisma';
import { redirect } from 'next/navigation';

export async function requireAuth(): Promise<UserTokenPayload> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

/**
 * STRICT BUSINESS RULE:
 * Ensures the logged-in user is a Teacher AND has status = 'approved'.
 * Pending teachers are redirected to /teacher/pending.
 * Suspended/Rejected teachers are redirected to /login or denied access.
 */
export async function requireApprovedTeacher() {
  const user = await requireAuth();

  if (user.role !== 'teacher') {
    redirect('/');
  }

  // Double check DB status in real-time to avoid token caching bypass
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { status: true, role: true }
  });

  if (!dbUser || dbUser.role !== 'teacher') {
    redirect('/');
  }

  if (dbUser.status === 'pending') {
    redirect('/teacher/pending');
  }

  if (dbUser.status === 'suspended') {
    redirect('/teacher/suspended');
  }

  if (dbUser.status !== 'approved') {
    redirect('/teacher/pending');
  }

  return user;
}

/**
 * STRICT BUSINESS RULE:
 * Only role = 'admin' can access admin functions.
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    redirect('/');
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, status: true }
  });

  if (!dbUser || dbUser.role !== 'admin') {
    redirect('/');
  }

  return user;
}

export async function requireStudent() {
  const user = await requireAuth();
  if (user.role !== 'student' && user.role !== 'admin') {
    redirect('/');
  }
  return user;
}
