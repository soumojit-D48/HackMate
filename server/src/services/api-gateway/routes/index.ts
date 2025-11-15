import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { SERVICE_PORTS } from '../../../config/constants.js';
// import { serviceRegistry } from '../config/service-registry.js';


const router = Router();

const services = {
  auth: `http://localhost:${SERVICE_PORTS.AUTH_SERVICE}`,
  user: `http://localhost:${SERVICE_PORTS.USER_SERVICE}`,
  team: `http://localhost:${SERVICE_PORTS.TEAM_SERVICE}`,
  matching: `http://localhost:${SERVICE_PORTS.MATCHING_SERVICE}`,
  chat: `http://localhost:${SERVICE_PORTS.CHAT_SERVICE}`,
  notification: `http://localhost:${SERVICE_PORTS.NOTIFICATION_SERVICE}`,
  admin: `http://localhost:${SERVICE_PORTS.ADMIN_SERVICE}`,
  file: `http://localhost:${SERVICE_PORTS.FILE_SERVICE}`,
};


router.use('/auth', createProxyMiddleware({
    target: services.auth,
    // target: serviceRegistry.auth?.url,
    changeOrigin: true,
    pathRewrite: {'^/api/auth': ''} // '^/api/old-path': '/api/new-path'
}))

router.use('/users', createProxyMiddleware({
  target: services.user,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' },
}));

router.use('/teams', createProxyMiddleware({
  target: services.team,
  changeOrigin: true,
  pathRewrite: { '^/api/teams': '' },
}));

router.use('/matching', createProxyMiddleware({
  target: services.matching,
  changeOrigin: true,
  pathRewrite: { '^/api/matching': '' },
}));

router.use('/chat', createProxyMiddleware({
  target: services.chat,
  changeOrigin: true,
  pathRewrite: { '^/api/chat': '' },
}));

router.use('/notifications', createProxyMiddleware({
  target: services.notification,
  changeOrigin: true,
  pathRewrite: { '^/api/notifications': '' },
}));

router.use('/admin', createProxyMiddleware({
  target: services.admin,
  changeOrigin: true,
  pathRewrite: { '^/api/admin': '' },
}));

router.use('/files', createProxyMiddleware({
  target: services.file,
  changeOrigin: true,
  pathRewrite: { '^/api/files': '' },
}));

export { router as routes }
