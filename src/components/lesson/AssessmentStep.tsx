import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, ArrowRight, ArrowLeft, Check, Flag, HelpCircle, MoveRight, Equal, X, RotateCcw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Assessment } from "@/data/curriculum";

interface Props {
  assessment: Assessment;
  onComplete: (score: number) => void;
}

type ModalState = "correct" | "try_again" | "failed" | null;

// Helper to prevent consecutive duplicates
function shuffleNoConsecutive<T>(items: T[], keyFunc: (item: T) => string): T[] {
  // First, standard shuffle
  const shuffled = [...items].sort(() => Math.random() - 0.5);

  // Then fix consecutives by swapping with next available non-matching
  for (let i = 1; i < shuffled.length; i++) {
    if (keyFunc(shuffled[i]) === keyFunc(shuffled[i - 1])) {
      // Find a swap candidate later in the array that isn't the same
      // and whose neighbors won't cause a new conflict
      for (let j = i + 1; j < shuffled.length; j++) {
        const candidate = shuffled[j];
        const prev = shuffled[i - 1];
        // Check if candidate is different from prev
        if (keyFunc(candidate) !== keyFunc(prev)) {
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          break;
        }
      }
    }
  }
  return shuffled;
}

const AssessmentStep = ({ assessment, onComplete }: Props) => {
  const navigate = useNavigate();

  // Create a learning queue: repeat each pair 2 times and shuffle randomly
  const learningQueue = useMemo(() => {
    const basePairs = assessment.pairs;
    const repeated = [
      ...basePairs,
      ...basePairs // Repeated 2 times instead of 3
    ];
    return shuffleNoConsecutive(repeated, (p) => p.word);
  }, [assessment.pairs]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPicture, setSelectedPicture] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [wrongSelections, setWrongSelections] = useState<Set<string>>(new Set());

  const currentPair = learningQueue[currentIndex];

  // Helper to get A, B, C, D
  const getLetter = (index: number) => String.fromCharCode(65 + index);

  // Generate shuffled picture options for the current word
  const pictureOptions = useMemo(() => {
    const otherPictures = assessment.pairs
      .filter((p) => p.picture !== currentPair.picture)
      .map((p) => p.picture);

    const shuffledOthers = [...otherPictures].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [currentPair.picture, ...shuffledOthers];
    return options.sort(() => Math.random() - 0.5);
  }, [assessment.pairs, currentPair.picture]);

  // Reset state on new question
  useEffect(() => {
    setSelectedPicture(null);
    setModalState(null);
    setAttempts(0);
    setWrongSelections(new Set());
  }, [currentIndex]);

  const handleSelect = (picture: string) => {
    if (modalState === "correct" || modalState === "failed") return; // Question is done
    if (wrongSelections.has(picture)) return; // Don't allow re-selecting known wrong answers
    setSelectedPicture(picture);
  };

  const handleConfirm = () => {
    if (!selectedPicture || modalState === "correct" || modalState === "failed") return;

    if (selectedPicture === currentPair.picture) {
      // Correct!
      setModalState("correct");
      const points = attempts === 0 ? 1 : 0.5;
      setCorrectCount((c) => c + points);
    } else {
      // Wrong answer
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      const newWrong = new Set(wrongSelections);
      newWrong.add(selectedPicture);
      setWrongSelections(newWrong);

      if (newAttempts >= 2) {
        setModalState("failed");
      } else {
        setModalState("try_again");
      }
    }
  };

  const handleRetry = () => {
    setModalState(null);
    setSelectedPicture(null);
  };

  const handleNext = () => {
    if (currentIndex < learningQueue.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
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
    <div className="relative flex flex-col items-center gap-6 px-4 w-full max-w-4xl mx-auto">
      {/* Top Navigation Bar: Home Icon and Progress */}
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

        {/* Header Icon (Link2) */}
        <div className="p-3 bg-primary/10 rounded-full">
          <Link2 className="w-6 h-6 text-primary fill-primary/20" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-12 pb-24"
        >
          {/* Left Side: Phrase + Arrow */}
          <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
            <div className="relative w-full">
              <div className="bg-card border-3 border-primary/20 rounded-t-3xl rounded-bl-3xl rounded-br-none p-6 shadow-xl relative z-10">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-center text-primary">
                  {currentPair.word}
                </h3>
              </div>
              <div className="absolute -bottom-2 right-0 w-6 h-6 bg-card border-r-3 border-b-3 border-primary/20 rotate-45 z-0 translate-y-[-50%] translate-x-[-10px]"></div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground/40 mt-4">
              <Equal className="w-10 h-10" strokeWidth={3} />
              <MoveRight className="w-12 h-12" strokeWidth={3} />
            </div>
          </div>

          {/* Right Side: Options List */}
          <div className="flex flex-col gap-4 w-full md:w-1/2 relative">
            <div className="absolute -top-12 right-0 md:-right-4 animate-bounce-slow">
              <HelpCircle className="w-10 h-10 text-primary" strokeWidth={3} />
            </div>

            <div className="flex flex-col gap-4">
              {pictureOptions.map((picture, idx) => {
                const letter = getLetter(idx);
                const isWrong = wrongSelections.has(picture);
                const isSelected = picture === selectedPicture;

                let stateClass = "border-border bg-card hover:border-primary/50";

                if (modalState === "correct" || modalState === "failed") {
                  if (picture === currentPair.picture) {
                    stateClass = "border-green-500 bg-green-500/10 shadow-md ring-2 ring-green-500/20";
                  } else if (isWrong || (attempts >= 2 && isSelected)) {
                    stateClass = "border-destructive bg-destructive/10 shadow-sm opacity-50";
                  } else {
                    stateClass = "border-border/50 opacity-30 grayscale";
                  }
                } else if (isWrong) {
                  stateClass = "border-destructive/50 bg-destructive/5 opacity-60 cursor-not-allowed";
                } else if (isSelected) {
                  stateClass = "border-primary bg-primary/5 shadow-md scale-[1.02]";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(picture)}
                    disabled={modalState === "correct" || modalState === "failed" || isWrong}
                    className={`relative flex items-center gap-4 w-full rounded-2xl border-3 p-3 transition-all duration-200 group overflow-hidden ${stateClass}`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-display text-lg font-bold flex-shrink-0 ml-2 transition-colors z-10 ${(isWrong) ? "border-destructive bg-destructive text-white"
                        : (modalState === "correct" || modalState === "failed") && picture === currentPair.picture ? "border-green-500 bg-green-500 text-white"
                          : isSelected ? "border-primary bg-primary text-white"
                            : "border-muted-foreground/30 bg-background text-muted-foreground"
                      }`}>
                      {isWrong ? <X className="w-5 h-5" /> : letter}
                    </div>

                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-white border-2 border-muted/20 relative p-1">
                      <img
                        src={picture}
                        alt={`Option ${letter}`}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main Action Button (Sticky Bottom) */}
      {!modalState && (
        <div className="fixed bottom-6 left-0 right-0 p-4 flex justify-center z-20 pointer-events-none gap-4">
          {/* Previous Button (left of main action) */}
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
              disabled={!selectedPicture}
              className={`w-full flex items-center justify-center rounded-2xl px-6 py-5 shadow-lg transition-all active:scale-95 ${selectedPicture
                  ? "gradient-hero text-primary-foreground cursor-pointer"
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

export default AssessmentStep;
