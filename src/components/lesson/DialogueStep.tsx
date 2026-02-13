import { motion } from "framer-motion";
import type { Dialogue } from "@/data/curriculum";

interface Props {
  dialogues: Dialogue[];
  onNext: () => void;
}

const DialogueStep = ({ dialogues, onNext }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 px-4"
    >
      <h2 className="font-display text-xl font-bold text-primary">
        💬
      </h2>

      <div className="w-full max-w-sm space-y-4">
        {dialogues.map((d, i) => (
          <div key={i} className="space-y-3">
            {/* Speaker 1 */}
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary">
                <img
                  src={d.picture_context[0]}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-primary px-4 py-2.5">
                <p className="font-body text-sm text-primary-foreground">
                  {d.speaker1}
                </p>
              </div>
            </div>

            {/* Speaker 2 */}
            <div className="flex items-start justify-end gap-3">
              <div className="rounded-2xl rounded-tr-sm bg-muted px-4 py-2.5">
                <p className="font-body text-sm text-foreground">
                  {d.speaker2}
                </p>
              </div>
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-secondary">
                <img
                  src={d.picture_context[1]}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="mt-4 w-full max-w-sm rounded-xl gradient-hero px-6 py-3.5 font-display text-lg font-semibold text-primary-foreground shadow-card transition-transform active:scale-95"
      >
        ▶
      </button>
    </motion.div>
  );
};

export default DialogueStep;
