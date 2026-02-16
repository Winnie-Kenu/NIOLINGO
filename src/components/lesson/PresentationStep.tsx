import { motion } from "framer-motion";
import { BookOpenText, Globe, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Presentation } from "@/data/curriculum";

interface Props {
  presentations: Presentation[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

const PresentationStep = ({ presentations, currentIndex, onNext, onPrevious }: Props) => {
  const navigate = useNavigate();
  const item = presentations[currentIndex];

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

        {/* Progress Dots/Bar */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / presentations.length) * 100}%` }}
            />
          </div>
          <p className="text-xs font-bold text-muted-foreground">{currentIndex + 1} / {presentations.length}</p>
        </div>

        {/* Header Icon */}
        <div className="p-3 bg-primary/10 rounded-full">
          <BookOpenText className="w-6 h-6 text-primary" />
        </div>
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center gap-6 w-full pb-24"
      >
        <div className="relative">
          <div className="h-48 w-48 overflow-hidden rounded-3xl border-4 border-secondary shadow-elevated">
            <img
              src={item.picture}
              alt={item.word}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        </div>

        <h2 className="font-display text-3xl font-bold text-primary">
          {item.word}
        </h2>

        <div className="w-full max-w-sm space-y-3">
          <div className="rounded-2xl bg-muted p-4 border border-border/50 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpenText className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-body text-sm text-foreground">{item.grammar}</p>
          </div>
          <div className="rounded-2xl bg-secondary/10 p-4 border border-secondary/20 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <Globe className="h-4 w-4 text-secondary" />
            </div>
            <p className="font-body text-sm text-foreground">
              {item.cultural_note}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Primary Actions (Sticky) */}
      <div className="fixed bottom-6 left-0 right-0 p-4 flex justify-center z-20 pointer-events-none gap-4">
        {/* Previous Button */}
        {currentIndex > 0 && (
          <div className="pointer-events-auto shadow-xl rounded-full">
            <button
              onClick={onPrevious}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-background border-2 border-muted hover:bg-muted/5 transition-colors text-muted-foreground"
            >
              <ArrowLeft className="w-8 h-8" strokeWidth={3} />
            </button>
          </div>
        )}

        <div className="w-full max-w-xs pointer-events-auto shadow-2xl rounded-2xl">
          <button
            onClick={onNext}
            className="w-full flex items-center justify-center rounded-2xl px-6 py-5 gradient-hero text-primary-foreground shadow-lg transition-transform active:scale-95 text-lg font-bold"
          >
            {currentIndex < presentations.length - 1 ? (
              <ArrowRight className="w-8 h-8" strokeWidth={3} />
            ) : (
              <Flag className="w-8 h-8" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationStep;
