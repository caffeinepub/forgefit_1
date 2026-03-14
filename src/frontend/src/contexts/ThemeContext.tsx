import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface ThemeDefinition {
  id: string;
  name: string;
  unlockLevel: number;
  accent: string;
  secondary: string;
  description: string;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "default",
    name: "Neon Blue",
    unlockLevel: 0,
    accent: "#00d4ff",
    secondary: "#06ffd4",
    description: "Classic neon blue",
  },
  {
    id: "crimson",
    name: "Crimson Fire",
    unlockLevel: 10,
    accent: "#ff2d55",
    secondary: "#ff6b35",
    description: "Unlock at Level 10",
  },
  {
    id: "voidwalker",
    name: "Void Walker",
    unlockLevel: 25,
    accent: "#8b5cf6",
    secondary: "#a78bfa",
    description: "Unlock at Level 25",
  },
  {
    id: "solarapex",
    name: "Solar Apex",
    unlockLevel: 50,
    accent: "#fbbf24",
    secondary: "#f59e0b",
    description: "Unlock at Level 50",
  },
];

interface ThemeContextValue {
  activeTheme: string;
  setTheme: (name: string) => void;
  isThemeUnlocked: (name: string, level: number) => boolean;
  themes: ThemeDefinition[];
  currentThemeDef: ThemeDefinition;
}

const ThemeContext = createContext<ThemeContextValue>({
  activeTheme: "default",
  setTheme: () => {},
  isThemeUnlocked: () => false,
  themes: THEMES,
  currentThemeDef: THEMES[0],
});

export function ThemeProvider({
  children,
  serverTheme,
}: { children: React.ReactNode; serverTheme?: string }) {
  const [activeTheme, setActiveTheme] = useState<string>(() => {
    return localStorage.getItem("forgefit-theme") || serverTheme || "default";
  });

  const applyTheme = useCallback((name: string) => {
    const def = THEMES.find((t) => t.id === name) || THEMES[0];
    document.documentElement.style.setProperty("--theme-accent", def.accent);
    document.documentElement.style.setProperty(
      "--theme-secondary",
      def.secondary,
    );
  }, []);

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme, applyTheme]);

  // Sync with server theme when it arrives
  useEffect(() => {
    if (serverTheme && serverTheme !== activeTheme) {
      setActiveTheme(serverTheme);
    }
  }, [serverTheme, activeTheme]);

  const setTheme = useCallback(
    (name: string) => {
      setActiveTheme(name);
      localStorage.setItem("forgefit-theme", name);
      applyTheme(name);
    },
    [applyTheme],
  );

  const isThemeUnlocked = useCallback((name: string, level: number) => {
    const def = THEMES.find((t) => t.id === name);
    if (!def) return false;
    return level >= def.unlockLevel;
  }, []);

  const currentThemeDef = useMemo(
    () => THEMES.find((t) => t.id === activeTheme) || THEMES[0],
    [activeTheme],
  );

  const value = useMemo(
    () => ({
      activeTheme,
      setTheme,
      isThemeUnlocked,
      themes: THEMES,
      currentThemeDef,
    }),
    [activeTheme, setTheme, isThemeUnlocked, currentThemeDef],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
