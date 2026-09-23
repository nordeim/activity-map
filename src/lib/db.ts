// Prisma client singleton with SQLite path resolution.
// See src/lib/db-path.ts for the resolution contract.

import { PrismaClient } from "@prisma/client";
import { runtimeDatabaseUrl } from "./db-path";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: runtimeDatabaseUrl(),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
