import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import meditationRoutes from "./routes/meditations.js";
import progressRoutes from "./routes/progress.js";

const app = express();
const port = process.env.PORT || 9091;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/v1/health', (req: Request, res: Response) => {
  console.log('Health check success');
  res.status(200).json({ status: 'ok' });
});

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/meditations', meditationRoutes);
app.use('/api/v1/progress', progressRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
});

export default app;
