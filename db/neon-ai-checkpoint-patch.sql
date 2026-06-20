-- AI / generation checkpoint patch for existing Neon databases
-- Run this if you already created the database before GenerationJob tables were added.
-- Safe to run more than once.

BEGIN;

CREATE TABLE IF NOT EXISTS "GenerationJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "websiteId" TEXT,
    "type" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Queued',
    "currentStep" TEXT,
    "result" JSONB NOT NULL DEFAULT '{}',
    "error" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GenerationJob_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GenerationStep" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "input" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB NOT NULL DEFAULT '{}',
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GenerationStep_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GenerationAsset" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'generated',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GenerationAsset_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "GenerationJob_userId_idx" ON "GenerationJob"("userId");
CREATE INDEX IF NOT EXISTS "GenerationJob_websiteId_idx" ON "GenerationJob"("websiteId");
CREATE INDEX IF NOT EXISTS "GenerationJob_status_idx" ON "GenerationJob"("status");
CREATE INDEX IF NOT EXISTS "GenerationJob_type_idx" ON "GenerationJob"("type");

CREATE INDEX IF NOT EXISTS "GenerationStep_jobId_idx" ON "GenerationStep"("jobId");
CREATE INDEX IF NOT EXISTS "GenerationStep_status_idx" ON "GenerationStep"("status");
CREATE UNIQUE INDEX IF NOT EXISTS "GenerationStep_jobId_name_key" ON "GenerationStep"("jobId", "name");

CREATE INDEX IF NOT EXISTS "GenerationAsset_jobId_idx" ON "GenerationAsset"("jobId");
CREATE INDEX IF NOT EXISTS "GenerationAsset_assetId_idx" ON "GenerationAsset"("assetId");
CREATE UNIQUE INDEX IF NOT EXISTS "GenerationAsset_jobId_assetId_key" ON "GenerationAsset"("jobId", "assetId");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GenerationJob_userId_fkey') THEN
    ALTER TABLE "GenerationJob"
    ADD CONSTRAINT "GenerationJob_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GenerationJob_websiteId_fkey') THEN
    ALTER TABLE "GenerationJob"
    ADD CONSTRAINT "GenerationJob_websiteId_fkey"
    FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GenerationStep_jobId_fkey') THEN
    ALTER TABLE "GenerationStep"
    ADD CONSTRAINT "GenerationStep_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "GenerationJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GenerationAsset_jobId_fkey') THEN
    ALTER TABLE "GenerationAsset"
    ADD CONSTRAINT "GenerationAsset_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "GenerationJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GenerationAsset_assetId_fkey') THEN
    ALTER TABLE "GenerationAsset"
    ADD CONSTRAINT "GenerationAsset_assetId_fkey"
    FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

COMMIT;

-- Verify AI/checkpoint tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('GenerationJob', 'GenerationStep', 'GenerationAsset', 'Asset', 'ComponentDefinition')
ORDER BY table_name;
