'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Hydrate from localStorage on init
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('cs_access_token');
  const refresh = localStorage.getItem('cs_refresh_token');
  const user = localStorage.getItem('cs_admin_user');
  if (token && user) {
    initialState.accessToken = token;
    initialState.refreshToken = refresh;
    initialState.user = JSON.parse(user);
    initialState.isAuthenticated = true;
  }
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/auth/login', credentials);
      return data.data;
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Login failed'
        : 'Login failed';
      return rejectWithValue(msg);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.refreshToken;
      if (!token) throw new Error('No refresh token');
      const { data } = await axios.post('/api/auth/refresh', { refreshToken: token });
      return data.data;
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Token refresh failed'
        : 'Token refresh failed';
      return rejectWithValue(msg);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cs_access_token');
        localStorage.removeItem('cs_refresh_token');
        localStorage.removeItem('cs_admin_user');
      }
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        if (typeof window !== 'undefined') {
          localStorage.setItem('cs_access_token', action.payload.accessToken);
          localStorage.setItem('cs_refresh_token', action.payload.refreshToken);
          localStorage.setItem('cs_admin_user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('cs_access_token', action.payload.accessToken);
          localStorage.setItem('cs_refresh_token', action.payload.refreshToken);
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cs_access_token');
          localStorage.removeItem('cs_refresh_token');
          localStorage.removeItem('cs_admin_user');
          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          }
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
