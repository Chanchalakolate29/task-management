import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeTaskDetails, openTaskModal } from '../store/uiSlice';
import useTasks from '../hooks/useTasks';
import { X, Calendar, User, Clock, CheckCircle2, AlertTriangle, Edit3, Trash2 } from 'lucide-react';
import { STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';

const TaskDetailsModal = () => {
  const dispatch = useDispatch();
  const { isTaskDetailsOpen, activeTaskDetail } = useSelector((state) => state.ui);
  const { changeStatus, deleteTask } = useTasks();

  if (!isTaskDetailsOpen || !activeTaskDetail) return null;

  const task = activeTaskDetail;
  const priorityStyle = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium;
  const statusStyle = STATUS_COLORS[task.status] || STATUS_COLORS.Pending;

  const handleStatusUpdate = (newStatus) => {
    changeStatus(task._id, newStatus);
    dispatch(closeTaskDetails());
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task._id);
      dispatch(closeTaskDetails());
    }
  };

  const handleEdit = () => {
    dispatch(closeTaskDetails());
    dispatch(openTaskModal(task));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${priorityStyle.bg} ${priorityStyle.text}`}>
              {task.priority} Priority
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
              {task.status}
            </span>
          </div>

          <button
            onClick={() => dispatch(closeTaskDetails())}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
              {task.title}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Created on {new Date(task.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Description
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {task.description || 'No detailed description provided for this task.'}
            </p>
          </div>

          {/* Dates & People Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-brand-500 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Due Date</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
              {task.assignedTo ? (
                <>
                  <img
                    src={task.assignedTo.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={task.assignedTo.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Assigned User</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                      {task.assignedTo.name}
                    </p>
                  </div>
                </>
              ) : (
                <User className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </div>

          {/* Status Quick Switcher */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Move Status To
            </p>
            <div className="grid grid-cols-3 gap-2">
              {['Pending', 'In Progress', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusUpdate(st)}
                  className={`py-2 px-3 rounded-xl font-medium text-xs border transition-all ${
                    task.status === st
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Task
          </button>

          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-white transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
