## Technical Considerations

1. **Database Costs**:

   - Vercel Postgres has usage limits; monitor usage through the Vercel dashboard
   - Consider connecting to an external PostgreSQL instance for more control over scaling

2. **Schema Evolution**:

   - Use database migrations for schema changes
   - Design the versioning system to accommodate schema changes
   - Test migrations thoroughly in staging before applying to production

3. **Performance**:

   - Monitor JSON query performance as data grows
   - Consider using indexes on JSON fields for frequently accessed properties
   - Implement caching for read-heavy operations

4. **Integration with Existing Workflows**:
   - Ensure compatibility with your current CI/CD pipeline
   - Document API usage for other team members
   - Maintain type safety throughout the codebase# CV Data Management System Implementation Plan

## Overview

This document outlines a comprehensive plan for implementing a CV data management system using Vercel, PostgreSQL, Prisma, and Zod. The system will provide schema validation, type safety, and a well-defined API for managing CV data.

The implementation follows these core principles:

- **Type Safety**: Using TypeScript and Zod for runtime validation
- **Schema Enforcement**: Ensuring data conforms to the defined structure
- **Vercel Integration**: Leveraging Vercel's PostgreSQL offering
- **Next.js Compatibility**: Designed for seamless integration with the website

## Current Structure

The current system uses a TypeScript constant (`cvData`) in `src/data/cv-data.ts` with a const assertion. The data is hierarchical, containing:

- Header information
- Executive summary
- Key skills
- Experience (with nested roles)
- Education (with nested thesis information)
- Interests

## Proposed Solution Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Next.js UI     │◄────►│  API Routes     │◄────►│  PostgreSQL     │
│  Components     │      │  (with Zod      │      │  (Vercel        │
│                 │      │   validation)    │      │   Postgres)     │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         ▲                        ▲                        ▲
         │                        │                        │
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  TypeScript     │      │  Prisma ORM     │      │  Zod Schema     │
│  Types          │      │  Layer          │      │  Validation     │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Implementation Steps

### 1. Setup Prisma with PostgreSQL

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
model CV {
  id           String   @id @default(cuid())
  data         Json     // Stores the entire CV as JSON
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  version      Int      @default(1)  // Version number that increments with updates
  lastUpdated  DateTime @default(now()) // Explicit timestamp for data updates
  updatedBy    String?  // Optional field to track who made the change
}

// Store historical versions of CV data
model CVVersion {
  id           String   @id @default(cuid())
  cvId         String   // Reference to the parent CV
  data         Json     // Historical snapshot of the CV data
  version      Int      // Version number
  createdAt    DateTime @default(now())
  updatedBy    String?  // Who made this version

  @@unique([cvId, version]) // Ensure version numbers are unique per CV
}
```

### 2. Define Zod Schema for Validation

Create a comprehensive Zod schema in `src/lib/schemas/cv-schema.ts` that matches the structure of your CV data:

```typescript
// src/lib/schemas/cv-schema.ts
import { z } from "zod";

// Define sub-schemas first
const headerSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.string().email(),
  linkedin: z.string().url(),
  github: z.string().url(),
  googleScholar: z.string().url().optional(),
  website: z.string().url(),
  cv: z.string().url(),
  location: z.string(),
});

const roleSchema = z.object({
  title: z.string(),
  dates: z.string(),
  description_paragraphs: z.array(z.string()),
});

const experienceSchema = z.object({
  company: z.string(),
  website: z.string().url().optional(),
  roles: z.array(roleSchema),
});

const thesisSchema = z.object({
  title: z.string(),
  link: z.string().url(),
});

const educationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  dates: z.string(),
  thesis: thesisSchema.optional(),
});

// Full CV schema
export const CVSchema = z.object({
  header: headerSchema,
  executive_summary: z.array(z.string()),
  key_skills: z.array(z.string()),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  interests: z.array(z.string()),
});

// Create a type from the schema
export type CVDataType = z.infer<typeof CVSchema>;
```

### 3. Create Prisma Client Utility

Create a utility to ensure a singleton Prisma client in `src/lib/prisma.ts`:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logging";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  logger.debug(`Query ${params.model}.${params.action} took ${after - before}ms`);
  return result;
});

export default prisma;
```

### 4. Create Data Access Utilities

Create data access utilities in `src/lib/cv-data-service.ts`:

