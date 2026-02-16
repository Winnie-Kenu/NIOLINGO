import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, HelpCircle, RotateCcw, X } from "lucide-react";
import type { Exercise } from "@/data/curriculum";

interface Props {
  exercises: Exercise[];
  onComplete: (score: number) => void;
  onPrevious: () => void;
}

type ModalState = "correct" | "try_again" | "failed" | null;

function shuffleNoConsecutive<T>(items: T[], keyFunc: (item: T) => string): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  for (let i = 1; i < shuffled.length; i++) {
    if (keyFunc(shuffled[i]) === keyFunc(shuffled[i - 1])) {
      for (let j = i + 1; j < shuffled.length; j++) {
        const candidate = shuffled[j];
        if (keyFunc(candidate) !== keyFunc(shuffled[i - 1])) {
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          break;
        }
      }
    }
  }
  return shuffled;
}

const ExerciseStep = ({ exercises, onComplete, onPrevious }: Props) => {
  const learningQueue = useMemo(() => {
    const repeated = [...exercises, ...exercises];
    return shuffleNoConsecutive(repeated, (e) => e.question_word || e.answer);
  }, [exercises]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [wrongSelections, setWrongSelections] = useState<Set<string>>(new Set());

  const currentExercise = learningQueue[currentIndex];
  const getLetter = (index: number) => String.fromCharCode(65 + index);

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
      setModalState("correct");
      setCorrectCount((c) => c + (attempts === 0 ? 1 : 0.5));
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      const newWrong = new Set(wrongSelections);
      newWrong.add(selectedOption);
      setWrongSelections(newWrong);
      setModalState(newAttempts >= 3 ? "failed" : "try_again");
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
      onComplete(Math.round((correctCount / learningQueue.length) * 100));
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      onPrevious();
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full flex flex-col gap-8 pb-32"
        >
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="relative w-1/2 aspect-square rounded-[40px] overflow-hidden border-4 border-primary/20 bg-card shadow-2xl">
              <img src={currentExercise.question_picture} alt="Question" className="w-full h-full object-cover" />
            </div>
            <ArrowRight className="w-10 h-10 text-muted-foreground/30" strokeWidth={3} />
            <div className="relative w-1/2 aspect-square rounded-[40px] flex items-center justify-center border-4 border-dashed border-primary/20 bg-primary/5">
              <HelpCircle className="w-16 h-16 text-primary/20" strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {currentExercise.options.map((option, idx) => {
              const letter = getLetter(idx);
              const isWrong = wrongSelections.has(option);
              const isSelected = option === selectedOption;
              const isSolved = modalState === "correct" || modalState === "failed";
              const isCorrectAnswer = option === currentExercise.answer;

              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  disabled={isSolved || isWrong}
                  className={`flex items-center gap-6 w-full rounded-[32px] border-4 px-6 py-5 transition-all ${isSolved && isCorrectAnswer ? "border-green-500 bg-green-50 shadow-inner" :
                    isSolved && isSelected && !isCorrectAnswer ? "border-red-500 bg-red-50 shadow-inner" :
                      isWrong ? "opacity-30 cursor-not-allowed grayscale scale-95" :
                        isSelected ? "border-primary bg-primary/5 shadow-2xl scale-105" : "border-border/60 bg-card hover:bg-muted/50"
                    }`}
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border-4 font-black text-xl flex-shrink-0 ${isSolved && isCorrectAnswer ? "bg-green-500 text-white border-green-600" :
                    isSolved && isSelected && !isCorrectAnswer ? "bg-red-500 text-white border-red-600" :
                      isSelected ? "bg-primary text-white border-primary-foreground/20" : "text-muted-foreground border-border"
                    }`}>
                    {letter}
                  </div>
                  <span className="font-display text-2xl font-black">{option}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {!modalState && (
        <div className="fixed bottom-6 left-0 right-0 p-4 flex justify-center z-20 gap-4 pointer-events-none">
          <button onClick={handlePrevious} className="pointer-events-auto w-16 h-16 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-8 h-8 text-muted-foreground" strokeWidth={3} />
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedOption}
            className={`pointer-events-auto flex-1 max-w-xs flex items-center justify-center rounded-[28px] py-5 shadow-2xl transition-all ${selectedOption ? "gradient-hero text-white" : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
          >
            <Check className="w-10 h-10" strokeWidth={3} />
          </button>
        </div>
      )}

      {modalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border-4 border-border p-10 rounded-[48px] w-full max-w-sm flex flex-col items-center gap-8 shadow-2xl">
            <div className={`p-8 rounded-full ${modalState === "correct" ? "bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]"} text-white`}>
              {modalState === "correct" ? <Check className="w-16 h-16" strokeWidth={3} /> : <X className="w-16 h-16" strokeWidth={3} />}
            </div>

            <button onClick={modalState === "try_again" ? handleRetry : handleNext} className="w-full py-6 rounded-[32px] gradient-hero text-white shadow-2xl flex items-center justify-center transition-transform active:scale-95">
              {modalState === "try_again" ? <RotateCcw className="w-10 h-10" strokeWidth={3} /> : <ArrowRight className="w-10 h-10" strokeWidth={3} />}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ExerciseStep;
