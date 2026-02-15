import { Router } from 'express';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getSupabaseClient } from '../storage/database/supabase-client.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mindful-moment-secret-key';

// Middleware to verify JWT token
const authenticateUser = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as any).userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/v1/progress - Get user's meditation progress
router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const client = getSupabaseClient();
    
    // Get user streak
    const { data: streak, error: streakError } = await client
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (streakError) {
      console.error('Get streak error:', streakError);
    }
    
    // Get recent progress
    const { data: progress, error: progressError } = await client
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(30);
    
    if (progressError) {
      console.error('Get progress error:', progressError);
    }
    
    res.json({
      streak: streak ? {
        currentStreak: streak.current_streak,
        longestStreak: streak.longest_streak,
        lastMeditationDate: streak.last_meditation_date,
        totalMinutes: streak.total_minutes,
        totalSessions: streak.total_sessions
      } : null,
      progress: (progress || []).map((p: any) => ({
        id: p.id,
        meditationId: p.meditation_id,
        durationSeconds: p.duration_seconds,
        completedAt: p.completed_at,
        rating: p.rating,
        notes: p.notes
      }))
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// POST /api/v1/progress - Record meditation completion
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { meditationId, durationSeconds, rating, notes } = req.body;
    
    if (!meditationId || !durationSeconds) {
      return res.status(400).json({ error: 'Meditation ID and duration are required' });
    }
    
    const client = getSupabaseClient();
    
    // Record progress
    const { error: progressError } = await client
      .from('user_progress')
      .insert({
        user_id: userId,
        meditation_id: meditationId,
        duration_seconds: durationSeconds,
        rating: rating || null,
        notes: notes || null
      });
    
    if (progressError) {
      console.error('Record progress error:', progressError);
      return res.status(500).json({ error: 'Failed to record progress' });
    }
    
    // Update streak
    const { data: streak, error: streakError } = await client
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (streakError) {
      console.error('Get streak error:', streakError);
    }
    
    const today = new Date().toISOString().split('T')[0];
    let newCurrentStreak = 1;
    let newLongestStreak = 1;
    
    if (streak) {
      const lastDate = streak.last_meditation_date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastDate === yesterdayStr) {
        newCurrentStreak = (streak.current_streak || 0) + 1;
      } else if (lastDate !== today) {
        newCurrentStreak = 1;
      } else {
        newCurrentStreak = streak.current_streak || 0;
      }
      
      newLongestStreak = Math.max(newCurrentStreak, streak.longest_streak || 0);
    }
    
    // Update streak record
    await client
      .from('user_streaks')
      .upsert({
        user_id: userId,
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_meditation_date: today,
        total_minutes: (streak?.total_minutes || 0) + Math.floor(durationSeconds / 60),
        total_sessions: (streak?.total_sessions || 0) + 1,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    
    res.json({ 
      message: 'Progress recorded',
      streak: {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak
      }
    });
  } catch (error) {
    console.error('Record progress error:', error);
    res.status(500).json({ error: 'Failed to record progress' });
  }
});

// GET /api/v1/progress/stats - Get user statistics
router.get('/stats', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const client = getSupabaseClient();
    
    // Get user streak
    const { data: streak } = await client
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    // Get this week's progress
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { data: weeklyProgress } = await client
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', oneWeekAgo.toISOString());
    
    const weeklyMinutes = (weeklyProgress || []).reduce(
      (sum: number, p: any) => sum + (p.duration_seconds || 0),
      0
    );
    
    res.json({
      totalMinutes: streak?.total_minutes || 0,
      totalSessions: streak?.total_sessions || 0,
      currentStreak: streak?.current_streak || 0,
      longestStreak: streak?.longest_streak || 0,
      weeklyMinutes: Math.floor(weeklyMinutes / 60),
      weeklySessions: (weeklyProgress || []).length
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
