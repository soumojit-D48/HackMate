

import Joi from 'joi';
import { ValidationError } from './error-handler';
import { USER_CONSTANTS, TEAM_CONSTANTS } from '../config/constants';

// Common validation schemas
export const commonSchemas = {
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
  uuid: Joi.string().uuid().required(),
  url: Joi.string().uri().optional(),
  phoneNumber: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .optional(),
  date: Joi.date().iso().optional(),
};

// User validation schemas
export const userSchemas = {
  createUser: Joi.object({
    email: commonSchemas.email,
    username: Joi.string()
      .min(USER_CONSTANTS.USERNAME_MIN_LENGTH)
      .max(USER_CONSTANTS.USERNAME_MAX_LENGTH)
      .pattern(/^[a-zA-Z0-9_-]+$/)
      .required(),
    fullName: Joi.string().min(2).max(100).required(),
    password: commonSchemas.password,
  }),

  updateProfile: Joi.object({
    fullName: Joi.string().min(2).max(100).optional(),
    bio: Joi.string().max(USER_CONSTANTS.MAX_BIO_LENGTH).optional(),
    avatar: commonSchemas.url,
    skills: Joi.array()
      .items(Joi.string().max(50))
      .max(USER_CONSTANTS.MAX_SKILLS)
      .optional(),
    interests: Joi.array()
      .items(Joi.string().max(50))
      .max(USER_CONSTANTS.MAX_INTERESTS)
      .optional(),
    location: Joi.string().max(100).optional(),
    github: commonSchemas.url,
    linkedin: commonSchemas.url,
    portfolio: commonSchemas.url,
    availability: Joi.string()
      .valid('AVAILABLE', 'BUSY', 'UNAVAILABLE')
      .optional(),
  }),

  search: Joi.object({
    query: Joi.string().min(1).max(100).optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    location: Joi.string().max(100).optional(),
    availability: Joi.string()
      .valid('AVAILABLE', 'BUSY', 'UNAVAILABLE')
      .optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

// Team validation schemas
export const teamSchemas = {
  createTeam: Joi.object({
    name: Joi.string()
      .min(3)
      .max(TEAM_CONSTANTS.MAX_NAME_LENGTH)
      .required(),
    description: Joi.string()
      .max(TEAM_CONSTANTS.MAX_DESCRIPTION_LENGTH)
      .optional(),
    hackathonId: commonSchemas.uuid.optional(),
    requiredSkills: Joi.array().items(Joi.string()).optional(),
    maxMembers: Joi.number()
      .integer()
      .min(TEAM_CONSTANTS.MIN_TEAM_SIZE)
      .max(TEAM_CONSTANTS.MAX_TEAM_SIZE)
      .default(5),
    isPublic: Joi.boolean().default(true),
  }),

  updateTeam: Joi.object({
    name: Joi.string()
      .min(3)
      .max(TEAM_CONSTANTS.MAX_NAME_LENGTH)
      .optional(),
    description: Joi.string()
      .max(TEAM_CONSTANTS.MAX_DESCRIPTION_LENGTH)
      .optional(),
    requiredSkills: Joi.array().items(Joi.string()).optional(),
    maxMembers: Joi.number()
      .integer()
      .min(TEAM_CONSTANTS.MIN_TEAM_SIZE)
      .max(TEAM_CONSTANTS.MAX_TEAM_SIZE)
      .optional(),
    isPublic: Joi.boolean().optional(),
    status: Joi.string()
      .valid('OPEN', 'CLOSED', 'FULL')
      .optional(),
  }),

  inviteMember: Joi.object({
    userId: commonSchemas.uuid,
    role: Joi.string()
      .valid(...TEAM_CONSTANTS.ROLES)
      .default('MEMBER'),
  }),

  updateMemberRole: Joi.object({
    role: Joi.string()
      .valid(...TEAM_CONSTANTS.ROLES)
      .required(),
  }),
};

// Message validation schemas
export const messageSchemas = {
  sendMessage: Joi.object({
    content: Joi.string().min(1).max(5000).required(),
    conversationId: commonSchemas.uuid.optional(),
    recipientId: commonSchemas.uuid.optional(),
    attachments: Joi.array()
      .items(
        Joi.object({
          url: commonSchemas.url.required(),
          type: Joi.string().valid('image', 'file', 'video').required(),
          name: Joi.string().max(255).required(),
          size: Joi.number().integer().positive().required(),
        })
      )
      .max(5)
      .optional(),
  }).xor('conversationId', 'recipientId'), // Either conversationId or recipientId must be present

  getMessages: Joi.object({
    conversationId: commonSchemas.uuid,
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
    before: Joi.date().iso().optional(),
  }),
};

// Pagination validation
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().optional(),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});

// ID validation
export const idSchema = Joi.object({
  id: commonSchemas.uuid,
});

// Validation helper function
export const validate = <T>(
  schema: Joi.ObjectSchema,
  data: any,
  options?: Joi.ValidationOptions
): T => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    ...options,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    throw new ValidationError('Validation failed', errors);
  }

  return value as T;
};

// Middleware validation helper
export const validateRequest = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: any, res: any, next: any) => {
    try {
      req[property] = validate(schema, req[property]);
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Custom validators
export const customValidators = {
  // Check if string is a valid skill format
  isValidSkill: (skill: string): boolean => {
    return /^[a-zA-Z0-9+#\s-]+$/.test(skill) && skill.length >= 2 && skill.length <= 50;
  },

  // Check if array has unique values
  hasUniqueValues: (arr: any[]): boolean => {
    return arr.length === new Set(arr).size;
  },

  // Check if string is alphanumeric with optional dashes and underscores
  isAlphanumericWithDashUnderscore: (str: string): boolean => {
    return /^[a-zA-Z0-9_-]+$/.test(str);
  },

  // Check if URL is valid and from allowed domains
  isAllowedDomain: (url: string, allowedDomains: string[]): boolean => {
    try {
      const urlObj = new URL(url);
      return allowedDomains.some((domain) => urlObj.hostname.endsWith(domain));
    } catch {
      return false;
    }
  },

  // Sanitize string (remove dangerous characters)
  sanitizeString: (str: string): string => {
    return str
      .replace(/[<>]/g, '') // Remove < and >
      .trim();
  },
};