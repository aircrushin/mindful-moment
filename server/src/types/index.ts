export interface User {
  id: number;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Meditation {
  id: number;
  title: string;
  description?: string;
  duration_minutes: number;
  category: string;
  scenario?: string;
  audio_url: string;
  image_url?: string;
  instructor?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  is_featured: boolean;
  play_count: number;
  created_at: Date;
}

export interface UserProgress {
  id: number;
  user_id: number;
  meditation_id: number;
  duration_seconds: number;
  completed_at: Date;
  rating?: number;
  notes?: string;
}

export interface UserStreak {
  id: number;
  user_id: number;
  current_streak: number;
  longest_streak: number;
  last_meditation_date?: Date;
  total_minutes: number;
  total_sessions: number;
}

export interface AuthRequest extends Request {
  userId?: number;
}
