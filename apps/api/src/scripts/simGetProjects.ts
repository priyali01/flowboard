import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();
async function main() {
  const userId = 'e7dfacbb-50cc-449e-b1ee-425e809ad6b6'; // Priyali
  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' }
  });
  console.log(projects);
}
main();
