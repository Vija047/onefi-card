const prisma = require('../config/prisma');

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function toNumber(value) {
  if (value === null || value === undefined) return value;
  return Number(value);
}

function serializeProduct(product) {
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    images: product.images,
    mrp: toNumber(product.mrp),
    price: toNumber(product.price),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    variants: product.variants
      ? product.variants.map((variant) => ({
          id: variant.id,
          productId: variant.productId,
          color: variant.color,
          storage: variant.storage,
          imageUrl: variant.imageUrl,
          mrp: toNumber(variant.mrp),
          price: toNumber(variant.price),
        }))
      : undefined,
    emiPlans: product.emiPlans
      ? product.emiPlans.map((plan) => ({
          id: plan.id,
          productId: plan.productId,
          monthlyPayment: toNumber(plan.monthlyPayment),
          tenureMonths: plan.tenureMonths,
          interestRate: toNumber(plan.interestRate),
          cashback: toNumber(plan.cashback),
        }))
      : undefined,
  };
}

function serializeListingProduct(product) {
  const firstVariant = product.variants?.[0];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    images: product.images,
    mrp: toNumber(product.mrp),
    price: toNumber(product.price),
    imageUrl: firstVariant?.imageUrl || null,
    variantCount: product.variants?.length || 0,
    emiPlanCount: product.emiPlans?.length || 0,
    startingEmi: product.emiPlans?.length
      ? Math.min(...product.emiPlans.map((plan) => toNumber(plan.monthlyPayment)))
      : null,
  };
}

async function getProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
      include: {
        variants: {
          orderBy: { id: 'asc' },
        },
        emiPlans: {
          orderBy: { tenureMonths: 'asc' },
        },
      },
    });

    res.json({
      products: products.map(serializeListingProduct),
    });
  } catch (err) {
    next(err);
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    if (!slug || !SLUG_PATTERN.test(slug)) {
      return res.status(400).json({ message: 'Invalid product slug' });
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: {
          orderBy: { id: 'asc' },
        },
        emiPlans: {
          orderBy: { tenureMonths: 'asc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product: serializeProduct(product) });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProducts,
  getProductBySlug,
};
