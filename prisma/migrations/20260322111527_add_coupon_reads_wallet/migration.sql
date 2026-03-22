/*
  Warnings:

  - You are about to alter the column `document_url` on the `payment_proofs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(600)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `conversation_locks` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `payment_proofs` MODIFY `transaction_date` DATETIME(3) NULL,
    MODIFY `currency` VARCHAR(191) NULL,
    MODIFY `issue_date` DATETIME(3) NULL,
    MODIFY `expiry_date` DATETIME(3) NULL,
    MODIFY `document_url` VARCHAR(191) NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `wallet_restricted_usd` DOUBLE NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `coupon_codes` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `amount_usd` DOUBLE NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `max_redemptions` INTEGER NULL,
    `expires_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `coupon_codes_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupon_redemptions` (
    `id` VARCHAR(191) NOT NULL,
    `code_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `amount_usd` DOUBLE NOT NULL,
    `redeemed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `coupon_redemptions_code_id_user_id_key`(`code_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message_reads` (
    `id` VARCHAR(191) NOT NULL,
    `match_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `last_read_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `message_reads_match_id_user_id_key`(`match_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
