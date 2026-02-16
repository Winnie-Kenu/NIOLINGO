import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, X, RotateCcw, Equal, MoveRight } from "lucide-react";
import type { Assessment } from "@/data/curriculum";

interface Props {
  assessment: Assessment;
  onComplete: (score: number) => void;
  onPrevious: () => void;
}

type ModalState = "correct" | "try_again" | "failed" | null;

function shuffleNoConsecutive<T>(items: T[], keyFunc: (item: T) => string): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  for (let i = 1; i < shuffled.length; i++) {
    if (keyFunc(shuffled[i]) === keyFunc(shuffled[i - 1])) {
      for (let j = i + 1; j < shuffled.length; j++) {
        if (keyFunc(shuffled[j]) !== keyFunc(shuffled[i - 1])) {
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          break;
        }
      }
    }
  }
  return shuffled;
}

const AssessmentStep = ({ assessment, onComplete, onPrevious }: Props) => {
  const learningQueue = useMemo(() => {
    const repeated = [...assessment.pairs, ...assessment.pairs];
    return shuffleNoConsecutive(repeated, (p) => p.word);
  }, [assessment.pairs]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPicture, setSelectedPicture] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [wrongSelections, setWrongSelections] = useState<Set<string>>(new Set());

  const currentPair = learningQueue[currentIndex];
  const getLetter = (index: number) => String.fromCharCode(65 + index);

  const pictureOptions = useMemo(() => {
    const others = assessment.pairs.filter(p => p.picture !== currentPair.picture).map(p => p.picture);
    const shuffled = [currentPair.picture, ...others.sort(() => Math.random() - 0.5).slice(0, 3)];
    return shuffled.sort(() => Math.random() - 0.5);
  }, [assessment.pairs, currentPair.picture]);

  useEffect(() => {
    setSelectedPicture(null);
    setModalState(null);
    setAttempts(0);
    setWrongSelections(new Set());
  }, [currentIndex]);

  const handleSelect = (picture: string) => {
    if (modalState === "correct" || modalState === "failed") return;
    if (wrongSelections.has(picture)) return;
    setSelectedPicture(picture);
  };

  const handleConfirm = () => {
    if (!selectedPicture || modalState === "correct" || modalState === "failed") return;
    if (selectedPicture === currentPair.picture) {
      setModalState("correct");
      setCorrectCount(c => c + (attempts === 0 ? 1 : 0.5));
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      const newWrong = new Set(wrongSelections);
      newWrong.add(selectedPicture);
      setWrongSelections(newWrong);
      setModalState(newAttempts >= 2 ? "failed" : "try_again");
    }
  };

  const handleNext = () => {
    if (currentIndex < learningQueue.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      onComplete(Math.round((correctCount / learningQueue.length) * 100));
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-8 w-full max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full flex flex-col md:flex-row gap-8 pb-32">
          {/* Question Side */}
          <div className="w-full md:w-1/3 flex flex-col items-center gap-6">
            <div className="bg-card border-4 border-primary/20 rounded-[40px] p-10 shadow-2xl w-full text-center">
              <h3 className="font-display text-4xl font-black text-primary leading-tight">{currentPair.word}</h3>
            </div>
            <div className="flex flex-col items-center opacity-10">
              <Equal className="w-16 h-16" />
              <MoveRight className="w-20 h-20" />
            </div>
          </div>

          {/* Options Side */}
          <div className="w-full md:w-2/3 grid grid-cols-2 gap-6">
            {pictureOptions.map((picture, idx) => {
              const isSelected = picture === selectedPicture;
              const isWrong = wrongSelections.has(picture);
              const isSolved = modalState === "correct" || modalState === "failed";
              const isCorrect = picture === currentPair.picture;

              return (
                <button key={idx} onClick={() => handleSelect(picture)} disabled={isSolved || isWrong} className={`relative aspect-square rounded-[40px] border-4 overflow-hidden transition-all p-3 ${isSolved && isCorrect ? "border-green-500 bg-green-50" :
                    isSolved && isSelected && !isCorrect ? "border-red-500 bg-red-50" :
                      isWrong ? "opacity-30 grayscale cursor-not-allowed scale-95" :
                        isSelected ? "border-primary bg-primary/5 shadow-[0_0_40px_rgba(var(--primary),0.2)] scale-105" : "border-border/60 bg-card hover:bg-muted/50"
                  }`}>
                  <img src={picture} className="w-full h-full object-contain" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-2xl bg-white/90 flex items-center justify-center font-black text-lg shadow-sm">{getLetter(idx)}</div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {!modalState && (
        <div className="fixed bottom-6 left-0 right-0 p-4 flex justify-center z-20 gap-4 pointer-events-none">
          <button onClick={() => currentIndex > 0 ? setCurrentIndex(i => i - 1) : onPrevious()} className="pointer-events-auto w-16 h-16 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-8 h-8 text-muted-foreground" strokeWidth={3} />
          </button>
          <button onClick={handleConfirm} disabled={!selectedPicture} className={`pointer-events-auto flex-1 max-w-xs rounded-[28px] py-5 shadow-2xl transition-all flex items-center justify-center ${selectedPicture ? "gradient-hero text-white" : "bg-muted text-muted-foreground"}`}>
            <Check className="w-10 h-10" strokeWidth={3} />
          </button>
        </div>
      )}

      {modalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border-4 border-border p-10 rounded-[48px] w-full max-w-sm flex flex-col items-center gap-8 shadow-2xl text-center">
            <div className={`p-8 rounded-full ${modalState === "correct" ? "bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]"} text-white`}>
              {modalState === "correct" ? <Check className="w-16 h-16" strokeWidth={3} /> : <X className="w-16 h-16" strokeWidth={3} />}
            </div>

            <button onClick={modalState === "try_again" ? () => setModalState(null) : handleNext} className="w-full py-6 rounded-[32px] gradient-hero text-white font-black shadow-2xl flex items-center justify-center transition-transform active:scale-95">
              {modalState === "try_again" ? <RotateCcw className="w-10 h-10" strokeWidth={3} /> : <ArrowRight className="w-10 h-10" strokeWidth={3} />}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AssessmentStep;
