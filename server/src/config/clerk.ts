

// import { Clerk } from '@clerk/clerk-sdk-node';

const {Clerk} = require("@clerk/clerk-sdk-node")

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY is required');
}

export const clerkClient = new Clerk({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const clerkConfig = {
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  webhookSecret: process.env.CLERK_WEBHOOK_SECRET,
};

export const verifyClerkToken = async (token: string): Promise<any> => {
  try {
    return await clerkClient.verifyToken(token);
  } catch (error) {
    throw new Error('Invalid authentication token');
  }
};

export const getClerkUser = async (userId: string) => {
  try {
    return await clerkClient.users.getUser(userId);
  } catch (error) {
    throw new Error('User not found');
  }
};

export const updateClerkUserMetadata = async (
  userId: string,
  metadata: Record<string, any>
) => {
  try {
    return await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: metadata,
    });
  } catch (error) {
    throw error;
  }
};


