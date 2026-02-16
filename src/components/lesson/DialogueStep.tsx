import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, User, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Dialogue } from "@/data/curriculum";

interface Props {
  dialogues: Dialogue[];
  onNext: () => void;
}

const DialogueStep = ({ dialogues, onNext }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentDialogue = dialogues[currentIndex];
  const isLast = currentIndex === dialogues.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
    } else {
      onNext();
    }
  };

  const img1 = currentDialogue.picture_context[0];
  const img2 = currentDialogue.picture_context[1];
  const isSameImage = img1 === img2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 px-4 w-full max-w-lg mx-auto"
    >
      {/* Header & Progress */}
      <div className="flex flex-col items-center gap-2">
        <div className="p-3 bg-primary/10 rounded-full">
          <MessageSquare className="w-8 h-8 text-primary fill-primary/20" />
        </div>
        <div className="flex gap-2 mt-1">
          {dialogues.map((_, i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === currentIndex
                  ? "bg-primary w-8 shadow-sm"
                  : i < currentIndex
                    ? "bg-primary/40 w-2.5"
                    : "bg-muted w-2.5"
                }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col gap-6"
        >
          {/* Visual Context - Big & Bold */}
          <div className="w-full">
            {isSameImage ? (
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-4 border-primary/20 shadow-xl">
                <img
                  src={img1}
                  alt="Context"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 aspect-[16/9]">
                <div className="relative rounded-2xl overflow-hidden border-3 border-primary/20 shadow-lg">
                  <img
                    src={img1}
                    alt="Speaker 1 context"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden border-3 border-secondary/20 shadow-lg">
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
          <div className="flex flex-col gap-6 w-full">
            {/* Speaker 1 */}
            <div className="flex flex-col items-start gap-2 mr-8">
              <div className="flex items-center gap-2 ml-1">
                <div className="p-1.5 bg-primary/10 rounded-full">
                  <User className="w-4 h-4 text-primary fill-primary/30" />
                </div>
              </div>
              <div className="rounded-3xl rounded-tl-sm bg-primary px-6 py-5 shadow-lg w-full relative group">
                <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-primary rotate-45" />
                <p className="font-display text-2xl font-bold text-primary-foreground leading-snug">
                  {currentDialogue.speaker1}
                </p>
              </div>
            </div>

            {/* Speaker 2 */}
            <div className="flex flex-col items-end gap-2 ml-8">
              <div className="flex items-center gap-2 mr-1">
                <div className="p-1.5 bg-muted rounded-full">
                  <User className="w-4 h-4 text-muted-foreground fill-muted-foreground/30" />
                </div>
              </div>
              <div className="rounded-3xl rounded-tr-sm bg-muted px-6 py-5 shadow-lg w-full relative">
                <div className="absolute -right-1.5 -top-1.5 w-3 h-3 bg-muted rotate-45" />
                <p className="font-display text-2xl font-bold text-foreground leading-snug text-right">
                  {currentDialogue.speaker2}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleNext}
        className={`mt-4 w-full flex items-center justify-center rounded-2xl px-6 py-5 shadow-lg transition-all ${isLast
            ? "gradient-gold shadow-gold/25"
            : "gradient-hero shadow-primary/25"
          }`}
      >
        {isLast ? (
          <CheckCircle2 className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
        ) : (
          <ArrowRight className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
        )}
      </motion.button>
    </motion.div>
  );
};

export default DialogueStep;
