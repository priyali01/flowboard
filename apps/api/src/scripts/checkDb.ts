import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();
async function main() {
  console.log('Projects:', await prisma.project.count());
  console.log('Workspaces:', await prisma.workspace.count());
  console.log('Users:', await prisma.user.count());
}
main().catch(console.error).finally(() => prisma.$disconnect());
