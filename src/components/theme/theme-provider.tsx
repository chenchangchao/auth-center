"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const THEME_STORAGE_KEY = "theme";
const SERVER_SNAPSHOT = "system:light";
const listeners = new Set<() => void>();
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  return storedTheme === "light" || storedTheme === "dark"
    ? storedTheme
    : "system";
}

function getThemeSnapshot() {
  const theme = getStoredTheme();
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  return `${theme}:${resolvedTheme}`;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function notifyThemeChange() {
  listeners.forEach((listener) => listener());
}

function subscribeTheme(listener: () => void) {
  listeners.add(listener);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => notifyThemeChange();

  media.addEventListener("change", handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

function applyTheme(theme: ResolvedTheme) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const snapshot = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerSnapshot,
  );
  const [theme, resolvedTheme] = snapshot.split(":") as [
    Theme,
    ResolvedTheme,
  ];

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    notifyThemeChange();
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return value;
}
