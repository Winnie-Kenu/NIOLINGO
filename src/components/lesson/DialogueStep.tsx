import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ArrowRight, ArrowLeft, Flag } from "lucide-react";
import type { Dialogue } from "@/data/curriculum";
import useSound from "use-sound";
import { useHaptics } from "@/hooks/useHaptics";

interface Props {
  dialogues: Dialogue[];
  onNext: () => void;
  onPrevious: () => void;
}

const DialogueStep = ({ dialogues, onNext, onPrevious }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentDialogue = dialogues[currentIndex];
  const isLast = currentIndex === dialogues.length - 1;
  const haptics = useHaptics();

  const [playClick] = useSound("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", { volume: 0.3 });
  const [playNext] = useSound("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3", { volume: 0.4 });

  const handleNext = () => {
    playNext();
    haptics.triggerClick();
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    playClick();
    haptics.triggerClick();
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      onPrevious();
    }
  };

  const img1 = currentDialogue.picture_context[0];
  const img2 = currentDialogue.picture_context[1];
  const isSameImage = img1 === img2;

  return (
    <div className="relative flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col gap-8 pb-32"
        >
          {/* Visual Context */}
          <div className="w-full">
            {isSameImage ? (
              <div className="relative w-full aspect-[4/3] rounded-[40px] overflow-hidden border-4 border-primary/10 shadow-2xl">
                <img
                  src={img1}
                  alt="Context"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 aspect-[16/9]">
                <div className="relative rounded-3xl overflow-hidden border-4 border-primary/10 shadow-xl">
                  <img
                    src={img1}
                    alt="Speaker 1 context"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative rounded-3xl overflow-hidden border-4 border-secondary/10 shadow-xl">
                  <img
                    src={img2}
                    alt="Speaker 2 context"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dialogue Bubbles */}
          <div className="flex flex-col gap-8 w-full">
            {/* Speaker 1 */}
            <div className="flex flex-col items-start gap-2 mr-12">
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="rounded-[32px] rounded-tl-sm bg-primary px-6 py-6 shadow-xl w-full relative border-b-4 border-primary-foreground/20">
                <p className="font-display text-2xl font-black text-white leading-tight">
                  {currentDialogue.speaker1}
                </p>
              </div>
            </div>

            {/* Speaker 2 */}
            <div className="flex flex-col items-end gap-2 ml-12">
              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="rounded-[32px] rounded-tr-sm bg-muted px-6 py-6 shadow-xl w-full relative border-b-4 border-muted-foreground/10">
                <p className="font-display text-2xl font-black text-foreground leading-tight text-right">
                  {currentDialogue.speaker2}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Primary Actions (Sticky) */}
      <div className="fixed bottom-6 left-0 right-0 p-4 flex justify-center z-20 pointer-events-none gap-4">
        <div className="pointer-events-auto shadow-xl rounded-full">
          <button
            onClick={handlePrevious}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-background border-2 border-border hover:bg-muted transition-colors text-muted-foreground"
          >
            <ArrowLeft className="w-8 h-8" strokeWidth={3} />
          </button>
        </div>

        <div className="w-full max-w-xs pointer-events-auto shadow-2xl rounded-2xl">
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-3 rounded-2xl px-6 py-5 shadow-lg transition-transform active:scale-95 text-xl font-black text-white gradient-hero"
          >
            {isLast ? (
              <Flag className="w-10 h-10" strokeWidth={3} />
            ) : (
              <ArrowRight className="w-10 h-10" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogueStep;
