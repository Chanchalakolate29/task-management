import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useDarkMode from '../hooks/useDarkMode';
import { openTaskModal } from '../store/uiSlice';
import { Sun, Moon, LogOut, Plus, ShieldCheck, CheckSquare, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/70 dark:bg-[#090d16]/70 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Brand / Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform text-white font-extrabold">
          <CheckSquare className="w-5 h-5" />
          <div className="absolute -inset-0.5 rounded-2xl bg-brand-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-brand-600 to-indigo-600 dark:from-white dark:via-brand-400 dark:to-indigo-400 bg-clip-text text-transparent">
            TaskFlow
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <Sparkles className="w-3 h-3 text-brand-500" /> PRO
          </span>
        </div>
      </Link>

      {/* Right Action Icons & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Quick Create Task Action Button */}
        <button
          onClick={() => dispatch(openTaskModal())}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 active:scale-95 text-white font-semibold text-xs tracking-wide shadow-md shadow-brand-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>

        {/* Dark Mode Toggle with subtle rotation */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all active:scale-95"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 -rotate-12 transition-transform duration-300" />
          )}
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

        {/* User Profile Card */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500/40 shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold leading-tight text-slate-900 dark:text-slate-100">
                {user.name}
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                {user.role === 'Admin' ? (
                  <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  'Team Member'
                )}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all active:scale-95"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
