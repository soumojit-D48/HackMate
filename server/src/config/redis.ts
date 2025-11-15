

// import * as Redis from 'ioredis';
// const redis = new Redis(process.env.REDIS_URL);
// redis.on('error', (err) => console.error('Redis error:', err));
// export default redis;



// import Redis from 'ioredis';

// const redis = new Redis({
//   host: process.env.REDIS_HOST || 'localhost',
//   port: parseInt(process.env.REDIS_PORT || '6379'),
//   password: process.env.REDIS_PASSWORD || undefined,
//   db: parseInt(process.env.REDIS_DB || '0'),
//   maxRetriesPerRequest: 3,
//   retryStrategy: (times: number) => Math.min(times * 50, 2000),
// });

// redis.on('connect', () => console.log('✅ Redis connected'));
// redis.on('error', (err) => console.error('Redis error:', err));

// export { redis };

// export const redisHelpers = {
//   async set(key: string, value: any, ttl?: number): Promise<void> {
//     const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
//     if (ttl) {
//       await redis.setex(key, ttl, stringValue);
//     } else {
//       await redis.set(key, stringValue);
//     }
//   },

//   async get<T = any>(key: string): Promise<T | null> {
//     const value = await redis.get(key);
//     if (!value) return null;
//     try {
//       return JSON.parse(value);
//     } catch {
//       return value as T;
//     }
//   },

//   async del(...keys: string[]): Promise<void> {
//     await redis.del(...keys);
//   },

//   async exists(key: string): Promise<boolean> {
//     const result = await redis.exists(key);
//     return result === 1;
//   },
// };



import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));

export { redis };

export const redisHelpers = {
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, stringValue);
    } else {
      await redis.set(key, stringValue);
    }
  },

  async get<T = any>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return value as T;
    }
  },

  async del(...keys: string[]): Promise<void> {
    await redis.del(...keys);
  },

  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  },
};


/*
✔ Connects to Redis
✔ Logs when Redis is connected / errors
✔ Exports the Redis client
✔ Provides helper functions → set, get, del, exists
✔ Automatically JSON serializes/deserializes values
*/