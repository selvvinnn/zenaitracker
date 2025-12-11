import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useGamificationStore } from '@/store/gamificationStore';
import { db } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import QuestInfoPanel from './QuestInfoPanel';
import QuickStatsCard from './QuickStatsCard';
import TaskList from './TaskList';
import CreateTaskModal from './CreateTaskModal';
import LevelUpAnimation from './LevelUpAnimation';
import { Task, TaskType, TaskCategory } from '@/types';

export default function DailyView() {
  const { user } = useAuthStore();
  const { awardXP } = useGamificationStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, today]);

  const loadTasks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await db.getTasks(user.id, today);
      setTasks(data);
    } catch (error: any) {
      toast.error('Failed to load tasks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: {
    title: string;
    type: TaskType;
    goal: number;
    category: TaskCategory;
  }) => {
    if (!user) return;

    try {
      const points = calculatePoints(taskData.type, taskData.goal);
      const newTask: Partial<Task> = {
        userId: user.id,
        title: taskData.title,
        type: taskData.type,
        goal: taskData.goal,
        progress: 0,
        points,
        category: taskData.category,
        date: today,
        completed: false,
        streak: 0,
        createdAt: new Date().toISOString(),
      };

      await db.createTask(newTask);
      await loadTasks();
      toast.success('Quest added!');
      setShowCreateModal(false);
    } catch (error: any) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const wasCompleted = task?.completed || false;
      const isNowCompleted = updates.completed === true;

      await db.updateTask(taskId, updates);
      await loadTasks();
      
      // Award XP if task was just completed (not if it was already completed)
      if (isNowCompleted && !wasCompleted && task && user) {
        const prevLevel = user.character.level;
        await awardXP(task.points);
        
        // Check if leveled up
        const updatedUser = useAuthStore.getState().user;
        if (updatedUser && updatedUser.character.level > prevLevel) {
          setLevelUp(updatedUser.character.level);
        }
      }
    } catch (error: any) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await db.deleteTask(taskId);
      await loadTasks();
      toast.success('Quest removed');
    } catch (error: any) {
      toast.error('Failed to delete task');
    }
  };

  const calculatePoints = (type: TaskType, goal: number): number => {
    const base = type === 'easy' ? 10 : type === 'medium' ? 50 : 100;
    const multiplier = Math.min(goal / 10, 2); // Cap multiplier at 2x
    return Math.floor(base * multiplier);
  };

  const completionRate = tasks.length > 0
    ? (tasks.filter(t => t.completed).length / tasks.length) * 100
    : 0;

  const totalRewards = tasks
    .filter(t => t.completed)
    .reduce((sum, t) => sum + t.points, 0);

  const quest: any = {
    title: 'Daily Quest',
    tasks,
    timeRemaining: calculateTimeRemaining(),
    rewardPoints: totalRewards,
    completed: tasks.length > 0 && tasks.every(t => t.completed),
  };

  function calculateTimeRemaining(): number {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="zen-title text-3xl mb-2">Daily Quest</h1>
          <p className="text-gray-400 font-gaming uppercase">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="zen-button flex items-center gap-2"
        >
          <Plus size={20} />
          Add Quest
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quest Info Panel */}
        <div className="lg:col-span-2">
          <QuestInfoPanel quest={quest} />
          <TaskList
            tasks={tasks}
            loading={loading}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        </div>

        {/* Quick Stats */}
        <div>
          <QuickStatsCard
            level={user?.character.level || 1}
            xp={user?.character.totalXP || 0}
            completionRate={completionRate}
            streak={0} // TODO: Calculate streak
            totalRewards={totalRewards}
            hydrationTodayLitres={user?.hydrationTodayLitres || 0}
            dailyHydrationGoal={user?.dailyHydrationGoal || 2}
          />
        </div>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
        />
      )}

      {levelUp && (
        <LevelUpAnimation
          newLevel={levelUp}
          onComplete={() => setLevelUp(null)}
        />
      )}
    </div>
  );
}

