const { PrismaClient } = require('@prisma/client');
const { products, seedProducts } = require('../config/catalogue');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 1Fi marketplace demo data...');

  // Clear existing seed data so re-runs are idempotent
  await prisma.emiPlan.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  await seedProducts(prisma);

  for (const product of products) {
    console.log(`Created product: ${product.name} (${product.slug})`);
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
