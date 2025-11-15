

import { ERROR_CODES, HTTP_STATUS } from '../config/constants.js';

// Base Application Error
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorCode: number = ERROR_CODES.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();

    Error.captureStackTrace(this);
  }
}

// Authentication Errors
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }
}

export class InvalidTokenError extends AppError {
  constructor(message: string = 'Invalid authentication token') {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_TOKEN);
  }
}

export class TokenExpiredError extends AppError {
  constructor(message: string = 'Authentication token has expired') {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.TOKEN_EXPIRED);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message: string = 'Invalid credentials provided') {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_CREDENTIALS);
  }
}

// Validation Errors
export class ValidationError extends AppError {
  public readonly errors: any[];

  constructor(message: string = 'Validation failed', errors: any[] = []) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    this.errors = errors;
  }
}

export class InvalidInputError extends AppError {
  constructor(message: string = 'Invalid input provided') {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.INVALID_INPUT);
  }
}

export class MissingRequiredFieldError extends AppError {
  constructor(field: string) {
    super(
      `Required field missing: ${field}`,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.MISSING_REQUIRED_FIELD
    );
  }
}

// Resource Errors
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(
      `${resource} not found`,
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.NOT_FOUND
    );
  }
}

export class AlreadyExistsError extends AppError {
  constructor(resource: string = 'Resource') {
    super(
      `${resource} already exists`,
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.ALREADY_EXISTS
    );
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
  }
}

// Permission Errors
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
  }
}

export class InsufficientPermissionsError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(
      message,
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.INSUFFICIENT_PERMISSIONS
    );
  }
}

// Server Errors
export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.DATABASE_ERROR
    );
  }
}

export class CacheError extends AppError {
  constructor(message: string = 'Cache operation failed') {
    super(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.CACHE_ERROR
    );
  }
}

export class QueueError extends AppError {
  constructor(message: string = 'Queue operation failed') {
    super(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.QUEUE_ERROR
    );
  }
}

// export class ExternalServiceError extends AppError {
//   constructor(service: string = 'External service') {
//     super(
//       `${service} is currently unavailable`,
//       HTTP_STATUS.SERVICE_UNAVAILABLE,
//       ERROR_CODES.EXTERNAL_SERVICE_ERROR
//     );
//   }
// }

// Business Logic Errors
export class TeamFullError extends AppError {
  constructor(message: string = 'Team is full') {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.TEAM_FULL);
  }
}

export class AlreadyInTeamError extends AppError {
  constructor(message: string = 'User is already in a team') {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.ALREADY_IN_TEAM);
  }
}

export class DuplicateRequestError extends AppError {
  constructor(message: string = 'Duplicate request') {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.DUPLICATE_REQUEST);
  }
}

// Rate Limiting Error
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests. Please try again later.') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

// Helper function to check if error is operational
export const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};

// Helper function to format error response
export const formatErrorResponse = (error: AppError) => {
  return {
    success: false,
    error: {
      message: error.message,
      code: error.errorCode,
      timestamp: error.timestamp,
      ...(error instanceof ValidationError && { errors: error.errors }),
    },
  };
};

// Helper function to handle async errors
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


