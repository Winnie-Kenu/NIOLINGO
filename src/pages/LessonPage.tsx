import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Trophy, Sparkles, ArrowRight, Home, BookOpen, MessageSquare, Dumbbell, Link2, Flag, Type, Keyboard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { useGameStore } from "@/stores/useGameStore";
import PresentationStep from "@/components/lesson/PresentationStep";
import DialogueStep from "@/components/lesson/DialogueStep";
import ExerciseStep from "@/components/lesson/ExerciseStep";
import AssessmentStep from "@/components/lesson/AssessmentStep";
import FillInGapStep from "@/components/lesson/FillInGapStep";
import TypingStep from "@/components/lesson/TypingStep";
import Mascot from "@/components/ui/Mascot";
import { useHaptics } from "@/hooks/useHaptics";
import useSound from "use-sound";

type Phase = "presentation" | "dialogue" | "exercise" | "fillInGap" | "typing" | "assessment" | "complete";

const LessonPage = () => {
  const { lessonIndex } = useParams<{ lessonIndex: string }>();
  const navigate = useNavigate();
  const idx = Number(lessonIndex);
  const lesson = curriculum.lessons[idx];
  const { completeLesson } = useGameStore();
  const haptics = useHaptics();

  const [phase, setPhase] = useState<Phase>("presentation");
  const [presentationIndex, setPresentationIndex] = useState(0);
  const [exerciseScore, setExerciseScore] = useState(0);
  const [fillInGapScore, setFillInGapScore] = useState(0);
  const [typingScore, setTypingScore] = useState(0);

  // Sound effects
  const [playSuccess] = useSound("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3", { volume: 0.5 });
  const [playTrophy] = useSound("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3", { volume: 0.6 });
  const [playClick] = useSound("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", { volume: 0.3 });

  useEffect(() => {
    if (phase === "complete") {
      haptics.triggerTrophy();
      playTrophy();
    }
  }, [phase, haptics, playTrophy]);

  const handlePresentationNext = useCallback(() => {
    playClick();
    haptics.triggerClick();
    if (presentationIndex < lesson.presentations.length - 1) {
      setPresentationIndex((i) => i + 1);
    } else {
      setPhase("dialogue");
    }
  }, [presentationIndex, lesson?.presentations.length, playClick, haptics]);

  const handlePresentationPrevious = useCallback(() => {
    playClick();
    haptics.triggerClick();
    if (presentationIndex > 0) {
      setPresentationIndex((i) => i - 1);
    } else {
      navigate("/");
    }
  }, [presentationIndex, navigate, playClick, haptics]);

  const handleDialogueNext = () => {
    playClick();
    haptics.triggerClick();
    setPhase("exercise");
  };
  const handleDialoguePrevious = () => {
    playClick();
    haptics.triggerClick();
    setPhase("presentation");
  };

  const handleExerciseComplete = (score: number) => {
    playSuccess();
    haptics.triggerSuccess();
    setExerciseScore(score);
    setPhase("fillInGap");
  };
  const handleExercisePrevious = () => {
    playClick();
    haptics.triggerClick();
    setPhase("dialogue");
  };

  const handleFillInGapComplete = (score: number) => {
    playSuccess();
    haptics.triggerSuccess();
    setFillInGapScore(score);
    setPhase("typing");
  };
  const handleFillInGapPrevious = () => {
    playClick();
    haptics.triggerClick();
    setPhase("exercise");
  };

  const handleTypingComplete = (score: number) => {
    playSuccess();
    haptics.triggerSuccess();
    setTypingScore(score);
    setPhase("assessment");
  };
  const handleTypingPrevious = () => {
    playClick();
    haptics.triggerClick();
    setPhase("fillInGap");
  };

  const handleAssessmentComplete = (score: number) => {
    const finalScore = Math.round((exerciseScore + fillInGapScore + typingScore + score) / 4);
    completeLesson(idx, finalScore);
    setPhase("complete");
  };
  const handleAssessmentPrevious = () => {
    playClick();
    haptics.triggerClick();
    setPhase("exercise");
  };

  if (!lesson) {
    navigate("/");
    return null;
  }

  const getProgress = () => {
    switch (phase) {
      case "presentation": return ((presentationIndex + 1) / lesson.presentations.length) * 20;
      case "dialogue": return 25 + 5;
      case "exercise": return 35 + 5;
      case "fillInGap": return 45 + 5;
      case "typing": return 55 + 10;
      case "assessment": return 75 + 10;
      case "complete": return 100;
      default: return 0;
    }
  };

  const getPhaseIcon = () => {
    switch (phase) {
      case "presentation": return <BookOpen className="w-5 h-5" />;
      case "dialogue": return <MessageSquare className="w-5 h-5" />;
      case "exercise": return <Dumbbell className="w-5 h-5" />;
      case "fillInGap": return <Type className="w-5 h-5" />;
      case "typing": return <Keyboard className="w-5 h-5" />;
      case "assessment": return <Link2 className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/85 backdrop-blur-xl">
        <div className="container flex h-16 sm:h-20 items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6">
          <button
            onClick={() => { playClick(); navigate("/"); }}
            className="p-2 sm:p-3 hover:bg-muted rounded-xl sm:rounded-2xl transition-all shadow-sm border border-border/40"
          >
            <Home className="w-5 h-5 sm:w-7 sm:h-7 text-muted-foreground" />
          </button>

          <div className="flex-1 flex flex-col gap-1.5 sm:gap-2">
            <div className="h-2.5 sm:h-3 w-full bg-muted/60 rounded-full overflow-hidden border border-border/20 shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary border-2 border-primary/20 shadow-md">
            {getPhaseIcon()}
          </div>
        </div>
      </header>

      <main className="container py-6 sm:py-8 pb-32 px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {phase === "presentation" && (
            <PresentationStep
              key={`pres-${presentationIndex}`}
              presentations={lesson.presentations}
              currentIndex={presentationIndex}
              onNext={handlePresentationNext}
              onPrevious={handlePresentationPrevious}
            />
          )}
          {phase === "dialogue" && (
            <DialogueStep
              key="dialogue"
              dialogues={lesson.dialogues}
              onNext={handleDialogueNext}
              onPrevious={handleDialoguePrevious}
            />
          )}
          {phase === "exercise" && (
            <ExerciseStep
              key="exercise"
              exercises={lesson.exercises}
              onComplete={handleExerciseComplete}
              onPrevious={handleExercisePrevious}
            />
          )}
          {phase === "fillInGap" && (
            <FillInGapStep
              key="fillInGap"
              fillInGaps={lesson.fillInGap}
              onComplete={handleFillInGapComplete}
              onPrevious={handleFillInGapPrevious}
            />
          )}
          {phase === "typing" && (
            <TypingStep
              key="typing"
              exercises={lesson.typingExercises}
              onComplete={handleTypingComplete}
              onPrevious={handleTypingPrevious}
            />
          )}
          {phase === "assessment" && lesson.assessment[0] && (
            <AssessmentStep
              key="assessment"
              assessment={lesson.assessment[0]}
              onComplete={handleAssessmentComplete}
              onPrevious={handleAssessmentPrevious}
            />
          )}
          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 sm:gap-12 text-center"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-yellow-400/20 blur-2xl sm:blur-3xl rounded-full" />
                <Mascot size="lg" type="cheering" className="sm:scale-125" />
              </div>

              <div className="space-y-4 sm:space-y-6">
                <h2 className="font-display text-4xl sm:text-5xl font-black text-foreground drop-shadow-sm tracking-tight">Oya!</h2>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                    >
                      <Star className="w-8 h-8 sm:w-12 sm:h-12 fill-yellow-400 text-yellow-500 animate-pulse-glow" style={{ animationDelay: `${i * 0.2}s` }} />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="w-full max-w-sm bg-card border-[3px] sm:border-4 border-border/80 p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-2xl flex flex-col items-center gap-4 sm:gap-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-secondary mb-1 sm:mb-2 drop-shadow-md" />
                <div className="text-6xl sm:text-8xl font-black text-primary tracking-tighter leading-none">
                  {Math.round((exerciseScore + fillInGapScore + typingScore + (useGameStore.getState().lessonProgress[idx]?.score || 0)) / 4)}%
                </div>
                <div className="flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-6 sm:px-8 bg-primary/10 rounded-2xl sm:rounded-[24px] text-primary font-black border-2 border-primary/20">
                  <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-secondary" />
                  <span className="text-xl sm:text-3xl">+{exerciseScore >= 80 ? 20 : 10}</span>
                </div>
              </div>

              <button
                onClick={() => { playClick(); haptics.triggerClick(); navigate("/"); }}
                className="w-full max-w-sm flex items-center justify-center rounded-2xl sm:rounded-[32px] gradient-hero py-4 sm:py-6 text-white shadow-[0_15px_30px_rgba(var(--primary),0.3)] hover:scale-[1.05] active:scale-95 transition-all"
              >
                <ArrowRight className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={4} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LessonPage;
