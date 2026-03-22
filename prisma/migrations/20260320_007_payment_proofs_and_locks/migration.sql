-- Add verified-first lock metadata
ALTER TABLE `conversation_locks`
  ADD COLUMN `allowed_users` JSON NULL,
  ADD COLUMN `lock_type` VARCHAR(191) NULL,
  ADD COLUMN `lock_status` VARCHAR(191) NULL,
  ADD COLUMN `lock_reason` VARCHAR(191) NULL,
  ADD COLUMN `updated_at` DATETIME NULL;

-- Payment proof workflow for contracts
CREATE TABLE `payment_proofs` (
  `id` VARCHAR(191) NOT NULL,
  `contract_id` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL,
  `created_by` VARCHAR(191) NOT NULL,
  `reviewed_by` VARCHAR(191) NULL,
  `review_reason` VARCHAR(191) NULL,
  `transaction_reference` VARCHAR(191) NULL,
  `bank_name` VARCHAR(191) NULL,
  `sender_account_name` VARCHAR(191) NULL,
  `receiver_account_name` VARCHAR(191) NULL,
  `transaction_date` DATETIME NULL,
  `amount` DOUBLE NULL,
  `currency` VARCHAR(20) NULL,
  `lc_number` VARCHAR(191) NULL,
  `issuing_bank` VARCHAR(191) NULL,
  `advising_bank` VARCHAR(191) NULL,
  `applicant_name` VARCHAR(191) NULL,
  `beneficiary_name` VARCHAR(191) NULL,
  `issue_date` DATETIME NULL,
  `expiry_date` DATETIME NULL,
  `document_id` VARCHAR(191) NULL,
  `document_url` VARCHAR(600) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
