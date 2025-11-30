import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { calculateXPForLevel, getRankFromXP } from '@/types';
import { toast } from 'react-hot-toast';

interface GamificationState {
  checkLevelUp: (newXP: number, currentLevel: number) => Promise<boolean>;
  awardXP: (points: number) => Promise<void>;
  calculateRewards: () => void;
}

export const useGamificationStore = create<GamificationState>((_) => ({
  checkLevelUp: async (newXP: number, currentLevel: number) => {
    const xpForNextLevel = calculateXPForLevel(currentLevel + 1);
    if (newXP >= xpForNextLevel) {
      return true;
    }
    return false;
  },

  awardXP: async (points: number) => {
    const { user, updateUser } = useAuthStore.getState();
    if (!user) return;

    try {
      const newTotalXP = user.character.totalXP + points;
      const newLevel = calculateLevel(newTotalXP);
      const newRank = getRankFromXP(newTotalXP);
      const leveledUp = newLevel > user.character.level;

      // Update user character
      await updateUser({
        character: {
          ...user.character,
          totalXP: newTotalXP,
          level: newLevel,
          rank: newRank,
        },
      });

      // Show level up animation if leveled up
      if (leveledUp) {
        toast.success(`Level Up! You're now Level ${newLevel}! 🎉`, {
          duration: 5000,
          icon: '⚡',
        });
        // Trigger confetti effect (will be handled in component)
      }

      toast.success(`+${points} XP earned!`, {
        icon: '✨',
      });
    } catch (error: any) {
      toast.error('Failed to award XP');
      console.error(error);
    }
  },

  calculateRewards: () => {
    // This will be used to calculate rewards from completed tasks
  },
}));

function calculateLevel(totalXP: number): number {
  let level = 1;
  while (calculateXPForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

