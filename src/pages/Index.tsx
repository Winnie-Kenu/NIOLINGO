import { motion } from "framer-motion";
import {
  Zap,
  Trophy,
  Library,
  Lock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  MessageCircle,
  FileText,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { curriculum } from "@/data/curriculum";
import { useGameStore } from "@/stores/useGameStore";
import Mascot from "@/components/ui/Mascot";
import useSound from "use-sound";
import { useHaptics } from "@/hooks/useHaptics";
import heroImg from "@/assets/niolingo.png";

const Index = () => {
  const navigate = useNavigate();
  const { xp, streak, lessonProgress, isLessonUnlocked, getTotalWordsLearned } =
    useGameStore();
  const haptics = useHaptics();

  // Sound effects
  const [playClick] = useSound("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", { volume: 0.3 });

  const completedLessons = Object.values(lessonProgress).filter(
    (p) => p.completed
  ).length;

  const handleLessonClick = (i: number, unlocked: boolean) => {
    playClick();
    haptics.triggerClick();
    if (unlocked) {
      navigate(`/lesson/${i}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <main className="container max-w-2xl py-8 px-4 space-y-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[40px] bg-card border-4 border-primary/10 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent -z-10" />
          <div className="p-8 md:p-12 flex flex-col items-center text-center gap-6">
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-full max-w-[280px] aspect-[16/9] md:max-w-[400px]"
            >
              <img
                src={heroImg}
                alt="Niolingo Mascot"
                className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(var(--primary),0.3)]"
              />
            </motion.div>

            <div className="space-y-2">
              <h2 className="font-display text-3xl md:text-5xl font-black text-foreground tracking-tight">
                Nio-Lingo
              </h2>
              <p className="font-body text-lg text-muted-foreground font-medium italic">
                Learn Naijá with Nio!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-3xl bg-card border-b-4 border-accent/20 p-5 shadow-xl transition-transform hover:scale-105"
          >
            <Zap className="h-8 w-8 text-accent fill-accent mb-2" />
            <span className="font-display text-2xl font-black text-foreground">
              {streak}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center rounded-3xl bg-card border-b-4 border-secondary/20 p-5 shadow-xl transition-transform hover:scale-105"
          >
            <Trophy className="h-8 w-8 text-secondary fill-secondary mb-2" />
            <span className="font-display text-2xl font-black text-foreground">
              {xp}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center rounded-3xl bg-card border-b-4 border-primary/20 p-5 shadow-xl transition-transform hover:scale-105"
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
          className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-primary/90 to-primary p-10 text-primary-foreground shadow-2xl border-4 border-white/10"
        >
          <div className="absolute top-0 right-0 p-4 opacity-15 transform translate-x-8 -translate-y-8">
            <Mascot size="xl" type="cheering" className="rotate-12" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>

            <h1 className="font-display text-4xl font-black leading-tight">
              {curriculum.unit}
            </h1>

            <div className="space-y-3">
              <div className="flex justify-end items-end mb-1">
                <span className="text-xs font-black bg-white/20 rounded-xl px-4 py-2 flex items-center gap-2 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 text-white animate-pulse" />
                  {completedLessons}/{curriculum.lessons.length}
                </span>
              </div>
              <div className="h-6 w-full rounded-full bg-white/15 overflow-hidden relative border border-white/10 p-1 shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(completedLessons / curriculum.lessons.length) * 100}%`,
                  }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lessons List with Mascot helpers */}
        <div className="space-y-6">
          {curriculum.lessons.map((lesson, i) => {
            const unlocked = isLessonUnlocked(i);
            const progress = lessonProgress[i];
            const completed = progress?.completed;

            const showMascot = i === completedLessons;

            return (
              <div key={i} className="relative">
                {showMascot && unlocked && !completed && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="absolute -left-16 top-1/2 -translate-y-1/2 hidden md:block"
                  >
                    <Mascot size="sm" type="thinking" animate />
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => handleLessonClick(i, unlocked)}
                  disabled={!unlocked}
                  className={`group relative w-full flex items-center gap-5 rounded-[36px] p-6 text-left transition-all border-4 shadow-xl ${completed
                    ? "bg-primary/5 border-primary/20"
                    : unlocked
                      ? "bg-card border-border/60 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1.5 active:scale-[0.98]"
                      : "bg-muted/40 border-border opacity-50 grayscale cursor-not-allowed"
                    }`}
                >
                  <div
                    className={`relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-[24px] shadow-lg ${completed
                      ? "gradient-hero"
                      : unlocked
                        ? "bg-gradient-to-br from-primary/10 to-primary/20"
                        : "bg-muted"
                      }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-10 w-10 text-primary-foreground" strokeWidth={3} />
                    ) : unlocked ? (
                      <span className="font-display text-4xl font-black text-primary">
                        {i + 1}
                      </span>
                    ) : (
                      <Lock className="h-8 w-8 text-muted-foreground/30" strokeWidth={3} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <p className={`font-display text-2xl font-black tracking-tight ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                      {lesson.lesson_title}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-muted/60 border border-border/40">
                        <FileText className="h-4 w-4 text-primary" strokeWidth={3} />
                        <span className="text-xs font-black text-muted-foreground">{lesson.presentations.length}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-muted/60 border border-border/40">
                        <MessageCircle className="h-4 w-4 text-secondary" strokeWidth={3} />
                        <span className="text-xs font-black text-muted-foreground">{lesson.dialogues.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {completed ? (
                      <div className="flex flex-col items-center bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[20px] px-4 py-2 shadow-lg border-b-4 border-yellow-700/30">
                        <Trophy className="h-4 w-4 text-white mb-1" strokeWidth={3} />
                        <span className="font-display text-xl font-black text-white leading-none">
                          {progress.bestScore}%
                        </span>
                      </div>
                    ) : unlocked ? (
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md">
                        <ChevronRight className="h-8 w-8" strokeWidth={4} />
                      </div>
                    ) : null}
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;
