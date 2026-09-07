-- Add the requested image metadata while keeping existing products valid.
ALTER TABLE "Product"
ADD COLUMN "images" JSONB NOT NULL DEFAULT '{}';

ALTER TABLE "Product"
ALTER COLUMN "images" DROP DEFAULT;