import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskBoard from '../components/TaskBoard';
import TaskCard from '../components/TaskCard';
import useTasks from '../hooks/useTasks';
import { openTaskModal, openTaskDetails, setViewMode } from '../store/uiSlice';
import { TASK_STATUSES, TASK_PRIORITIES } from '../utils/constants';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

const TasksPage = () => {
  const dispatch = useDispatch();
  const viewMode = useSelector((state) => state.ui.viewMode);

  const {
    tasks,
    pagination,
    filters,
    loading,
    getTasksList,
    changeStatus,
    deleteTask,
    updateFilters,
    clearAllFilters,
  } = useTasks();

  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounced search handling
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateFilters({ search: searchInput });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);

  // Fetch tasks when filters change
  useEffect(() => {
    getTasksList();
  }, [filters, getTasksList]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      getTasksList({ page: newPage });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 animate-fade-in">
          {/* Header Title & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Task Management Module
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Search, filter, edit, assign, and organize team tasks
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Layout Switcher */}
              <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700">
                <button
                  onClick={() => dispatch(setViewMode('kanban'))}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    viewMode === 'kanban'
                      ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="Kanban Board View"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden md:inline">Board</span>
                </button>
                <button
                  onClick={() => dispatch(setViewMode('list'))}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden md:inline">List</span>
                </button>
              </div>

              <button
                onClick={() => dispatch(openTaskModal())}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-semibold text-sm transition-all shadow-md shadow-brand-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks by title..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => updateFilters({ status: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="All">All Statuses</option>
                  {TASK_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="relative">
                <select
                  value={filters.priority}
                  onChange={(e) => updateFilters({ priority: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="All">All Priorities</option>
                  {TASK_PRIORITIES.map((pr) => (
                    <option key={pr} value={pr}>
                      {pr} Priority
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Date */}
              <div className="relative">
                <select
                  value={`${filters.sortBy}-${filters.order}`}
                  onChange={(e) => {
                    const [sortBy, order] = e.target.value.split('-');
                    updateFilters({ sortBy, order });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="dueDate-asc">Due Date (Earliest First)</option>
                  <option value="dueDate-desc">Due Date (Latest First)</option>
                  <option value="title-asc">Title (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Active Filters bar & Reset */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">
                Showing <strong className="text-slate-800 dark:text-slate-200">{tasks.length}</strong> of{' '}
                <strong className="text-slate-800 dark:text-slate-200">{pagination.total}</strong> tasks
              </span>

              {(filters.status !== 'All' || filters.priority !== 'All' || filters.search || filters.sortBy !== 'createdAt') && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    clearAllFilters();
                  }}
                  className="flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* View Container: Board or List */}
          {loading ? (
            <div className="p-16 text-center text-slate-400 font-medium">
              Loading tasks...
            </div>
          ) : viewMode === 'kanban' ? (
            <TaskBoard
              tasks={tasks}
              onStatusChange={changeStatus}
              onEditTask={(t) => dispatch(openTaskModal(t))}
              onDeleteTask={deleteTask}
              onViewDetails={(t) => dispatch(openTaskDetails(t))}
              onQuickAdd={(st) => dispatch(openTaskModal({ status: st }))}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={(t) => dispatch(openTaskModal(t))}
                  onDelete={deleteTask}
                  onViewDetails={(t) => dispatch(openTaskDetails(t))}
                />
              ))}
              {tasks.length === 0 && (
                <div className="col-span-full p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
                  No tasks match your filter criteria.
                </div>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Page {pagination.page} of {pagination.pages}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TasksPage;