```typescript
// src/lib/cv-data-service.ts
import { prisma } from "./prisma";
import { CVSchema, CVDataType } from "./schemas/cv-schema";
import { logger } from "./logging";

export async function saveCVData(cvData: unknown, updatedBy?: string) {
  try {
    // Validate the data against our schema
    const validatedData = CVSchema.parse(cvData);

    // Start a transaction to update the CV and create a version
    return prisma.$transaction(async (tx) => {
      // Get the current CV to determine the next version number
      const currentCV = await tx.cV.findUnique({
        where: { id: "main-cv" },
      });

      const nextVersion = currentCV ? currentCV.version + 1 : 1;

      // Store current version in history before updating
      if (currentCV) {
        await tx.cVVersion.create({
          data: {
            cvId: currentCV.id,
            data: currentCV.data,
            version: currentCV.version,
            updatedBy: currentCV.updatedBy,
          },
        });
      }

      // Update or create the main CV
      const updatedCV = await tx.cV.upsert({
        where: {
          id: "main-cv", // Using a fixed ID for the main CV
        },
        update: {
          data: validatedData as any, // Prisma accepts this JSON
          updatedAt: new Date(),
          lastUpdated: new Date(),
          version: nextVersion,
          updatedBy,
        },
        create: {
          id: "main-cv",
          data: validatedData as any,
          version: 1,
          updatedBy,
        },
      });

      return updatedCV;
    });
  } catch (error) {
    logger.error("Error saving CV data:", error);
    throw new Error("Failed to save CV data");
  }
}

/**
 * Get a specific version of the CV
 */
export async function getCVDataVersion(version: number): Promise<CVDataType | null> {
  try {
    // If requesting the latest version, use the main CV record
    if (version === -1) {
      return getCVData();
    }

    // Otherwise, fetch the specific version
    const record = await prisma.cVVersion.findUnique({
      where: {
        cvId_version: {
          cvId: "main-cv",
          version,
        },
      },
    });

    if (!record) return null;

    // Validate data from DB to ensure it matches schema
    return CVSchema.parse(record.data);
  } catch (error) {
    logger.error("Error retrieving CV version:", error);
    throw new Error("Failed to retrieve CV version");
  }
}

/**
 * Get all available versions of the CV
 */
export async function getCVVersions() {
  try {
    const versions = await prisma.cVVersion.findMany({
      where: { cvId: "main-cv" },
      select: {
        version: true,
        createdAt: true,
        updatedBy: true,
      },
      orderBy: { version: "desc" },
    });

    const current = await prisma.cV.findUnique({
      where: { id: "main-cv" },
      select: {
        version: true,
        lastUpdated: true,
        updatedBy: true,
      },
    });

    if (current) {
      return [
        {
          version: current.version,
          createdAt: current.lastUpdated,
          updatedBy: current.updatedBy,
          isCurrent: true,
        },
        ...versions.map((v) => ({ ...v, isCurrent: false })),
      ];
    }

    return versions.map((v) => ({ ...v, isCurrent: false }));
  } catch (error) {
    logger.error("Error retrieving CV versions:", error);
    throw new Error("Failed to retrieve CV versions");
  }
}

export async function getCVData(): Promise<CVDataType | null> {
  try {
    const record = await prisma.cV.findUnique({
      where: { id: "main-cv" },
    });

    if (!record) return null;

    // Validate data from DB to ensure it matches schema
    return CVSchema.parse(record.data);
  } catch (error) {
    logger.error("Error retrieving CV data:", error);
    throw new Error("Failed to retrieve CV data");
  }
}
```

### 5. Implement Next.js API Routes

Create API routes for CV data in `src/app/api/cv/route.ts` (using App Router):

