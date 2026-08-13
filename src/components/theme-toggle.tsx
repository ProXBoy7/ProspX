import { useTheme } from "../lib/use-theme";

export function ThemeToggle() {
  const { theme, cycle } = useTheme();
  const icon =
    theme === "dark"
      ? "dark_mode"
      : theme === "glass"
      ? "auto_awesome"
      : theme === "glassmorphism"
      ? "blur_on"
      : theme === "light-glass"
      ? "blur_on"
      : "light_mode";
  const label =
    theme === "light"
      ? "Light theme"
      : theme === "dark"
      ? "Dark theme"
      : theme === "glass"
      ? "Glass theme"
      : theme === "glassmorphism"
      ? "Glassmorphism theme"
      : "Light Glass theme";

  return (
    <button
      onClick={cycle}
      aria-label={`Theme: ${label}. Click to switch.`}
      title={label}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card/60 text-foreground hover:bg-card transition"
    >
      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
        {icon}
      </span>
    </button>
  );
}
