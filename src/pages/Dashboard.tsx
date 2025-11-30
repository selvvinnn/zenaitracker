import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import DailyView from '@/components/DailyView';
import MonthlyView from '@/components/MonthlyView';
import YearlyView from '@/components/YearlyView';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/daily" element={<DailyView />} />
        <Route path="/monthly" element={<MonthlyView />} />
        <Route path="/yearly" element={<YearlyView />} />
        <Route path="/" element={<Navigate to="/dashboard/daily" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

