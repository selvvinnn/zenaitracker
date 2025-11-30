import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, TrendingUp, Award } from 'lucide-react';

export default function YearlyView() {
  const { user } = useAuthStore();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate months for the selected year
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(selectedYear, i, 1);
    return {
      date,
      name: format(date, 'MMMM'),
      shortName: format(date, 'MMM'),
    };
  });

  // TODO: Load yearly data
  const totalXP = user?.character.totalXP || 0;
  const currentLevel = user?.character.level || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="zen-title text-3xl mb-2">Yearly Overview</h1>
          <p className="text-gray-400 font-gaming uppercase">
            {selectedYear} Summary
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedYear(selectedYear - 1)}
            className="zen-button-secondary px-4 py-2"
          >
            ← {selectedYear - 1}
          </button>
          <button
            onClick={() => setSelectedYear(new Date().getFullYear())}
            className="zen-button-secondary px-4 py-2"
          >
            {new Date().getFullYear()}
          </button>
          <button
            onClick={() => setSelectedYear(selectedYear + 1)}
            className="zen-button-secondary px-4 py-2"
          >
            {selectedYear + 1} →
          </button>
        </div>
      </div>

      {/* Yearly Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="zen-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-zen-cyan/20 rounded-lg">
              <TrendingUp className="text-zen-cyan" size={32} />
            </div>
            <div>
              <div className="text-sm text-gray-400 font-gaming uppercase mb-1">
                Total XP Gained
              </div>
              <div className="text-3xl font-bold text-zen-cyan font-mono">
                {totalXP.toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="zen-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-zen-gold/20 rounded-lg">
              <Award className="text-zen-gold" size={32} />
            </div>
            <div>
              <div className="text-sm text-gray-400 font-gaming uppercase mb-1">
                Current Level
              </div>
              <div className="text-3xl font-bold text-zen-gold font-mono">
                {currentLevel}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="zen-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-zen-green/20 rounded-lg">
              <Calendar className="text-zen-green" size={32} />
            </div>
            <div>
              <div className="text-sm text-gray-400 font-gaming uppercase mb-1">
                Active Days
              </div>
              <div className="text-3xl font-bold text-zen-green font-mono">
                {/* TODO: Calculate active days */}
                0
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Monthly Grid */}
      <div className="zen-card p-6">
        <h2 className="font-gaming text-xl text-zen-cyan uppercase mb-6">
          Monthly Breakdown
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {months.map((month, index) => (
            <motion.div
              key={month.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="zen-card p-4 text-center cursor-pointer hover:border-zen-cyan/50 transition-all"
            >
              <div className="text-sm font-gaming text-gray-400 uppercase mb-2">
                {month.shortName}
              </div>
              <div className="text-2xl font-bold text-zen-cyan mb-2">
                {/* TODO: Show completion percentage */}
                0%
              </div>
              <div className="text-xs text-gray-500">
                {/* TODO: Show task count */}
                0 tasks
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      <div className="zen-card p-6">
        <h2 className="font-gaming text-xl text-zen-cyan uppercase mb-6">
          Yearly Progress
        </h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p className="font-gaming uppercase">Yearly Progress Chart (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
}

