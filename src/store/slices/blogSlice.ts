'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Blog, BlogWithTags, PaginationMeta } from '@/types';

interface BlogState {
  blogs: Blog[];
  currentBlog: BlogWithTags | null;
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  meta: null,
  isLoading: false,
  error: null,
};

function getAuthHeader() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('cs_access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const fetchAdminBlogs = createAsyncThunk(
  'blog/fetchAdminBlogs',
  async (params: { page?: number; limit?: number; includeDeleted?: boolean } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, includeDeleted = false } = params;
      const { data } = await axios.get('/api/admin/blogs', {
        params: { page, limit, includeDeleted },
        headers: getAuthHeader(),
      });
      return data.data;
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error) ? error.response?.data?.message || 'Failed to fetch blogs' : 'Failed to fetch blogs';
      return rejectWithValue(msg);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blog/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/admin/blogs/${id}`, { headers: getAuthHeader() });
      return id;
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error) ? error.response?.data?.message || 'Delete failed' : 'Delete failed';
      return rejectWithValue(msg);
    }
  }
);

export const toggleBlogStatus = createAsyncThunk(
  'blog/toggleStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`/api/admin/blogs/${id}/toggle-status`, {}, { headers: getAuthHeader() });
      return data.data;
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error) ? error.response?.data?.message || 'Toggle failed' : 'Toggle failed';
      return rejectWithValue(msg);
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearCurrentBlog: (state) => { state.currentBlog = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminBlogs.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchAdminBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchAdminBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((b) => b.id !== action.payload);
      })
      .addCase(toggleBlogStatus.fulfilled, (state, action) => {
        const idx = state.blogs.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.blogs[idx] = action.payload;
      });
  },
});

export const { clearError, clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;
