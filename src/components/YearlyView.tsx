import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, TrendingUp, Award } from "lucide-react";

export default function YearlyView() {
  const { user } = useAuthStore();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(selectedYear, i, 1);
    return {
      name: format(date, "MMMM"),
      shortName: format(date, "MMM"),
    };
  });

  const totalXP = user?.character.totalXP || 0;
  const currentLevel = user?.character.level || 1;

  return (
    <div className="space-y-6 w-full overflow-x-hidden">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="zen-title text-2xl sm:text-3xl mb-1">Yearly Overview</h1>
          <p className="text-gray-400 font-gaming uppercase">{selectedYear}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setSelectedYear(selectedYear - 1)}
            className="zen-button-secondary px-3 py-2 text-sm"
          >
            ← {selectedYear - 1}
          </button>

          <button
            onClick={() => setSelectedYear(new Date().getFullYear())}
            className="zen-button-secondary px-3 py-2 text-sm"
          >
            {new Date().getFullYear()}
          </button>

          <button
            onClick={() => setSelectedYear(selectedYear + 1)}
            className="zen-button-secondary px-3 py-2 text-sm"
          >
            {selectedYear + 1} →
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <motion.div className="zen-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-zen-cyan/20 rounded-lg">
              <TrendingUp className="text-zen-cyan" />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Total XP</p>
              <p className="text-xl text-zen-cyan font-bold">{totalXP}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="zen-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-zen-gold/20 rounded-lg">
              <Award className="text-zen-gold" />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Level</p>
              <p className="text-xl text-zen-gold font-bold">{currentLevel}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="zen-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-zen-green/20 rounded-lg">
              <Calendar className="text-zen-green" />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Active Days</p>
              <p className="text-xl text-zen-green font-bold">0</p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Months Grid */}
      <div className="zen-card p-4">
        <h2 className="text-zen-cyan text-lg font-gaming uppercase mb-4">
          Months
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {months.map((month, i) => (
            <motion.div
              key={i}
              className="zen-card p-3 text-center hover:border-zen-cyan/40"
            >
              <p className="text-gray-400 text-xs uppercase">{month.shortName}</p>
              <p className="text-zen-cyan text-xl font-bold">0%</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="zen-card p-6 text-center text-gray-400">
        <p>Yearly Progress Chart (Coming Soon)</p>
      </div>
    </div>
  );
}
