// This file MUST be imported before anything else to ensure environment variables are loaded
import "dotenv/config";

// Force reload of environment variables for Prisma
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/thesis_writing";
process.env.SHADOW_DATABASE_URL = process.env.SHADOW_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/thesis_writing_shadow";
