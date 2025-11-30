import { useState, useEffect, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  LogOut,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { calculateLevelProgress, getRankFromXP } from '@/types';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // --- FIX: reactive screen size detection ---
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const wide = window.innerWidth >= 1024;
      setIsDesktop(wide);

      // Desktop → sidebar always open
      if (wide) setSidebarOpen(true);
      // Mobile → sidebar hidden
      else setSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) return null;

  const levelProgress = calculateLevelProgress(
    user.character.totalXP,
    user.character.level
  );
  const rank = getRankFromXP(user.character.totalXP);

  const navItems = [
    { path: '/dashboard/daily', icon: Calendar, label: 'Daily' },
    { path: '/dashboard/monthly', icon: CalendarDays, label: 'Monthly' },
    { path: '/dashboard/yearly', icon: CalendarRange, label: 'Yearly' },
  ];

  return (
    <div className="min-h-screen bg-zen-dark-primary flex">

      {/* MOBILE HEADER */}
      {!isDesktop && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-zen-dark-secondary p-4 border-b border-zen-cyan/30 flex justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-zen-cyan"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="font-gaming text-zen-cyan">ZEN</h1>
          <div className="w-6" />
        </div>
      )}

      {/* SIDEBAR */}
      <motion.aside
        animate={{ x: sidebarOpen ? 0 : -260 }}
        transition={{ type: "spring", stiffness: 80 }}
        className={`
          fixed ${isDesktop ? "static" : ""}
          top-0 left-0
          w-64 h-full
          bg-zen-dark-secondary
          border-r border-zen-cyan/30
          z-40 overflow-y-auto
        `}
      >
        <div className={`p-6 ${isDesktop ? "mt-0" : "mt-16"}`}>

          {/* PROFILE */}
          <div className="zen-card p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl">
                {user.character.avatar === 'warrior' && '⚔️'}
                {user.character.avatar === 'mage' && '🔮'}
                {user.character.avatar === 'assassin' && '🗡️'}
                {user.character.avatar === 'archer' && '🏹'}
                {user.character.avatar === 'knight' && '🛡️'}
                {user.character.avatar === 'berserker' && '⚡'}
              </div>
              <div>
                <div className="font-gaming text-zen-cyan">{user.character.name}</div>
                <div className="text-xs text-gray-400 uppercase">
                  Rank {rank} • Lv.{user.character.level}
                </div>
              </div>
            </div>

            <div className="zen-progress-bar mt-3">
              <motion.div
                className="zen-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress.percentage}%` }}
              />
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    active
                      ? 'bg-zen-cyan/20 text-zen-cyan border border-zen-cyan/50'
                      : 'text-gray-400 hover:text-zen-cyan hover:bg-zen-dark-primary/50'
                  }`}
                  onClick={() => !isDesktop && setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}

            {/* SETTINGS */}
            <button
              onClick={() => {
                navigate('/settings');
                if (!isDesktop) setSidebarOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-zen-cyan hover:bg-zen-dark-primary/50 w-full transition"
            >
              <Settings size={20} />
              <span className="font-gaming uppercase">Settings</span>
            </button>

            {/* LOGOUT */}
            <div className="mt-8 pt-8 border-t border-zen-cyan/20">
              <button
                onClick={() => {
                  signOut();
                  navigate('/login');
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-zen-red hover:bg-zen-dark-primary/50 w-full transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main
        className="
          flex-1
          p-4 lg:p-8
          mt-[62px] lg:mt-0
          lg:ml-64
        "
      >
        {children}
      </main>

      {/* MOBILE OVERLAY */}
      {!isDesktop && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
