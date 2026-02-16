import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, ArrowRight, ArrowLeft, Check, Flag, HelpCircle, RotateCcw, X, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Exercise } from "@/data/curriculum";

interface Props {
  exercises: Exercise[];
  onComplete: (score: number) => void;
}

type ModalState = "correct" | "try_again" | "failed" | null;

// Helper to prevent consecutive duplicates
function shuffleNoConsecutive<T>(items: T[], keyFunc: (item: T) => string): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  for (let i = 1; i < shuffled.length; i++) {
    if (keyFunc(shuffled[i]) === keyFunc(shuffled[i - 1])) {
      for (let j = i + 1; j < shuffled.length; j++) {
        const candidate = shuffled[j];
        const prev = shuffled[i - 1];
        if (keyFunc(candidate) !== keyFunc(prev)) {
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          break;
        }
      }
    }
  }
  return shuffled;
}


const ExerciseStep = ({ exercises, onComplete }: Props) => {
  const navigate = useNavigate();

  // Create a learning queue: repeat each exercise 2 times and shuffle
  const learningQueue = useMemo(() => {
    const baseList = exercises;
    const repeated = [
      ...baseList,
      ...baseList // Repeated 2 times
    ];
    return shuffleNoConsecutive(repeated, (e) => e.question_word || e.answer);
  }, [exercises]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [wrongSelections, setWrongSelections] = useState<Set<string>>(new Set());

  const currentExercise = learningQueue[currentIndex];
  // Map index to letters A, B, C, D
  const getLetter = (index: number) => String.fromCharCode(65 + index); // 65 is 'A'

  // Reset state on new question
  useEffect(() => {
    setSelectedOption(null);
    setModalState(null);
    setAttempts(0);
    setWrongSelections(new Set());
  }, [currentIndex]);

  const handleSelect = (option: string) => {
    if (modalState === "correct" || modalState === "failed") return;
    if (wrongSelections.has(option)) return;
    setSelectedOption(option);
  };

  const handleConfirm = () => {
    if (!selectedOption || modalState === "correct" || modalState === "failed") return;

    if (selectedOption === currentExercise.answer) {
      // Correct!
      setModalState("correct");
      const points = attempts === 0 ? 1 : 0.5;
      setCorrectCount((c) => c + points);
    } else {
      // Wrong answer
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Track wrong selection
      const newWrong = new Set(wrongSelections);
      newWrong.add(selectedOption);
      setWrongSelections(newWrong);

      // Allow 3 total attempts (0, 1, 2). So if attempts becomes 3, fail.
      if (newAttempts >= 3) {
        setModalState("failed");
      } else {
        setModalState("try_again");
      }
    }
  };

  const handleRetry = () => {
    setModalState(null);
    setSelectedOption(null);
  };

  const handleNext = () => {
    if (currentIndex < learningQueue.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Calculate final score
      const finalScore = Math.round((correctCount / learningQueue.length) * 100);
      onComplete(finalScore);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleHome = () => {
    navigate("/");
  };


  return (
    <div className="relative flex flex-col items-center gap-6 px-4 w-full max-w-lg mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex w-full items-center justify-between gap-4">
        {/* Home Button */}
        <button
          onClick={handleHome}
          className="p-3 bg-muted/50 rounded-full hover:bg-muted transition-colors"
          title="Go Home"
        >
          <Home className="w-6 h-6 text-muted-foreground" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / learningQueue.length) * 100}%` }}
            />
          </div>
          <p className="text-xs font-bold text-muted-foreground">{currentIndex + 1} / {learningQueue.length}</p>
        </div>

        {/* Header Icon */}
        <div className="p-3 bg-primary/10 rounded-full">
          <Dumbbell className="w-6 h-6 text-primary fill-primary/20" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col gap-8 pb-24"
        >
          {/* Visual Question Area: Picture => ? */}
          <div className="flex items-center justify-between gap-4 w-full">
            {/* Picture Box */}
            <div className="relative w-1/2 aspect-square rounded-3xl overflow-hidden border-4 border-primary/20 shadow-xl bg-card">
              <img
                src={currentExercise.question_picture}
                alt="Question"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>

            {/* Arrow */}
            <ArrowRight className="w-10 h-10 text-muted-foreground/50" strokeWidth={3} />

            {/* Question Mark Box */}
            <div className="relative w-1/2 aspect-square rounded-3xl flex items-center justify-center border-4 border-dashed border-primary/30 bg-primary/5">
              <HelpCircle className="w-16 h-16 text-primary/40" strokeWidth={2.5} />
            </div>
          </div>

          {/* Options List A, B, C, D */}
          <div className="flex flex-col gap-3 w-full">
            {currentExercise.options.map((option, idx) => {
              const letter = getLetter(idx);
              const isWrong = wrongSelections.has(option);
              const isSelected = option === selectedOption;

              let stateClass = "border-border bg-card text-foreground hover:border-primary/50";

              if (modalState === "correct" || modalState === "failed") {
                // Final state logic
                if (option === currentExercise.answer) {
                  stateClass = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-300 shadow-md";
                } else if (isWrong || (attempts >= 3 && isSelected)) {
                  stateClass = "border-destructive bg-destructive/10 text-destructive shadow-sm opacity-50";
                } else {
                  stateClass = "border-border/50 bg-card/50 text-muted-foreground opacity-60";
                }
              } else if (isWrong) {
                stateClass = "border-destructive/50 bg-destructive/5 text-destructive opacity-60 cursor-not-allowed";
              } else if (isSelected) {
                stateClass = "border-primary bg-primary/10 text-primary shadow-md scale-[1.02]";
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  disabled={modalState === "correct" || modalState === "failed" || isWrong}
                  className={`relative flex items-center gap-4 w-full rounded-2xl border-3 px-4 py-4 transition-all duration-200 ${stateClass}`}
                >
                  {/* Circle Letter */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-display text-lg font-bold flex-shrink-0 transition-colors ${isWrong ? "border-destructive bg-destructive text-white"
                      : (modalState === "correct" || modalState === "failed") && option === currentExercise.answer ? "border-green-500 bg-green-500 text-white"
                        : isSelected ? "border-primary bg-primary text-white"
                          : "border-muted-foreground/30 text-muted-foreground"
                    }`}>
                    {isWrong ? <X className="w-5 h-5" /> : letter}
                  </div>

                  {/* Option Text */}
                  <span className="font-display text-lg font-bold text-left leading-tight">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main Action Button (Sticky) */}
      {!modalState && (
        <div className="fixed bottom-6 left-0 right-0 p-4 flex justify-center z-20 pointer-events-none gap-4">
          {/* Previous Button */}
          {currentIndex > 0 && (
            <div className="pointer-events-auto shadow-xl rounded-full">
              <button
                onClick={handlePrevious}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-background border-2 border-muted hover:bg-muted/50 transition-colors text-muted-foreground"
              >
                <ArrowLeft className="w-8 h-8" strokeWidth={3} />
              </button>
            </div>
          )}

          {/* Confirm Button */}
          <div className="w-full max-w-xs pointer-events-auto shadow-2xl rounded-2xl">
            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              className={`w-full flex items-center justify-center rounded-2xl px-6 py-5 shadow-lg transition-all active:scale-95 ${selectedOption
                  ? "gradient-hero text-primary-foreground cursor-pointer shadow-primary/25"
                  : "bg-background border-2 border-muted text-muted-foreground cursor-not-allowed opacity-80"
                }`}
            >
              <Check className="w-8 h-8" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      <AnimatePresence>
        {modalState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ y: 100, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 100, scale: 0.9 }}
              className={`w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-6 ${modalState === "correct" ? "bg-green-100 dark:bg-green-900/90 border-4 border-green-500 text-green-800 dark:text-green-100"
                  : modalState === "try_again" ? "bg-yellow-100 dark:bg-yellow-900/90 border-4 border-yellow-500 text-yellow-800 dark:text-yellow-100"
                    : "bg-red-100 dark:bg-red-900/90 border-4 border-red-500 text-red-800 dark:text-red-100"
                }`}
            >
              {/* Icon */}
              <div className={`p-4 rounded-full ${modalState === "correct" ? "bg-green-500 text-white"
                  : modalState === "try_again" ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                {modalState === "correct" ? <Check className="w-12 h-12" strokeWidth={4} />
                  : modalState === "try_again" ? <RotateCcw className="w-12 h-12" strokeWidth={3} />
                    : <X className="w-12 h-12" strokeWidth={4} />
                }
              </div>

              {/* Button */}
              <button
                onClick={modalState === "try_again" ? handleRetry : handleNext}
                className={`w-full flex items-center justify-center rounded-2xl px-6 py-5 shadow-lg transition-transform active:scale-95 ${modalState === "correct" ? "bg-green-600 text-white hover:bg-green-700"
                    : modalState === "try_again" ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
              >
                {modalState === "try_again" ? (
                  <RotateCcw className="w-8 h-8" strokeWidth={3} />
                ) : currentIndex < learningQueue.length - 1 ? (
                  <ArrowRight className="w-8 h-8" strokeWidth={3} />
                ) : (
                  <Flag className="w-8 h-8" strokeWidth={3} />
                )}
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExerciseStep;
