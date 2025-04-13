# CV Data Management System Implementation Plan

**Status:** Defined

## Overview

This document outlines a comprehensive plan for implementing a CV data management system using Vercel PostgreSQL, Prisma, and Zod. The system will provide schema validation, type safety, versioning, and a secure API for managing CV data, enabling dynamic updates to the website content.

## Alignment with Best Practices (`.agent/best-practices.md`)

This plan adheres to the project's established best practices:

*   **Type Safety & Runtime Validation:** Leverages Zod for defining data schemas and validating data at runtime boundaries (API routes), inferring TypeScript types directly from Zod schemas (`z.infer`). This aligns with **`best-practices.md#2`**.
*   **Testing (TDD):** Emphasizes Test-Driven Development for the data service layer and integration testing for API routes. Unit tests will use Vitest/React Testing Library. This aligns with **`best-practices.md#1`**.
*   **Security:** Implements API token authentication and stresses secure handling of secrets (environment variables). Input validation via Zod is mandatory. This aligns with **`best-practices.md#8`**.
*   **Modularity & Code Quality:** Separates concerns into data service, API routes, and schemas. Promotes clear code and logging. This aligns with **`best-practices.md#6`**.
*   **Next.js & React:** Utilizes Next.js API Routes and Server/Client components appropriately. Aligns with **`best-practices.md#3` & `#4`**.
*   **Error Handling:** Incorporates structured error handling and logging. Aligns with **`best-practices.md#3`** (regarding `error.tsx`) and general robustness.

## Proposed Solution Architecture

```mermaid
graph LR
    A[Next.js Frontend (Admin UI)] --> B{API Routes (/api/cv)};
    B --> C[Data Service Layer (src/lib/cv-data-service.ts)];
    C --> D[Prisma Client (src/lib/prisma.ts)];
    D --> E[(Vercel PostgreSQL)];

    subgraph Validation & Types
        F[Zod Schema (src/lib/schemas/cv-schema.ts)] --> B;
        F --> C;
        F --> A;
    end

    subgraph Security
        G[API Token Auth] --> B;
        H[Environment Variables] --> D;
        H --> G;
    end
```

## Technical Considerations

1.  **Database Costs**:

    *   Vercel Postgres has usage limits; monitor usage through the Vercel dashboard
    *   Consider connecting to an external PostgreSQL instance for more control over scaling

2.  **Schema Evolution**:

    *   Use database migrations for schema changes
    *   Design the versioning system to accommodate schema changes
    *   Test migrations thoroughly in staging before applying to production

3.  **Performance**:

    *   Monitor JSON query performance as data grows
    *   Consider using indexes on JSON fields for frequently accessed properties
    *   Implement caching for read-heavy operations

4.  **Integration with Existing Workflows**:

    *   Ensure compatibility with your current CI/CD pipeline
    *   Document API usage for other team members
    *   Maintain type safety throughout the codebase

## Current Structure

The current system uses a TypeScript constant (`cvData`) in `src/data/cv-data.ts` with a const assertion. The data is hierarchical, containing:

*   Header information
*   Executive summary
*   Key skills
*   Experience (with nested roles)
*   Education (with nested thesis information)
*   Interests

## Proposed Solution Architecture

```mermaid
graph LR
    A[Next.js Frontend (Admin UI)] --> B{API Routes (/api/cv)};
    B --> C[Data Service Layer (src/lib/cv-data-service.ts)];
    C --> D[Prisma Client (src/lib/prisma.ts)];
    D --> E[(Vercel PostgreSQL)];

    subgraph Validation & Types
        F[Zod Schema (src/lib/schemas/cv-schema.ts)] --> B;
        F --> C;
        F --> A;
    end

    subgraph Security
        G[API Token Auth] --> B;
        H[Environment Variables] --> D;
        H --> G;
    end
```

## Implementation Steps

### 1. Setup Environment Variables

Ensure the following environment variables are defined in your `.env` file (and configured in Vercel):

*   `DATABASE_URL`: The connection string for your Vercel PostgreSQL database (provided by Vercel).
*   `CV_API_TOKEN`: A securely generated secret token used to authenticate requests to the POST/management endpoints of the CV API.

