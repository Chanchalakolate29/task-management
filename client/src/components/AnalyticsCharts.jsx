import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const AnalyticsCharts = ({ tasks = [], metrics = {} }) => {
  const statusData = [
    { name: 'Pending', value: metrics.pending || 0, color: '#f59e0b' },
    { name: 'In Progress', value: metrics.inProgress || 0, color: '#0284c7' },
    { name: 'Completed', value: metrics.completed || 0, color: '#10b981' },
  ];

  const priorityCounts = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
  tasks.forEach((task) => {
    if (priorityCounts[task.priority] !== undefined) {
      priorityCounts[task.priority] += 1;
    }
  });

  const priorityData = [
    { name: 'Low', count: priorityCounts.Low, fill: '#64748b' },
    { name: 'Medium', count: priorityCounts.Medium, fill: '#0284c7' },
    { name: 'High', count: priorityCounts.High, fill: '#f59e0b' },
    { name: 'Urgent', count: priorityCounts.Urgent, fill: '#f43f5e' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Donut Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="mb-2">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            Task Status Distribution
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Breakdown of tasks by current status state
          </p>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  color: '#fff',
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Bar Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="mb-2">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            Tasks by Priority Level
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Count of tasks categorized by priority urgency
          </p>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
