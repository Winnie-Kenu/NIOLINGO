import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { useGameStore } from "@/stores/useGameStore";
import Header from "@/components/layout/Header";
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

  const totalSteps = lesson.presentations.length + 3; // presentations + dialogue + exercise + assessment
  const currentStep =
    phase === "presentation"
      ? presentationIndex + 1
      : phase === "dialogue"
      ? lesson.presentations.length + 1
      : phase === "exercise"
      ? lesson.presentations.length + 2
      : phase === "assessment"
      ? lesson.presentations.length + 3
      : totalSteps;

  const handlePresentationNext = useCallback(() => {
    if (presentationIndex < lesson.presentations.length - 1) {
      setPresentationIndex((i) => i + 1);
    } else {
      setPhase("dialogue");
    }
  }, [presentationIndex, lesson.presentations.length]);

  const handleDialogueNext = () => setPhase("exercise");

  const handleExerciseComplete = (score: number) => {
    setExerciseScore(score);
    setPhase("assessment");
  };

  const handleAssessmentComplete = (score: number) => {
    const finalScore = Math.round((exerciseScore + score) / 2);
    completeLesson(idx, finalScore);
    setPhase("complete");
  };

  if (!lesson) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Progress bar */}
      <div className="sticky top-14 z-40 bg-card/80 backdrop-blur-sm px-4 py-2">
        <div className="container flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-hero"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs font-semibold text-muted-foreground min-w-[3rem] text-right">
            {currentStep}/{totalSteps}
          </span>
        </div>
      </div>

      <main className="container py-8 pb-20">
        <AnimatePresence mode="wait">
          {phase === "presentation" && (
            <PresentationStep
              key={`pres-${presentationIndex}`}
              presentations={lesson.presentations}
              currentIndex={presentationIndex}
              onNext={handlePresentationNext}
            />
          )}
          {phase === "dialogue" && (
            <DialogueStep
              key="dialogue"
              dialogues={lesson.dialogues}
              onNext={handleDialogueNext}
            />
          )}
          {phase === "exercise" && (
            <ExerciseStep
              key="exercise"
              exercises={lesson.exercises}
              onComplete={handleExerciseComplete}
            />
          )}
          {phase === "assessment" && lesson.assessment[0] && (
            <AssessmentStep
              key="assessment"
              assessment={lesson.assessment[0]}
              onComplete={handleAssessmentComplete}
            />
          )}
          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 pt-10"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full gradient-gold animate-pulse-glow">
                <Star className="h-12 w-12 text-gold-foreground" />
              </div>
              <h2 className="font-display text-3xl font-bold text-primary">
                🎉 🏆
              </h2>
              <p className="text-center font-body text-2xl text-foreground font-bold">
                {exerciseScore}%
              </p>
              <div className="flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2">
                <Star className="h-5 w-5 text-secondary" />
                <span className="font-display font-bold text-secondary-foreground">
                  +{exerciseScore >= 80 ? 20 : 10} ⭐
                </span>
              </div>
              <button
                onClick={() => navigate("/")}
                className="mt-4 w-full max-w-sm rounded-xl gradient-hero px-6 py-3.5 font-display text-lg font-semibold text-primary-foreground shadow-card transition-transform active:scale-95"
              >
                🏠
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LessonPage;
