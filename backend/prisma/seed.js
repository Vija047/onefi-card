const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

const products = [
  {
    name: 'iPhone 17 Pro',
    slug: 'iphone-17-pro',
    description:
      'Demo product for the 1Fi Marketplace assignment. Flagship Apple phone with Pro camera system and multiple EMI plans backed by mutual funds.',
    mrp: 149900,
    price: 134900,
    variants: [
      {
        color: 'Silver',
        storage: '256 GB',
        imageUrl:
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
      },
      {
        color: 'Cosmic Orange',
        storage: '512 GB',
        imageUrl:
          'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80',
      },
      {
        color: 'Deep Blue',
        storage: '1 TB',
        imageUrl:
          'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80',
      },
    ],
    emiPlans: [
      {
        monthlyPayment: 11242,
        tenureMonths: 12,
        interestRate: 0,
        cashback: 2000,
      },
      {
        monthlyPayment: 5996,
        tenureMonths: 24,
        interestRate: 6.5,
        cashback: 3500,
      },
      {
        monthlyPayment: 4249,
        tenureMonths: 36,
        interestRate: 9.9,
        cashback: 5000,
      },
    ],
  },
  {
    name: 'Samsung S24 Ultra',
    slug: 'samsung-s24-ultra',
    description:
      'Demo product for the 1Fi Marketplace assignment. Samsung Galaxy S24 Ultra with S Pen support and flexible EMI options.',
    mrp: 129999,
    price: 109999,
    variants: [
      {
        color: 'Titanium Black',
        storage: '256 GB',
        imageUrl:
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
      },
      {
        color: 'Titanium Gray',
        storage: '512 GB',
        imageUrl:
          'https://images.unsplash.com/photo-1706372124814-ddd9aef0411f?w=800&q=80',
      },
    ],
    emiPlans: [
      {
        monthlyPayment: 9167,
        tenureMonths: 12,
        interestRate: 0,
        cashback: 1500,
      },
      {
        monthlyPayment: 4890,
        tenureMonths: 24,
        interestRate: 7.0,
        cashback: 2500,
      },
      {
        monthlyPayment: 3465,
        tenureMonths: 36,
        interestRate: 10.5,
        cashback: 4000,
      },
    ],
  },
  {
    name: 'Google Pixel 10',
    slug: 'google-pixel-10',
    description:
      'Demo product for the 1Fi Marketplace assignment. Google Pixel 10 with AI photography features and mutual-fund-backed EMI plans.',
    mrp: 89999,
    price: 79999,
    variants: [
      {
        color: 'Obsidian',
        storage: '128 GB',
        imageUrl:
          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
      },
      {
        color: 'Porcelain',
        storage: '256 GB',
        imageUrl:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      },
    ],
    emiPlans: [
      {
        monthlyPayment: 6667,
        tenureMonths: 12,
        interestRate: 0,
        cashback: 1000,
      },
      {
        monthlyPayment: 3556,
        tenureMonths: 24,
        interestRate: 6.0,
        cashback: 2000,
      },
      {
        monthlyPayment: 2520,
        tenureMonths: 36,
        interestRate: 9.5,
        cashback: 3000,
      },
    ],
  },
];

async function main() {
  console.log('Seeding 1Fi marketplace demo data...');

  // Clear existing seed data so re-runs are idempotent
  await prisma.emiPlan.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  for (const product of products) {
    const { variants, emiPlans, ...productData } = product;

    await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants,
        },
        emiPlans: {
          create: emiPlans,
        },
      },
    });

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
