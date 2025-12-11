import { motion } from 'framer-motion';
import { TrendingUp, Flame, Award } from 'lucide-react';
import { calculateLevelProgress } from '@/types';
import WaterBottle from '@/components/WaterBottle';

interface QuickStatsCardProps {
  level: number;
  xp: number;
  completionRate: number;
  streak: number;
  totalRewards: number;

  hydrationTodayLitres?: number;   // optional
  dailyHydrationGoal?: number;     // optional
}

export default function QuickStatsCard({
  level,
  xp,
  completionRate,
  streak,
  totalRewards,
  hydrationTodayLitres = 0,
  dailyHydrationGoal = 2,
}: QuickStatsCardProps) {

  const safeLevel = Number(level) || 1;
  const safeXP = Number(xp) || 0;
  const progress = calculateLevelProgress(safeXP, safeLevel);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="zen-card p-6 space-y-6"
    >
      <h3 className="font-gaming text-xl text-zen-cyan uppercase">Quick Stats</h3>

      {/* LEVEL */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400 font-gaming uppercase">Level {safeLevel}</span>
          <span className="text-xs text-gray-500 font-mono">
            {progress.currentXP.toFixed(0)} / {progress.xpForNextLevel.toFixed(0)} XP
          </span>
        </div>
        <div className="zen-progress-bar h-2">
          <motion.div
            className="zen-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

    {/* WATER BOTTLE (safe hydration) */}
      <div className="flex justify-center">
        <WaterBottle
          total={Number(hydrationTodayLitres) || 0}
          goal={Number(dailyHydrationGoal) || 2}
        />
      </div>
      

      {/* COMPLETION */}
      <div className="p-4 bg-zen-dark-primary rounded-lg border border-zen-cyan/20">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-zen-green" size={20} />
          <div>
            <div className="text-xs text-gray-400 font-gaming uppercase">Today's Progress</div>
            <div className="text-2xl font-bold text-zen-green">{completionRate.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* TASK STREAK */}
      <div className="p-4 bg-zen-dark-primary rounded-lg border border-zen-gold/20">
        <div className="flex items-center gap-3">
          <Flame className="text-zen-gold" size={20} />
          <div>
            <div className="text-xs text-gray-400 font-gaming uppercase">Current Streak</div>
            <div className="text-2xl font-bold text-zen-gold">{streak} 🔥</div>
          </div>
        </div>
      </div>

      {/* REWARDS */}
      <div className="p-4 bg-zen-dark-primary rounded-lg border border-zen-cyan/20">
        <div className="flex items-center gap-3">
          <Award className="text-zen-cyan" size={20} />
          <div>
            <div className="text-xs text-gray-400 font-gaming uppercase">Rewards Earned</div>
            <div className="text-2xl font-bold text-zen-cyan">{totalRewards} XP</div>
          </div>
        </div>
      </div>


    </motion.div>
  );
}
