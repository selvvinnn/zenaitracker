import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TaskType, TaskCategory } from '@/types';

interface CreateTaskModalProps {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    type: TaskType;
    goal: number;
    category: TaskCategory;
  }) => void;
}

const TASK_TYPES: { value: TaskType; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const CATEGORIES: { value: TaskCategory; label: string }[] = [
  { value: 'health', label: 'Health' },
  { value: 'work', label: 'Work' },
  { value: 'learning', label: 'Learning' },
  { value: 'social', label: 'Social' },
  { value: 'creative', label: 'Creative' },
  { value: 'other', label: 'Other' },
];

export default function CreateTaskModal({ onClose, onSubmit }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskType>('medium');
  const [goal, setGoal] = useState(100);
  const [category, setCategory] = useState<TaskCategory>('other');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), type, goal, category });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="zen-card p-6 w-full max-w-md relative z-10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="zen-title text-2xl">Create New Quest</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Task Title */}
            <div>
              <label className="block text-zen-cyan font-gaming text-sm uppercase mb-2">
                Quest Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="zen-input"
                placeholder="e.g., Complete 100 push-ups"
                required
                autoFocus
              />
            </div>

            {/* Task Type */}
            <div>
              <label className="block text-zen-cyan font-gaming text-sm uppercase mb-2">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TASK_TYPES.map((taskType) => (
                  <button
                    key={taskType.value}
                    type="button"
                    onClick={() => setType(taskType.value)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all font-gaming uppercase ${
                      type === taskType.value
                        ? 'border-zen-cyan bg-zen-cyan/20 text-zen-cyan'
                        : 'border-zen-cyan/30 text-gray-400 hover:border-zen-cyan/50'
                    }`}
                  >
                    {taskType.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-zen-cyan font-gaming text-sm uppercase mb-2">
                Goal (Target Value)
              </label>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(parseInt(e.target.value) || 0)}
                className="zen-input"
                min={1}
                max={10000}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-zen-cyan font-gaming text-sm uppercase mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="zen-input"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="zen-button-secondary flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="zen-button flex-1">
                Create Quest
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

