import React from 'react';
import { Layers, Clock, CheckCircle2, PlayCircle, TrendingUp, Sparkles } from 'lucide-react';

const DashboardCards = ({ metrics = { total: 0, pending: 0, inProgress: 0, completed: 0 } }) => {
  const cards = [
    {
      title: 'Total Tasks',
      value: metrics.total,
      subtitle: 'All active & archived',
      icon: Layers,
      gradient: 'from-blue-600 to-indigo-600',
      badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      borderGlow: 'hover:border-blue-500/50',
    },
    {
      title: 'Pending',
      value: metrics.pending,
      subtitle: 'Awaiting execution',
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      borderGlow: 'hover:border-amber-500/50',
    },
    {
      title: 'In Progress',
      value: metrics.inProgress,
      subtitle: 'Actively being worked on',
      icon: PlayCircle,
      gradient: 'from-sky-500 to-cyan-600',
      badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      borderGlow: 'hover:border-sky-500/50',
    },
    {
      title: 'Completed',
      value: metrics.completed,
      subtitle: 'Finished & verified',
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      borderGlow: 'hover:border-emerald-500/50',
    },
  ];

  const completionRate = metrics.total > 0 ? Math.round((metrics.completed / metrics.total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`relative overflow-hidden rounded-3xl bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${card.borderGlow}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${card.badgeBg}`}>
                    {card.title}
                  </span>
                  <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white tracking-tight">
                    {card.value}
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                    {card.subtitle}
                  </p>
                </div>

                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center text-white shadow-lg shadow-slate-950/20 shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress completion hero bar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-xl shadow-inner">
              {completionRate}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white">Overall Team Productivity</h4>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <TrendingUp className="w-3 h-3" /> High Performance
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {metrics.completed} of {metrics.total} tasks completed successfully
              </p>
            </div>
          </div>

          {/* Glowing Gradient Progress Bar */}
          <div className="w-full sm:w-72 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Completion Ratio</span>
              <span className="text-emerald-400 font-bold">{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
              <div
                className="bg-gradient-to-r from-cyan-400 via-brand-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-md shadow-emerald-500/30"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
