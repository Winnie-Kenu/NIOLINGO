import { Zap, Trophy } from "lucide-react";
import { useGameStore } from "@/stores/useGameStore";
import { Link } from "react-router-dom";
import useSound from "use-sound";
import { useHaptics } from "@/hooks/useHaptics";

const Header = () => {
  const { xp, streak } = useGameStore();
  const haptics = useHaptics();
  const [playClick] = useSound("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", { volume: 0.2 });

  const handleLogoClick = () => {
    playClick();
    haptics.triggerClick();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-card/85 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform duration-300 overflow-hidden p-1.5 border border-primary/5">
            <img
              src="/Nio-favicon.png"
              alt="NIOLINGO Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-display text-2xl font-black tracking-tight text-primary">
            NIOLINGO
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-accent/10 px-4 py-2 border border-accent/20 shadow-sm transition-transform hover:scale-105">
            <Zap className="h-5 w-5 text-accent fill-accent animate-bounce-slow" />
            <span className="font-display text-base font-bold text-accent">
              {streak}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-secondary/10 px-4 py-2 border border-secondary/20 shadow-sm transition-transform hover:scale-105">
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
