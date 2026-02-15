import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerState } from '@/types';

const initialState: PlayerState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  meditationId: null,
  isLoading: false,
  error: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setMeditationId: (state, action: PayloadAction<number | null>) => {
      state.meditationId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetPlayer: (state) => {
      state.isPlaying = false;
      state.currentTime = 0;
      state.duration = 0;
      state.meditationId = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setPlaying,
  setCurrentTime,
  setDuration,
  setMeditationId,
  setLoading,
  setError,
  resetPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;
