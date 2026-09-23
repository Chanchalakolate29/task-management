import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await API.get('/tasks', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Error fetching tasks'
      );
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await API.post('/tasks', taskData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Error creating task'
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/tasks/${id}`, taskData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Error updating task'
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/tasks/${id}`);
      return response.data.data.id;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Error deleting task'
      );
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'tasks/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/users');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Error fetching users list'
      );
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    users: [],
    metrics: {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
    },
    pagination: {
      total: 0,
      page: 1,
      pages: 1,
      limit: 50,
    },
    filters: {
      search: '',
      status: 'All',
      priority: 'All',
      sortBy: 'createdAt',
      order: 'desc',
    },
    loading: false,
    usersLoading: false,
    error: null,
    selectedTask: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        status: 'All',
        priority: 'All',
        sortBy: 'createdAt',
        order: 'desc',
      };
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    // Optimistic update for Drag and Drop board status change
    updateTaskStatusOptimistic: (state, action) => {
      const { taskId, newStatus } = action.payload;
      const task = state.tasks.find((t) => t._id === taskId);
      if (task) {
        task.status = newStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.metrics = action.payload.metrics;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
        state.metrics.total += 1;
        if (action.payload.status === 'Pending') state.metrics.pending += 1;
        if (action.payload.status === 'In Progress') state.metrics.inProgress += 1;
        if (action.payload.status === 'Completed') state.metrics.completed += 1;
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
        state.metrics.total = Math.max(0, state.metrics.total - 1);
      })
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.usersLoading = false;
      });
  },
});

export const {
  setFilter,
  resetFilters,
  setSelectedTask,
  updateTaskStatusOptimistic,
} = taskSlice.actions;

export default taskSlice.reducer;
