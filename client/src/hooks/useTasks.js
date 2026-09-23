import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchUsers,
  setFilter,
  resetFilters,
  updateTaskStatusOptimistic,
} from '../store/taskSlice';
import { addToast } from '../store/uiSlice';

export const useTasks = () => {
  const dispatch = useDispatch();
  const {
    tasks,
    users,
    metrics,
    pagination,
    filters,
    loading,
    usersLoading,
    error,
  } = useSelector((state) => state.tasks);

  const getTasksList = useCallback(
    (customParams = {}) => {
      const queryParams = { ...filters, ...customParams };
      return dispatch(fetchTasks(queryParams));
    },
    [dispatch, filters]
  );

  const getUsersList = useCallback(() => {
    return dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateTask = async (taskData) => {
    try {
      const result = await dispatch(createTask(taskData)).unwrap();
      dispatch(addToast({ message: 'Task created successfully!', type: 'success' }));
      return result;
    } catch (err) {
      dispatch(addToast({ message: err || 'Failed to create task', type: 'error' }));
      throw err;
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const result = await dispatch(updateTask({ id, taskData })).unwrap();
      dispatch(addToast({ message: 'Task updated successfully!', type: 'success' }));
      return result;
    } catch (err) {
      dispatch(addToast({ message: err || 'Failed to update task', type: 'error' }));
      throw err;
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      dispatch(addToast({ message: 'Task deleted successfully', type: 'info' }));
    } catch (err) {
      dispatch(addToast({ message: err || 'Failed to delete task', type: 'error' }));
      throw err;
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    dispatch(updateTaskStatusOptimistic({ taskId, newStatus }));
    try {
      await dispatch(updateTask({ id: taskId, taskData: { status: newStatus } })).unwrap();
      dispatch(addToast({ message: `Task moved to ${newStatus}`, type: 'success' }));
    } catch (err) {
      // Refresh tasks if optimistic update failed
      getTasksList();
      dispatch(addToast({ message: 'Failed to update status', type: 'error' }));
    }
  };

  const updateFilters = (newFilters) => {
    dispatch(setFilter(newFilters));
  };

  const clearAllFilters = () => {
    dispatch(resetFilters());
  };

  return {
    tasks,
    users,
    metrics,
    pagination,
    filters,
    loading,
    usersLoading,
    error,
    getTasksList,
    getUsersList,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    changeStatus: handleStatusChange,
    updateFilters,
    clearAllFilters,
  };
};

export default useTasks;
