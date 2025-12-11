import { format } from 'date-fns';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyEntry } from '@/types';
import { TrendingUp, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface MonthlyAnalyticsProps {
  entries: DailyEntry[];
  currentDate: Date;
}

export default function MonthlyAnalytics({ entries, currentDate }: MonthlyAnalyticsProps) {
  // Prepare chart data
  const chartData = entries.map((entry) => ({
    date: format(new Date(entry.date), 'MMM d'),
    completion: entry.completionRate,
    points: entry.pointsEarned,
  }));

  const totalTasks = entries.reduce((sum, entry) => sum + entry.tasks.length, 0);
  const completedTasks = entries.reduce(
    (sum, entry) => sum + entry.tasks.filter((t: any) => t.completed).length,
    0
  );
  const totalPoints = entries.reduce((sum, entry) => sum + entry.pointsEarned, 0);
  const avgCompletion = entries.length > 0
    ? entries.reduce((sum, entry) => sum + entry.completionRate, 0) / entries.length
    : 0;

  const bestDay = entries.length > 0
    ? entries.reduce((best, entry) =>
        entry.completionRate > best.completionRate ? entry : best
      )
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="zen-card p-6"
    >
      <h2 className="font-gaming text-2xl text-zen-cyan uppercase mb-6">
        Monthly Analytics - {format(currentDate, 'MMMM yyyy')}
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="zen-card p-4 bg-zen-dark-primary">
          <div className="flex items-center gap-3">
            <Target className="text-zen-cyan" size={24} />
            <div>
              <div className="text-xs text-gray-400 font-gaming uppercase">Avg. Completion</div>
              <div className="text-2xl font-bold text-zen-cyan">{avgCompletion.toFixed(0)}%</div>
            </div>
          </div>
        </div>

        <div className="zen-card p-4 bg-zen-dark-primary">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-zen-green" size={24} />
            <div>
              <div className="text-xs text-gray-400 font-gaming uppercase">Tasks Completed</div>
              <div className="text-2xl font-bold text-zen-green">
                {completedTasks}/{totalTasks}
              </div>
            </div>
          </div>
        </div>

        <div className="zen-card p-4 bg-zen-dark-primary">
          <div className="flex items-center gap-3">
            <Award className="text-zen-gold" size={24} />
            <div>
              <div className="text-xs text-gray-400 font-gaming uppercase">Total XP</div>
              <div className="text-2xl font-bold text-zen-gold">{totalPoints}</div>
            </div>
          </div>
        </div>

        <div className="zen-card p-4 bg-zen-dark-primary">
          <div className="flex items-center gap-3">
            <Award className="text-zen-cyan" size={24} />
            <div>
              <div className="text-xs text-gray-400 font-gaming uppercase">Best Day</div>
              <div className="text-lg font-bold text-zen-cyan">
                {bestDay ? format(new Date(bestDay.date), 'MMM d') : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trend */}
        <div className="zen-card p-6 bg-zen-dark-primary">
          <h3 className="font-gaming text-lg text-zen-cyan uppercase mb-4">
            Daily Completion Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00d4ff20" />
              <XAxis dataKey="date" stroke="#00d4ff" fontSize={12} />
              <YAxis stroke="#00d4ff" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1f2e',
                  border: '1px solid #00d4ff',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#00d4ff' }}
              />
              <Line
                type="monotone"
                dataKey="completion"
                stroke="#00ff88"
                strokeWidth={2}
                dot={{ fill: '#00ff88', r: 4 }}
                name="Completion %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Points Earned */}
        <div className="zen-card p-6 bg-zen-dark-primary">
          <h3 className="font-gaming text-lg text-zen-cyan uppercase mb-4">
            XP Earned Daily
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00d4ff20" />
              <XAxis dataKey="date" stroke="#00d4ff" fontSize={12} />
              <YAxis stroke="#00d4ff" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1f2e',
                  border: '1px solid #00d4ff',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#00d4ff' }}
              />
              <Bar dataKey="points" fill="#ffd700" name="XP Points" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

