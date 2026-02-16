import { motion } from "framer-motion";
import { BookOpenText, Globe, ArrowLeft, ArrowRight, Flag } from "lucide-react";
import type { Presentation } from "@/data/curriculum";
import useSound from "use-sound";
import { useHaptics } from "@/hooks/useHaptics";

interface Props {
  presentations: Presentation[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

const PresentationStep = ({ presentations, currentIndex, onNext, onPrevious }: Props) => {
  const item = presentations[currentIndex];
  const haptics = useHaptics();

  const [playClick] = useSound("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", { volume: 0.3 });
  const [playNext] = useSound("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3", { volume: 0.4 });

  const handleNextClick = () => {
    playNext();
    haptics.triggerClick();
    onNext();
  };

  const handlePreviousClick = () => {
    playClick();
    haptics.triggerClick();
    onPrevious();
  };

  return (
    <div className="relative flex flex-col items-center gap-6 sm:gap-8 w-full max-w-lg mx-auto">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center gap-6 sm:gap-8 w-full pb-32"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-secondary/10 blur-xl sm:blur-2xl rounded-3xl -z-10 group-hover:bg-secondary/20 transition-all" />
          <div className="h-44 w-44 sm:h-56 sm:w-56 overflow-hidden rounded-[32px] sm:rounded-[40px] border-[3px] sm:border-4 border-white shadow-2xl relative bg-card">
            <img
              src={item.picture}
              alt={item.word}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        </div>

        <div className="text-center space-y-1 sm:space-y-2">
          <h2 className="font-display text-3xl sm:text-4xl font-black text-primary leading-tight">
            {item.word}
          </h2>
        </div>

        <div className="w-full space-y-3 sm:space-y-4">
          <div
            className="rounded-2xl sm:rounded-[32px] bg-card p-4 sm:p-6 border-2 border-border shadow-lg relative overflow-hidden group hover:border-primary/30 transition-colors cursor-default"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 text-primary">
              <BookOpenText className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <p className="font-body text-sm sm:text-base text-foreground/90 leading-relaxed">{item.grammar}</p>
          </div>

          <div
            className="rounded-2xl sm:rounded-[32px] bg-secondary/5 p-4 sm:p-6 border-2 border-secondary/10 shadow-lg group hover:border-secondary/30 transition-colors cursor-default"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 text-secondary">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <p className="font-body text-sm sm:text-base text-foreground/90 leading-relaxed">
              {item.cultural_note}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Primary Actions (Sticky) */}
      <div className="fixed bottom-6 left-0 right-0 p-4 flex justify-center z-20 pointer-events-none gap-3 sm:gap-4">
        {/* Previous Button */}
        <div className="pointer-events-auto shadow-xl rounded-full">
          <button
            onClick={handlePreviousClick}
            className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-background border-2 border-border hover:bg-muted transition-colors text-muted-foreground"
          >
            <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={3} />
          </button>
        </div>

        <div className="w-full max-w-[240px] sm:max-w-xs pointer-events-auto shadow-2xl rounded-xl sm:rounded-2xl">
          <button
            onClick={handleNextClick}
            className="w-full flex items-center justify-center rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 gradient-hero text-white shadow-lg transition-transform active:scale-95 text-lg sm:text-xl font-black gap-2 sm:gap-3"
          >
            {currentIndex < presentations.length - 1 ? (
              <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={3} />
            ) : (
              <Flag className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationStep;
