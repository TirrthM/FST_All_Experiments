// Experiment 5: Global Singleton Connection Pattern for Prisma Client
// Prevents exhausting the connection pool during Next.js Hot Module Replacement (HMR)

export interface GenericPrismaClient {
  $transaction: <T>(fn: (tx: any) => Promise<T>) => Promise<T>;
  [key: string]: any;
}

const globalForPrisma = globalThis as unknown as {
  prisma: GenericPrismaClient | undefined;
};

// Singleton instance wrapper
export const prisma: GenericPrismaClient =
  globalForPrisma.prisma ??
  ({
    $transaction: async (fn) => fn({}),
    author: { upsert: async () => ({}) },
    genre: { upsert: async () => ({}) },
    book: { create: async () => ({}), delete: async () => ({}) },
    review: { create: async () => ({}) },
  } as GenericPrismaClient);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
