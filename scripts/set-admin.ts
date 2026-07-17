import { prisma } from '../lib/prisma';

async function setAdminRole() {
  // Get email from command line argument
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: npm run set-admin your-email@example.com');
    process.exit(1);
  }

  try {
    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    // Update user role to admin
    await prisma.users.update({
      where: { email },
      data: { role: 'admin' },
    });

    console.log(`✅ Successfully set ${email} as admin!`);
    console.log('You can now access /admin/dashboard');
  } catch (error) {
    console.error('Error updating user role:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setAdminRole();