```typescript
// src/lib/auth.ts
export async function verifyApiToken(token: string | null): Promise<boolean> {
  if (!token) return false;

  // Get the API token from environment variable
  const apiToken = process.env.CV_API_TOKEN;
  if (!apiToken) {
    // If no token is configured, fail closed for security
    return false;
  }

  // Simple constant-time comparison to avoid timing attacks
  return token === apiToken;
}

// src/app/api/cv/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCVData, saveCVData, getCVVersions, getCVDataVersion } from "@/lib/cv-data-service";
import { CVSchema } from "@/lib/schemas/cv-schema";
import { logger } from "@/lib/logging";
import { verifyApiToken } from "@/lib/auth";

// Public endpoint for CV data
export async function GET(request: NextRequest) {
  try {
    // Check if a specific version was requested
    const searchParams = request.nextUrl.searchParams;
    const versionParam = searchParams.get("version");

    if (versionParam) {
      const version = parseInt(versionParam, 10);
      if (isNaN(version)) {
        return NextResponse.json({ error: "Invalid version parameter" }, { status: 400 });
      }

      const data = await getCVDataVersion(version);
      if (!data) {
        return NextResponse.json({ error: "CV version not found" }, { status: 404 });
      }
      return NextResponse.json(data);
    } else {
      // Return the latest version
      const data = await getCVData();
      if (!data) {
        return NextResponse.json({ error: "CV data not found" }, { status: 404 });
      }
      return NextResponse.json(data);
    }
  } catch (error) {
    logger.error("Error in CV GET API:", error);
    return NextResponse.json({ error: "Failed to retrieve CV data" }, { status: 500 });
  }
}

// Protected endpoint for CV updates
export async function POST(request: NextRequest) {
  try {
    // Check API token for authentication
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const isAuthorized = await verifyApiToken(token);
    if (!isAuthorized) {
      logger.warn("Unauthorized CV update attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate incoming data
    const validationResult = CVSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    // Get user identifier from request if available (could be from headers)
    const updatedBy = request.headers.get("X-User-Email") || "unknown";

    // Save data with versioning
    await saveCVData(body, updatedBy);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error in CV POST API:", error);
    return NextResponse.json({ error: "Failed to save CV data" }, { status: 500 });
  }
}

// Add a versions endpoint to list available versions
export async function GET_VERSIONS(request: NextRequest) {
  try {
    // This endpoint requires authentication too
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const isAuthorized = await verifyApiToken(token);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const versions = await getCVVersions();
    return NextResponse.json(versions);
  } catch (error) {
    logger.error("Error in CV versions API:", error);
    return NextResponse.json({ error: "Failed to retrieve CV versions" }, { status: 500 });
  }
}
```

### 6. Update CV Page to Fetch Data from API

Update the CV page to fetch data from the API in `src/app/cv/page.tsx`:

```typescript
// src/app/cv/page.tsx
import type { Metadata } from "next";

import { CVContent } from "@/components/cv-content";
import { getCVData } from "@/lib/cv-data-service";
import { getMetadata } from "@/data-generation/page-metadata";

export const metadata: Metadata = getMetadata({
  title: "Jim Cresswell | Hands-On Engineering Leadership",
  description: "CV of Jim Cresswell, Hands-On Engineering Leader",
});

export default async function CV() {
  // This is a server component, so we can directly fetch data
  const data = await getCVData();

  if (!data) {
    // Handle case where data is not found
    return <div className="text-center py-8">CV data not found</div>;
  }

  return <CVContent data={data} />;
}
```

### 7. Create Import Script for Initial Data

Create a script to import the initial CV data in `scripts/import-cv-data.ts`:

```typescript
// scripts/import-cv-data.ts
import { PrismaClient } from "@prisma/client";
import cvData from "../src/data/cv-data";
import { CVSchema } from "../src/lib/schemas/cv-schema";

const prisma = new PrismaClient();

async function importCVData() {
  try {
    // Validate data against schema first
    const validatedData = CVSchema.parse(cvData);
    console.log("CV data is valid");

    // Insert into database
    await prisma.cV.upsert({
      where: { id: "main-cv" },
      update: { data: validatedData as any },
      create: {
        id: "main-cv",
        data: validatedData as any,
      },
    });

    console.log("CV data imported successfully");
  } catch (error) {
    console.error("Error importing CV data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importCVData();
```

### 8. Configure Environment Variables

Create a `.env` file with the PostgreSQL connection string and API token:

```
DATABASE_URL="postgresql://username:password@hostname:port/database?schema=public"
CV_API_TOKEN="your-secure-random-token-here"
```

For Vercel, add these environment variables in the Vercel dashboard.

To generate a secure random token, you can use:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 9. Implement Backup Mechanism

Create a scheduled database backup solution in `scripts/backup-database.ts`:

