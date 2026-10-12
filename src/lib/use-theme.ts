import { useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "sg-theme";
const ORDER: Theme[] = ["light", "dark"];

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as Theme | null);
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "glass", "light-glass", "glassmorphism");
    root.classList.add(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const cycle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return { theme, setTheme, cycle, toggle };
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
