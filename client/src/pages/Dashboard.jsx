import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DashboardCards from '../components/DashboardCards';
import AnalyticsCharts from '../components/AnalyticsCharts';
import useTasks from '../hooks/useTasks';
import { openTaskModal, openTaskDetails } from '../store/uiSlice';
import { Plus, ArrowRight, CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react';
import { STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, metrics, loading, getTasksList } = useTasks();

  useEffect(() => {
    getTasksList({ limit: 10 });
  }, [getTasksList]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Dashboard Overview
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Real-time tracking for tasks, team allocation, and project status
              </p>
            </div>

            <button
              onClick={() => dispatch(openTaskModal())}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-semibold text-sm transition-all shadow-md shadow-brand-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>

          {/* Metrics Summary Cards */}
          <DashboardCards metrics={metrics} />

          {/* Visual Analytics Charts */}
          <AnalyticsCharts tasks={tasks} metrics={metrics} />

          {/* Recent Tasks Activity Feed */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  Recent Tasks
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Latest tasks across all status pipelines
                </p>
              </div>

              <button
                onClick={() => navigate('/tasks')}
                className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                <span>View All Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                Loading metrics and tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-sm">
                No tasks available yet. Click "Create Task" to add your first task!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {tasks.slice(0, 5).map((task) => {
                  const statusStyle = STATUS_COLORS[task.status] || STATUS_COLORS.Pending;
                  const priorityStyle = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium;

                  return (
                    <div
                      key={task._id}
                      onClick={() => dispatch(openTaskDetails(task))}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 p-3 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-2.5 h-2.5 rounded-full ${statusStyle.dot} shrink-0`} />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                            {task.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {task.description || 'No description'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${priorityStyle.bg} ${priorityStyle.text}`}>
                          {task.priority}
                        </span>

                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                          {task.status}
                        </span>

                        {task.assignedTo && (
                          <img
                            src={task.assignedTo.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                            alt={task.assignedTo.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                            title={`Assigned to ${task.assignedTo.name}`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
