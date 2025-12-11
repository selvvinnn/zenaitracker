import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { db } from '@/lib/supabase';
import { format, startOfMonth, endOfMonth } from 'date-fns';
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
    if (user) loadEntries();
  }, [user, currentDate]);

  const loadEntries = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const start = format(startOfMonth(currentDate), "yyyy-MM-dd");
      const end = format(endOfMonth(currentDate), "yyyy-MM-dd");
      const data = await db.getDailyEntriesRange(user.id, start, end);
      setEntries(data);
    } finally {
      setLoading(false);
    }
  };

  const getEntryForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return entries.find((e) => e.date === dateStr);
  };

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="zen-title text-2xl sm:text-3xl mb-1">Monthly View</h1>
          <p className="text-gray-400 font-gaming uppercase">
            {format(currentDate, "MMMM yyyy")}
          </p>
        </div>

        {/* Mobile-friendly buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() =>
              setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
            }
            className="zen-button-secondary px-3 py-2 text-sm"
          >
            ← Prev
          </button>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="zen-button-secondary px-3 py-2 text-sm"
          >
            Today
          </button>

          <button
            onClick={() =>
              setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
            }
            className="zen-button-secondary px-3 py-2 text-sm"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        
        {/* Calendar Grid */}
        <div className="lg:col-span-2 w-full overflow-hidden">
          <CalendarGrid
            currentDate={currentDate}
            selectedDate={selectedDate}
            entries={entries}
            onDateSelect={setSelectedDate}
            loading={loading}
          />
        </div>

        {/* Daily Notes */}
        <div className="space-y-6 w-full">
          <DailyNotes
            date={selectedDate}
            entry={getEntryForDate(selectedDate)}
            onUpdate={loadEntries}
          />
        </div>
      </div>

      {/* Analytics */}
      <div className="w-full">
        <MonthlyAnalytics entries={entries} currentDate={currentDate} />
      </div>
    </div>
  );
}