### 2. Setup Prisma with PostgreSQL

#### Install Dependencies

```bash
pnpm add @prisma/client zod
pnpm add prisma --save-dev
```

#### Initialize Prisma

```bash
npx prisma init
```

#### Configure Prisma Schema (schema.prisma)

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Store CV data as a JSON document in PostgreSQL with versioning
// Note: Using Json type provides flexibility but limits database-level querying/indexing on nested fields.
// This is suitable for storing the entire CV structure as one unit.
model CV {
  id           String   @id @default(cuid()) // Using CUIDs for unique IDs
  data         Json
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  version      Int      @default(1)
  lastUpdated  DateTime @default(now())
  updatedBy    String?  // Optional: Track who made the change (e.g., admin user ID)
  versions     CVVersion[] // Relation to historical versions

  // Constraint to ensure only one 'main' CV document exists if needed
  // @@unique([someIdentifierField])
}

// Store historical versions of CV data
model CVVersion {
  id           String   @id @default(cuid())
  cvId         String
  cv           CV       @relation(fields: [cvId], references: [id], onDelete: Cascade) // Relation to parent CV
  data         Json
  version      Int
  createdAt    DateTime @default(now())
  updatedBy    String?

  @@index([cvId]) // Index for efficient querying of versions for a specific CV
  @@unique([cvId, version])
}
```

#### Apply Initial Migration

Generate and apply the initial database migration.

```bash
# Generate migration files based on schema changes
npx prisma migrate dev --name init_cv_schema

# Apply migrations (in production/staging environments)
# npx prisma migrate deploy
```

### 3. Define Zod Schema for Validation

Create `src/lib/schemas/cv-schema.ts` (as shown previously). Ensure the schema accurately reflects the desired CV data structure.

```typescript
// src/lib/schemas/cv-schema.ts
import { z } from 'zod';

// ... (headerSchema, roleSchema, etc. as before)

// Full CV schema
export const CVSchema = z.object({
  // ... fields as before
});

// Infer the TypeScript type from the Zod schema (Best Practice)
export type CVDataType = z.infer<typeof CVSchema>;
```

### 4. Create Prisma Client Utility

Create `src/lib/prisma.ts` (as shown previously) to manage the Prisma client instance.

### 5. Implement Database Seeding (Initial Data Load)

Create a script to populate the database with initial CV data.

*   Add a `seed` script to `package.json`:
    ```json
    "scripts": {
      // ... other scripts
      "prisma:seed": "node --loader ts-node/esm prisma/seed.ts"
    }
    ```
*   Create `prisma/seed.ts`:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { CVSchema, CVDataType } from '../src/lib/schemas/cv-schema'; // Adjust path if needed
import initialCvData from '../src/data/cv-data'; // Assuming initial data is here
import { logger } from '../src/lib/logging'; // Adjust path if needed

const prisma = new PrismaClient();

async function main() {
  logger.info('Starting database seeding...');

  // 1. Validate initial data (Essential Step!)
  const validationResult = CVSchema.safeParse(initialCvData);
  if (!validationResult.success) {
    logger.error('Initial CV data failed validation:', validationResult.error.errors);
    // Consider throwing a custom validation error
    throw new Error('Seeding failed: Initial data validation error.');
  }
  const validatedData: CVDataType = validationResult.data;

  // 2. Upsert the main CV record (e.g., using a fixed ID for singleton CV)
  const cvId = 'main-cv'; // Use a fixed ID for the single main CV
  const existingCv = await prisma.cV.findUnique({ where: { id: cvId } });

  if (!existingCv) {
    logger.info(`Creating initial CV record with id: ${cvId}`);
    await prisma.cV.create({
      data: {
        id: cvId,
        data: validatedData as any, // Cast needed as Prisma expects JsonValue
        version: 1,
        updatedBy: 'seed-script',
      },
    });
    logger.info('Initial CV record created.');
  } else {
    logger.info(`CV record with id: ${cvId} already exists. Skipping creation.`);
    // Optionally, update the existing record if needed during development
    // await prisma.cV.update({
    //   where: { id: cvId },
    //   data: {
    //     data: validatedData as any,
    //     version: { increment: 1 },
    //     updatedBy: 'seed-script-update',
    //     lastUpdated: new Date(),
    //   },
    // });
    // logger.info('Existing CV record updated.');
  }

  logger.info('Database seeding finished successfully.');
}

main()
  .catch(async (e) => {
    logger.error('Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

*   Run the seed script: `pnpm prisma:seed`

### 6. Create Data Service Layer

Create `src/lib/cv-data-service.ts` with functions to interact with the database. Apply TDD here.

```typescript
// src/lib/cv-data-service.ts
import { Prisma, PrismaClient, CVVersion } from '@prisma/client'; // Import Prisma types
import { prisma } from './prisma';
import { CVSchema, CVDataType } from './schemas/cv-schema';
import { logger } from './logging'; // Assuming logger setup

