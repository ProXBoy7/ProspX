import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "glass" | "light-glass" | "glassmorphism";
const KEY = "sg-theme";
const ORDER: Theme[] = ["light", "dark", "glass", "light-glass", "glassmorphism"];

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as Theme | null) ?? "light";
    setTheme(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "glass", "light-glass", "glassmorphism");
    root.classList.add(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const cycle = () => setTheme((t) => ORDER[(ORDER.indexOf(t) + 1) % ORDER.length]);
  return { theme, setTheme, cycle };
}

export function getStoredUser(): { name: string; email: string } | null {
  try {
    const raw = localStorage.getItem("sg-user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: { name: string; email: string }) {
  localStorage.setItem("sg-user", JSON.stringify(user));
}
