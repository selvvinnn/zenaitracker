import { motion } from 'framer-motion';
import { Trash2, Check, X } from 'lucide-react';
import { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskList({ tasks, loading, onUpdate, onDelete }: TaskListProps) {
  if (loading) {
    return (
      <div className="zen-card p-8 text-center">
        <div className="animate-pulse text-zen-cyan font-gaming uppercase">Loading quests...</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="zen-card p-8 text-center"
      >
        <p className="text-gray-400 font-gaming uppercase mb-2">No Quests Available</p>
        <p className="text-sm text-gray-500">Add your first quest to begin your journey!</p>
      </motion.div>
    );
  }

  const handleProgressChange = (task: Task, newProgress: number) => {
    const progress = Math.max(0, Math.min(newProgress, task.goal));
    const completed = progress >= task.goal;
    onUpdate(task.id, { progress, completed });
  };

  const handleToggleComplete = (task: Task) => {
    const completed = !task.completed;
    const progress = completed ? task.goal : Math.min(task.progress, task.goal - 1);
    onUpdate(task.id, { completed, progress });
  };

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => {
        const progressPercentage = (task.progress / task.goal) * 100;
        const typeColors = {
          easy: 'from-zen-green to-green-600',
          medium: 'from-zen-cyan to-blue-600',
          hard: 'from-zen-gold to-orange-600',
        };

        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`zen-card p-4 ${task.completed ? 'border-zen-green/50' : ''}`}
          >
            <div className="flex items-start gap-4">
              {/* Completion Toggle */}
              <button
                onClick={() => handleToggleComplete(task)}
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? 'bg-zen-green border-zen-green'
                    : 'border-zen-cyan/50 hover:border-zen-cyan'
                }`}
              >
                {task.completed && <Check size={18} className="text-white" />}
              </button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-gaming uppercase ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded bg-gradient-to-r ${typeColors[task.type]} text-white font-bold`}>
                      {task.type.toUpperCase()}
                    </span>
                    <span className="text-zen-gold font-mono font-bold text-sm">
                      +{task.points} XP
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span className="font-mono">
                      {task.progress} / {task.goal}
                    </span>
                  </div>
                  <div className="zen-progress-bar h-2">
                    <motion.div
                      className={`zen-progress-fill bg-gradient-to-r ${typeColors[task.type]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Progress Controls */}
                {!task.completed && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleProgressChange(task, task.progress - 1)}
                      className="px-3 py-1 bg-zen-dark-primary border border-zen-red/30 rounded text-zen-red hover:border-zen-red transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <input
                      type="number"
                      value={task.progress}
                      onChange={(e) => handleProgressChange(task, parseInt(e.target.value) || 0)}
                      min={0}
                      max={task.goal}
                      className="flex-1 px-3 py-1 bg-zen-dark-primary border border-zen-cyan/30 rounded text-center text-white focus:outline-none focus:border-zen-cyan"
                    />
                    <button
                      onClick={() => handleProgressChange(task, task.progress + 1)}
                      className="px-3 py-1 bg-zen-dark-primary border border-zen-green/30 rounded text-zen-green hover:border-zen-green transition-colors"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => onDelete(task.id)}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-zen-red transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