const MAIN_CV_ID = 'main-cv'; // Define the constant ID for the main CV

/**
 * Saves or updates the main CV data, handling versioning.
 * Applies TDD: Write tests for this function first.
 */
export async function saveCVData(cvData: unknown, updatedBy?: string): Promise<CVDataType> {
  logger.info(`Attempting to save CV data. Updated by: ${updatedBy ?? 'system'}`);

  // 1. Validate the incoming data (Best Practice: Runtime Validation)
  const validationResult = CVSchema.safeParse(cvData);
  if (!validationResult.success) {
    logger.error('CV data validation failed:', validationResult.error.errors);
    // Consider throwing a custom validation error
    throw new Error(`Invalid CV data provided: ${validationResult.error.message}`);
  }
  const validatedData = validationResult.data;

  try {
    // 2. Use a transaction for atomic update and versioning
    const result = await prisma.$transaction(async (tx) => {
      // Find the current CV to get its version
      const currentCV = await tx.cV.findUnique({
        where: { id: MAIN_CV_ID },
      });

      if (!currentCV) {
        logger.error(`CV with id ${MAIN_CV_ID} not found for saving.`);
        throw new Error(`CV record with id ${MAIN_CV_ID} not found.`);
      }

      // Create a historical version entry
      await tx.cVVersion.create({
        data: {
          cvId: MAIN_CV_ID,
          data: currentCV.data, // Store the *previous* data state
          version: currentCV.version,
          updatedBy: currentCV.updatedBy,
          // createdAt will be defaulted
        },
      });

      // Update the main CV record with new data and incremented version
      const updatedCV = await tx.cV.update({
        where: { id: MAIN_CV_ID },
        data: {
          data: validatedData as any, // Prisma expects JsonValue
          version: { increment: 1 },
          lastUpdated: new Date(),
          updatedBy: updatedBy ?? 'system',
        },
      });

      logger.info(`Successfully saved CV data. New version: ${updatedCV.version}`);
      return updatedCV;
    });

    // Validate the data fetched *after* saving (optional sanity check)
    const finalValidation = CVSchema.safeParse(result.data);
    if (!finalValidation.success) {
        logger.warn('Data fetched after save failed validation (might indicate DB/schema mismatch)');
        // Decide how to handle this - log, alert, etc.
    }

    // Ensure the returned type matches CVDataType
    return finalValidation.success ? finalValidation.data : (result.data as CVDataType);

  } catch (error) {
    logger.error('Failed to save CV data:', error);
    // Re-throw or handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors (e.g., unique constraint violation)
      logger.error(`Prisma Error Code: ${error.code}`, error.meta);
      throw new Error(`Database error during save: ${error.message}`);
    } else if (error instanceof Error) {
      // Rethrow validation or other specific errors
      throw error;
    } else {
      throw new Error('An unknown database error occurred during save.');
    }
  }
}

/**
 * Retrieves the latest version of the main CV data.
 * Applies TDD: Write tests for this function.
 */
