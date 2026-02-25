import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, RotateCcw, X, Keyboard } from "lucide-react";
import type { TypingExercise } from "@/data/curriculum";
import { useHaptics } from "@/hooks/useHaptics";
import useSound from "use-sound";

interface Props {
    exercises: TypingExercise[];
    onComplete: (score: number) => void;
    onPrevious: () => void;
}

type ModalState = "correct" | "try_again" | "failed" | null;

function shuffleNoConsecutive<T>(items: T[], keyFunc: (item: T) => string): T[] {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    for (let i = 1; i < shuffled.length; i++) {
        if (keyFunc(shuffled[i]) === keyFunc(shuffled[i - 1])) {
            for (let j = i + 1; j < shuffled.length; j++) {
                const candidate = shuffled[j];
                if (keyFunc(candidate) !== keyFunc(shuffled[i - 1])) {
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                    break;
                }
            }
        }
    }
    return shuffled;
}

const TypingStep = ({ exercises, onComplete, onPrevious }: Props) => {
    const haptics = useHaptics();
    const [playSuccess] = useSound("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3", { volume: 0.5 });
    const [playError] = useSound("https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3", { volume: 0.4 });
    const [playClick] = useSound("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", { volume: 0.3 });

    const learningQueue = useMemo(() => {
        const repeated = [...exercises, ...exercises];
        return shuffleNoConsecutive(repeated, (e) => e.sentence);
    }, [exercises]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [modalState, setModalState] = useState<ModalState>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentExercise = learningQueue[currentIndex];

    useEffect(() => {
        setUserInput("");
        setModalState(null);
        setAttempts(0);
        // Focus input on next exercise
        setTimeout(() => inputRef.current?.focus(), 100);
    }, [currentIndex]);

    const handleConfirm = () => {
        if (!userInput.trim() || modalState === "correct" || modalState === "failed") return;

        const normalizedInput = userInput.trim().toLowerCase();
        const normalizedAnswer = currentExercise.answer.toLowerCase();

        if (normalizedInput === normalizedAnswer) {
            playSuccess();
            haptics.triggerSuccess();
            setModalState("correct");
            setCorrectCount((c) => c + (attempts === 0 ? 1 : 0.5));
        } else {
            playError();
            haptics.triggerError();
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            setModalState(newAttempts >= 3 ? "failed" : "try_again");
        }
    };

    const handleRetry = () => {
        playClick();
        haptics.triggerClick();
        setModalState(null);
        setUserInput("");
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleNext = () => {
        playClick();
        haptics.triggerClick();
        if (currentIndex < learningQueue.length - 1) {
            setCurrentIndex((i) => i + 1);
        } else {
            onComplete(Math.round((correctCount / learningQueue.length) * 100));
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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && userInput.trim() && !modalState) {
            handleConfirm();
        }
    };

    const renderSentence = () => {
        const parts = currentExercise.sentence.split("___");
        return (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-display text-2xl sm:text-4xl font-black text-center">
                <span>{parts[0]}</span>
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={!!modalState}
                        placeholder=""
                        className={`min-w-[140px] sm:min-w-[200px] px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border-b-4 sm:border-b-8 transition-all bg-transparent text-center outline-none ${userInput
                            ? "border-primary text-primary bg-primary/5"
                            : "border-muted-foreground/30 text-muted-foreground/50 bg-muted/20"
                            }`}
                    />
                </div>
                <span>{parts[1]}</span>
            </div>
        );
    };

    return (
        <div className="relative flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full flex flex-col gap-10 sm:gap-14 pb-32"
                >
                    {/* Question Header */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-[40px] overflow-hidden border-4 border-primary/20 shadow-2xl">
                            <img src={currentExercise.picture} className="w-full h-full object-cover" alt="Context" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground/60 mb-2">
                            <Keyboard className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
                        </div>

                        {renderSentence()}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-4 text-muted-foreground/20 italic text-center px-6"
                    >
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {!modalState && (
                <div className="fixed bottom-6 left-0 right-0 p-4 flex justify-center z-20 gap-4 pointer-events-none">
                    <button onClick={handlePrevious} className="pointer-events-auto w-16 h-16 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-xl hover:bg-muted transition-colors">
                        <ArrowLeft className="w-8 h-8 text-muted-foreground" strokeWidth={3} />
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!userInput.trim()}
                        className={`pointer-events-auto flex-1 max-w-xs flex items-center justify-center rounded-3xl py-5 shadow-2xl transition-all ${userInput.trim() ? "gradient-hero text-white" : "bg-muted text-muted-foreground cursor-not-allowed"
                            }`}
                    >
                        <Check className="w-10 h-10" strokeWidth={3} />
                    </button>
                </div>
            )}

            {modalState && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-card border-4 border-border p-10 rounded-[48px] w-full max-w-sm flex flex-col items-center gap-10 shadow-2xl"
                    >
                        <div className={`p-8 rounded-full ${modalState === "correct" ? "bg-green-500 shadow-[0_0_40px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)]"} text-white`}>
                            {modalState === "correct" ? <Check className="w-16 h-16" strokeWidth={3} /> : <X className="w-16 h-16" strokeWidth={3} />}
                        </div>

                        {modalState === "failed" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-primary/10 rounded-2xl px-6 py-4 border-2 border-primary/20"
                            >
                                <span className="font-display text-2xl sm:text-3xl font-black text-primary">
                                    {currentExercise.answer}
                                </span>
                            </motion.div>
                        )}

                        <button onClick={modalState === "try_again" ? handleRetry : handleNext} className="w-full py-6 rounded-[32px] gradient-hero text-white shadow-2xl flex items-center justify-center transition-transform active:scale-95">
                            {modalState === "try_again" ? <RotateCcw className="w-10 h-10" strokeWidth={3} /> : <ArrowRight className="w-10 h-10" strokeWidth={3} />}
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default TypingStep;
