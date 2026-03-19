-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `subscription_status` VARCHAR(191) NOT NULL DEFAULT 'free',
    `wallet_balance_usd` DOUBLE NOT NULL DEFAULT 0,
    `policy_strikes` INTEGER NOT NULL DEFAULT 0,
    `messaging_restricted_until` DATETIME(3) NULL,
    `profile` JSON NULL,
    `org_owner_id` VARCHAR(191) NULL,
    `member_id` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `permissions` JSON NULL,
    `permission_matrix` JSON NULL,
    `assigned_requests` INTEGER NULL,
    `performance_score` INTEGER NULL,
    `chatbot_enabled` BOOLEAN NOT NULL DEFAULT false,
    `handoff_mode` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `password_reset_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `plan` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `auto_renew` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification` (
    `user_id` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `buyer_region` VARCHAR(191) NULL,
    `documents` JSON NOT NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `verified_at` DATETIME(3) NULL,
    `subscription_valid_until` DATETIME(3) NULL,
    `missing_required` JSON NULL,
    `credibility` JSON NULL,
    `subscription_remaining_days` INTEGER NULL,
    `expiring_soon` BOOLEAN NULL,
    `verification_status` VARCHAR(191) NULL,
    `review_status` VARCHAR(191) NULL,
    `review_reason` VARCHAR(191) NULL,
    `reviewed_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requirements` (
    `id` VARCHAR(191) NOT NULL,
    `buyer_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `product` VARCHAR(191) NULL,
    `industry` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `target_market` VARCHAR(191) NULL,
    `quantity` VARCHAR(191) NULL,
    `moq` VARCHAR(191) NULL,
    `price_range` VARCHAR(191) NULL,
    `material` VARCHAR(191) NULL,
    `fabric_gsm` VARCHAR(191) NULL,
    `timeline_days` VARCHAR(191) NULL,
    `delivery_timeline` VARCHAR(191) NULL,
    `certifications_required` JSON NULL,
    `shipping_terms` VARCHAR(191) NULL,
    `incoterms` VARCHAR(191) NULL,
    `payment_terms` VARCHAR(191) NULL,
    `document_ready` VARCHAR(191) NULL,
    `audit_date` VARCHAR(191) NULL,
    `language_support` VARCHAR(191) NULL,
    `capacity_min` VARCHAR(191) NULL,
    `trims_wash` VARCHAR(191) NULL,
    `sample_timeline` VARCHAR(191) NULL,
    `sample_available` VARCHAR(191) NULL,
    `packaging` VARCHAR(191) NULL,
    `compliance_notes` VARCHAR(191) NULL,
    `custom_description` VARCHAR(191) NULL,
    `size_range` VARCHAR(191) NULL,
    `color_pantone` VARCHAR(191) NULL,
    `customization_capabilities` VARCHAR(191) NULL,
    `techpack_accepted` BOOLEAN NULL,
    `sample_lead_time_days` VARCHAR(191) NULL,
    `compliance_details` VARCHAR(191) NULL,
    `ai_summary` VARCHAR(191) NULL,
    `assigned_agent_id` VARCHAR(191) NULL,
    `assigned_at` DATETIME(3) NULL,
    `assigned_by` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `moderated` BOOLEAN NULL,
    `moderation_reason` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_products` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `company_role` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `industry` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `material` VARCHAR(191) NULL,
    `moq` VARCHAR(191) NULL,
    `price_range` VARCHAR(191) NULL,
    `lead_time_days` VARCHAR(191) NULL,
    `fabric_gsm` VARCHAR(191) NULL,
    `size_range` VARCHAR(191) NULL,
    `color_pantone` VARCHAR(191) NULL,
    `customization_capabilities` VARCHAR(191) NULL,
    `sample_available` VARCHAR(191) NULL,
    `sample_lead_time_days` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `video_url` VARCHAR(191) NULL,
    `video_review_status` VARCHAR(191) NULL,
    `video_restricted` BOOLEAN NULL,
    `video_moderation_flags` JSON NULL,
    `video_reviewed_at` DATETIME(3) NULL,
    `video_review_reason` VARCHAR(191) NULL,
    `moderated` BOOLEAN NULL,
    `moderation_reason` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` VARCHAR(191) NOT NULL,
    `match_id` VARCHAR(191) NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(191) NULL,
    `attachment` JSON NULL,
    `moderated` BOOLEAN NULL,
    `moderation_reason` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message_requests` (
    `thread_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `acted_by` VARCHAR(191) NULL,
    `acted_at` DATETIME(3) NULL,

    PRIMARY KEY (`thread_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `entity_type` VARCHAR(191) NULL,
    `entity_id` VARCHAR(191) NULL,
    `message` VARCHAR(191) NOT NULL,
    `meta` JSON NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `search_alerts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `query` VARCHAR(191) NOT NULL,
    `filters` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `search_usage_counters` (
    `user_id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL,
    `updated_at` DATETIME(3) NULL,
    `reset_at` DATETIME(3) NULL,

    PRIMARY KEY (`user_id`, `action`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversation_locks` (
    `request_id` VARCHAR(191) NOT NULL,
    `locked_by` VARCHAR(191) NOT NULL,
    `allowed_agents` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `partner_requests` (
    `id` VARCHAR(191) NOT NULL,
    `requester_id` VARCHAR(191) NOT NULL,
    `requester_role` VARCHAR(191) NOT NULL,
    `target_id` VARCHAR(191) NOT NULL,
    `target_role` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `call_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `match_id` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `scheduled_for` DATETIME(3) NULL,
    `duration_minutes` INTEGER NULL,
    `participant_ids` JSON NULL,
    `status` VARCHAR(191) NULL,
    `recording_url` VARCHAR(191) NULL,
    `recording_status` VARCHAR(191) NULL,
    `contract_id` VARCHAR(191) NULL,
    `security_audit_id` VARCHAR(191) NULL,
    `context` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `started_at` DATETIME(3) NULL,
    `ended_at` DATETIME(3) NULL,
    `audit_trail` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `call_recording_views` (
    `id` VARCHAR(191) NOT NULL,
    `call_id` VARCHAR(191) NOT NULL,
    `viewer_id` VARCHAR(191) NOT NULL,
    `viewed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` VARCHAR(191) NOT NULL,
    `uploaded_by` VARCHAR(191) NOT NULL,
    `entity_type` VARCHAR(191) NOT NULL,
    `entity_id` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `contract_number` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `buyer_name` VARCHAR(191) NULL,
    `factory_name` VARCHAR(191) NULL,
    `buyer_id` VARCHAR(191) NULL,
    `factory_id` VARCHAR(191) NULL,
    `bank_name` VARCHAR(191) NULL,
    `beneficiary_name` VARCHAR(191) NULL,
    `transaction_reference` VARCHAR(191) NULL,
    `is_draft` BOOLEAN NULL,
    `buyer_signature_state` VARCHAR(191) NULL,
    `factory_signature_state` VARCHAR(191) NULL,
    `buyer_signed_at` DATETIME(3) NULL,
    `factory_signed_at` DATETIME(3) NULL,
    `artifact` JSON NULL,
    `lifecycle_status` VARCHAR(191) NULL,
    `archived_at` DATETIME(3) NULL,
    `moderation_flags` JSON NULL,
    `moderation_status` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leads` (
    `id` VARCHAR(191) NOT NULL,
    `org_owner_id` VARCHAR(191) NOT NULL,
    `match_id` VARCHAR(191) NOT NULL,
    `counterparty_id` VARCHAR(191) NULL,
    `source` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `assigned_agent_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `last_interaction_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lead_notes` (
    `id` VARCHAR(191) NOT NULL,
    `lead_id` VARCHAR(191) NOT NULL,
    `org_owner_id` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lead_reminders` (
    `id` VARCHAR(191) NOT NULL,
    `lead_id` VARCHAR(191) NOT NULL,
    `org_owner_id` VARCHAR(191) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `remind_at` DATETIME(3) NOT NULL,
    `message` VARCHAR(191) NULL,
    `done` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `analytics` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `actor_id` VARCHAR(191) NULL,
    `entity_id` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boosts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `scope` VARCHAR(191) NOT NULL,
    `multiplier` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `starts_at` DATETIME(3) NOT NULL,
    `ends_at` DATETIME(3) NOT NULL,
    `price_usd` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cancelled_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_views` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `viewed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `entity_type` VARCHAR(191) NOT NULL,
    `entity_id` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `actor_id` VARCHAR(191) NULL,
    `actor_name` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `resolved_at` DATETIME(3) NULL,
    `resolved_by` VARCHAR(191) NULL,
    `resolution_action` VARCHAR(191) NULL,
    `resolution_note` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `violations` (
    `id` VARCHAR(191) NOT NULL,
    `actor_id` VARCHAR(191) NOT NULL,
    `kind` VARCHAR(191) NULL,
    `reason` VARCHAR(191) NULL,
    `entity_type` VARCHAR(191) NULL,
    `entity_id` VARCHAR(191) NULL,
    `snippet` VARCHAR(191) NULL,
    `strikes` INTEGER NULL,
    `action` VARCHAR(191) NULL,
    `restrict_hours` INTEGER NULL,
    `messaging_restricted_until` DATETIME(3) NULL,
    `meta` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `social_interactions` (
    `id` VARCHAR(191) NOT NULL,
    `interaction_type` VARCHAR(191) NOT NULL,
    `entity_type` VARCHAR(191) NOT NULL,
    `entity_id` VARCHAR(191) NOT NULL,
    `actor_id` VARCHAR(191) NOT NULL,
    `actor_name` VARCHAR(191) NULL,
    `actor_verified` BOOLEAN NULL,
    `text` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_connections` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `requester_id` VARCHAR(191) NOT NULL,
    `receiver_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matches` (
    `requirement_id` VARCHAR(191) NOT NULL,
    `factory_id` VARCHAR(191) NOT NULL,
    `score` INTEGER NULL,
    `status` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`requirement_id`, `factory_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `metrics` (
    `id` VARCHAR(191) NOT NULL,
    `requirement_id` VARCHAR(191) NULL,
    `from_status` VARCHAR(191) NULL,
    `to_status` VARCHAR(191) NULL,
    `context` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assistant_knowledge` (
    `id` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `tags` JSON NULL,
    `source` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ratings` (
    `id` VARCHAR(191) NOT NULL,
    `profile_key` VARCHAR(191) NOT NULL,
    `from_user_id` VARCHAR(191) NOT NULL,
    `interaction_type` VARCHAR(191) NULL,
    `score` INTEGER NULL,
    `comment` VARCHAR(191) NULL,
    `reliability_flags` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rating_milestones` (
    `id` VARCHAR(191) NOT NULL,
    `profile_key` VARCHAR(191) NOT NULL,
    `counterparty_id` VARCHAR(191) NOT NULL,
    `interaction_type` VARCHAR(191) NULL,
    `milestone` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL,
    `completed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `updated_by` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rating_feedback_requests` (
    `id` VARCHAR(191) NOT NULL,
    `profile_key` VARCHAR(191) NOT NULL,
    `counterparty_id` VARCHAR(191) NOT NULL,
    `interaction_type` VARCHAR(191) NULL,
    `qualification_rules` JSON NULL,
    `status` VARCHAR(191) NULL,
    `triggered_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fulfilled_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rating_feedback_events` (
    `id` VARCHAR(191) NOT NULL,
    `profile_key` VARCHAR(191) NOT NULL,
    `counterparty_id` VARCHAR(191) NOT NULL,
    `interaction_type` VARCHAR(191) NULL,
    `event` VARCHAR(191) NULL,
    `milestone` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallet_history` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `kind` VARCHAR(191) NULL,
    `amount_usd` DOUBLE NULL,
    `balance_after_usd` DOUBLE NULL,
    `reason` VARCHAR(191) NULL,
    `ref` VARCHAR(191) NULL,
    `meta` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