export async function getCVData(): Promise<CVDataType | null> {
  logger.info('Attempting to retrieve latest CV data...');
  try {
    const cv = await prisma.cV.findUnique({
      where: { id: MAIN_CV_ID },
    });

    if (!cv) {
      logger.warn(`CV with id ${MAIN_CV_ID} not found.`);
      return null;
    }

    // Validate the retrieved data against the schema (Best Practice)
    const validationResult = CVSchema.safeParse(cv.data);
    if (!validationResult.success) {
      logger.error(`Stored CV data (Version: ${cv.version}) failed validation:`, validationResult.error.errors);
      // Decide how to handle this - return null, throw error, return potentially unsafe data?
      // Throwing an error is safer if data integrity is critical.
      throw new Error('Stored CV data is invalid according to the current schema.');
    }

    logger.info(`Successfully retrieved CV data version ${cv.version}`);
    return validationResult.data;
  } catch (error: any) {
    logger.error('Failed to retrieve CV data:', error);
    // Handle specific errors if needed
    if (error.message.includes('Stored CV data is invalid')) {
        // Rethrow validation error specifically
        throw error;
    }
    if (error.message.includes('not found')) {
        return null; // Return null for not found
    }
    throw new Error('Failed to retrieve CV data due to a database error.');
  }
}

/**
 * Retrieves metadata for all historical versions of the main CV.
 * Applies TDD: Write tests for this function.
 */
export async function getCVVersionsMetadata(): Promise<Omit<CVVersion, 'data' | 'cv'>[]> {
  logger.info('Retrieving historical CV versions metadata...');
  try {
    const versions = await prisma.cVVersion.findMany({
      where: { cvId: MAIN_CV_ID },
      orderBy: { version: 'desc' }, // Show newest first
      select: {
        id: true,
        cvId: true,
        version: true,
        createdAt: true,
        updatedBy: true,
        // Exclude 'data' for performance when only metadata is needed
      },
    });
    logger.info(`Retrieved metadata for ${versions.length} historical versions.`);
    return versions;
  } catch (error: any) {
    logger.error('Failed to retrieve CV versions metadata:', error);
    throw new Error('Failed to retrieve CV versions metadata due to a database error.');
  }
}

/**
 * Retrieves a specific historical version of the CV data.
 * Applies TDD: Write tests for this function.
 */
export async function getCVVersionByNumber(version: number): Promise<CVDataType | null> {
    logger.info(`Retrieving historical CV version: ${version}`);
    if (version <= 0) {
        logger.warn('Requested invalid version number <= 0');
        return null;
    }
    try {
        const cvVersion = await prisma.cVVersion.findUnique({
            where: {
                cvId_version: {
                    cvId: MAIN_CV_ID,
                    version: version,
                },
            },
        });

        if (!cvVersion) {
            logger.warn(`CV version ${version} not found.`);
            return null;
        }

        // Validate the historical data against the current schema
        const validationResult = CVSchema.safeParse(cvVersion.data);
        if (!validationResult.success) {
            logger.error(`Stored CV data (Version: ${version}) failed validation against current schema:`, validationResult.error.errors);
            // Decide how to handle - could indicate schema drift. Maybe return raw JSON or throw?
            // Returning null or throwing is often safer.
            throw new Error(`Stored CV version ${version} data is invalid according to the current schema.`);
        }

        logger.info(`Successfully retrieved CV version ${version}`);
        return validationResult.data;
    } catch (error: any) {
        logger.error(`Failed to retrieve CV version ${version}:`, error);
        if (error instanceof Error && error.message.includes('Stored CV version')) {
            throw error; // Rethrow validation error
        }
        if (error.message.includes('not found')) {
            return null; // Return null for not found
        }
        throw new Error(`Failed to retrieve CV version ${version} due to a database error.`);
    }
}

```

### 7. Implement API Routes

Create API routes in `src/app/api/cv/` using Next.js App Router conventions. Apply TDD for API routes as well.

First, create a simple authentication utility:

```typescript
// src/lib/auth.ts
import { logger } from './logging';

/**
 * Verifies the provided API token against the environment variable.
 * Uses constant-time comparison for security.
 */
