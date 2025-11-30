import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { db } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import CalendarGrid from './CalendarGrid';
import DailyNotes from './DailyNotes';
import MonthlyAnalytics from './MonthlyAnalytics';
import { DailyEntry } from '@/types';

export default function MonthlyView() {
  const { user } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user, currentDate]);

  const loadEntries = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      const data = await db.getDailyEntriesRange(user.id, start, end);
      setEntries(data);
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEntryForDate = (date: Date): DailyEntry | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries.find(e => e.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="zen-title text-3xl mb-2">Monthly View</h1>
          <p className="text-gray-400 font-gaming uppercase">
            {format(currentDate, 'MMMM yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="zen-button-secondary px-4 py-2"
          >
            ← Prev
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="zen-button-secondary px-4 py-2"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="zen-button-secondary px-4 py-2"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <CalendarGrid
            currentDate={currentDate}
            selectedDate={selectedDate}
            entries={entries}
            onDateSelect={setSelectedDate}
            loading={loading}
          />
        </div>

        {/* Daily Notes & Analytics */}
        <div className="space-y-6">
          <DailyNotes
            date={selectedDate}
            entry={getEntryForDate(selectedDate)}
            onUpdate={loadEntries}
          />
        </div>
      </div>

      {/* Monthly Analytics */}
      <MonthlyAnalytics
        entries={entries}
        currentDate={currentDate}
      />
    </div>
  );
}

