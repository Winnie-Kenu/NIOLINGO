import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Trophy, Sparkles, ArrowRight, Home, BookOpen, MessageSquare, Dumbbell, Link2, Flag } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { useGameStore } from "@/stores/useGameStore";
import PresentationStep from "@/components/lesson/PresentationStep";
import DialogueStep from "@/components/lesson/DialogueStep";
import ExerciseStep from "@/components/lesson/ExerciseStep";
import AssessmentStep from "@/components/lesson/AssessmentStep";

type Phase = "presentation" | "dialogue" | "exercise" | "assessment" | "complete";

const LessonPage = () => {
  const { lessonIndex } = useParams<{ lessonIndex: string }>();
  const navigate = useNavigate();
  const idx = Number(lessonIndex);
  const lesson = curriculum.lessons[idx];
  const { completeLesson } = useGameStore();

  const [phase, setPhase] = useState<Phase>("presentation");
  const [presentationIndex, setPresentationIndex] = useState(0);
  const [exerciseScore, setExerciseScore] = useState(0);

  const handlePresentationNext = useCallback(() => {
    if (presentationIndex < lesson.presentations.length - 1) {
      setPresentationIndex((i) => i + 1);
    } else {
      setPhase("dialogue");
    }
  }, [presentationIndex, lesson?.presentations.length]);

  const handlePresentationPrevious = useCallback(() => {
    if (presentationIndex > 0) {
      setPresentationIndex((i) => i - 1);
    } else {
      navigate("/");
    }
  }, [presentationIndex, navigate]);

  const handleDialogueNext = () => setPhase("exercise");
  const handleDialoguePrevious = () => setPhase("presentation");

  const handleExerciseComplete = (score: number) => {
    setExerciseScore(score);
    setPhase("assessment");
  };
  const handleExercisePrevious = () => setPhase("dialogue");

  const handleAssessmentComplete = (score: number) => {
    const finalScore = Math.round((exerciseScore + score) / 2);
    completeLesson(idx, finalScore);
    setPhase("complete");
  };
  const handleAssessmentPrevious = () => setPhase("exercise");

  if (!lesson) {
    navigate("/");
    return null;
  }

  // Calculate Progress for the top bar
  const getProgress = () => {
    switch (phase) {
      case "presentation": return ((presentationIndex + 1) / lesson.presentations.length) * 20;
      case "dialogue": return 25 + 15;
      case "exercise": return 50 + 10;
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
      case "assessment": return <Link2 className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Global Lesson Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4 px-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-muted-foreground" />
          </button>

          <div className="flex-1 flex flex-col gap-1">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary">
            {getPhaseIcon()}
          </div>
        </div>
      </header>

      <main className="container py-8 pb-32 px-4">
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
              className="flex flex-col items-center gap-12 text-center"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full group-hover:bg-yellow-400/30 transition-all" />
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-2xl">
                  <Trophy className="h-16 w-16 text-white" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1, type: "spring" }}
                    >
                      <Star className="w-10 h-10 fill-yellow-400 text-yellow-500 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="w-full max-w-sm bg-card border-2 border-border p-8 rounded-[40px] shadow-xl flex flex-col items-center gap-4">
                <Trophy className="w-8 h-8 text-secondary mb-2" />
                <div className="text-7xl font-black text-primary">{exerciseScore}%</div>
                <div className="flex items-center justify-center gap-2 py-3 px-6 bg-primary/10 rounded-2xl text-primary font-bold">
                  <Sparkles className="w-6 h-6 text-secondary" />
                  <span className="text-xl">+{exerciseScore >= 80 ? 20 : 10}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/")}
                className="w-full max-w-sm flex items-center justify-center gap-3 rounded-2xl gradient-hero px-6 py-5 text-white shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                <ArrowRight className="w-10 h-10" strokeWidth={3} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LessonPage;
