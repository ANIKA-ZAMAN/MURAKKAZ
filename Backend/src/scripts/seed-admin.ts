import prisma from '../config/database';
import bcrypt from 'bcryptjs';

export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@murakkaz.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const firstName = 'Murakkaz';
  const lastName = 'Administrator';

  const hashedPassword = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const updated = await prisma.user.update({
      where: { email },
      data: {
        role: 'SUPER_ADMIN',
        passwordHash: hashedPassword,
        isVerified: true
      }
    });
    console.log(`✅ Admin account updated: ${updated.email} [${updated.role}]`);
    return updated;
  }

  const created = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
      isVerified: true,
      preference: {
        create: {}
      }
    }
  });

  console.log(`🚀 Initial Super Admin created: ${created.email} [${created.role}]`);
  return created;
}

if (require.main === module) {
  seedAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
