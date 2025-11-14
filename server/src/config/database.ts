import { PrismaClient } from '@prisma/client';
import {logger } from '../utils/logger.js'

// Singleton pattern for Prisma Client
class DatabaseClient {
  private static instance: PrismaClient | null = null;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new PrismaClient({
        log: [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'event' },
          { level: 'warn', emit: 'event' },
        ],
      });

      // Log database queries in development
      if (process.env.NODE_ENV === 'development') {
        DatabaseClient.instance.$on('query' as never, (e: any) => {
          logger.debug(`Query: ${e.query}`);
          logger.debug(`Duration: ${e.duration}ms`);
        });
      }

      // Log database errors
      DatabaseClient.instance.$on('error' as never, (e: any) => {
        logger.error('Database error:', e);
      });

      // Log database warnings
      DatabaseClient.instance.$on('warn' as never, (e: any) => {
        logger.warn('Database warning:', e);
      });

      logger.info('✅ Database connection established');
    }

    return DatabaseClient.instance;
  }

  public static async disconnect(): Promise<void> {
    if (DatabaseClient.instance) {
      await DatabaseClient.instance.$disconnect();
      DatabaseClient.instance = null;
      logger.info('Database connection closed');
    }
  }
}

// Export singleton instance
export const prisma = DatabaseClient.getInstance();

// Export disconnect function for graceful shutdown
export const disconnectDatabase = DatabaseClient.disconnect;

// Health check function
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};