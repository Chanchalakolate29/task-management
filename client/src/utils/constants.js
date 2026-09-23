export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'];

export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export const STATUS_COLORS = {
  Pending: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800/50',
    dot: 'bg-amber-500',
  },
  'In Progress': {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800/50',
    dot: 'bg-blue-500',
  },
  Completed: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    dot: 'bg-emerald-500',
  },
};

export const PRIORITY_COLORS = {
  Low: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    badge: 'bg-slate-200 dark:bg-slate-700',
  },
  Medium: {
    bg: 'bg-sky-100 dark:bg-sky-900/40',
    text: 'text-sky-800 dark:text-sky-300',
    badge: 'bg-sky-200 dark:bg-sky-800',
  },
  High: {
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-800 dark:text-amber-300',
    badge: 'bg-amber-200 dark:bg-amber-800',
  },
  Urgent: {
    bg: 'bg-rose-100 dark:bg-rose-900/40',
    text: 'text-rose-800 dark:text-rose-300',
    badge: 'bg-rose-200 dark:bg-rose-800',
  },
};
