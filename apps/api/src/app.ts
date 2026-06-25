import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth.routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/v1/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
