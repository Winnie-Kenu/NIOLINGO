import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, HelpCircle, RotateCcw, X, Type } from "lucide-react";
import type { FillInGap } from "@/data/curriculum";
import { useHaptics } from "@/hooks/useHaptics";
import useSound from "use-sound";

interface Props {
    fillInGaps: FillInGap[];
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

const FillInGapStep = ({ fillInGaps, onComplete, onPrevious }: Props) => {
    const haptics = useHaptics();
    const [playSuccess] = useSound("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3", { volume: 0.5 });
    const [playError] = useSound("https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3", { volume: 0.4 });
    const [playClick] = useSound("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", { volume: 0.3 });

    const learningQueue = useMemo(() => {
        const repeated = [...fillInGaps, ...fillInGaps];
        return shuffleNoConsecutive(repeated, (e) => e.sentence);
    }, [fillInGaps]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [modalState, setModalState] = useState<ModalState>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [wrongSelections, setWrongSelections] = useState<Set<string>>(new Set());

    const currentExercise = learningQueue[currentIndex];

    useEffect(() => {
        setSelectedOption(null);
        setModalState(null);
        setAttempts(0);
        setWrongSelections(new Set());
    }, [currentIndex]);

    const handleSelect = (option: string) => {
        if (modalState === "correct" || modalState === "failed") return;
        if (wrongSelections.has(option)) return;
        playClick();
        haptics.triggerClick();
        setSelectedOption(option);
    };

    const handleConfirm = () => {
        if (!selectedOption || modalState === "correct" || modalState === "failed") return;

        if (selectedOption === currentExercise.answer) {
            playSuccess();
            haptics.triggerSuccess();
            setModalState("correct");
            setCorrectCount((c) => c + (attempts === 0 ? 1 : 0.5));
        } else {
            playError();
            haptics.triggerError();
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            const newWrong = new Set(wrongSelections);
            newWrong.add(selectedOption);
            setWrongSelections(newWrong);
            setModalState(newAttempts >= 3 ? "failed" : "try_again");
        }
    };

    const handleRetry = () => {
        playClick();
        haptics.triggerClick();
        setModalState(null);
        setSelectedOption(null);
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

    const renderSentence = () => {
        const parts = currentExercise.sentence.split("___");
        return (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-display text-2xl sm:text-4xl font-black text-center">
                <span>{parts[0]}</span>
                <div className={`min-w-[100px] sm:min-w-[140px] px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border-b-4 sm:border-b-8 transition-all ${selectedOption
                    ? "border-primary text-primary bg-primary/5 scale-105"
                    : "border-muted-foreground/30 text-transparent bg-muted/20"
                    }`}>
                    {selectedOption || "____"}
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
                            <Type className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
                        </div>
                        {renderSentence()}
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                        {currentExercise.options.map((option) => {
                            const isWrong = wrongSelections.has(option);
                            const isSelected = option === selectedOption;
                            const isSolved = modalState === "correct" || modalState === "failed";
                            const isCorrectAnswer = option === currentExercise.answer;

                            return (
                                <button
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    disabled={isSolved || isWrong}
                                    className={`relative flex items-center justify-center rounded-2xl sm:rounded-[32px] border-[3px] sm:border-4 px-6 py-5 sm:py-8 transition-all outline-none group ${isSolved && isCorrectAnswer ? "border-green-500 bg-green-50 shadow-inner" :
                                        isSolved && isSelected && !isCorrectAnswer ? "border-red-500 bg-red-50 shadow-inner" :
                                            isWrong ? "opacity-30 cursor-not-allowed grayscale scale-95" :
                                                isSelected ? "border-primary bg-primary/5 shadow-2xl scale-[1.05]" : "border-border/60 bg-card hover:bg-muted/50 hover:border-primary/40"
                                        }`}
                                >
                                    <span className={`font-display text-xl sm:text-3xl font-black ${isSelected ? "text-primary" : "text-foreground"
                                        }`}>
                                        {option}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {!modalState && (
                <div className="fixed bottom-6 left-0 right-0 p-4 flex justify-center z-20 gap-4 pointer-events-none">
                    <button onClick={handlePrevious} className="pointer-events-auto w-16 h-16 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-xl hover:bg-muted transition-colors">
                        <ArrowLeft className="w-8 h-8 text-muted-foreground" strokeWidth={3} />
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedOption}
                        className={`pointer-events-auto flex-1 max-w-xs flex items-center justify-center rounded-3xl py-5 shadow-2xl transition-all ${selectedOption ? "gradient-hero text-white" : "bg-muted text-muted-foreground cursor-not-allowed"
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

                        <button onClick={modalState === "try_again" ? handleRetry : handleNext} className="w-full py-6 rounded-[32px] gradient-hero text-white shadow-2xl flex items-center justify-center transition-transform active:scale-95">
                            {modalState === "try_again" ? <RotateCcw className="w-10 h-10" strokeWidth={3} /> : <ArrowRight className="w-10 h-10" strokeWidth={3} />}
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default FillInGapStep;
