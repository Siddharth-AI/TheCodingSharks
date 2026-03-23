'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Workshop, PaginationMeta } from '@/types';

interface WorkshopState {
  workshops: Workshop[];
  currentWorkshop: Workshop | null;
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkshopState = {
  workshops: [],
  currentWorkshop: null,
  meta: null,
  isLoading: false,
  error: null,
};

function getAuthHeader() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('cs_access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const fetchAdminWorkshops = createAsyncThunk(
  'workshop/fetchAdminWorkshops',
  async (params: { page?: number; limit?: number; includeDeleted?: boolean } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, includeDeleted = false } = params;
      const { data } = await axios.get('/api/admin/workshops', {
        params: { page, limit, includeDeleted },
        headers: getAuthHeader(),
      });
      return data.data;
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error) ? error.response?.data?.message || 'Failed to fetch workshops' : 'Failed to fetch workshops';
      return rejectWithValue(msg);
    }
  }
);

export const deleteWorkshop = createAsyncThunk(
  'workshop/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/admin/workshops/${id}`, { headers: getAuthHeader() });
      return id;
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error) ? error.response?.data?.message || 'Delete failed' : 'Delete failed';
      return rejectWithValue(msg);
    }
  }
);

export const toggleWorkshopStatus = createAsyncThunk(
  'workshop/toggleStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`/api/admin/workshops/${id}/toggle-status`, {}, { headers: getAuthHeader() });
      return data.data;
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error) ? error.response?.data?.message || 'Toggle failed' : 'Toggle failed';
      return rejectWithValue(msg);
    }
  }
);

const workshopSlice = createSlice({
  name: 'workshop',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearCurrentWorkshop: (state) => { state.currentWorkshop = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminWorkshops.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchAdminWorkshops.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workshops = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchAdminWorkshops.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteWorkshop.fulfilled, (state, action) => {
        state.workshops = state.workshops.filter((w) => w.id !== action.payload);
      })
      .addCase(toggleWorkshopStatus.fulfilled, (state, action) => {
        const idx = state.workshops.findIndex((w) => w.id === action.payload.id);
        if (idx !== -1) state.workshops[idx] = action.payload;
      });
  },
});

export const { clearError, clearCurrentWorkshop } = workshopSlice.actions;
export default workshopSlice.reducer;
