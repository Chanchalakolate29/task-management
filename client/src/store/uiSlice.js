import { createSlice } from '@reduxjs/toolkit';

const isDarkStored = localStorage.getItem('theme') === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: isDarkStored,
    viewMode: 'kanban', // 'kanban' | 'list'
    isTaskModalOpen: false,
    taskModalData: null, // null for create, task object for edit
    isTaskDetailsOpen: false,
    activeTaskDetail: null,
    toasts: [],
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    openTaskModal: (state, action) => {
      state.isTaskModalOpen = true;
      state.taskModalData = action.payload || null;
    },
    closeTaskModal: (state) => {
      state.isTaskModalOpen = false;
      state.taskModalData = null;
    },
    openTaskDetails: (state, action) => {
      state.isTaskDetailsOpen = true;
      state.activeTaskDetail = action.payload;
    },
    closeTaskDetails: (state) => {
      state.isTaskDetailsOpen = false;
      state.activeTaskDetail = null;
    },
    addToast: (state, action) => {
      // payload: { message, type: 'success' | 'error' | 'info' | 'warning' }
      const toast = {
        id: Date.now(),
        type: action.payload.type || 'info',
        message: action.payload.message,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleDarkMode,
  setViewMode,
  openTaskModal,
  closeTaskModal,
  openTaskDetails,
  closeTaskDetails,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
