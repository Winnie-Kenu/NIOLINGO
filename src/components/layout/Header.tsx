import { Flame, Star, BookOpen } from "lucide-react";
import { useGameStore } from "@/stores/useGameStore";
import { Link } from "react-router-dom";

const Header = () => {
  const { xp, streak } = useGameStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-hero">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-primary">
            NIOLINGO
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
            <Flame className="h-4 w-4 text-accent" />
            <span className="font-display text-sm font-semibold text-foreground">
              {streak}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
            <Star className="h-4 w-4 text-secondary" />
            <span className="font-display text-sm font-semibold text-foreground">
              {xp} XP
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
