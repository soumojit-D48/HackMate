

export const SERVICE_PORTS = {
  API_GATEWAY: parseInt(process.env.GATEWAY_PORT || '3000'),
  AUTH_SERVICE: parseInt(process.env.AUTH_PORT || '3001'),
  USER_SERVICE: parseInt(process.env.USER_PORT || '3002'),
  TEAM_SERVICE: parseInt(process.env.TEAM_PORT || '3003'),
  MATCHING_SERVICE: parseInt(process.env.MATCHING_PORT || '3004'),
  CHAT_SERVICE: parseInt(process.env.CHAT_PORT || '3005'),
  NOTIFICATION_SERVICE: parseInt(process.env.NOTIFICATION_PORT || '3006'),
  ADMIN_SERVICE: parseInt(process.env.ADMIN_PORT || '3007'),
  FILE_SERVICE: parseInt(process.env.FILE_PORT || '3008'),
} as const;

export const QUEUE_NAMES = {
  NOTIFICATIONS: 'notifications',
  EMAIL: 'email',
  TEAM_INVITES: 'team_invites',
  TEAM_REQUESTS: 'team_requests',
  MATCH_REQUESTS: 'match_requests',
  USER_EVENTS: 'user_events',
  CHAT_MESSAGES: 'chat_messages',
  ANALYTICS: 'analytics',
} as const;

export const CACHE_KEYS = {
  USER: (userId: string) => `user:${userId}`,
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  TEAM: (teamId: string) => `team:${teamId}`,
  TEAM_MEMBERS: (teamId: string) => `team:members:${teamId}`,
  MATCHES: (userId: string) => `matches:${userId}`,
  CONVERSATION: (conversationId: string) => `conversation:${conversationId}`,
  USER_SESSIONS: (userId: string) => `sessions:${userId}`,
  RATE_LIMIT: (identifier: string) => `rate_limit:${identifier}`,
} as const;

export const CACHE_TTL = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 1800,
  VERY_LONG: 3600,
  DAY: 86400,
} as const;

export const ERROR_CODES = {
  UNAUTHORIZED: 1001,
  INVALID_TOKEN: 1002,
  TOKEN_EXPIRED: 1003,
  INVALID_CREDENTIALS: 1004,
  VALIDATION_ERROR: 2001,
  INVALID_INPUT: 2002,
  MISSING_REQUIRED_FIELD: 2003,
  NOT_FOUND: 3001,
  ALREADY_EXISTS: 3002,
  CONFLICT: 3003,
  FORBIDDEN: 4001,
  INSUFFICIENT_PERMISSIONS: 4002,
  INTERNAL_SERVER_ERROR: 5001,
  DATABASE_ERROR: 5002,
  CACHE_ERROR: 5003,
  QUEUE_ERROR: 5004,
  TEAM_FULL: 6001,
  ALREADY_IN_TEAM: 6002,
  DUPLICATE_REQUEST: 6005,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const TEAM_CONSTANTS = {
  MAX_TEAM_SIZE: 10,
  MIN_TEAM_SIZE: 1,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  ROLES: ['OWNER', 'ADMIN', 'MEMBER'] as const,
} as const;

export const USER_CONSTANTS = {
  MAX_BIO_LENGTH: 500,
  MAX_SKILLS: 20,
  MAX_INTERESTS: 15,
  MAX_PROJECTS: 10,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
} as const;

export const FILE_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  MAX_IMAGE_SIZE: 2 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const RATE_LIMITS = {
  DEFAULT: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  AUTH: {
    windowMs: 15 * 60 * 1000,
    max: 5,
  },
  CHAT: {
    windowMs: 60 * 1000,
    max: 50,
  },
} as const;

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  REACTION: 'reaction',
  MESSAGE_READ: 'message_read',
  ERROR: 'error',
} as const;

export const NOTIFICATION_TYPES = {
  TEAM_INVITE: 'TEAM_INVITE',
  TEAM_REQUEST: 'TEAM_REQUEST',
  REQUEST_ACCEPTED: 'REQUEST_ACCEPTED',
  REQUEST_REJECTED: 'REQUEST_REJECTED',
  NEW_MESSAGE: 'NEW_MESSAGE',
  MATCH_FOUND: 'MATCH_FOUND',
  TEAM_UPDATE: 'TEAM_UPDATE',
  MEMBER_JOINED: 'MEMBER_JOINED',
  MEMBER_LEFT: 'MEMBER_LEFT',
} as const;