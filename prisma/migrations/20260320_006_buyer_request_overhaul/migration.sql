ALTER TABLE `requirements`
  ADD COLUMN `request_type` VARCHAR(191) NOT NULL DEFAULT 'garments',
  ADD COLUMN `specs` JSON NULL,
  ADD COLUMN `custom_fields` JSON NULL,
  ADD COLUMN `quote_deadline` DATETIME(3) NULL,
  ADD COLUMN `expires_at` DATETIME(3) NULL,
  ADD COLUMN `max_suppliers` INT NULL;
