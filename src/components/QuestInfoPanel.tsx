import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Trophy, CheckCircle2 } from 'lucide-react';
import { Quest } from '@/types';

interface QuestInfoPanelProps {
  quest: Quest;
}

export default function QuestInfoPanel({ quest }: QuestInfoPanelProps) {
  const [timeRemaining, setTimeRemaining] = useState(quest.timeRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedTasks = quest.tasks.filter(t => t.completed).length;
  const totalTasks = quest.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="zen-card p-6 mb-6"
    >
      {/* Quest Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="zen-title text-2xl">{quest.title}</h2>
        {quest.completed ? (
          <div className="flex items-center gap-2 text-zen-green">
            <CheckCircle2 size={24} />
            <span className="font-gaming uppercase">Completed</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-zen-gold">
            <AlertTriangle size={24} />
            <span className="font-gaming uppercase">In Progress</span>
          </div>
        )}
      </div>

      {/* Timer */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-zen-dark-primary rounded-lg border border-zen-cyan/20">
        <Clock className="text-zen-cyan" size={24} />
        <div>
          <div className="text-xs text-gray-400 font-gaming uppercase mb-1">
            Time Remaining
          </div>
          <div className="text-2xl font-mono font-bold text-zen-cyan">
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-zen-cyan font-gaming uppercase text-sm">
            Quest Progress
          </span>
          <span className="text-white font-mono font-bold">
            {completedTasks}/{totalTasks}
          </span>
        </div>
        <div className="zen-progress-bar h-3">
          <motion.div
            className="zen-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Reward Points */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-zen-cyan/10 to-zen-green/10 rounded-lg border border-zen-cyan/30">
        <Trophy className="text-zen-gold" size={24} />
        <div>
          <div className="text-xs text-gray-400 font-gaming uppercase mb-1">
            Reward Points
          </div>
          <div className="text-2xl font-mono font-bold text-zen-gold">
            {quest.rewardPoints} XP
          </div>
        </div>
      </div>

      {/* Caution Message */}
      {!quest.completed && totalTasks > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-zen-gold/10 border border-zen-gold/30 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-zen-gold flex-shrink-0 mt-0.5" size={20} />
            <div>
              <div className="font-gaming text-zen-gold uppercase text-sm mb-1">
                Quest Incomplete
              </div>
              <div className="text-sm text-gray-300">
                Complete all tasks before the timer runs out to earn full rewards!
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

