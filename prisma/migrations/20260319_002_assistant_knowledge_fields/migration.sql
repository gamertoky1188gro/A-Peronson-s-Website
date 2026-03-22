-- AlterTable
ALTER TABLE `assistant_knowledge`
  ADD COLUMN `org_id` VARCHAR(191) NULL,
  ADD COLUMN `type` VARCHAR(191) NULL,
  ADD COLUMN `keywords` JSON NULL;