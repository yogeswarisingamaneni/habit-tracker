import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { habitService } from '../HabitService';
import { Habit } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar, Flame, Trophy, Search, Filter, PlusCircle, X } from 'lucide-react';
import { format, startOfToday, isSameDay, parseISO } from 'date-fns';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    if (user) {
      const unsubscribe = habitService.getHabits(user.uid, setHabits);
      return unsubscribe;
    }
  }, [user]);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim() || !user) return;

    await habitService.addHabit(user.uid, {
      name: newHabitName,
      description: '',
      frequency: 'daily',
      color: 'indigo',
      icon: 'Zap'
    });

    setNewHabitName('');
    setIsAdding(false);
  };

  const toggleCompletion = async (habit: Habit) => {
    if (!user) return;
    await habitService.toggleHabitCompletion(user.uid, habit, new Date());
  };

  const filteredHabits = habits.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isCompletedToday = h.completedDates.includes(format(new Date(), 'yyyy-MM-dd'));
    
    if (filter === 'completed') return matchesSearch && isCompletedToday;
    if (filter === 'pending') return matchesSearch && !isCompletedToday;
    return matchesSearch;
  });

  const today = format(new Date(), 'yyyy-MM-dd');
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{completedToday}/{habits.length}</div>
            <div className="text-sm text-slate-500 font-medium">Completed Today</div>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{completionRate}%</div>
            <div className="text-sm text-slate-500 font-medium">Completion Rate</div>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{profile?.xp || 0} XP</div>
            <div className="text-sm text-slate-500 font-medium">Total Experience</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search habits..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all",
                  filter === f ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" />
          New Habit
        </button>
      </div>

      {/* Habit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredHabits.map((habit) => {
            const isCompleted = habit.completedDates.includes(today);
            return (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "group p-6 rounded-3xl border transition-all cursor-pointer",
                  isCompleted 
                    ? "bg-indigo-600/10 border-indigo-500/30" 
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                )}
                onClick={() => toggleCompletion(habit)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                    isCompleted ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400"
                  )}>
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-xs font-bold text-orange-400">{habit.currentStreak}</span>
                  </div>
                </div>
                <h3 className={cn(
                  "text-lg font-bold mb-1 transition-colors",
                  isCompleted ? "text-white" : "text-slate-200"
                )}>
                  {habit.name}
                </h3>
                <p className="text-sm text-slate-500 mb-6">Daily Routine</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="w-1.5 h-6 rounded-full bg-slate-800 overflow-hidden">
                        <div className="w-full h-full bg-indigo-500/20" />
                      </div>
                    ))}
                  </div>
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                    isCompleted 
                      ? "bg-indigo-500 border-indigo-500 text-white" 
                      : "border-slate-700 text-transparent group-hover:border-indigo-500/50"
                  )}>
                    {isCompleted && <Plus className="w-5 h-5" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute right-6 top-6 p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">Create New Habit</h2>
              <form onSubmit={handleAddHabit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Habit Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="e.g. Morning Meditation" 
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    Create Habit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
