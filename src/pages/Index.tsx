import { motion } from "framer-motion";
import {
  Flame,
  Star,
  BookOpen,
  Lock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { curriculum } from "@/data/curriculum";
import { useGameStore } from "@/stores/useGameStore";

const Index = () => {
  const navigate = useNavigate();
  const { xp, streak, lessonProgress, isLessonUnlocked, getTotalWordsLearned } =
    useGameStore();

  const completedLessons = Object.values(lessonProgress).filter(
    (p) => p.completed
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 pb-20 space-y-8">
        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="flex flex-col items-center rounded-2xl bg-card p-4 shadow-card">
            <Flame className="h-7 w-7 text-accent mb-1" />
            <span className="font-display text-2xl font-bold text-foreground">
              {streak}
            </span>
            <span className="text-xs text-muted-foreground">Streak</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-card p-4 shadow-card">
            <Star className="h-7 w-7 text-secondary mb-1" />
            <span className="font-display text-2xl font-bold text-foreground">
              {xp}
            </span>
            <span className="text-xs text-muted-foreground">XP</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-card p-4 shadow-card">
            <BookOpen className="h-7 w-7 text-primary mb-1" />
            <span className="font-display text-2xl font-bold text-foreground">
              {getTotalWordsLearned()}
            </span>
            <span className="text-xs text-muted-foreground">Words</span>
          </div>
        </motion.div>

        {/* Unit header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Unit 1
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {curriculum.unit}
          </h1>
          <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-hero"
              initial={{ width: 0 }}
              animate={{
                width: `${(completedLessons / curriculum.lessons.length) * 100}%`,
              }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {completedLessons} / {curriculum.lessons.length} lessons
          </p>
        </div>

        {/* Lessons */}
        <div className="space-y-3">
          {curriculum.lessons.map((lesson, i) => {
            const unlocked = isLessonUnlocked(i);
            const progress = lessonProgress[i];
            const completed = progress?.completed;

            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => unlocked && navigate(`/lesson/${i}`)}
                disabled={!unlocked}
                className={`w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-all shadow-card ${
                  completed
                    ? "bg-primary/5 border-2 border-primary/20"
                    : unlocked
                    ? "bg-card border-2 border-border hover:border-primary/40 hover:shadow-elevated"
                    : "bg-muted/50 border-2 border-border opacity-60"
                }`}
              >
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
                    completed
                      ? "gradient-hero"
                      : unlocked
                      ? "bg-primary/10"
                      : "bg-muted"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                  ) : unlocked ? (
                    <span className="font-display text-lg font-bold text-primary">
                      {i + 1}
                    </span>
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-display text-base font-semibold text-foreground truncate">
                    {lesson.lesson_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lesson.presentations.length} words •{" "}
                    {lesson.dialogues.length} dialogues
                  </p>
                  {completed && (
                    <p className="text-xs font-semibold text-primary mt-0.5">
                      Best: {progress.bestScore}%
                    </p>
                  )}
                </div>

                {unlocked && (
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;
