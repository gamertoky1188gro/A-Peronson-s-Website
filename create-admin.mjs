import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const passwordHash = await bcrypt.hash('Admin@Admin', 10);

const admin = await prisma.user.create({
  data: {
    id: 'admin-001',
    name: 'Admin',
    email: 'admin@gmail.com',
    password_hash: passwordHash,
    role: 'admin',
    status: 'active',
    verified: true,
  }
});

console.log('Admin created:', admin.email);

const org = await prisma.user.create({
  data: {
    id: 'org-ccm-001',
    name: 'CCM',
    email: 'org@ccm.com',
    password_hash: passwordHash,
    role: 'buying_house',
    status: 'active',
    verified: true,
    org_owner_id: 'org-ccm-001',
  }
});

console.log('Organization created:', org.email);

await prisma.$disconnect();