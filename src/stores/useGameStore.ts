import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LessonProgress {
  completed: boolean;
  score: number;
  bestScore: number;
}

interface GameState {
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  lessonProgress: Record<number, LessonProgress>;
  currentLesson: number | null;

  addXp: (amount: number) => void;
  updateStreak: () => void;
  completeLesson: (lessonIndex: number, score: number) => void;
  setCurrentLesson: (index: number | null) => void;
  isLessonUnlocked: (index: number) => boolean;
  getTotalWordsLearned: () => number;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      lessonProgress: {},
      currentLesson: null,

      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),

      updateStreak: () => {
        const today = new Date().toDateString();
        const { lastActiveDate, streak } = get();
        if (lastActiveDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = lastActiveDate === yesterday.toDateString();

        set({
          streak: isConsecutive ? streak + 1 : 1,
          lastActiveDate: today,
        });
      },

      completeLesson: (lessonIndex, score) => {
        const prev = get().lessonProgress[lessonIndex];
        set((s) => ({
          lessonProgress: {
            ...s.lessonProgress,
            [lessonIndex]: {
              completed: true,
              score,
              bestScore: Math.max(score, prev?.bestScore || 0),
            },
          },
        }));
        get().addXp(score >= 80 ? 20 : 10);
        get().updateStreak();
      },

      setCurrentLesson: (index) => set({ currentLesson: index }),

      isLessonUnlocked: (index) => {
        if (index === 0) return true;
        return get().lessonProgress[index - 1]?.completed || false;
      },

      getTotalWordsLearned: () => {
        const { lessonProgress } = get();
        // Rough count based on completed lessons
        const wordCounts = [4, 3, 2, 4]; // words per lesson
        return Object.keys(lessonProgress)
          .filter((k) => lessonProgress[Number(k)]?.completed)
          .reduce((sum, k) => sum + (wordCounts[Number(k)] || 0), 0);
      },
    }),
    { name: "niolingo-game" }
  )
);
