import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, X, RotateCcw, Equal, MoveRight } from "lucide-react";
import type { Assessment } from "@/data/curriculum";
import { useHaptics } from "@/hooks/useHaptics";
import useSound from "use-sound";

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
  const haptics = useHaptics();
  const [playSuccess] = useSound("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3", { volume: 0.5 });
  const [playError] = useSound("https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3", { volume: 0.4 });
  const [playClick] = useSound("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", { volume: 0.3 });

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
    playClick();
    haptics.triggerClick();
    setSelectedPicture(picture);
  };

  const handleConfirm = () => {
    if (!selectedPicture || modalState === "correct" || modalState === "failed") return;
    if (selectedPicture === currentPair.picture) {
      playSuccess();
      haptics.triggerSuccess();
      setModalState("correct");
      setCorrectCount(c => c + (attempts === 0 ? 1 : 0.5));
    } else {
      playError();
      haptics.triggerError();
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      const newWrong = new Set(wrongSelections);
      newWrong.add(selectedPicture);
      setWrongSelections(newWrong);
      setModalState(newAttempts >= 2 ? "failed" : "try_again");
    }
  };

  const handleNext = () => {
    playClick();
    haptics.triggerClick();
    if (currentIndex < learningQueue.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      onComplete(Math.round((correctCount / learningQueue.length) * 100));
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-6 sm:gap-8 w-full max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full flex flex-col md:flex-row gap-6 sm:gap-8 pb-32">
          {/* Question Side */}
          <div className="w-full md:w-1/3 flex flex-col items-center gap-4 sm:gap-6">
            <div className="bg-card border-[3px] sm:border-4 border-primary/20 rounded-3xl sm:rounded-[40px] p-6 sm:p-10 shadow-xl sm:shadow-2xl w-full text-center">
              <h3 className="font-display text-2xl sm:text-4xl font-black text-primary leading-tight">{currentPair.word}</h3>
            </div>
            <div className="flex flex-col items-center opacity-10">
              <Equal className="w-10 h-10 sm:w-16 sm:h-16" />
              <MoveRight className="w-12 h-12 sm:w-20 sm:h-20" />
            </div>
          </div>

          {/* Options Side */}
          <div className="w-full md:w-2/3 grid grid-cols-2 gap-3 sm:gap-6">
            {pictureOptions.map((picture, idx) => {
              const isSelected = picture === selectedPicture;
              const isWrong = wrongSelections.has(picture);
              const isSolved = modalState === "correct" || modalState === "failed";
              const isCorrect = picture === currentPair.picture;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(picture)}
                  disabled={isSolved || isWrong}
                  className={`relative aspect-square rounded-2xl sm:rounded-[40px] border-[3px] sm:border-4 overflow-hidden transition-all p-2 sm:p-3 outline-none ${isSolved && isCorrect ? "border-green-500 bg-green-50" :
                    isSolved && isSelected && !isCorrect ? "border-red-500 bg-red-50" :
                      isWrong ? "opacity-30 grayscale cursor-not-allowed scale-95" :
                        isSelected ? "border-primary bg-primary/5 shadow-xl scale-[1.02]" : "border-border/60 bg-card hover:bg-muted/50"
                    }`}
                >
                  <img src={picture} className="w-full h-full object-contain" />
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-2xl bg-white/90 flex items-center justify-center font-black text-sm sm:text-lg shadow-sm border border-border/20">{getLetter(idx)}</div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {!modalState && (
        <div className="fixed bottom-6 left-0 right-0 p-4 flex justify-center z-20 gap-3 sm:gap-4 pointer-events-none">
          <button onClick={() => { playClick(); haptics.triggerClick(); currentIndex > 0 ? setCurrentIndex(i => i - 1) : onPrevious(); }} className="pointer-events-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" strokeWidth={3} />
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedPicture}
            className={`pointer-events-auto flex-1 max-w-[240px] sm:max-w-xs rounded-xl sm:rounded-[28px] py-4 sm:py-5 shadow-2xl transition-all flex items-center justify-center ${selectedPicture ? "gradient-hero text-white" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
          >
            <Check className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={3} />
          </button>
        </div>
      )}

      {modalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border-[3px] sm:border-4 border-border p-8 sm:p-10 rounded-[32px] sm:rounded-[48px] w-full max-w-sm flex flex-col items-center gap-6 sm:gap-8 shadow-2xl text-center"
          >
            <div className={`p-6 sm:p-8 rounded-full ${modalState === "correct" ? "bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]"} text-white`}>
              {modalState === "correct" ? <Check className="w-10 h-10 sm:w-16 sm:h-16" strokeWidth={3} /> : <X className="w-10 h-10 sm:w-16 sm:h-16" strokeWidth={3} />}
            </div>

            <button onClick={() => { playClick(); haptics.triggerClick(); modalState === "try_again" ? setModalState(null) : handleNext(); }} className="w-full py-5 sm:py-6 rounded-2xl sm:rounded-[32px] gradient-hero text-white font-black shadow-2xl flex items-center justify-center transition-transform active:scale-95 text-lg sm:text-xl">
              {modalState === "try_again" ? <RotateCcw className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={3} /> : <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={3} />}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AssessmentStep;
