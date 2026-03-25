-- AlterTable
ALTER TABLE `coupon_codes` ADD COLUMN `created_by` VARCHAR(191) NULL,
    ADD COLUMN `marketing_source` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ratings` ADD COLUMN `auto_generated` BOOLEAN NOT NULL DEFAULT false;
