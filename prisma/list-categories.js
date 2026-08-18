const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' }
  });
  console.log(JSON.stringify(categories, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
