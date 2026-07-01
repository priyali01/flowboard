import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './routes/auth.routes';
import { projectRoutes } from './routes/project.routes';
import { taskRoutes } from './routes/task.routes';
import labelRoutes from './routes/label.routes';
import commentRoutes from './routes/comment.routes';
import activityRoutes from './routes/activity.routes';
import notificationRoutes from './routes/notification.routes';
import workspaceRoutes from './routes/workspace.routes';
import templateRoutes from './routes/template.routes';
import analyticsRoutes from './routes/analytics.routes';
import exportRoutes from './routes/export.routes';
import { authMiddleware } from './middleware/auth.middleware';

export const app = express();

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/v1', apiLimiter);

app.use('/v1/auth', authRoutes);
app.use('/v1/projects', projectRoutes);
app.use('/v1', taskRoutes);
app.use('/v1/labels', authMiddleware, labelRoutes);
app.use('/v1', commentRoutes);
app.use('/v1', activityRoutes);
app.use('/v1', notificationRoutes);
app.use('/v1/workspaces', authMiddleware, workspaceRoutes);
app.use('/v1', authMiddleware, analyticsRoutes);
app.use('/v1/workspaces', authMiddleware, exportRoutes);
app.use('/v1', authMiddleware, templateRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
