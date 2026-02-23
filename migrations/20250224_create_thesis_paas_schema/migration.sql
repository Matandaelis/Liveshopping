-- AlterEnum
ALTER TYPE "subscription_tier" ADD VALUE 'FREE' IF NOT EXISTS;
ALTER TYPE "subscription_tier" ADD VALUE 'PRO' IF NOT EXISTS;
ALTER TYPE "subscription_tier" ADD VALUE 'PREMIUM' IF NOT EXISTS;
ALTER TYPE "subscription_tier" ADD VALUE 'ENTERPRISE' IF NOT EXISTS;

-- CreateTable
CREATE TABLE IF NOT EXISTS "SubscriptionPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tier" TEXT NOT NULL UNIQUE,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "billingPeriod" TEXT NOT NULL DEFAULT 'MONTHLY',
    "description" TEXT,
    "features" JSONB NOT NULL DEFAULT '[]',
    "maxDocuments" INTEGER NOT NULL DEFAULT -1,
    "maxAISuggestions" INTEGER NOT NULL DEFAULT -1,
    "maxPlagiarismScans" INTEGER NOT NULL DEFAULT -1,
    "hasCollaboration" BOOLEAN NOT NULL DEFAULT false,
    "hasTemplates" BOOLEAN NOT NULL DEFAULT false,
    "supportLevel" TEXT NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "renewalDate" TIMESTAMP(3),
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
    CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan" ("id") ON DELETE RESTRICT
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ThesisTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "university" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Kenya',
    "department" TEXT,
    "sections" JSONB NOT NULL DEFAULT '[]',
    "requirementNotes" TEXT,
    "marginSettings" JSONB NOT NULL DEFAULT '{}',
    "fontSettings" JSONB NOT NULL DEFAULT '{}',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "templateId" TEXT,
    "content" JSONB NOT NULL DEFAULT '[]',
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collaborators" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
    CONSTRAINT "Document_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ThesisTemplate" ("id") ON DELETE SET NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Citation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT,
    "publicationYear" INTEGER,
    "source" TEXT,
    "url" TEXT,
    "doi" TEXT,
    "citationStyle" TEXT NOT NULL DEFAULT 'APA',
    "formattedText" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Citation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WritingFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "userId" TEXT,
    "feedbackType" TEXT,
    "text" TEXT NOT NULL,
    "category" TEXT,
    "severity" TEXT,
    "startPosition" INTEGER,
    "endPosition" INTEGER,
    "suggestedImprovement" TEXT,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WritingFeedback_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE,
    CONSTRAINT "WritingFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PlagiarismScan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "scanStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "similarityPercentage" DECIMAL(5,2),
    "matchedSources" JSONB NOT NULL DEFAULT '[]',
    "reportUrl" TEXT,
    "scanDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlagiarismScan_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AIChat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "documentId" TEXT,
    "model" TEXT NOT NULL DEFAULT 'GROQ',
    "title" TEXT NOT NULL DEFAULT 'New Conversation',
    "messages" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AIChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
    CONSTRAINT "AIChat_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE SET NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "UserStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "documentsCreated" INTEGER NOT NULL DEFAULT 0,
    "aiSuggestionsUsed" INTEGER NOT NULL DEFAULT 0,
    "plagiarismScansUsed" INTEGER NOT NULL DEFAULT 0,
    "totalWritingTime" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PaymentTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "stripePaymentIntentId" TEXT,
    "stripeInvoiceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "PaymentTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
    CONSTRAINT "PaymentTransaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE SET NULL
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX IF NOT EXISTS "Subscription_status_idx" ON "Subscription"("status");
CREATE INDEX IF NOT EXISTS "Document_userId_idx" ON "Document"("userId");
CREATE INDEX IF NOT EXISTS "Document_status_idx" ON "Document"("status");
CREATE INDEX IF NOT EXISTS "Document_templateId_idx" ON "Document"("templateId");
CREATE INDEX IF NOT EXISTS "Citation_documentId_idx" ON "Citation"("documentId");
CREATE INDEX IF NOT EXISTS "WritingFeedback_documentId_idx" ON "WritingFeedback"("documentId");
CREATE INDEX IF NOT EXISTS "WritingFeedback_userId_idx" ON "WritingFeedback"("userId");
CREATE INDEX IF NOT EXISTS "PlagiarismScan_documentId_idx" ON "PlagiarismScan"("documentId");
CREATE INDEX IF NOT EXISTS "AIChat_userId_idx" ON "AIChat"("userId");
CREATE INDEX IF NOT EXISTS "AIChat_documentId_idx" ON "AIChat"("documentId");
CREATE INDEX IF NOT EXISTS "UserStats_userId_idx" ON "UserStats"("userId");
CREATE INDEX IF NOT EXISTS "PaymentTransaction_userId_idx" ON "PaymentTransaction"("userId");
CREATE INDEX IF NOT EXISTS "PaymentTransaction_subscriptionId_idx" ON "PaymentTransaction"("subscriptionId");

-- Add columns to User if they don't exist
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "subscriptionId" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "subscriptionTier" TEXT DEFAULT 'FREE';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "university" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "userRole" TEXT DEFAULT 'STUDENT';

-- Add foreign key if it doesn't exist (PostgreSQL doesn't support IF NOT EXISTS for FKs, so we wrap in a transaction)
DO $$ 
BEGIN
  ALTER TABLE "User" ADD CONSTRAINT "User_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Create indices on User table if not exist
CREATE INDEX IF NOT EXISTS "User_subscriptionId_idx" ON "User"("subscriptionId");
CREATE INDEX IF NOT EXISTS "User_stripeCustomerId_idx" ON "User"("stripeCustomerId");
