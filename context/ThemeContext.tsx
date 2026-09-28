"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const STORAGE_KEY = "theme";
const THEME_CHANGE_EVENT = "theme-change";
const LIGHT_MEDIA_QUERY = "(prefers-color-scheme: light)";

const isTheme = (value: unknown): value is Theme =>
  value === "dark" || value === "light";

const readStoredTheme = (): Theme | null => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isTheme(stored) ? stored : null;
};

const getSystemTheme = (): Theme =>
  window.matchMedia(LIGHT_MEDIA_QUERY).matches ? "light" : "dark";

const getThemeSnapshot = (): Theme => readStoredTheme() ?? getSystemTheme();

const getServerThemeSnapshot = (): Theme => "dark";

const subscribeToTheme = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
};

const subscribeToHydration = () => () => {};

const getHydratedSnapshot = () => true;

const getServerHydratedSnapshot = () => false;

const writeStoredTheme = (theme: Theme) => {
  window.localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot
  );

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    document.documentElement.setAttribute("data-theme", theme);
    if (readStoredTheme() === null) {
      writeStoredTheme(theme);
    }
  }, [theme, hydrated]);

  const toggleTheme = useCallback(() => {
    writeStoredTheme(theme === "dark" ? "light" : "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
