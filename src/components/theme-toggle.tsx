import { useTheme } from "../lib/use-theme";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to Day mode" : "Switch to Night mode"}
      title={isDark ? "Switch to Day mode" : "Switch to Night mode"}
      className="relative flex items-center p-1 w-16 h-8 rounded-full border border-border/80 bg-muted/40 hover:bg-muted/70 transition-all shadow-inner group"
    >
      {/* Sliding indicator */}
      <span
        className={`absolute top-1 bottom-1 w-6 h-6 rounded-full transition-transform duration-300 ease-spring flex items-center justify-center shadow-sm ${
          isDark
            ? "translate-x-8 bg-slate-900 text-sky-400 border border-sky-400/30 shadow-sky-950/50"
            : "translate-x-0 bg-white text-amber-500 border border-amber-300/40 shadow-amber-500/20"
        }`}
      >
        {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
      </span>

      {/* Background static icons */}
      <span className="w-6 h-6 flex items-center justify-center text-amber-500/60 pointer-events-none">
        <Sun className="w-3.5 h-3.5" />
      </span>
      <span className="w-6 h-6 ml-auto flex items-center justify-center text-slate-400 pointer-events-none">
        <Moon className="w-3.5 h-3.5" />
      </span>
    </button>
  );
}
