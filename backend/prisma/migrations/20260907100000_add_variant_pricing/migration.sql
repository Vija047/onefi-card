-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN "mrp" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN "price" DECIMAL(65,30) NOT NULL DEFAULT 0;

UPDATE "ProductVariant" AS variant
SET
	"mrp" = CASE
		WHEN product."slug" = 'iphone-17-pro' AND variant."storage" = '256 GB' THEN 139900
		WHEN product."slug" = 'iphone-17-pro' AND variant."storage" = '512 GB' THEN 144900
		WHEN product."slug" = 'iphone-17-pro' AND variant."storage" = '1 TB' THEN 149900
		WHEN product."slug" = 'samsung-s24-ultra' AND variant."storage" = '256 GB' THEN 119999
		WHEN product."slug" = 'samsung-s24-ultra' AND variant."storage" = '512 GB' THEN 129999
		WHEN product."slug" = 'google-pixel-10' AND variant."storage" = '128 GB' THEN 79999
		WHEN product."slug" = 'google-pixel-10' AND variant."storage" = '256 GB' THEN 89999
		ELSE product."mrp"
	END,
	"price" = CASE
		WHEN product."slug" = 'iphone-17-pro' AND variant."storage" = '256 GB' THEN 124900
		WHEN product."slug" = 'iphone-17-pro' AND variant."storage" = '512 GB' THEN 129900
		WHEN product."slug" = 'iphone-17-pro' AND variant."storage" = '1 TB' THEN 134900
		WHEN product."slug" = 'samsung-s24-ultra' AND variant."storage" = '256 GB' THEN 99999
		WHEN product."slug" = 'samsung-s24-ultra' AND variant."storage" = '512 GB' THEN 109999
		WHEN product."slug" = 'google-pixel-10' AND variant."storage" = '128 GB' THEN 69999
		WHEN product."slug" = 'google-pixel-10' AND variant."storage" = '256 GB' THEN 79999
		ELSE product."price"
	END
FROM "Product" AS product
WHERE variant."productId" = product."id";

-- RemoveColumnDefaults
ALTER TABLE "ProductVariant" ALTER COLUMN "mrp" DROP DEFAULT;
ALTER TABLE "ProductVariant" ALTER COLUMN "price" DROP DEFAULT;
