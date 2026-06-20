-- CreateEnum
CREATE TYPE "WebsiteStatus" AS ENUM ('Draft', 'Published', 'Archived');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('Active', 'Draft', 'Archived');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Paid', 'Packing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('New', 'Contacted', 'Converted', 'Archived');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('Free', 'Pro', 'Business');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Owner', 'Admin', 'Designer', 'Editor', 'Viewer', 'Billing');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "primaryTenantId" TEXT,
    "stripeConnectAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ownerUserId" TEXT,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'Free',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantMember" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Editor',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantInvite" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Editor',
    "tokenHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "expiresAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "branding" JSONB NOT NULL DEFAULT '{}',
    "domains" JSONB NOT NULL DEFAULT '{}',
    "billing" JSONB NOT NULL DEFAULT '{}',
    "security" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "tenantId" TEXT,
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Editor',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Website" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "organizationId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "WebsiteStatus" NOT NULL DEFAULT 'Draft',
    "industry" TEXT,
    "theme" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "sections" JSONB NOT NULL DEFAULT '[]',
    "seo" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "theme" JSONB NOT NULL DEFAULT '{}',
    "sections" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentDefinition" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "defaults" JSONB NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComponentDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'Draft',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "source" TEXT,
    "message" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'New',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "total" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" "OrderStatus" NOT NULL DEFAULT 'Paid',
    "items" JSONB NOT NULL DEFAULT '[]',
    "stripePaymentId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishVersion" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "tenantId" TEXT,
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'Free',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "path" TEXT,
    "referrer" TEXT,
    "visitorId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "verifiedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ABTest" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "targetPath" TEXT NOT NULL DEFAULT '/',
    "goal" TEXT NOT NULL DEFAULT 'lead_submit',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ABTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ABVariant" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 50,
    "sections" JSONB NOT NULL DEFAULT '[]',
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ABVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "tenantId" TEXT,
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingState" (
    "tenantId" TEXT,
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "checklist" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "price" INTEGER,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationJob" (
    "tenantId" TEXT,
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "websiteId" TEXT,
    "type" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Queued',
    "currentStep" TEXT,
    "result" JSONB NOT NULL DEFAULT '{}',
    "error" TEXT,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCostCents" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenerationJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationStep" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "input" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB NOT NULL DEFAULT '{}',
    "error" TEXT,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCostCents" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenerationStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationAsset" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'generated',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenerationAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingStep" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "onboardingId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIProviderConfig" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "encryptedApiKey" TEXT,
    "keyLast4" TEXT,
    "defaultTextModel" TEXT,
    "defaultImageModel" TEXT,
    "defaultCodeModel" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIProviderConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIUsageEvent" (
    "tenantId" TEXT,
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "websiteId" TEXT,
    "generationJobId" TEXT,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL DEFAULT 0,
    "completionTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "imageCount" INTEGER NOT NULL DEFAULT 0,
    "videoSeconds" INTEGER NOT NULL DEFAULT 0,
    "estimatedCostCents" INTEGER NOT NULL DEFAULT 0,
    "latencyMs" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Completed',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIUsageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE INDEX "Tenant_ownerUserId_idx" ON "Tenant"("ownerUserId");

-- CreateIndex
CREATE INDEX "Tenant_status_idx" ON "Tenant"("status");

-- CreateIndex
CREATE INDEX "TenantMember_tenantId_idx" ON "TenantMember"("tenantId");

-- CreateIndex
CREATE INDEX "TenantMember_userId_idx" ON "TenantMember"("userId");

-- CreateIndex
CREATE INDEX "TenantMember_role_idx" ON "TenantMember"("role");

-- CreateIndex
CREATE UNIQUE INDEX "TenantMember_tenantId_userId_key" ON "TenantMember"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "TenantInvite_tenantId_idx" ON "TenantInvite"("tenantId");

-- CreateIndex
CREATE INDEX "TenantInvite_userId_idx" ON "TenantInvite"("userId");

