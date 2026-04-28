import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log('✅ DB Connected');
    await prisma.$disconnect();
  } catch (e) {
    console.log('❌ Error:', e.message.slice(0, 200));
  }
}

test();
