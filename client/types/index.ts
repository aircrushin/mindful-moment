export interface User {
  id: number;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Meditation {
  id: number;
  title: string;
  description?: string;
  durationMinutes: number;
  category: string;
  scenario?: string;
  audioUrl: string;
  imageUrl?: string;
  instructor?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isFeatured: boolean;
  playCount: number;
  createdAt: string;
}

export interface UserProgress {
  id: number;
  meditationId: number;
  title: string;
  category: string;
  durationMinutes: number;
  actualSeconds: number;
  rating?: number;
  notes?: string;
  completedAt: string;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalMinutes: number;
  totalSessions: number;
}

export interface CategoryBreakdown {
  category: string;
  sessionCount: number;
  totalMinutes: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface MeditationState {
  meditations: Meditation[];
  featuredMeditations: Meditation[];
  categories: string[];
  currentMeditation: Meditation | null;
  isLoading: boolean;
  error: string | null;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  meditationId: number | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProgressState {
  stats: UserStats | null;
  recentSessions: UserProgress[];
  categoryBreakdown: CategoryBreakdown[];
  isLoading: boolean;
  error: string | null;
}
