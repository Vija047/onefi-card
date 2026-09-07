/**
 * Backfill Product.images from existing ProductVariant.imageUrl values.
 * Uses only data already stored in the database — no mock/placeholder URLs.
 */
async function backfillProductImages(prisma) {
  const products = await prisma.product.findMany({
    include: {
      variants: {
        orderBy: { id: 'asc' },
      },
    },
  });

  let updated = 0;

  for (const product of products) {
    const raw =
      product.images && typeof product.images === 'object' && !Array.isArray(product.images)
        ? product.images
        : {};

    const hasHero = Boolean(raw.hero);
    const hasGallery = Array.isArray(raw.gallery) && raw.gallery.length > 0;
    if (hasHero && hasGallery) continue;

    const gallery = [
      ...new Set(
        (product.variants || [])
          .map((variant) => variant.imageUrl)
          .filter(Boolean),
      ),
    ];

    if (!gallery.length) continue;

    await prisma.product.update({
      where: { id: product.id },
      data: {
        images: {
          hero: raw.hero || gallery[0],
          gallery: hasGallery ? raw.gallery : gallery,
        },
      },
    });

    updated += 1;
  }

  if (updated > 0) {
    console.log(`Backfilled images for ${updated} product(s) from existing variant URLs`);
  }
}

module.exports = { backfillProductImages };
