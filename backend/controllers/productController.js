const prisma = require('../config/prisma');

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function toNumber(value) {
  if (value === null || value === undefined) return value;
  return Number(value);
}

function uniqueUrls(urls) {
  return [...new Set((urls || []).filter(Boolean))];
}

/**
 * Build a detailed images payload from DB fields.
 * If Product.images is empty, fall back to variant imageUrls already stored in the database.
 * Never invents placeholder/mock URLs.
 */
function normalizeImages(product) {
  const raw =
    product.images && typeof product.images === 'object' && !Array.isArray(product.images)
      ? product.images
      : {};

  const storedGallery = Array.isArray(raw.gallery) ? uniqueUrls(raw.gallery) : [];
  const variantGallery = uniqueUrls(
    (product.variants || []).map((variant) => variant.imageUrl),
  );

  const gallery = storedGallery.length ? storedGallery : variantGallery;
  const hero = raw.hero || gallery[0] || null;

  return {
    hero,
    gallery,
  };
}

function serializeVariant(variant) {
  return {
    id: variant.id,
    productId: variant.productId,
    color: variant.color,
    storage: variant.storage,
    imageUrl: variant.imageUrl,
    mrp: toNumber(variant.mrp),
    price: toNumber(variant.price),
  };
}

function serializeEmiPlan(plan) {
  return {
    id: plan.id,
    productId: plan.productId,
    monthlyPayment: toNumber(plan.monthlyPayment),
    tenureMonths: plan.tenureMonths,
    interestRate: toNumber(plan.interestRate),
    cashback: toNumber(plan.cashback),
  };
}

function serializeProduct(product) {
  if (!product) return null;

  const images = normalizeImages(product);
  const variants = product.variants ? product.variants.map(serializeVariant) : [];
  const emiPlans = product.emiPlans ? product.emiPlans.map(serializeEmiPlan) : [];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    images,
    mrp: toNumber(product.mrp),
    price: toNumber(product.price),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    variants,
    emiPlans,
    details: {
      variantCount: variants.length,
      emiPlanCount: emiPlans.length,
      colors: [...new Set(variants.map((variant) => variant.color))],
      storages: [...new Set(variants.map((variant) => variant.storage))],
      startingEmi: emiPlans.length
        ? Math.min(...emiPlans.map((plan) => plan.monthlyPayment))
        : null,
      priceRange: variants.length
        ? {
            min: Math.min(...variants.map((variant) => variant.price)),
            max: Math.max(...variants.map((variant) => variant.price)),
          }
        : {
            min: toNumber(product.price),
            max: toNumber(product.price),
          },
    },
  };
}

function serializeListingProduct(product) {
  const images = normalizeImages(product);
  const firstVariant = product.variants?.[0];
  const emiPlans = product.emiPlans || [];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    images,
    mrp: toNumber(product.mrp),
    price: toNumber(product.price),
    imageUrl: firstVariant?.imageUrl || images.hero || null,
    variantCount: product.variants?.length || 0,
    emiPlanCount: emiPlans.length,
    startingEmi: emiPlans.length
      ? Math.min(...emiPlans.map((plan) => toNumber(plan.monthlyPayment)))
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
  normalizeImages,
};
