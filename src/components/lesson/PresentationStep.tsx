import { motion } from "framer-motion";
import { BookOpenText, Globe, ArrowLeft, ArrowRight, Flag } from "lucide-react";
import type { Presentation } from "@/data/curriculum";

interface Props {
  presentations: Presentation[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

const PresentationStep = ({ presentations, currentIndex, onNext, onPrevious }: Props) => {
  const item = presentations[currentIndex];

  return (
    <div className="relative flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center gap-8 w-full pb-32"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-secondary/10 blur-2xl rounded-3xl -z-10 group-hover:bg-secondary/20 transition-all" />
          <div className="h-56 w-56 overflow-hidden rounded-[40px] border-4 border-white shadow-2xl relative bg-card">
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

        <div className="text-center space-y-2">
          <h2 className="font-display text-4xl font-black text-primary leading-tight">
            {item.word}
          </h2>
        </div>

        <div className="w-full space-y-4">
          <div className="rounded-[32px] bg-card p-6 border-2 border-border shadow-lg relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <BookOpenText className="h-6 w-6 text-primary" />
            </div>
            <p className="font-body text-base text-foreground/90 leading-relaxed">{item.grammar}</p>
          </div>

          <div className="rounded-[32px] bg-secondary/5 p-6 border-2 border-secondary/10 shadow-lg group hover:border-secondary/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="h-6 w-6 text-secondary" />
            </div>
            <p className="font-body text-base text-foreground/90 leading-relaxed">
              {item.cultural_note}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Primary Actions (Sticky) */}
      <div className="fixed bottom-6 left-0 right-0 p-4 flex justify-center z-20 pointer-events-none gap-4">
        {/* Previous Button */}
        <div className="pointer-events-auto shadow-xl rounded-full">
          <button
            onClick={onPrevious}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-background border-2 border-border hover:bg-muted transition-colors text-muted-foreground"
          >
            <ArrowLeft className="w-8 h-8" strokeWidth={3} />
          </button>
        </div>

        <div className="w-full max-w-xs pointer-events-auto shadow-2xl rounded-2xl">
          <button
            onClick={onNext}
            className="w-full flex items-center justify-center rounded-2xl px-6 py-5 gradient-hero text-white shadow-lg transition-transform active:scale-95 text-xl font-black gap-3"
          >
            {currentIndex < presentations.length - 1 ? (
              <ArrowRight className="w-10 h-10" strokeWidth={3} />
            ) : (
              <Flag className="w-10 h-10" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationStep;
