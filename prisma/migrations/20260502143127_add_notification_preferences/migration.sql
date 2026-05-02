-- CreateTable
CREATE TABLE "admin_modules" (
    "id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon_name" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_sections" (
    "id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "features" JSONB,

    CONSTRAINT "admin_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_actions" (
    "id" TEXT NOT NULL,
    "action_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT,
    "group_label" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "fields" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_capabilities" (
    "id" TEXT NOT NULL,
    "capability_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "icon_name" TEXT,
    "subtitle" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "admin_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_ui_config" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "section_metrics" JSONB,
    "chart_palette" TEXT[],
    "empty_states" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_ui_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_mock_data" (
    "id" TEXT NOT NULL,
    "data_key" TEXT NOT NULL,
    "data_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "admin_mock_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_role_config" (
    "id" TEXT NOT NULL,
    "role_key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "is_admin_role" BOOLEAN NOT NULL DEFAULT false,
    "benefits" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "admin_role_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "governance_config" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "initial_policy" JSONB,
    "initial_version" JSONB,
    "initial_simulation" JSONB,
    "initial_template" JSONB,
    "default_rules" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "governance_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_branding" (
    "id" TEXT NOT NULL,
    "brand_key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "admin_branding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_security_purposes" (
    "id" TEXT NOT NULL,
    "purpose_key" TEXT NOT NULL,
    "purpose_type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "admin_security_purposes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_config_history" (
    "id" TEXT NOT NULL,
    "config_type" TEXT NOT NULL,
    "changed_by" TEXT NOT NULL,
    "previous_value" JSONB,
    "new_value" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_config_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email_enabled" BOOLEAN NOT NULL DEFAULT true,
    "push_enabled" BOOLEAN NOT NULL DEFAULT true,
    "message_notifs" BOOLEAN NOT NULL DEFAULT true,
    "requirement_notifs" BOOLEAN NOT NULL DEFAULT true,
    "contract_notifs" BOOLEAN NOT NULL DEFAULT true,
    "smart_match_notifs" BOOLEAN NOT NULL DEFAULT true,
    "monthly_summary" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_modules_module_id_key" ON "admin_modules"("module_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_sections_section_id_key" ON "admin_sections"("section_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_actions_action_id_key" ON "admin_actions"("action_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_capabilities_capability_id_key" ON "admin_capabilities"("capability_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_mock_data_data_key_key" ON "admin_mock_data"("data_key");

-- CreateIndex
CREATE UNIQUE INDEX "admin_role_config_role_key_key" ON "admin_role_config"("role_key");

-- CreateIndex
CREATE UNIQUE INDEX "admin_branding_brand_key_key" ON "admin_branding"("brand_key");

-- CreateIndex
CREATE UNIQUE INDEX "admin_security_purposes_purpose_key_key" ON "admin_security_purposes"("purpose_key");

-- CreateIndex
CREATE INDEX "admin_config_history_config_type_created_at_idx" ON "admin_config_history"("config_type", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_user_id_key" ON "notification_preferences"("user_id");

-- AddForeignKey
ALTER TABLE "admin_sections" ADD CONSTRAINT "admin_sections_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "admin_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
