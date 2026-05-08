-- AlterTable
ALTER TABLE "company_products" ADD COLUMN     "content_review_flags" JSONB,
ADD COLUMN     "content_review_reason" TEXT,
ADD COLUMN     "content_review_status" TEXT,
ADD COLUMN     "content_reviewed_at" TIMESTAMP(3),
ADD COLUMN     "content_reviewed_by" TEXT,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "priceBaseMax" DOUBLE PRECISION,
ADD COLUMN     "priceBaseMin" DOUBLE PRECISION,
ADD COLUMN     "priceOriginalMax" DOUBLE PRECISION,
ADD COLUMN     "priceOriginalMin" DOUBLE PRECISION;
