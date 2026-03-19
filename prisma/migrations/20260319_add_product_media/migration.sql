-- Add media fields to company_products
ALTER TABLE `company_products`
  ADD COLUMN `image_urls` JSON NULL,
  ADD COLUMN `cover_image_url` VARCHAR(191) NULL,
  ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'published';

UPDATE `company_products`
  SET `status` = 'published'
  WHERE `status` IS NULL OR `status` = '';

UPDATE `company_products`
  SET `image_urls` = JSON_ARRAY()
  WHERE `image_urls` IS NULL;

UPDATE `company_products`
  SET `cover_image_url` = ''
  WHERE `cover_image_url` IS NULL;
