import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProgressState, UserStats, UserProgress, CategoryBreakdown } from '@/types';
import * as SecureStore from 'expo-secure-store';

const API_BASE = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

// Record meditation session
export const recordSession = createAsyncThunk(
  'progress/recordSession',
  async (
    { meditationId, durationSeconds, rating, notes }: {
      meditationId: number;
      durationSeconds: number;
      rating?: number;
      notes?: string;
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await fetch(`${API_BASE}/api/v1/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ meditationId, durationSeconds, rating, notes }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to record session');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Fetch user stats
export const fetchStats = createAsyncThunk(
  'progress/fetchStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const response = await fetch(`${API_BASE}/api/v1/progress/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch stats');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Fetch history
export const fetchHistory = createAsyncThunk(
  'progress/fetchHistory',
  async ({ limit, offset }: { limit?: number; offset?: number } = {}, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append('limit', limit.toString());
      if (offset) queryParams.append('offset', offset.toString());
      
      const url = `${API_BASE}/api/v1/progress/history${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch history');
      }
      
      return data.history;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const initialState: ProgressState = {
  stats: null,
  recentSessions: [],
  categoryBreakdown: [],
  isLoading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Record session
    builder.addCase(recordSession.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(recordSession.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.stats) {
        state.stats.currentStreak = action.payload.streak.current;
        state.stats.longestStreak = action.payload.streak.longest;
        state.stats.totalSessions += 1;
      }
    });
    builder.addCase(recordSession.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch stats
    builder.addCase(fetchStats.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchStats.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stats = action.payload.stats;
      state.recentSessions = action.payload.recentSessions;
      state.categoryBreakdown = action.payload.categoryBreakdown;
    });
    builder.addCase(fetchStats.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch history
    builder.addCase(fetchHistory.fulfilled, (state, action) => {
      state.recentSessions = action.payload;
    });
  },
});

export const { clearError } = progressSlice.actions;
export default progressSlice.reducer;
