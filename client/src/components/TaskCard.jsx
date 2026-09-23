import React, { memo } from 'react';
import { Calendar, MoreVertical, Edit3, Trash2, Eye, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';

const TaskCard = memo(({ task, onEdit, onDelete, onViewDetails, isDragging = false }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const priorityStyle = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium;
  const statusStyle = STATUS_COLORS[task.status] || STATUS_COLORS.Pending;

  const formattedDueDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  return (
    <div
      className={`group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-sm hover:shadow-md transition-all duration-200 ${
        isDragging ? 'rotate-2 scale-105 shadow-xl ring-2 ring-brand-500 z-50' : ''
      }`}
    >
      {/* Top Header: Priority Badge & Actions */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${priorityStyle.bg} ${priorityStyle.text}`}>
          {task.priority} Priority
        </span>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-7 z-20 w-36 py-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 animate-fade-in text-xs font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onViewDetails(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Details
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onEdit(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Task
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDelete(task._id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Task Title */}
      <h4
        onClick={() => onViewDetails(task)}
        className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-1 mb-1.5"
      >
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer Details: Due Date & Assigned User */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        {/* Due Date Indicator */}
        <div className={`flex items-center gap-1.5 font-medium ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDueDate}</span>
          {isOverdue && <AlertCircle className="w-3.5 h-3.5 text-rose-500" title="Overdue" />}
        </div>

        {/* Assigned User Avatar */}
        {task.assignedTo && (
          <div className="flex items-center gap-1.5" title={`Assigned to ${task.assignedTo.name}`}>
            <img
              src={task.assignedTo.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={task.assignedTo.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
            />
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[80px]">
              {task.assignedTo.name.split(' ')[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';
export default TaskCard;