-- CreateIndex
CREATE INDEX "TenantInvite_email_idx" ON "TenantInvite"("email");

-- CreateIndex
CREATE INDEX "TenantInvite_status_idx" ON "TenantInvite"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TenantSettings_tenantId_key" ON "TenantSettings"("tenantId");

-- CreateIndex
CREATE INDEX "TenantSettings_tenantId_idx" ON "TenantSettings"("tenantId");

-- CreateIndex
CREATE INDEX "TenantSettings_userId_idx" ON "TenantSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_tenantId_idx" ON "Organization"("tenantId");

-- CreateIndex
CREATE INDEX "Organization_userId_idx" ON "Organization"("userId");

-- CreateIndex
CREATE INDEX "Membership_tenantId_idx" ON "Membership"("tenantId");

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_organizationId_key" ON "Membership"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Website_slug_key" ON "Website"("slug");

-- CreateIndex
CREATE INDEX "Website_ownerId_idx" ON "Website"("ownerId");

-- CreateIndex
CREATE INDEX "Website_organizationId_idx" ON "Website"("organizationId");

-- CreateIndex
CREATE INDEX "Website_tenantId_idx" ON "Website"("tenantId");

-- CreateIndex
CREATE INDEX "Website_userId_idx" ON "Website"("userId");

-- CreateIndex
CREATE INDEX "Page_websiteId_idx" ON "Page"("websiteId");

-- CreateIndex
CREATE INDEX "Page_tenantId_idx" ON "Page"("tenantId");

-- CreateIndex
CREATE INDEX "Page_userId_idx" ON "Page"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_websiteId_path_key" ON "Page"("websiteId", "path");

-- CreateIndex
CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug");

-- CreateIndex
CREATE INDEX "Template_tenantId_idx" ON "Template"("tenantId");

-- CreateIndex
CREATE INDEX "Template_userId_idx" ON "Template"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentDefinition_type_key" ON "ComponentDefinition"("type");

-- CreateIndex
CREATE INDEX "ComponentDefinition_tenantId_idx" ON "ComponentDefinition"("tenantId");

-- CreateIndex
CREATE INDEX "ComponentDefinition_userId_idx" ON "ComponentDefinition"("userId");

-- CreateIndex
CREATE INDEX "Asset_websiteId_idx" ON "Asset"("websiteId");

-- CreateIndex
CREATE INDEX "Asset_tenantId_idx" ON "Asset"("tenantId");

-- CreateIndex
CREATE INDEX "Asset_userId_idx" ON "Asset"("userId");

-- CreateIndex
CREATE INDEX "Product_websiteId_idx" ON "Product"("websiteId");

-- CreateIndex
CREATE INDEX "Product_tenantId_idx" ON "Product"("tenantId");

-- CreateIndex
CREATE INDEX "Product_userId_idx" ON "Product"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_websiteId_slug_key" ON "Product"("websiteId", "slug");

-- CreateIndex
CREATE INDEX "Lead_websiteId_idx" ON "Lead"("websiteId");

-- CreateIndex
CREATE INDEX "Lead_tenantId_idx" ON "Lead"("tenantId");

-- CreateIndex
CREATE INDEX "Lead_userId_idx" ON "Lead"("userId");

-- CreateIndex
CREATE INDEX "Order_websiteId_idx" ON "Order"("websiteId");

