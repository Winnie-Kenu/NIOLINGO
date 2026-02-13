import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import type { Exercise } from "@/data/curriculum";

interface Props {
  exercises: Exercise[];
  onComplete: (score: number) => void;
}

const ExerciseStep = ({ exercises, onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const exercise = exercises[currentIndex];
  const isCorrect = selected === exercise.answer;

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);
    if (option === exercise.answer) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      const score = Math.round(
        ((correctCount + (isCorrect ? 0 : 0)) / exercises.length) * 100
      );
      // recalculate properly
      const finalCorrect = correctCount;
      onComplete(Math.round((finalCorrect / exercises.length) * 100));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 px-4"
    >
      <p className="text-sm font-semibold text-muted-foreground">
        {currentIndex + 1} / {exercises.length}
      </p>

      <div className="h-40 w-40 overflow-hidden rounded-2xl border-4 border-secondary shadow-elevated">
        <img
          src={exercise.question_picture}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>

      <p className="font-display text-lg font-semibold text-foreground">
        ❓🖼️
      </p>

      <div className="w-full max-w-sm space-y-3">
        <AnimatePresence mode="wait">
          {exercise.options.map((option) => {
            let classes =
              "w-full rounded-xl border-2 px-4 py-3 text-left font-body text-sm font-semibold transition-all ";
            if (showResult) {
              if (option === exercise.answer) {
                classes += "border-primary bg-primary/10 text-primary";
              } else if (option === selected) {
                classes += "border-destructive bg-destructive/10 text-destructive";
              } else {
                classes += "border-border bg-card text-muted-foreground opacity-50";
              }
            } else if (option === selected) {
              classes += "border-primary bg-primary/5 text-primary";
            } else {
              classes += "border-border bg-card text-foreground hover:border-primary/50";
            }

            return (
              <motion.button
                key={option}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(option)}
                className={classes}
              >
                <div className="flex items-center justify-between">
                  {option}
                  {showResult && option === exercise.answer && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                  {showResult &&
                    option === selected &&
                    option !== exercise.answer && (
                      <X className="h-5 w-5 text-destructive" />
                    )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div
            className={`rounded-xl p-4 text-center font-display text-lg font-bold ${
              isCorrect
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {isCorrect ? "✅ 🎉" : `➡️ "${exercise.answer}"`}
          </div>
          <button
            onClick={handleNext}
            className="mt-4 w-full rounded-xl gradient-hero px-6 py-3.5 font-display text-lg font-semibold text-primary-foreground shadow-card transition-transform active:scale-95"
          >
            {currentIndex < exercises.length - 1 ? "▶" : "🏁"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExerciseStep;
