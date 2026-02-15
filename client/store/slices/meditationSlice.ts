import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MeditationState, Meditation } from '@/types';

const API_BASE = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

// Fetch all meditations
export const fetchMeditations = createAsyncThunk(
  'meditations/fetchAll',
  async (params: { category?: string; duration?: number; featured?: boolean } | undefined, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.duration) queryParams.append('duration', params.duration.toString());
      if (params?.featured) queryParams.append('featured', 'true');
      
      const url = `${API_BASE}/api/v1/meditations${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await fetch(url);
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch meditations');
      }
      
      return data.meditations;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Fetch single meditation
export const fetchMeditation = createAsyncThunk(
  'meditations/fetchOne',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/meditations/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Meditation not found');
      }
      
      return data.meditation;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Fetch categories
export const fetchCategories = createAsyncThunk(
  'meditations/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/meditations/categories`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch categories');
      }
      
      return data.categories;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Increment play count
export const incrementPlayCount = createAsyncThunk(
  'meditations/incrementPlayCount',
  async (id: number) => {
    try {
      await fetch(`${API_BASE}/api/v1/meditations/${id}/play`, { method: 'POST' });
      return id;
    } catch (error) {
      // Silently fail - not critical
      return id;
    }
  }
);

const initialState: MeditationState = {
  meditations: [],
  featuredMeditations: [],
  categories: [],
  currentMeditation: null,
  isLoading: false,
  error: null,
};

const meditationSlice = createSlice({
  name: 'meditations',
  initialState,
  reducers: {
    setCurrentMeditation: (state, action) => {
      state.currentMeditation = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch meditations
    builder.addCase(fetchMeditations.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMeditations.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.meta.arg?.featured) {
        state.featuredMeditations = action.payload;
      } else {
        state.meditations = action.payload;
      }
    });
    builder.addCase(fetchMeditations.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch single meditation
    builder.addCase(fetchMeditation.fulfilled, (state, action) => {
      state.currentMeditation = action.payload;
    });
    
    // Fetch categories
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    
    // Increment play count
    builder.addCase(incrementPlayCount.fulfilled, (state, action) => {
      const meditation = state.meditations.find(m => m.id === action.payload);
      if (meditation) {
        meditation.playCount += 1;
      }
    });
  },
});

export const { setCurrentMeditation, clearError } = meditationSlice.actions;
export default meditationSlice.reducer;
