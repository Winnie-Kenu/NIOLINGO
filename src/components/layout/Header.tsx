import { Zap, Trophy, Sparkles } from "lucide-react";
import { useGameStore } from "@/stores/useGameStore";
import { Link } from "react-router-dom";

const Header = () => {
  const { xp, streak } = useGameStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-card/85 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="h-6 w-6 text-white animate-pulse" />
          </div>
          <span className="font-display text-2xl font-black tracking-tight text-primary">
            NIOLINGO
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-accent/10 px-4 py-2 border border-accent/20 shadow-sm">
            <Zap className="h-5 w-5 text-accent fill-accent animate-bounce-slow" />
            <span className="font-display text-base font-bold text-accent">
              {streak}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-secondary/10 px-4 py-2 border border-secondary/20 shadow-sm">
            <Trophy className="h-5 w-5 text-secondary fill-secondary" />
            <span className="font-display text-base font-bold text-secondary">
              {xp}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