export function verifyApiToken(token: string | null): boolean {
  const expectedToken = process.env.CV_API_TOKEN;

  if (!expectedToken) {
    logger.error('CRITICAL: CV_API_TOKEN is not set in environment variables.');
    return false; // Fail closed if the expected token isn't configured
  }

  if (!token) {
    return false; // No token provided
  }

  // Basic constant-time comparison (Consider more robust library for production)
  if (token.length !== expectedToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
  }
  return result === 0;
}
```

Now, implement the API routes:

```typescript
// src/app/api/cv/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getCVData,
  saveCVData,
  getCVVersionByNumber,
} from '@/lib/cv-data-service';
import { CVSchema } from '@/lib/schemas/cv-schema';
import { logger } from '@/lib/logging';
import { verifyApiToken } from '@/lib/auth';

/**
 * GET /api/cv
 * Retrieves the latest CV data (publicly accessible).
 * Optionally retrieves a specific version using ?version={number} (requires auth).
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const versionParam = searchParams.get('version');

  try {
    if (versionParam) {
      // --- Retrieve Specific Version (Requires Auth) ---
      const token = request.headers.get('Authorization')?.replace('Bearer ', '');
      if (!verifyApiToken(token)) {
        logger.warn('Unauthorized attempt to access specific CV version.');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const version = parseInt(versionParam, 10);
      if (isNaN(version) || version <= 0) {
        return NextResponse.json({ error: 'Invalid version number.' }, { status: 400 });
      }

      logger.info(`API: Attempting to retrieve CV version ${version}`);
      const data = await getCVVersionByNumber(version);
      if (!data) {
        return NextResponse.json({ error: `CV version ${version} not found.` }, { status: 404 });
      }
      return NextResponse.json(data);

    } else {
      // --- Retrieve Latest Version (Public) ---
      logger.info('API: Attempting to retrieve latest CV data.');
      const data = await getCVData();
      if (!data) {
        // This might happen if seeding hasn't run or data was deleted
        logger.warn('API: Latest CV data not found.');
        return NextResponse.json({ error: 'CV data not found.' }, { status: 404 });
      }
      return NextResponse.json(data);
    }
  } catch (error: any) {
    logger.error(`API Error (GET /api/cv): ${error.message}`, { error });
    // Distinguish between known data errors and unexpected server errors
    if (error.message.includes('Stored CV data is invalid')) {
        // Log critical error, but maybe return a generic message to the client
        return NextResponse.json({ error: 'Internal data consistency error.' }, { status: 500 });
    }
    if (error.message.includes('not found')) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to retrieve CV data due to a server error.' }, { status: 500 });
  }
}

/**
 * POST /api/cv
 * Saves new CV data (protected by API token).
 */