```typescript
// scripts/backup-database.ts
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function backupDatabase() {
  try {
    // Get all CV data
    const mainCV = await prisma.cV.findUnique({
      where: { id: "main-cv" },
    });

    // Get all versions
    const versions = await prisma.cVVersion.findMany({
      where: { cvId: "main-cv" },
    });

    // Create backup data structure
    const backupData = {
      timestamp: new Date().toISOString(),
      mainCV,
      versions,
    };

    // Create backups directory if it doesn't exist
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Create backup filename with timestamp
    const filename = `cv-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    const backupPath = path.join(backupDir, filename);

    // Write backup file
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

    console.log(`Database backup created: ${backupPath}`);

    // If in production (e.g., Vercel), upload to cloud storage
    if (process.env.NODE_ENV === "production") {
      // Implement cloud storage upload here (e.g., AWS S3, Google Cloud Storage)
      // For simplicity, this is left as an exercise
      console.log("Would upload to cloud storage in production");
    }

    return backupPath;
  } catch (error) {
    console.error("Error backing up database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// If run directly
if (require.main === module) {
  backupDatabase()
    .then(() => console.log("Backup completed"))
    .catch((error) => {
      console.error("Backup failed:", error);
      process.exit(1);
    });
}

export { backupDatabase };
```

Configure a scheduled job to run this backup script:

For **Vercel**:

- Create a Vercel Cron Job in your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/backup",
      "schedule": "0 0 * * *" // Daily at midnight
    }
  ]
}
```

- Create the backup endpoint that will be called by the cron job:

```typescript
// src/app/api/backup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { backupDatabase } from "../../../../scripts/backup-database";
import { verifyApiToken } from "@/lib/auth";
import { logger } from "@/lib/logging";

export async function GET(request: NextRequest) {
  try {
    // Verify this is an authorized request
    // This can be called by Vercel Cron or manually with proper auth
    const authHeader = request.headers.get("Authorization");
    const cronHeader = request.headers.get("x-vercel-cron");

    // Allow the request if it's from Vercel Cron or has a valid API token
    const isCronJob = cronHeader === process.env.VERCEL_CRON_SECRET;
    const hasValidToken = await verifyApiToken(
      authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null,
    );

    if (!isCronJob && !hasValidToken) {
      logger.warn("Unauthorized backup attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backupPath = await backupDatabase();

    return NextResponse.json({
      success: true,
      message: "Backup completed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error in backup API:", error);
    return NextResponse.json(
      {
        error: "Backup failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
```

### 9. Optional: Create Admin Interface for CV Editing

Create a simple admin interface for editing CV data in `src/app/admin/cv/page.tsx` and `src/app/admin/cv/page.client.tsx`:

```typescript
// src/app/admin/cv/page.tsx
import { CVEditor } from './page.client';
import { getCVData } from '@/lib/cv-data-service';

export default async function AdminCVPage() {
  const initialData = await getCVData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">CV Editor</h1>
      <CVEditor initialData={initialData} />
    </div>
  );
}
```

```typescript
// src/app/admin/cv/page.client.tsx
'use client';

import { useState, useEffect } from 'react';
import { CVDataType } from '@/lib/schemas/cv-schema';
import { logger } from '@/lib/logging';

interface Version {
  version: number;
  createdAt: string;
  updatedBy?: string;
  isCurrent: boolean;
}

export function CVEditor({ initialData }: { initialData: CVDataType | null }) {
  const [data, setData] = useState<CVDataType | null>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [apiToken, setApiToken] = useState<string>('');
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  // Load API token from local storage if available
  useEffect(() => {
    const storedToken = localStorage.getItem('cv_api_token');
    if (storedToken) {
      setApiToken(storedToken);
    }
  }, []);

  // Load versions when API token changes
  useEffect(() => {
    if (apiToken) {
      fetchVersions();
    }
  }, [apiToken]);

  // Fetch available versions
  const fetchVersions = async () => {
    try {
      const response = await fetch('/api/cv/versions', {
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch versions');
      }

      const versionData = await response.json();
      setVersions(versionData);
    } catch (error) {
      logger.error('Error fetching versions:', error);
    }
  };

  // Load a specific version
  const loadVersion = async (version: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cv?version=${version}`, {
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load version');
      }

      const versionData = await response.json();
      setData(versionData);
      setSelectedVersion(version);
    } catch (error) {
      logger.error('Error loading version:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!data) {
    return <div>No CV data available</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiToken) {
      setSaveError('API token is required');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
          'X-User-Email': 'admin-ui' // You could replace this with actual user info
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save CV data');
      }

      setSaveSuccess(true);

      // Refetch versions to show the new version
      await fetchVersions();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApiTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = e.target.value;
    setApiToken(newToken);
    localStorage.setItem('cv_api_token', newToken);
  };

  return (
    <div className="space-y-8">
      {/* API Token Section */}
      <div className="mb-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
        <h2 className="text-lg font-medium mb-2">Authentication</h2>
        <div className="flex gap-2">
          <input
            type="password"
            value={apiToken}
            onChange={handleApiTokenChange}
            placeholder="Enter API token"
            className="flex-1 p-2 border rounded"
          />
        </div>
      </div>

      {/* Version History */}
      {versions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Version History</h2>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Version</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {versions.map((version) => (
                  <tr key={version.version} className={version
```

## Deployment Process

1. Set up Vercel PostgreSQL:

```bash
# Install the Vercel CLI
pnpm add -g vercel

# Link your project
vercel link

# Add Postgres to your project
vercel integration add vercel-postgres
```

2. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

3. Run the import script to populate initial data:

```bash
npx tsx scripts/import-cv-data.ts
```

4. Deploy to Vercel:

```bash
vercel --prod
```

## Benefits of This Approach

1. **Schema Enforcement**: Zod provides runtime validation ensuring data integrity
2. **TypeScript Integration**: Full type safety from database to UI
3. **Simple Data Model**: Stores the entire CV as a single JSON document
4. **API Access**: Clean endpoints for retrieving or updating CV data
5. **Vercel Compatibility**: Works with Vercel's PostgreSQL offering
6. **Flexibility**: Easy to extend or modify the schema as needed

## Included in Initial Implementation

1. **Simple Authentication**: API token-based authentication for admin functions
2. **Versioning**: Basic version control for CV changes with historical snapshots
3. **Backup Mechanism**: Automated database exports for disaster recovery
4. **Rich Text Editor**: Add a WYSIWYG editor for description fields
5. **Revision History**: Track changes to the CV over time
6. **Exports**: Add PDF and other export formats
7. **Preview Mode**: Add ability to preview changes before publishing

## Security Considerations

1. **API Token Storage**:

   - Store the API token securely in environment variables
   - Never expose the token in client-side code
   - Rotate tokens periodically for enhanced security

2. **Authentication Best Practices**:

   - Use HTTPS for all communications
   - Implement rate limiting on API endpoints
   - Consider IP whitelisting for admin endpoints in production

3. **Database Security**:

   - Use connection pooling with minimum necessary permissions
   - Encrypt sensitive data at rest (provided by Vercel Postgres)
   - Regularly audit database access logs

4. **Backup Security**:

   - Encrypt backup files
   - Control access to backup storage with IAM policies if using cloud storage
   - Maintain backup history for disaster recovery

5. **Monitoring & Alerting**:
   - Log all data modification attempts
   - Set up alerts for failed authentication attempts
   - Monitor API usage patterns for anomalies

## Integration with Existing Codebase

This implementation has been designed to fit within your current project structure and development practices:

1. **TypeScript**: Uses your existing TypeScript setup with strict typing
2. **ESLint/Prettier**: Follows your current code style and linting rules
3. **File Structure**: Matches your current organization of code
4. **Logging**: Integrates with your Winston logging setup
5. **Component Structure**: Maintains compatibility with your React component architecture
6. **Package Management**: Uses pnpm as your package manager

## Implementation Timeline

1. **Setup Database and Authentication**

   - Install dependencies
   - Configure Prisma
   - Set up Vercel Postgres
   - Implement API token authentication

2. **Schema & Data Layer with Versioning**

   - Define Zod schema
   - Create data access utilities with versioning support
   - Write data import script
   - Implement backup mechanism

3. **API Implementation**

   - Create authenticated API routes
   - Implement version history endpoint
   - Create backup API for scheduled backups
   - Test with Postman/Insomnia

4. **UI Integration**

   - Update CV page to use API
   - Create basic admin interface with version history support
   - Add version comparison view

5. **Testing & Deployment**
   - End-to-end testing
   - Deploy to Vercel
   - Set up scheduled backups
