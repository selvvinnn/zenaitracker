import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { DailyEntry } from '@/types';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  entries: DailyEntry[];
  onDateSelect: (date: Date) => void;
  loading: boolean;
}

export default function CalendarGrid({
  currentDate,
  selectedDate,
  entries,
  onDateSelect,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEntryForDate = (date: Date): DailyEntry | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries.find(e => e.date === dateStr);
  };

  const getCompletionStatus = (date: Date): 'complete' | 'partial' | 'incomplete' | 'none' => {
    if (!isSameMonth(date, currentDate)) return 'none';
    const entry = getEntryForDate(date);
    if (!entry) return 'incomplete';
    if (entry.completionRate === 100) return 'complete';
    if (entry.completionRate > 0) return 'partial';
    return 'incomplete';
  };

  const statusColors = {
    complete: 'bg-zen-green border-zen-green/50',
    partial: 'bg-zen-gold border-zen-gold/50',
    incomplete: 'bg-zen-red/20 border-zen-red/30',
    none: 'bg-transparent border-zen-dark-primary',
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="zen-card p-6"
    >
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-zen-cyan font-gaming text-sm uppercase py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          const status = getCompletionStatus(day);
          const entry = getEntryForDate(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <motion.button
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => onDateSelect(day)}
              disabled={!isCurrentMonth}
              className={`
                aspect-square p-2 rounded-lg border-2 transition-all
                ${statusColors[status]}
                ${isSelected ? 'ring-2 ring-zen-cyan ring-offset-2 ring-offset-zen-dark-secondary' : ''}
                ${isToday ? 'ring-2 ring-zen-cyan/50' : ''}
                ${!isCurrentMonth ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
              `}
            >
              <div className={`text-sm font-bold ${isCurrentMonth ? 'text-white' : 'text-gray-500'}`}>
                {format(day, 'd')}
              </div>
              {entry && (
                <div className="text-xs text-white/70 mt-1">
                  {entry.completionRate.toFixed(0)}%
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-zen-green border border-zen-green/50" />
          <span className="text-gray-400">Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-zen-gold border border-zen-gold/50" />
          <span className="text-gray-400">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-zen-red/20 border border-zen-red/30" />
          <span className="text-gray-400">Incomplete</span>
        </div>
      </div>
    </motion.div>
  );
}

