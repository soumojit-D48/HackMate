

import { redis } from '../config/redis.js';
import { CACHE_KEYS, CACHE_TTL } from '../config/constants.js';
import { logger } from './logger.js';
import { CacheError } from './error-handler.js';

/**
 * Cache wrapper with automatic JSON serialization/deserialization
 */
export class CacheHelper {
  /**
   * Set a value in cache with TTL
   */
  static async set<T>(
    key: string,
    value: T,
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await redis.setex(key, ttl, serialized);
      logger.debug(`Cache SET: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      logger.error(`Cache SET error for key ${key}:`, error);
      throw new CacheError(`Failed to set cache for key: ${key}`);
    }
  }

  /**
   * Get a value from cache
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      if (!value) {
        logger.debug(`Cache MISS: ${key}`);
        return null;
      }

      logger.debug(`Cache HIT: ${key}`);
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Cache GET error for key ${key}:`, error);
      return null; // Return null on error instead of throwing
    }
  }

  /**
   * Delete a value from cache
   */
  static async del(key: string | string[]): Promise<void> {
    try {
      const keys = Array.isArray(key) ? key : [key];
      await redis.del(...keys);
      logger.debug(`Cache DEL: ${keys.join(', ')}`);
    } catch (error) {
      logger.error(`Cache DEL error:`, error);
      throw new CacheError('Failed to delete cache');
    }
  }

  /**
   * Check if key exists
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Cache EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get or set pattern - fetch from cache or execute function and cache result
   */
  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<T> {
    try {
      // Try to get from cache
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // Execute function and cache result
      const result = await fetchFn();
      await this.set(key, result, ttl);
      return result;
    } catch (error) {
      logger.error(`Cache getOrSet error for key ${key}:`, error);
      // If cache fails, just execute the function
      return await fetchFn();
    }
  }

  /**
   * Delete keys by pattern
   */
  static async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
        logger.debug(`Cache DEL pattern: ${pattern} (${keys.length} keys)`);
      }
    } catch (error) {
      logger.error(`Cache DEL pattern error for ${pattern}:`, error);
      throw new CacheError('Failed to delete cache pattern');
    }
  }

  /**
   * Set expiration on existing key
   */
  static async expire(key: string, seconds: number): Promise<void> {
    try {
      await redis.expire(key, seconds);
      logger.debug(`Cache EXPIRE: ${key} (${seconds}s)`);
    } catch (error) {
      logger.error(`Cache EXPIRE error for key ${key}:`, error);
      throw new CacheError('Failed to set expiration');
    }
  }

  /**
   * Get TTL for a key
   */
  static async ttl(key: string): Promise<number> {
    try {
      return await redis.ttl(key);
    } catch (error) {
      logger.error(`Cache TTL error for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Increment a counter
   */
  static async increment(key: string, by: number = 1): Promise<number> {
    try {
      const result = await redis.incrby(key, by);
      logger.debug(`Cache INCR: ${key} by ${by}`);
      return result;
    } catch (error) {
      logger.error(`Cache INCREMENT error for key ${key}:`, error);
      throw new CacheError('Failed to increment counter');
    }
  }

  /**
   * Add item to a set
   */
  static async addToSet(key: string, ...members: string[]): Promise<void> {
    try {
      await redis.sadd(key, ...members);
      logger.debug(`Cache SADD: ${key}`);
    } catch (error) {
      logger.error(`Cache SADD error for key ${key}:`, error);
      throw new CacheError('Failed to add to set');
    }
  }

  /**
   * Get all members of a set
   */
  static async getSetMembers(key: string): Promise<string[]> {
    try {
      return await redis.smembers(key);
    } catch (error) {
      logger.error(`Cache SMEMBERS error for key ${key}:`, error);
      return [];
    }
  }

  /**
   * Remove item from a set
   */
  static async removeFromSet(key: string, ...members: string[]): Promise<void> {
    try {
      await redis.srem(key, ...members);
      logger.debug(`Cache SREM: ${key}`);
    } catch (error) {
      logger.error(`Cache SREM error for key ${key}:`, error);
      throw new CacheError('Failed to remove from set');
    }
  }

  /**
   * Check if member exists in set
   */
  static async isInSet(key: string, member: string): Promise<boolean> {
    try {
      const result = await redis.sismember(key, member);
      return result === 1;
    } catch (error) {
      logger.error(`Cache SISMEMBER error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Add item to sorted set with score
   */
  static async addToSortedSet(
    key: string,
    score: number,
    member: string
  ): Promise<void> {
    try {
      await redis.zadd(key, score, member);
      logger.debug(`Cache ZADD: ${key}`);
    } catch (error) {
      logger.error(`Cache ZADD error for key ${key}:`, error);
      throw new CacheError('Failed to add to sorted set');
    }
  }

  /**
   * Get range from sorted set
   */
  static async getSortedSetRange(
    key: string,
    start: number = 0,
    stop: number = -1
  ): Promise<string[]> {
    try {
      return await redis.zrange(key, start, stop);
    } catch (error) {
      logger.error(`Cache ZRANGE error for key ${key}:`, error);
      return [];
    }
  }

  /**
   * Flush all cache (use with caution!)
   */
  static async flushAll(): Promise<void> {
    try {
      await redis.flushall();
      logger.warn('Cache FLUSHED - All keys deleted');
    } catch (error) {
      logger.error('Cache FLUSH error:', error);
      throw new CacheError('Failed to flush cache');
    }
  }
}

/**
 * Domain-specific cache helpers
 */
export const UserCache = {
  set: (userId: string, data: any, ttl?: number) =>
    CacheHelper.set(CACHE_KEYS.USER(userId), data, ttl),
  get: (userId: string) => CacheHelper.get(CACHE_KEYS.USER(userId)),
  del: (userId: string) => CacheHelper.del(CACHE_KEYS.USER(userId)),
  setProfile: (userId: string, profile: any, ttl?: number) =>
    CacheHelper.set(CACHE_KEYS.USER_PROFILE(userId), profile, ttl),
  getProfile: (userId: string) =>
    CacheHelper.get(CACHE_KEYS.USER_PROFILE(userId)),
};

export const TeamCache = {
  set: (teamId: string, data: any, ttl?: number) =>
    CacheHelper.set(CACHE_KEYS.TEAM(teamId), data, ttl),
  get: (teamId: string) => CacheHelper.get(CACHE_KEYS.TEAM(teamId)),
  del: (teamId: string) => CacheHelper.del(CACHE_KEYS.TEAM(teamId)),
  setMembers: (teamId: string, members: any, ttl?: number) =>
    CacheHelper.set(CACHE_KEYS.TEAM_MEMBERS(teamId), members, ttl),
  getMembers: (teamId: string) =>
    CacheHelper.get(CACHE_KEYS.TEAM_MEMBERS(teamId)),
};

export const MatchCache = {
  set: (userId: string, matches: any, ttl?: number) =>
    CacheHelper.set(CACHE_KEYS.MATCHES(userId), matches, ttl),
  get: (userId: string) => CacheHelper.get(CACHE_KEYS.MATCHES(userId)),
  del: (userId: string) => CacheHelper.del(CACHE_KEYS.MATCHES(userId)),
};

export const ConversationCache = {
  set: (conversationId: string, data: any, ttl?: number) =>
    CacheHelper.set(CACHE_KEYS.CONVERSATION(conversationId), data, ttl),
  get: (conversationId: string) =>
    CacheHelper.get(CACHE_KEYS.CONVERSATION(conversationId)),
  del: (conversationId: string) =>
    CacheHelper.del(CACHE_KEYS.CONVERSATION(conversationId)),
};