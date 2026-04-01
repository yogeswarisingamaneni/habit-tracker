import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { habitService } from '../HabitService';
import { Habit } from '../types';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = habitService.getHabits(user.uid, setHabits);
      return unsubscribe;
    }
  }, [user]);

  // Last 7 days completion data
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  }).map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = habits.filter(h => h.completedDates.includes(dateStr)).length;
    return {
      name: format(date, 'EEE'),
      count,
      fullDate: dateStr
    };
  });

  // Most consistent habit
  const mostConsistent = [...habits].sort((a, b) => b.longestStreak - a.longestStreak)[0];

  // Completion by habit
  const habitCompletionData = habits.map(h => ({
    name: h.name,
    value: h.completedDates.length
  }));

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Insights</h1>
          <p className="text-slate-400">Track your progress and identify patterns in your behavior.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-sm font-medium">
          <Calendar className="w-4 h-4" />
          Last 7 Days
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 text-indigo-500" />
          </div>
          <div className="relative z-10">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Total Completions</div>
            <div className="text-4xl font-extrabold text-white mb-2">
              {habits.reduce((acc, h) => acc + h.completedDates.length, 0)}
            </div>
            <div className="text-sm text-indigo-400 font-medium">+12% from last week</div>
          </div>
        </div>
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award className="w-24 h-24 text-cyan-500" />
          </div>
          <div className="relative z-10">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Best Habit</div>
            <div className="text-2xl font-extrabold text-white mb-2 truncate">
              {mostConsistent?.name || 'No habits yet'}
            </div>
            <div className="text-sm text-cyan-400 font-medium">{mostConsistent?.longestStreak || 0} Day Streak</div>
          </div>
        </div>
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Active Habits</div>
            <div className="text-4xl font-extrabold text-white mb-2">{habits.length}</div>
            <div className="text-sm text-emerald-400 font-medium">Keep it up!</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-8">Weekly Activity</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habit Distribution */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-8">Habit Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={habitCompletionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {habitCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {habitCompletionData.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs text-slate-400 truncate">{h.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
