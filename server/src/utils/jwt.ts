

import jwt from 'jsonwebtoken';
import { InvalidTokenError, TokenExpiredError } from './error-handler';
import { logger } from './logger.js';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// Token payload interface
export interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
  [key: string]: any;
}

// Decoded token interface
export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

/**
 * Generate access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'hackmate-api',
    });
  } catch (error) {
    logger.error('Error generating access token:', error);
    throw new Error('Failed to generate access token');
  }
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  try {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'hackmate-api',
    });
  } catch (error) {
    logger.error('Error generating refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokenPair = (payload: TokenPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): DecodedToken => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'hackmate-api',
    }) as DecodedToken;

    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new TokenExpiredError('Access token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new InvalidTokenError('Invalid access token');
    }
    logger.error('Error verifying access token:', error);
    throw new InvalidTokenError('Token verification failed');
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): DecodedToken => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'hackmate-api',
    }) as DecodedToken;

    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new TokenExpiredError('Refresh token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new InvalidTokenError('Invalid refresh token');
    }
    logger.error('Error verifying refresh token:', error);
    throw new InvalidTokenError('Token verification failed');
  }
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch (error) {
    logger.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Get token expiration time in seconds
 */
export const getTokenExpirationTime = (token: string): number | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp - currentTime;
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null;
  }

  // Bearer token format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Create token payload from user data
 */
export const createTokenPayload = (user: {
  id: string;
  email: string;
  role?: string;
  [key: string]: any;
}): TokenPayload => {
  return {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
};