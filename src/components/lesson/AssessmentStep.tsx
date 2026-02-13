import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Assessment } from "@/data/curriculum";

interface Props {
  assessment: Assessment;
  onComplete: (score: number) => void;
}

const AssessmentStep = ({ assessment, onComplete }: Props) => {
  const pairs = assessment.pairs;
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string | null>(null);

  const shuffledPictures = useMemo(
    () => [...pairs].sort(() => Math.random() - 0.5),
    [pairs]
  );

  const handleWordClick = (word: string) => {
    if (matched.has(word)) return;
    setSelectedWord(word);
    setWrongPair(null);
  };

  const handlePictureClick = (pair: (typeof pairs)[0]) => {
    if (!selectedWord || matched.has(pair.word)) return;

    if (selectedWord === pair.word) {
      const next = new Set(matched);
      next.add(pair.word);
      setMatched(next);
      setSelectedWord(null);

      if (next.size === pairs.length) {
        setTimeout(() => onComplete(100), 600);
      }
    } else {
      setWrongPair(pair.word);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedWord(null);
      }, 800);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 px-4"
    >
      <h2 className="font-display text-xl font-bold text-primary">
        Match am!
      </h2>
      <p className="text-sm text-muted-foreground">
        Touch the word, then touch the picture
      </p>

      {/* Words */}
      <div className="flex flex-wrap justify-center gap-2 w-full max-w-sm">
        {pairs.map((p) => (
          <button
            key={p.word}
            onClick={() => handleWordClick(p.word)}
            disabled={matched.has(p.word)}
            className={`rounded-xl border-2 px-3 py-2 font-display text-sm font-semibold transition-all ${
              matched.has(p.word)
                ? "border-primary/30 bg-primary/10 text-primary/50"
                : selectedWord === p.word
                ? "border-primary bg-primary/10 text-primary scale-105"
                : "border-border bg-card text-foreground hover:border-primary/50"
            }`}
          >
            {p.word}
          </button>
        ))}
      </div>

      {/* Pictures */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {shuffledPictures.map((p) => (
          <motion.button
            key={p.word}
            onClick={() => handlePictureClick(p)}
            animate={
              wrongPair === p.word
                ? { x: [0, -8, 8, -8, 0] }
                : {}
            }
            transition={{ duration: 0.4 }}
            disabled={matched.has(p.word)}
            className={`relative aspect-square overflow-hidden rounded-2xl border-3 transition-all ${
              matched.has(p.word)
                ? "border-primary opacity-50"
                : wrongPair === p.word
                ? "border-destructive"
                : "border-border hover:border-secondary"
            }`}
          >
            <img
              src={p.picture}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            {matched.has(p.word) && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                <span className="text-3xl">✅</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default AssessmentStep;
