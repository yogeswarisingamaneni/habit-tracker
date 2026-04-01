import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Habit } from './types';
import { format, isYesterday, parseISO, differenceInDays } from 'date-fns';

export const habitService = {
  getHabits(userId: string, callback: (habits: Habit[]) => void) {
    const q = query(collection(db, 'users', userId, 'habits'));
    return onSnapshot(q, (snapshot) => {
      const habits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
      callback(habits);
    });
  },

  async addHabit(userId: string, habit: Omit<Habit, 'id' | 'userId' | 'currentStreak' | 'longestStreak' | 'completedDates' | 'createdAt'>) {
    const newHabit = {
      ...habit,
      userId,
      currentStreak: 0,
      longestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    return addDoc(collection(db, 'users', userId, 'habits'), newHabit);
  },

  async updateHabit(userId: string, habitId: string, updates: Partial<Habit>) {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    return updateDoc(habitRef, updates);
  },

  async deleteHabit(userId: string, habitId: string) {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    return deleteDoc(habitRef);
  },

  async toggleHabitCompletion(userId: string, habit: Habit, date: Date) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const habitRef = doc(db, 'users', userId, 'habits', habit.id);
    const userRef = doc(db, 'users', userId);
    const isCompleted = habit.completedDates.includes(dateStr);

    if (isCompleted) {
      // Uncomplete
      await updateDoc(habitRef, {
        completedDates: arrayRemove(dateStr),
        // Recalculating streaks is complex, for simplicity we just decrement XP
      });
      await updateDoc(userRef, { xp: increment(-10) });
    } else {
      // Complete
      const newCompletedDates = [...habit.completedDates, dateStr].sort();
      let currentStreak = habit.currentStreak;
      
      // Simple streak logic
      if (habit.lastCompletedDate && isYesterday(parseISO(habit.lastCompletedDate))) {
        currentStreak += 1;
      } else if (!habit.lastCompletedDate || differenceInDays(date, parseISO(habit.lastCompletedDate)) > 1) {
        currentStreak = 1;
      }

      const longestStreak = Math.max(currentStreak, habit.longestStreak);

      await updateDoc(habitRef, {
        completedDates: arrayUnion(dateStr),
        lastCompletedDate: dateStr,
        currentStreak,
        longestStreak
      });
      await updateDoc(userRef, { xp: increment(10) });
    }
  }
};
