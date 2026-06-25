import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth.routes';
import { projectRoutes } from './routes/project.routes';
import { taskRoutes } from './routes/task.routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/v1/auth', authRoutes);
app.use('/v1/projects', projectRoutes);
app.use('/v1', taskRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
