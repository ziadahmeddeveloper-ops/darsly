import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@darsly.com' },
    update: {
      password: hash,
      role: 'admin',
      status: 'active',
    },
    create: {
      name: 'إدارة منصة درسلي',
      email: 'admin@darsly.com',
      password: hash,
      phone: '01000000000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'admin',
      status: 'active',
    },
  });

  console.log('Admin account successfully set/reset:', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
