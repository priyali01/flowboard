import { prisma } from '../db';

async function main() {
  console.log('Starting workspace migration...');
  
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    const existing = await prisma.workspace.findFirst({
      where: { ownerId: user.id }
    });
    
    if (!existing) {
      console.log(`Creating workspace for user ${user.email}`);
      const workspace = await prisma.workspace.create({
        data: {
          name: `${user.name}'s Workspace`,
          ownerId: user.id,
          members: {
            create: {
              userId: user.id,
              role: 'OWNER'
            }
          }
        }
      });
      
      await prisma.project.updateMany({
        where: { ownerId: user.id, workspaceId: null },
        data: { workspaceId: workspace.id }
      });
    }
  }
  
  console.log('Migration completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