-- CreateIndex
CREATE INDEX "Order_tenantId_idx" ON "Order"("tenantId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "PublishVersion_websiteId_idx" ON "PublishVersion"("websiteId");

-- CreateIndex
CREATE INDEX "PublishVersion_tenantId_idx" ON "PublishVersion"("tenantId");

-- CreateIndex
CREATE INDEX "PublishVersion_userId_idx" ON "PublishVersion"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PublishVersion_websiteId_version_key" ON "PublishVersion"("websiteId", "version");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_tenantId_idx" ON "Subscription"("tenantId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_websiteId_idx" ON "AnalyticsEvent"("websiteId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_type_idx" ON "AnalyticsEvent"("type");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_tenantId_idx" ON "AnalyticsEvent"("tenantId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_userId_idx" ON "AnalyticsEvent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_hostname_key" ON "Domain"("hostname");

-- CreateIndex
CREATE INDEX "Domain_websiteId_idx" ON "Domain"("websiteId");

-- CreateIndex
CREATE INDEX "Domain_tenantId_idx" ON "Domain"("tenantId");

-- CreateIndex
CREATE INDEX "Domain_userId_idx" ON "Domain"("userId");

-- CreateIndex
CREATE INDEX "ABTest_websiteId_idx" ON "ABTest"("websiteId");

-- CreateIndex
CREATE INDEX "ABTest_tenantId_idx" ON "ABTest"("tenantId");

-- CreateIndex
CREATE INDEX "ABTest_userId_idx" ON "ABTest"("userId");

-- CreateIndex
CREATE INDEX "ABVariant_tenantId_idx" ON "ABVariant"("tenantId");

-- CreateIndex
CREATE INDEX "ABVariant_userId_idx" ON "ABVariant"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_resource_idx" ON "AuditLog"("resource");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_idx" ON "AuditLog"("tenantId");

-- CreateIndex
CREATE INDEX "WebhookEvent_provider_idx" ON "WebhookEvent"("provider");

-- CreateIndex
CREATE INDEX "WebhookEvent_type_idx" ON "WebhookEvent"("type");

-- CreateIndex
CREATE INDEX "WebhookEvent_tenantId_idx" ON "WebhookEvent"("tenantId");

-- CreateIndex
CREATE INDEX "WebhookEvent_userId_idx" ON "WebhookEvent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingState_userId_key" ON "OnboardingState"("userId");

-- CreateIndex
CREATE INDEX "OnboardingState_tenantId_idx" ON "OnboardingState"("tenantId");

-- CreateIndex
CREATE INDEX "OnboardingState_userId_idx" ON "OnboardingState"("userId");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_tenantId_idx" ON "ProductVariant"("tenantId");

-- CreateIndex
CREATE INDEX "ProductVariant_userId_idx" ON "ProductVariant"("userId");

-- CreateIndex
CREATE INDEX "GenerationJob_userId_idx" ON "GenerationJob"("userId");

-- CreateIndex
CREATE INDEX "GenerationJob_websiteId_idx" ON "GenerationJob"("websiteId");

-- CreateIndex
CREATE INDEX "GenerationJob_status_idx" ON "GenerationJob"("status");

-- CreateIndex
CREATE INDEX "GenerationJob_type_idx" ON "GenerationJob"("type");

-- CreateIndex
CREATE INDEX "GenerationJob_tenantId_idx" ON "GenerationJob"("tenantId");

-- CreateIndex
CREATE INDEX "GenerationStep_jobId_idx" ON "GenerationStep"("jobId");

-- CreateIndex
CREATE INDEX "GenerationStep_status_idx" ON "GenerationStep"("status");

-- CreateIndex
CREATE INDEX "GenerationStep_tenantId_idx" ON "GenerationStep"("tenantId");

-- CreateIndex
CREATE INDEX "GenerationStep_userId_idx" ON "GenerationStep"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GenerationStep_jobId_name_key" ON "GenerationStep"("jobId", "name");

-- CreateIndex
CREATE INDEX "GenerationAsset_jobId_idx" ON "GenerationAsset"("jobId");

-- CreateIndex
CREATE INDEX "GenerationAsset_assetId_idx" ON "GenerationAsset"("assetId");

-- CreateIndex
CREATE INDEX "GenerationAsset_tenantId_idx" ON "GenerationAsset"("tenantId");

-- CreateIndex
CREATE INDEX "GenerationAsset_userId_idx" ON "GenerationAsset"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GenerationAsset_jobId_assetId_key" ON "GenerationAsset"("jobId", "assetId");

-- CreateIndex
CREATE INDEX "OnboardingStep_tenantId_idx" ON "OnboardingStep"("tenantId");

-- CreateIndex
CREATE INDEX "OnboardingStep_userId_idx" ON "OnboardingStep"("userId");

-- CreateIndex
CREATE INDEX "OnboardingStep_onboardingId_idx" ON "OnboardingStep"("onboardingId");

-- CreateIndex
CREATE INDEX "OnboardingStep_status_idx" ON "OnboardingStep"("status");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingStep_onboardingId_key_key" ON "OnboardingStep"("onboardingId", "key");

-- CreateIndex
CREATE INDEX "AIProviderConfig_tenantId_idx" ON "AIProviderConfig"("tenantId");

-- CreateIndex
CREATE INDEX "AIProviderConfig_userId_idx" ON "AIProviderConfig"("userId");

-- CreateIndex
CREATE INDEX "AIProviderConfig_provider_idx" ON "AIProviderConfig"("provider");

-- CreateIndex
CREATE INDEX "AIProviderConfig_isActive_idx" ON "AIProviderConfig"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "AIProviderConfig_tenantId_provider_label_key" ON "AIProviderConfig"("tenantId", "provider", "label");

-- CreateIndex
CREATE INDEX "AIUsageEvent_tenantId_idx" ON "AIUsageEvent"("tenantId");

-- CreateIndex
CREATE INDEX "AIUsageEvent_userId_idx" ON "AIUsageEvent"("userId");

-- CreateIndex
CREATE INDEX "AIUsageEvent_websiteId_idx" ON "AIUsageEvent"("websiteId");

-- CreateIndex
CREATE INDEX "AIUsageEvent_generationJobId_idx" ON "AIUsageEvent"("generationJobId");

-- CreateIndex
CREATE INDEX "AIUsageEvent_provider_idx" ON "AIUsageEvent"("provider");

-- CreateIndex
CREATE INDEX "AIUsageEvent_model_idx" ON "AIUsageEvent"("model");

-- CreateIndex
CREATE INDEX "AIUsageEvent_operation_idx" ON "AIUsageEvent"("operation");

-- CreateIndex
CREATE INDEX "AIUsageEvent_createdAt_idx" ON "AIUsageEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishVersion" ADD CONSTRAINT "PublishVersion_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABTest" ADD CONSTRAINT "ABTest_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABVariant" ADD CONSTRAINT "ABVariant_testId_fkey" FOREIGN KEY ("testId") REFERENCES "ABTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingState" ADD CONSTRAINT "OnboardingState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationStep" ADD CONSTRAINT "GenerationStep_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "GenerationJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationAsset" ADD CONSTRAINT "GenerationAsset_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "GenerationJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationAsset" ADD CONSTRAINT "GenerationAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Tenant-aware starter seed for Neon PostgreSQL
-- Run after db/neon-schema.sql.

BEGIN;

-- Root user and tenant
INSERT INTO "User" ("id", "email", "name", "primaryTenantId", "createdAt", "updatedAt")
VALUES ('user_founder', 'founder@aurelia.ai', 'Aurelia Founder', 'tenant_main', NOW(), NOW())
ON CONFLICT ("email") DO UPDATE SET "name" = EXCLUDED."name", "primaryTenantId" = EXCLUDED."primaryTenantId", "updatedAt" = NOW();

INSERT INTO "Tenant" ("id", "name", "slug", "ownerUserId", "plan", "status", "metadata", "createdAt", "updatedAt")
VALUES ('tenant_main', 'Aurelia Founder Workspace', 'aurelia-founder', 'user_founder', 'Business', 'Active', '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "ownerUserId" = EXCLUDED."ownerUserId", "plan" = EXCLUDED."plan", "updatedAt" = NOW();

INSERT INTO "TenantMember" ("id", "tenantId", "userId", "role", "status", "metadata", "createdAt", "updatedAt")
VALUES ('tenant_member_owner', 'tenant_main', 'user_founder', 'Owner', 'Active', '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("tenantId", "userId") DO UPDATE SET "role" = EXCLUDED."role", "status" = EXCLUDED."status", "updatedAt" = NOW();

INSERT INTO "TenantSettings" ("id", "tenantId", "userId", "branding", "domains", "billing", "security", "metadata", "createdAt", "updatedAt")
VALUES ('tenant_settings_main', 'tenant_main', 'user_founder', '{"accent":"#D4AF37","background":"#F8F6F0"}'::jsonb, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("tenantId") DO UPDATE SET "branding" = EXCLUDED."branding", "updatedAt" = NOW();

-- Onboarding
INSERT INTO "OnboardingState" ("id", "tenantId", "userId", "completed", "currentStep", "checklist", "createdAt", "updatedAt")
VALUES ('onboarding_main', 'tenant_main', 'user_founder', false, 1, '{"siteCreated":true,"productsAdded":true,"seoReviewed":false,"published":false}'::jsonb, NOW(), NOW())
ON CONFLICT ("userId") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "checklist" = EXCLUDED."checklist", "updatedAt" = NOW();

INSERT INTO "OnboardingStep" ("id", "tenantId", "userId", "onboardingId", "key", "title", "status", "metadata", "createdAt", "updatedAt") VALUES
('onboarding_step_site', 'tenant_main', 'user_founder', 'onboarding_main', 'site', 'Create first website', 'Completed', '{"order":1}'::jsonb, NOW(), NOW()),
('onboarding_step_products', 'tenant_main', 'user_founder', 'onboarding_main', 'products', 'Add products', 'Completed', '{"order":2}'::jsonb, NOW(), NOW()),
('onboarding_step_seo', 'tenant_main', 'user_founder', 'onboarding_main', 'seo', 'Review search presence', 'Pending', '{"order":3}'::jsonb, NOW(), NOW()),
('onboarding_step_publish', 'tenant_main', 'user_founder', 'onboarding_main', 'publish', 'Publish website', 'Pending', '{"order":4}'::jsonb, NOW(), NOW())
ON CONFLICT ("onboardingId", "key") DO UPDATE SET "status" = EXCLUDED."status", "updatedAt" = NOW();

-- AI provider config and usage example
INSERT INTO "AIProviderConfig" ("id", "tenantId", "userId", "provider", "label", "encryptedApiKey", "keyLast4", "defaultTextModel", "defaultImageModel", "defaultCodeModel", "isActive", "metadata", "createdAt", "updatedAt")
VALUES ('ai_config_gemini_main', 'tenant_main', 'user_founder', 'gemini', 'Primary Gemini', NULL, NULL, 'gemini-2.5-flash', 'gemini-2.5-flash-image-preview', 'gemini-2.5-pro', true, '{"managedBy":"env-or-tenant-config","seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("tenantId", "provider", "label") DO UPDATE SET "defaultTextModel" = EXCLUDED."defaultTextModel", "defaultImageModel" = EXCLUDED."defaultImageModel", "defaultCodeModel" = EXCLUDED."defaultCodeModel", "updatedAt" = NOW();

INSERT INTO "AIUsageEvent" ("id", "tenantId", "userId", "provider", "model", "operation", "promptTokens", "completionTokens", "totalTokens", "imageCount", "estimatedCostCents", "latencyMs", "status", "metadata", "createdAt")
VALUES ('ai_usage_seed', 'tenant_main', 'user_founder', 'gemini', 'gemini-2.5-flash', 'seed-example', 0, 0, 0, 0, 0, 0, 'Completed', '{"seed":true,"note":"example usage row"}'::jsonb, NOW())
ON CONFLICT ("id") DO NOTHING;

-- Component definitions
INSERT INTO "ComponentDefinition" ("id", "tenantId", "userId", "type", "label", "description", "category", "schema", "defaults", "metadata", "isActive", "createdAt", "updatedAt") VALUES
('cmp_hero', 'tenant_main', 'user_founder', 'hero', 'Hero', 'Premium conversion hero with headline, copy, CTA and media.', 'Sections', '{"title":{"type":"string"},"eyebrow":{"type":"string"},"body":{"type":"string"},"cta":{"type":"string"},"imageUrl":{"type":"asset"}}'::jsonb, '{"eyebrow":"Launch page","title":"Maison Aurelia","body":"A premium storefront crafted for thoughtful customers.","cta":"Shop collection","imageUrl":""}'::jsonb, '{"scope":"tenant","supports":["seo","motion","assetPicker"]}'::jsonb, true, NOW(), NOW()),
('cmp_features', 'tenant_main', 'user_founder', 'features', 'Features', 'Three glass feature cards with premium motion metadata.', 'Sections', '{"title":{"type":"string"},"items":{"type":"array"}}'::jsonb, '{"title":"Everything your customers need","items":[{"title":"Polished layouts","body":"Clear sections with refined visual rhythm."},{"title":"Luxury motion","body":"Shimmers, reveals and smooth storytelling."},{"title":"Commerce ready","body":"Products, cart, leads and checkout."}]}'::jsonb, '{"scope":"tenant","supports":["reorder","iconPicker"]}'::jsonb, true, NOW(), NOW()),
('cmp_gallery', 'tenant_main', 'user_founder', 'gallery', 'Gallery', 'Editorial image gallery with asset picker.', 'Media', '{"title":{"type":"string"},"images":{"type":"asset[]"}}'::jsonb, '{"title":"Editorial gallery","images":[]}'::jsonb, '{"scope":"tenant","supports":["assetLibrary","parallax"]}'::jsonb, true, NOW(), NOW()),
('cmp_products', 'tenant_main', 'user_founder', 'products', 'Product cards', 'DB-driven product showcase connected to CMS products.', 'Commerce', '{"title":{"type":"string"},"limit":{"type":"number"}}'::jsonb, '{"title":"Featured products","limit":3}'::jsonb, '{"scope":"tenant","supports":["productSource","abTesting","checkout"]}'::jsonb, true, NOW(), NOW()),
('cmp_scroll_story', 'tenant_main', 'user_founder', 'scrollStory', 'Scroll Storytelling', 'Premium scroll-driven story section with image or video panels.', 'Story', '{"eyebrow":{"type":"string"},"title":{"type":"string"},"body":{"type":"string"},"mediaUrl":{"type":"asset"},"mediaType":{"type":"string"},"chapters":{"type":"array"}}'::jsonb, '{"eyebrow":"Story","title":"A journey told in motion","body":"Guide visitors through a polished sequence of visuals and narrative details.","mediaUrl":"","mediaType":"video","chapters":[{"title":"Opening moment","body":"Introduce the world, mood and promise."},{"title":"Craft and detail","body":"Show what makes the offer valuable."},{"title":"Invitation","body":"End with a clear next step."}]}'::jsonb, '{"scope":"tenant","supports":["video","image","stickyScroll","storytelling"]}'::jsonb, true, NOW(), NOW()),
('cmp_model3d', 'tenant_main', 'user_founder', 'model3d', '3D Model Showcase', 'Premium GLB/GLTF product model section backed by Vercel Blob assets.', 'Commerce', '{"title":{"type":"string"},"body":{"type":"string"},"assetUrl":{"type":"asset"},"scale":{"type":"number"},"autoRotate":{"type":"boolean"},"environment":{"type":"string"}}'::jsonb, '{"title":"Explore every detail","body":"A closer look at the craftsmanship, materials and form.","assetUrl":"","scale":1.6,"autoRotate":true,"environment":"city"}'::jsonb, '{"scope":"tenant","supports":["modelViewer","lighting","commerce"]}'::jsonb, true, NOW(), NOW()),
('cmp_lead', 'tenant_main', 'user_founder', 'lead', 'Lead capture', 'Contact capture block connected to Lead API.', 'Forms', '{"title":{"type":"string"},"placeholder":{"type":"string"}}'::jsonb, '{"title":"Join the private list","placeholder":"email@brand.com"}'::jsonb, '{"scope":"tenant","supports":["notifications","analytics"]}'::jsonb, true, NOW(), NOW())
ON CONFLICT ("type") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "userId" = EXCLUDED."userId", "label" = EXCLUDED."label", "description" = EXCLUDED."description", "category" = EXCLUDED."category", "schema" = EXCLUDED."schema", "defaults" = EXCLUDED."defaults", "metadata" = EXCLUDED."metadata", "isActive" = true, "updatedAt" = NOW();

-- Template
INSERT INTO "Template" ("id", "tenantId", "userId", "name", "slug", "industry", "description", "isPremium", "metadata", "theme", "sections", "createdAt", "updatedAt")
VALUES ('tpl_maison_retail', 'tenant_main', 'user_founder', 'Maison Retail', 'maison-retail', 'Luxury retail', 'Premium storefront with products, story and search-ready sections.', false, '{"scope":"tenant","seed":true}'::jsonb, '{"background":"#F8F6F0","accent":"#D4AF37","text":"#1a1a1a","fonts":{"heading":"Playfair Display","body":"Inter"}}'::jsonb, '[{"id":"tpl-hero","type":"hero","props":{"eyebrow":"Luxury retail","title":"Maison Retail","body":"A polished storefront for premium products.","cta":"Shop collection"}},{"id":"tpl-story","type":"scrollStory","props":{"eyebrow":"Story","title":"A launch told beautifully","body":"Use motion, media and chapters to guide customers through the product story."}},{"id":"tpl-products","type":"products","props":{"title":"Featured collection","limit":3}}]'::jsonb, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "userId" = EXCLUDED."userId", "sections" = EXCLUDED."sections", "updatedAt" = NOW();

-- Starter website/page
INSERT INTO "Website" ("id", "tenantId", "userId", "ownerId", "name", "slug", "status", "industry", "theme", "metadata", "createdAt", "updatedAt")
VALUES ('web_maison_aurelia', 'tenant_main', 'user_founder', 'user_founder', 'Maison Aurelia', 'maison-aurelia', 'Draft', 'Luxury retail', '{"background":"#F8F6F0","accent":"#D4AF37","text":"#1a1a1a","fonts":{"heading":"Playfair Display","body":"Inter"}}'::jsonb, '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "userId" = EXCLUDED."userId", "updatedAt" = NOW();

INSERT INTO "Page" ("id", "tenantId", "userId", "websiteId", "title", "path", "sections", "seo", "createdAt", "updatedAt")
VALUES ('page_home_maison', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'Home', '/', '[{"id":"home-hero","type":"hero","props":{"eyebrow":"Seeded workspace","title":"Maison Aurelia","body":"A premium storefront with story, products and polished search settings.","cta":"Shop collection"}},{"id":"home-story","type":"scrollStory","props":{"eyebrow":"Story","title":"A journey told in motion","body":"Use image or video chapters to guide visitors through your brand story.","mediaUrl":"","mediaType":"video","chapters":[{"title":"Opening moment","body":"Introduce the mood and promise."},{"title":"Craft and detail","body":"Show materials, process and value."},{"title":"Invitation","body":"Guide visitors to the next step."}]}},{"id":"home-products","type":"products","props":{"title":"Featured products","limit":3}},{"id":"home-lead","type":"lead","props":{"title":"Join the private list","placeholder":"email@brand.com"}}]'::jsonb, '{"title":"Maison Aurelia | Premium Storefront","description":"A refined storefront for premium products, storytelling and customer conversion.","keywords":["luxury retail","premium storefront","Maison Aurelia"],"structuredDataType":"Store"}'::jsonb, NOW(), NOW())
ON CONFLICT ("websiteId", "path") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "userId" = EXCLUDED."userId", "sections" = EXCLUDED."sections", "seo" = EXCLUDED."seo", "updatedAt" = NOW();

-- Products and variants
INSERT INTO "Product" ("id", "tenantId", "userId", "websiteId", "name", "slug", "description", "price", "currency", "stock", "sku", "status", "metadata", "createdAt", "updatedAt") VALUES
('prod_noir_lamp', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'Noir Lamp', 'noir-lamp', 'A sculptural lamp with a soft architectural glow.', 24000, 'usd', 14, 'NOIR-LAMP', 'Active', '{"imageUrl":"","seed":true}'::jsonb, NOW(), NOW()),
('prod_champagne_chair', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'Champagne Chair', 'champagne-chair', 'A refined chair with champagne-toned detailing.', 89000, 'usd', 6, 'CHAMP-CHAIR', 'Active', '{"imageUrl":"","seed":true}'::jsonb, NOW(), NOW()),
('prod_silk_serum', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'Silk Serum', 'silk-serum', 'A botanical serum with a smooth, luminous finish.', 7600, 'usd', 33, 'SILK-SERUM', 'Active', '{"imageUrl":"","seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("websiteId", "slug") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "userId" = EXCLUDED."userId", "stock" = EXCLUDED."stock", "status" = EXCLUDED."status", "updatedAt" = NOW();

INSERT INTO "ProductVariant" ("id", "tenantId", "userId", "productId", "name", "sku", "price", "stock", "metadata", "createdAt", "updatedAt") VALUES
('var_lamp_noir', 'tenant_main', 'user_founder', 'prod_noir_lamp', 'Noir', 'NOIR-LAMP-BLACK', 24000, 8, '{"color":"black"}'::jsonb, NOW(), NOW()),
('var_lamp_champagne', 'tenant_main', 'user_founder', 'prod_noir_lamp', 'Champagne', 'NOIR-LAMP-CHAMP', 26000, 6, '{"color":"champagne"}'::jsonb, NOW(), NOW()),
('var_serum_30ml', 'tenant_main', 'user_founder', 'prod_silk_serum', '30ml', 'SILK-SERUM-30', 7600, 20, '{"size":"30ml"}'::jsonb, NOW(), NOW()),
('var_serum_50ml', 'tenant_main', 'user_founder', 'prod_silk_serum', '50ml', 'SILK-SERUM-50', 11600, 13, '{"size":"50ml"}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "userId" = EXCLUDED."userId", "stock" = EXCLUDED."stock", "price" = EXCLUDED."price", "updatedAt" = NOW();

-- Example lead/order/usage/generation checkpoint
INSERT INTO "Lead" ("id", "tenantId", "userId", "websiteId", "name", "email", "source", "status", "metadata", "createdAt", "updatedAt")
VALUES ('lead_sophia', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'Sophia Chen', 'sophia@example.com', 'Homepage form', 'New', '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Order" ("id", "tenantId", "userId", "websiteId", "customerName", "customerEmail", "total", "currency", "status", "items", "metadata", "createdAt", "updatedAt")
VALUES ('order_seed_1001', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'Olivia Hart', 'olivia@example.com', 31600, 'usd', 'Paid', '[{"productId":"prod_noir_lamp","quantity":1},{"productId":"prod_silk_serum","quantity":1}]'::jsonb, '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "GenerationJob" ("id", "tenantId", "userId", "websiteId", "type", "prompt", "status", "currentStep", "result", "metadata", "createdAt", "updatedAt")
VALUES ('gen_seed_job', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'website', 'Seed example generation job', 'Completed', 'completed', '{"seed":true}'::jsonb, '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "status" = EXCLUDED."status", "updatedAt" = NOW();

INSERT INTO "GenerationStep" ("id", "tenantId", "userId", "jobId", "name", "status", "input", "output", "createdAt", "updatedAt")
VALUES ('gen_seed_step', 'tenant_main', 'user_founder', 'gen_seed_job', 'seed_completed', 'Completed', '{}'::jsonb, '{"ok":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("jobId", "name") DO UPDATE SET "status" = EXCLUDED."status", "updatedAt" = NOW();

COMMIT;
