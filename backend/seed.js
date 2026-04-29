const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@quiz.com' },
    update: {},
    create: {
      email: 'admin@quiz.com',
      name: 'Admin User',
      password,
      role: 'ADMIN'
    }
  });

  await prisma.user.upsert({
    where: { email: 'student@quiz.com' },
    update: {},
    create: {
      email: 'student@quiz.com',
      name: 'Student User',
      password,
      role: 'STUDENT'
    }
  });
  
  console.log('Database seeded with admin@quiz.com and student@quiz.com');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
