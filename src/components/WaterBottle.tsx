import { motion } from "framer-motion";
import { Droplet } from "lucide-react";

interface WaterBottleProps {
  total?: number;   // hydrationTodayLitres
  goal?: number;    // dailyHydrationGoal
}

export default function WaterBottle({ total = 0, goal = 2 }: WaterBottleProps) {
  const safeTotal = Number(total) || 0;
  const safeGoal = Number(goal) || 1; // prevent division by zero

  const percentage = Math.min((safeTotal / safeGoal) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-3">

      {/* Bottle Wrapper */}
      <div className="relative w-24 h-56 border-2 border-zen-cyan rounded-xl overflow-hidden bg-zen-dark-secondary shadow-lg">

        {/* Animated Water Fill */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-zen-cyan/80 to-zen-cyan/40"
        />

        {/* Bottle Glow */}
        <div className="absolute inset-0 pointer-events-none rounded-xl border border-zen-cyan/30 shadow-[0_0_15px_rgba(0,255,255,0.3)]" />

      </div>

      {/* Stats */}
      <div className="text-center">
        <div className="text-zen-cyan font-gaming uppercase tracking-wide">
          {safeTotal.toFixed(2)} L / {safeGoal.toFixed(2)} L
        </div>

        <div className="text-gray-400 text-xs flex items-center justify-center gap-1 mt-1">
          <Droplet size={14} className="text-zen-cyan" />
          {percentage.toFixed(0)}% hydrated
        </div>
      </div>

    </div>
  );
}
