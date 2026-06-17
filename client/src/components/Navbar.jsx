import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon, LogOut, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <nav className="glass sticky top-0 z-40 w-full px-6 py-4 transition-all duration-300 shadow-sm border-b border-white/20 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Title */}
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="p-2 bg-gradient-to-tr from-brand-blue to-brand-purple rounded-xl shadow-md text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <BookOpen size={22} className="animate-pulse" />
          </div>
          <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-tight transition-all duration-300 group-hover:opacity-90">
            AssignmentHub
          </span>
        </div>

        {/* Action Controls */}
        {user && (
          <div className="flex items-center gap-4">
            
            {/* User Profile Summary */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {user.name}
              </span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold shadow-sm ${
                  user.role === 'admin' 
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white' 
                    : 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700/60 hidden sm:block"></div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all duration-300 hover:scale-105 active:scale-95 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="btn-glow-danger flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-red-200/60 dark:border-red-900/30 text-red-600 hover:bg-red-50/50 dark:text-red-400 dark:hover:bg-red-950/20 font-semibold text-sm transition-all duration-300 active:scale-95 shadow-sm"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Logout</span>
            </button>

          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