export async function POST(request: NextRequest) {
  // 1. Authentication
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!verifyApiToken(token)) {
    logger.warn('Unauthorized POST attempt to /api/cv.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Get Request Body
  let body;
  try {
    body = await request.json();
  } catch (e) {
    logger.error('API Error: Failed to parse request body.', { error: e });
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // 3. Input Validation (using the existing Zod schema)
  const validationResult = CVSchema.safeParse(body);
  if (!validationResult.success) {
    logger.warn('API Error: Invalid data submitted.', { errors: validationResult.error.format() });
    return NextResponse.json(
      { error: 'Invalid data provided.', details: validationResult.error.format() },
      { status: 400 }
    );
  }

  // 4. Identify Updater (Optional: Get from headers or token claims if using JWT)
  const updatedBy = request.headers.get('X-User-Identifier') ?? 'api-post';

  // 5. Call Data Service
  try {
    logger.info(`API: Attempting to save new CV data. Updated by: ${updatedBy}`);
    const savedData = await saveCVData(validationResult.data, updatedBy);
    logger.info(`API: Successfully saved CV data. New version: ${savedData.version}`); // Assuming saveCVData returns the saved object with version
    // Return the newly saved data or just success
    // Returning the data confirms what was saved and its version
    return NextResponse.json({ message: 'CV data saved successfully.', data: savedData }, { status: 200 });
  } catch (error: any) {
    logger.error(`API Error (POST /api/cv): ${error.message}`, { error });
    // Handle specific known errors from the service layer
    if (error.message.includes('Invalid CV data provided')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error.message.includes('not found')) {
        // This shouldn't happen on save if upsert logic is correct, but good to handle
        return NextResponse.json({ error: 'Error finding existing CV record for update.' }, { status: 404 });
    }
    if (error.message.includes('Database error during save')) {
        return NextResponse.json({ error: 'A database error occurred during save.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to save CV data due to an unexpected server error.' }, { status: 500 });
  }
}

// Note: Implement rate limiting using middleware or a library like 'next-connect'
//       for enhanced security against brute-force attacks or abuse.
```

Create a separate route for fetching version metadata:

```typescript
// src/app/api/cv/versions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCVVersionsMetadata } from '@/lib/cv-data-service';
import { logger } from '@/lib/logging';
import { verifyApiToken } from '@/lib/auth';

/**
 * GET /api/cv/versions
 * Retrieves metadata for all historical CV versions (protected by API token).
 */
export async function GET(request: NextRequest) {
  // 1. Authentication
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!verifyApiToken(token)) {
    logger.warn('Unauthorized attempt to access /api/cv/versions.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Call Data Service
  try {
    logger.info('API: Retrieving CV versions metadata.');
    const versions = await getCVVersionsMetadata();
    logger.info(`API: Retrieved metadata for ${versions.length} versions.`);
    return NextResponse.json(versions);
  } catch (error: any) {
    logger.error(`API Error (GET /api/cv/versions): ${error.message}`, { error });
    return NextResponse.json({ error: 'Failed to retrieve CV versions metadata due to a server error.' }, { status: 500 });
  }
}
```

### 8. Update CV Page Component

Update the page component (`src/app/cv/page.tsx`) to fetch data using the service layer function directly, as it's a Next.js Server Component. Error handling should be included.

```typescript
// src/app/cv/page.tsx
import type { Metadata } from 'next';
import { CVContent } from '@/components/cv-content'; // Assuming this component renders the CV
import { getCVData } from '@/lib/cv-data-service';
import { logger } from '@/lib/logging';
// import { getMetadata } from '@/data-generation/page-metadata'; // If you have this helper

// Example Metadata (adjust as needed)
export const metadata: Metadata = {
  title: 'Jim Cresswell | CV',
  description: 'Curriculum Vitae for Jim Cresswell',
};

export default async function CVPage() {
  logger.info('CVPage: Fetching CV data...');
  let cvData = null;
  let fetchError = null;

  try {
    cvData = await getCVData();
  } catch (error: any) {
    logger.error(`CVPage: Failed to fetch CV data: ${error.message}`, { error });
    fetchError = error.message || 'An unexpected error occurred while fetching CV data.';
  }

  if (fetchError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        <p>Error loading CV data:</p>
        <p>{fetchError}</p>
      </div>
    );
  }

  if (!cvData) {
    logger.warn('CVPage: No CV data found after fetch attempt.');
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        CV data is currently unavailable.
      </div>
    );
  }

  logger.info('CVPage: CV data fetched successfully.');
  // Pass the validated data to the rendering component
  return <CVContent data={cvData} />;
}
```

### 9. Configure Environment Variables

Ensure the following environment variables are configured both locally (`.env` or `.env.local`) and in the deployment environment (e.g., Vercel dashboard):

*   `DATABASE_URL`: The full connection string for your PostgreSQL database.
    *   Example: `postgresql://user:password@host:port/database?schema=public`
*   `CV_API_TOKEN`: A cryptographically secure random string used to authenticate POST requests to `/api/cv` and GET requests to `/api/cv/versions` or specific `/api/cv?version=X`.
    *   Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
*   `LOG_LEVEL` (Optional): Set logging level (e.g., `debug`, `info`, `warn`, `error`). Defaults to `info` if using a typical logger setup.
*   `VERCEL_CRON_SECRET` (If using Vercel Cron for Backups): A secret shared between your backup script/API and the Vercel Cron configuration.

**Security Note:** Never commit `.env` files containing sensitive information like `DATABASE_URL` or `CV_API_TOKEN` to your Git repository. Use `.env.local` (which should be in `.gitignore`) for local development secrets and configure production secrets directly in your hosting provider's settings.

### 10. Implement Backup Strategy

A robust backup strategy is crucial. Consider these approaches:

*   **Managed Database Backups:** Leverage the automated backup features provided by your database host (e.g., Vercel Postgres, AWS RDS, Supabase). This is often the simplest and most reliable method.
*   **Manual/Scripted Backups:**
    *   Create a script (`scripts/backup-database.ts`) that uses `pg_dump` or similar database tools to export the database schema and data.
    *   **Store Backups Securely Offsite:** Upload the backup files to a secure, separate location (e.g., AWS S3, Google Cloud Storage, Backblaze B2). Do not rely solely on backups stored on the same server or platform.
    *   **Schedule Backups:** Automate the execution of the backup script using:
        *   **Vercel Cron Jobs:** Define a cron job in `vercel.json` that triggers a secure API endpoint (`/api/backup`) which runs the backup script.
        *   **GitHub Actions:** Schedule a workflow to run the script and upload the backup.
        *   **System Cron (if self-hosting):** Use the operating system's cron daemon.
*   **Regular Testing:** Periodically test your backup restoration process to ensure backups are valid and can be restored successfully.

*(Detailed script implementation for backup is beyond the scope of this core data handling plan but should be tracked as a separate task.)*

## Testing Strategy

*   **Unit Tests:** Use Vitest/Jest for testing individual functions, especially in the data service layer (`cv-data-service.ts`), validation logic (`cv-schema.ts`), and utility functions (`auth.ts`). Mock Prisma client interactions.
*   **Integration Tests:** Test the interaction between the API routes and the data service layer. This might involve setting up a test database or using Prisma mocking utilities.
*   **End-to-End Tests (Optional but Recommended):** Use tools like Playwright or Cypress to simulate user interactions with the deployed application, verifying data display and potentially the admin interface (if built).

## Deployment Process

1.  **Infrastructure Setup:**
    *   Ensure your PostgreSQL database is provisioned and accessible (e.g., via Vercel Postgres, Supabase, AWS RDS).
    *   Configure required environment variables (`DATABASE_URL`, `CV_API_TOKEN`, etc.) in your deployment environment (e.g., Vercel project settings).
2.  **Database Migration:**
    *   Generate the Prisma client based on your schema: `pnpm prisma generate`
    *   Apply database migrations to the production database. **Caution:** Use `prisma migrate deploy` in production environments, not `prisma migrate dev`.
        ```bash
        pnpm prisma migrate deploy
        ```
3.  **Database Seeding (Initial Deployment Only):**
    *   Run the seed script against the production database **once** during the initial setup.
        ```bash
        pnpm prisma:seed
        ```
    *   **Note:** Be careful running seed scripts in production. Ensure your script is idempotent or designed only for initial population.
4.  **Build and Deploy Application:**
    *   Build the Next.js application: `pnpm build`
    *   Deploy using your hosting provider's mechanism (e.g., `vercel deploy --prod`, push to connected Git branch).
5.  **Configure Backups:** Set up and verify your chosen automated backup mechanism.
6.  **Monitoring:** Set up logging and monitoring (e.g., Vercel Log Drains, Sentry) to track application health and errors.

## Security Considerations

*   **Environment Variables:** Keep secrets out of code; use environment variables configured securely in the deployment environment.
*   **API Token Security:** Protect the `CV_API_TOKEN`. Use HTTPS for all API communication. Implement rate limiting on protected API endpoints.
*   **Input Validation:** Rigorously validate all incoming data using Zod schemas (both in API routes and data service layer) to prevent injection attacks and ensure data integrity.
*   **Database Security:** Use strong database credentials. Limit database user permissions if possible. Ensure the database is not publicly accessible.
*   **Dependencies:** Keep dependencies updated to patch security vulnerabilities (`pnpm up --latest`). Use tools like `npm audit` or Snyk.
*   **Error Handling:** Avoid leaking sensitive information in error messages returned to the client.

## Future Enhancements

*   Implement a more sophisticated Admin UI for editing.
*   Add more granular role-based access control if multiple users need to edit.
*   Integrate with a Content Management System (CMS) if desired.
*   Enhance testing coverage, especially end-to-end tests.

This plan provides a structured approach to handling CV data within the Next.js application, incorporating versioning, validation, and security best practices.
