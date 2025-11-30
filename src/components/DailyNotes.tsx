import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { db } from '@/lib/supabase';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Save, Edit3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { DailyEntry } from '@/types';

interface DailyNotesProps {
  date: Date;
  entry: DailyEntry | undefined;
  onUpdate: () => void;
}

export default function DailyNotes({ date, entry, onUpdate }: DailyNotesProps) {
  const { user } = useAuthStore();
  const [notes, setNotes] = useState(entry?.notes || '');
  const [mood, setMood] = useState(entry?.mood || '');
  const [memories, setMemories] = useState(entry?.memories || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setNotes(entry?.notes || '');
    setMood(entry?.mood || '');
    setMemories(entry?.memories || '');
    setIsEditing(false);
  }, [entry, date]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      if (entry) {
        await db.updateDailyEntry(entry.id, {
          notes,
          mood,
          memories,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await db.createDailyEntry({
          userId: user.id,
          date: dateStr,
          notes,
          mood,
          memories,
          tasks: [],
          completionRate: 0,
          pointsEarned: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      toast.success('Notes saved!');
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast.error('Failed to save notes');
    }
  };

  const moods = [
    { value: '😊', label: 'Happy' },
    { value: '😢', label: 'Sad' },
    { value: '😴', label: 'Tired' },
    { value: '🔥', label: 'Energetic' },
    { value: '😌', label: 'Calm' },
    { value: '🤔', label: 'Thoughtful' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="zen-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-gaming text-xl text-zen-cyan uppercase">
          Daily Notes
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-zen-cyan hover:bg-zen-cyan/10 rounded transition-colors"
          >
            <Edit3 size={18} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Mood Selector */}
        <div>
          <label className="block text-zen-cyan font-gaming text-sm uppercase mb-2">
            Mood
          </label>
          {isEditing ? (
            <div className="flex gap-2">
              {moods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                    mood === m.value
                      ? 'border-zen-cyan bg-zen-cyan/20'
                      : 'border-zen-cyan/30 hover:border-zen-cyan/50'
                  }`}
                  title={m.label}
                >
                  {m.value}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-4xl">{mood || '😊'}</div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-zen-cyan font-gaming text-sm uppercase mb-2">
            Notes
          </label>
          {isEditing ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="zen-input min-h-[120px] resize-none"
              placeholder="Write your thoughts for this day..."
            />
          ) : (
            <div className="zen-card p-4 min-h-[120px] text-gray-300 whitespace-pre-wrap">
              {notes || 'No notes for this day. Click edit to add some!'}
            </div>
          )}
        </div>

        {/* Memorable Moments */}
        <div>
          <label className="block text-zen-cyan font-gaming text-sm uppercase mb-2">
            Memorable Moments
          </label>
          {isEditing ? (
            <textarea
              value={memories}
              onChange={(e) => setMemories(e.target.value)}
              className="zen-input min-h-[100px] resize-none"
              placeholder="What made this day special?"
            />
          ) : (
            <div className="zen-card p-4 min-h-[100px] text-gray-300 whitespace-pre-wrap">
              {memories || 'No memorable moments recorded.'}
            </div>
          )}
        </div>

        {/* Save Button */}
        {isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="zen-button w-full flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Notes
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

