
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { SERVICE_PORTS } from '../../config/constants.js';
import { routes } from './routes/index.js';

const app = express();
const PORT = SERVICE_PORTS.API_GATEWAY;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_ , res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});