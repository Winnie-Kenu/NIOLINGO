import { motion, AnimatePresence } from "framer-motion";

interface MascotProps {
    type?: "happy" | "thinking" | "sad" | "cheering" | "surprised";
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    animate?: boolean;
}

const Mascot = ({ type = "happy", size = "md", className = "", animate = true }: MascotProps) => {
    const sizes = {
        sm: "h-12 w-12",
        md: "h-24 w-24",
        lg: "h-40 w-40",
        xl: "h-56 w-56",
    };

    const getFacialExpression = () => {
        switch (type) {
            case "thinking":
                return (
                    <g transform="translate(15, 30)">
                        {/* Large expressive eyes */}
                        <circle cx="10" cy="10" r="4" fill="#1A1A1A" />
                        <circle cx="25" cy="10" r="4" fill="#1A1A1A" />
                        <path d="M 12 25 Q 17.5 20 23 25" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <path d="M 8 5 Q 11 2 14 5" stroke="#1A1A1A" strokeWidth="2" fill="none" />
                        <path d="M 21 5 Q 24 2 27 5" stroke="#1A1A1A" strokeWidth="2" fill="none" />
                    </g>
                );
            case "cheering":
                return (
                    <g transform="translate(15, 30)">
                        <path d="M 6 12 Q 10 5 14 12" stroke="#1A1A1A" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d="M 21 12 Q 25 5 29 12" stroke="#1A1A1A" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d="M 10 22 Q 17.5 35 25 22" fill="#E11D48" />
                        <circle cx="5" cy="18" r="3" fill="#FDA4AF" opacity="0.6" />
                        <circle cx="30" cy="18" r="3" fill="#FDA4AF" opacity="0.6" />
                    </g>
                );
            case "sad":
                return (
                    <g transform="translate(15, 30)">
                        <circle cx="10" cy="12" r="4" fill="#1A1A1A" />
                        <circle cx="25" cy="12" r="4" fill="#1A1A1A" />
                        <path d="M 12 28 Q 17.5 20 23 28" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        {/* Tear */}
                        <circle cx="8" cy="18" r="2" fill="#38BDF8" />
                    </g>
                );
            default: // happy
                return (
                    <g transform="translate(15, 30)">
                        <circle cx="10" cy="10" r="4" fill="#1A1A1A" />
                        <circle cx="25" cy="10" r="4" fill="#1A1A1A" />
                        <path d="M 10 22 Q 17.5 32 25 22" stroke="#1A1A1A" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <circle cx="5" cy="18" r="3" fill="#FDA4AF" opacity="0.4" />
                        <circle cx="30" cy="18" r="3" fill="#FDA4AF" opacity="0.4" />
                    </g>
                );
        }
    };

    const animationProps = animate ? {
        animate: {
            y: [0, -10, 0],
            rotate: type === "cheering" ? [0, 5, -5, 0] : [0, 2, -2, 0],
            scale: type === "cheering" ? [1, 1.05, 1] : 1
        },
        transition: {
            duration: type === "cheering" ? 2 : 4,
            repeat: Infinity,
            ease: "easeInOut" as const
        }
    } : {};

    return (
        <motion.div
            className={`relative ${sizes[size]} ${className} drop-shadow-2xl`}
            {...animationProps}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Shadow for depth */}
                <ellipse cx="50" cy="92" rx="35" ry="8" fill="rgba(0,0,0,0.08)" />

                {/* Main Body - Premium Teal/Gold gradient feel */}
                <defs>
                    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#2DD4BF", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#0D9488", stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Wings */}
                <motion.path
                    d="M 15 50 Q 0 35 15 20"
                    stroke="#0D9488"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    animate={type === "cheering" ? { rotate: [0, -20, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                />
                <motion.path
                    d="M 85 50 Q 100 35 85 20"
                    stroke="#0D9488"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    animate={type === "cheering" ? { rotate: [0, 20, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                />

                {/* Body Sphere */}
                <circle cx="50" cy="50" r="40" fill="url(#bodyGrad)" stroke="#134E4A" strokeWidth="1" />

                {/* Tummy area */}
                <circle cx="50" cy="58" r="25" fill="white" opacity="0.15" />

                {/* Face */}
                <g transform="translate(17, 12)">
                    {getFacialExpression()}
                </g>

                {/* Tiny golden crown for NIO-LINGO premium feel if king type or cheering */}
                {(type === "cheering" || type === "happy") && (
                    <path d="M 40 15 L 45 5 L 50 12 L 55 5 L 60 15" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
                )}
            </svg>

            {/* Decorative Sparkles for cheering mascot */}
            {type === "cheering" && animate && (
                <AnimatePresence>
                    <motion.div
                        className="absolute -top-4 -right-4"
                        animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        <SparkleIcon className="text-yellow-400 w-8 h-8" />
                    </motion.div>
                </AnimatePresence>
            )}
        </motion.div>
    );
};

const SparkleIcon = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 0l2.5 7.5L22 10l-7.5 2.5L12 20l-2.5-7.5L2 10l7.5-2.5z" />
    </svg>
);

export default Mascot;
