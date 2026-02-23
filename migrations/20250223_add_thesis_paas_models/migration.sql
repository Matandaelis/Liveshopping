-- Create Subscription Plan Types
CREATE TYPE "subscription_tier" AS ENUM ('FREE', 'PRO', 'PREMIUM', 'ENTERPRISE');
CREATE TYPE "billing_period" AS ENUM ('MONTHLY', 'ANNUAL');
CREATE TYPE "citation_style" AS ENUM ('APA', 'MLA', 'CHICAGO', 'HARVARD', 'IEEE');
CREATE TYPE "ai_model_type" AS ENUM ('GROQ', 'CLAUDE', 'GPT4');

-- Subscription Plans Table
CREATE TABLE "SubscriptionPlan" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    tier subscription_tier NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    billingPeriod billing_period NOT NULL DEFAULT 'MONTHLY',
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    maxDocuments INTEGER DEFAULT -1,
    maxAISuggestions INTEGER DEFAULT -1,
    maxPlagiarismScans INTEGER DEFAULT -1,
    hasCollaboration BOOLEAN DEFAULT false,
    hasTemplates BOOLEAN DEFAULT false,
    supportLevel VARCHAR(50) DEFAULT 'NONE',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Subscriptions Table
CREATE TABLE "Subscription" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    userId TEXT NOT NULL,
    planId TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    startDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    endDate TIMESTAMP,
    renewalDate TIMESTAMP,
    stripeSubscriptionId VARCHAR(255),
    stripeCustomerId VARCHAR(255),
    autoRenew BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (planId) REFERENCES "SubscriptionPlan"(id)
);

-- Thesis Templates Table
CREATE TABLE "ThesisTemplate" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    university VARCHAR(255),
    country VARCHAR(255) DEFAULT 'Kenya',
    department VARCHAR(255),
    sections JSONB DEFAULT '[]'::jsonb,
    requirementNotes TEXT,
    marginSettings JSONB DEFAULT '{}'::jsonb,
    fontSettings JSONB DEFAULT '{}'::jsonb,
    isPublic BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE "Document" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    userId TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    templateId TEXT,
    content JSONB DEFAULT '[]'::jsonb,
    wordCount INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'DRAFT',
    version INTEGER DEFAULT 1,
    lastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    collaborators JSONB DEFAULT '[]'::jsonb,
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (templateId) REFERENCES "ThesisTemplate"(id)
);

-- Citations Table
CREATE TABLE "Citation" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    documentId TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    authors TEXT,
    publicationYear INTEGER,
    source VARCHAR(255),
    url VARCHAR(500),
    doi VARCHAR(100),
    citationStyle citation_style DEFAULT 'APA',
    formattedText TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (documentId) REFERENCES "Document"(id) ON DELETE CASCADE
);

-- Writing Feedback Table
CREATE TABLE "WritingFeedback" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    documentId TEXT NOT NULL,
    userId TEXT,
    feedbackType VARCHAR(50),
    text TEXT NOT NULL,
    category VARCHAR(100),
    severity VARCHAR(50),
    startPosition INTEGER,
    endPosition INTEGER,
    suggestedImprovement TEXT,
    isResolved BOOLEAN DEFAULT false,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (documentId) REFERENCES "Document"(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE SET NULL
);

-- Plagiarism Scans Table
CREATE TABLE "PlagiarismScan" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    documentId TEXT NOT NULL,
    scanStatus VARCHAR(50) DEFAULT 'PENDING',
    similarityPercentage DECIMAL(5, 2),
    matchedSources JSONB DEFAULT '[]'::jsonb,
    reportUrl VARCHAR(500),
    scanDate TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (documentId) REFERENCES "Document"(id) ON DELETE CASCADE
);

-- AI Chat Conversations Table
CREATE TABLE "AIChat" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    userId TEXT NOT NULL,
    documentId TEXT,
    model ai_model_type DEFAULT 'GROQ',
    title VARCHAR(255) DEFAULT 'New Conversation',
    messages JSONB DEFAULT '[]'::jsonb,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (documentId) REFERENCES "Document"(id) ON DELETE SET NULL
);

-- User Statistics Table
CREATE TABLE "UserStats" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    userId TEXT NOT NULL UNIQUE,
    documentsCreated INTEGER DEFAULT 0,
    aiSuggestionsUsed INTEGER DEFAULT 0,
    plagiarismScansUsed INTEGER DEFAULT 0,
    totalWritingTime INTEGER DEFAULT 0,
    lastActivityDate TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Payment Transactions Table
CREATE TABLE "PaymentTransaction" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    userId TEXT NOT NULL,
    subscriptionId TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'PENDING',
    stripePaymentIntentId VARCHAR(255),
    stripeInvoiceId VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completedAt TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (subscriptionId) REFERENCES "Subscription"(id) ON DELETE SET NULL
);

-- Create Indexes
CREATE INDEX idx_subscription_userId ON "Subscription"(userId);
CREATE INDEX idx_subscription_status ON "Subscription"(status);
CREATE INDEX idx_document_userId ON "Document"(userId);
CREATE INDEX idx_document_status ON "Document"(status);
CREATE INDEX idx_citation_documentId ON "Citation"(documentId);
CREATE INDEX idx_writingFeedback_documentId ON "WritingFeedback"(documentId);
CREATE INDEX idx_plagiarismScan_documentId ON "PlagiarismScan"(documentId);
CREATE INDEX idx_aiChat_userId ON "AIChat"(userId);
CREATE INDEX idx_paymentTransaction_userId ON "PaymentTransaction"(userId);

-- Add new fields to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS subscriptionId TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS subscriptionTier subscription_tier DEFAULT 'FREE';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS stripeCustomerId VARCHAR(255);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS university VARCHAR(255);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'STUDENT';
ALTER TABLE "User" ADD CONSTRAINT fk_subscription FOREIGN KEY (subscriptionId) REFERENCES "Subscription"(id) ON DELETE SET NULL;
