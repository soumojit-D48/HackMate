import { SERVICE_PORTS } from "../../../config/constants";

export interface ServiceConfig {
  name: string,
  url: string,
  port: number,
  healthCheck: string
}

export const serviceRegistry: Record<string, ServiceConfig> = {
  // serviceRegistry["auth"] returns the config for Auth Service.
  auth: {
    name: "Auth Service",
    url: `http://localhost:${SERVICE_PORTS.AUTH_SERVICE}`,
    port: SERVICE_PORTS.AUTH_SERVICE,
    healthCheck: '/health',
  },
  user: {
    name: 'User Service',
    url: `http://localhost:${SERVICE_PORTS.USER_SERVICE}`,
    port: SERVICE_PORTS.USER_SERVICE,
    healthCheck: '/health',
  },
  team: {
    name: 'Team Service',
    url: `http://localhost:${SERVICE_PORTS.TEAM_SERVICE}`,
    port: SERVICE_PORTS.TEAM_SERVICE,
    healthCheck: '/health',
  },
  matching: {
    name: 'Matching Service',
    url: `http://localhost:${SERVICE_PORTS.MATCHING_SERVICE}`,
    port: SERVICE_PORTS.MATCHING_SERVICE,
    healthCheck: '/health',
  },
  chat: {
    name: 'Chat Service',
    url: `http://localhost:${SERVICE_PORTS.CHAT_SERVICE}`,
    port: SERVICE_PORTS.CHAT_SERVICE,
    healthCheck: '/health',
  },
  notification: {
    name: 'Notification Service',
    url: `http://localhost:${SERVICE_PORTS.NOTIFICATION_SERVICE}`,
    port: SERVICE_PORTS.NOTIFICATION_SERVICE,
    healthCheck: '/health',
  },
  admin: {
    name: 'Admin Service',
    url: `http://localhost:${SERVICE_PORTS.ADMIN_SERVICE}`,
    port: SERVICE_PORTS.ADMIN_SERVICE,
    healthCheck: '/health',
  },
  file: {
    name: 'File Service',
    url: `http://localhost:${SERVICE_PORTS.FILE_SERVICE}`,
    port: SERVICE_PORTS.FILE_SERVICE,
    healthCheck: '/health',
  },
}


export const getServiceUrl = (serviceName: string): string => {
  const service = serviceRegistry[serviceName]

  if (!service) {
    throw new Error(`Service ${serviceName} not found in registry`)
  }
  return service.url // "auth" → It returns "http://localhost:3001"
}

export const getAllServices = (): ServiceConfig[] => {
  return Object.values(serviceRegistry)
  // Get a list of all service configs.
}