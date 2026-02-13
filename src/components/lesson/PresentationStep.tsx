import { motion } from "framer-motion";
import type { Presentation } from "@/data/curriculum";

interface Props {
  presentations: Presentation[];
  currentIndex: number;
  onNext: () => void;
}

const PresentationStep = ({ presentations, currentIndex, onNext }: Props) => {
  const item = presentations[currentIndex];

  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center gap-6 px-4"
    >
      <div className="relative">
        <div className="h-48 w-48 overflow-hidden rounded-2xl border-4 border-secondary shadow-elevated">
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
        <div className="rounded-xl bg-muted p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Grammar
          </p>
          <p className="font-body text-sm text-foreground">{item.grammar}</p>
        </div>
        <div className="rounded-xl bg-secondary/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground/60 mb-1">
            Cultural Note
          </p>
          <p className="font-body text-sm text-foreground">
            {item.cultural_note}
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-4 w-full max-w-sm rounded-xl gradient-hero px-6 py-3.5 font-display text-lg font-semibold text-primary-foreground shadow-card transition-transform active:scale-95"
      >
        Continue
      </button>
    </motion.div>
  );
};

export default PresentationStep;
