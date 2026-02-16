import { motion } from "framer-motion";
import {
  Zap,
  Trophy,
  Library,
  Lock,
  CheckCircle2,
  ChevronRight,
  Rocket,
  Sparkles,
  MessageCircle,
  FileText,
  Target
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
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <main className="container max-w-2xl py-8 px-4 space-y-10">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-3xl bg-card border-b-4 border-accent/20 p-5 shadow-xl"
          >
            <Zap className="h-8 w-8 text-accent fill-accent mb-2" />
            <span className="font-display text-2xl font-black text-foreground">
              {streak}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center rounded-3xl bg-card border-b-4 border-secondary/20 p-5 shadow-xl"
          >
            <Trophy className="h-8 w-8 text-secondary fill-secondary mb-2" />
            <span className="font-display text-2xl font-black text-foreground">
              {xp}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center rounded-3xl bg-card border-b-4 border-primary/20 p-5 shadow-xl"
          >
            <Library className="h-8 w-8 text-primary fill-primary/20 mb-2" />
            <span className="font-display text-2xl font-black text-foreground">
              {getTotalWordsLearned()}
            </span>
          </motion.div>
        </div>

        {/* Unit header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary/90 to-primary p-12 text-primary-foreground shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
            <Rocket className="w-32 h-32 rotate-12" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>

            <h1 className="font-display text-3xl font-black leading-tight">
              {curriculum.unit}
            </h1>

            <div className="space-y-3">
              <div className="flex justify-end items-end mb-1">
                <span className="text-xs font-black bg-white/20 rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-white animate-pulse" />
                  {completedLessons}/{curriculum.lessons.length}
                </span>
              </div>
              <div className="h-5 w-full rounded-full bg-white/20 overflow-hidden relative border border-white/10 p-1">
                <motion.div
                  className="h-full rounded-full bg-white shadow-[0_0_20px_white]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(completedLessons / curriculum.lessons.length) * 100}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lessons List */}
        <div className="space-y-5">
          {curriculum.lessons.length === 0 && (
            <div className="text-center p-10 bg-muted rounded-3xl">
              <p className="text-muted-foreground font-bold">No progress yet...</p>
            </div>
          )}
          {curriculum.lessons.map((lesson, i) => {
            const unlocked = isLessonUnlocked(i);
            const progress = lessonProgress[i];
            const completed = progress?.completed;

            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => unlocked && navigate(`/lesson/${i}`)}
                disabled={!unlocked}
                className={`group relative w-full flex items-center gap-5 rounded-[28px] p-5 text-left transition-all border-2 shadow-lg ${completed
                  ? "bg-primary/5 border-primary/30"
                  : unlocked
                    ? "bg-card border-border/80 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1"
                    : "bg-muted/40 border-border opacity-50 grayscale cursor-not-allowed"
                  }`}
              >
                <div
                  className={`relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl shadow-lg ${completed
                    ? "gradient-hero"
                    : unlocked
                      ? "bg-gradient-to-br from-primary/10 to-primary/20"
                      : "bg-muted"
                    }`}
                >
                  {completed ? (
                    <CheckCircle2 className="h-8 w-8 text-primary-foreground" strokeWidth={3} />
                  ) : unlocked ? (
                    <span className="font-display text-2xl font-black text-primary">
                      {i + 1}
                    </span>
                  ) : (
                    <Lock className="h-7 w-7 text-muted-foreground/50" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <p className={`font-display text-xl font-black tracking-tight ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                    {lesson.lesson_title}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-muted/50">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[10px] font-black text-muted-foreground">{lesson.presentations.length}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-muted/50">
                      <MessageCircle className="h-3.5 w-3.5 text-secondary" />
                      <span className="text-[10px] font-black text-muted-foreground">{lesson.dialogues.length}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {completed ? (
                    <div className="flex flex-col items-center bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl px-3 py-1.5 shadow-md">
                      <Trophy className="h-3 w-3 text-white mb-0.5" />
                      <span className="font-display text-lg font-black text-white leading-none">
                        {progress.bestScore}%
                      </span>
                    </div>
                  ) : unlocked ? (
                    <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <ChevronRight className="h-6 w-6" strokeWidth={3} />
                    </div>
                  ) : null}
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;
