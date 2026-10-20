-- Support investigation cases.
--
-- Four NEW tables only. No existing model is altered: the diff that produced this
-- file was taken between the pre-change schema (HEAD) and the post-change
-- schema, and it contains nothing but the four CREATE TABLEs, their indexes and
-- their foreign keys.
--
-- The support EVIDENCE files themselves are not in the database. They live in the
-- gated /uploads/support prefix and are anchored by a Document row with
-- entity_type 'support_case' (see privateDocumentService.recordPrivateUpload).
--
-- CreateTable
CREATE TABLE "support_cases" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'collecting',
    "subject" TEXT,
    "summary" TEXT,
    "ticket_id" TEXT,
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "report_status" TEXT,
    "report_delivered_at" TIMESTAMP(3),
    "retain" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_case_messages" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'answer',
    "content" TEXT NOT NULL,
    "agent" TEXT,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_case_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_investigations" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "attempt" INTEGER NOT NULL DEFAULT 0,
    "model_id" TEXT,
    "prompt" TEXT,
    "report" TEXT,
    "findings" JSONB,
    "evidence" JSONB,
    "tool_log" JSONB,
    "error" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_investigations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_case_attachments" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "document_id" TEXT,
    "file_path" TEXT NOT NULL,
    "mime_type" TEXT,
    "byte_size" INTEGER,
    "uploaded_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_case_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "support_cases_user_id_created_at_idx" ON "support_cases"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "support_cases_status_created_at_idx" ON "support_cases"("status", "created_at");

-- CreateIndex
CREATE INDEX "support_case_messages_case_id_sequence_idx" ON "support_case_messages"("case_id", "sequence");

-- CreateIndex
CREATE INDEX "support_investigations_case_id_role_idx" ON "support_investigations"("case_id", "role");

-- CreateIndex
CREATE INDEX "support_investigations_status_idx" ON "support_investigations"("status");

-- CreateIndex
CREATE INDEX "support_case_attachments_case_id_idx" ON "support_case_attachments"("case_id");

-- AddForeignKey
ALTER TABLE "support_case_messages" ADD CONSTRAINT "support_case_messages_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "support_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_investigations" ADD CONSTRAINT "support_investigations_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "support_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_case_attachments" ADD CONSTRAINT "support_case_attachments_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "support_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

