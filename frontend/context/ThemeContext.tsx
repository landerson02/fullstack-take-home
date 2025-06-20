"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Theme =
  | "beige"
  | "pastel-blue"
  | "pastel-pink"
  | "pastel-green"
  | "bright-orange";
export type ColorMode = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "beige",
  setTheme: () => {},
  colorMode: "light",
  setColorMode: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("beige");
  const [colorMode, setColorMode] = useState<ColorMode>("light");

  useEffect(() => {
    // load theme from localstorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedColorMode = localStorage.getItem("colorMode") as ColorMode;

    if (
      savedTheme &&
      [
        "beige",
        "pastel-blue",
        "pastel-pink",
        "pastel-green",
        "bright-orange",
      ].includes(savedTheme)
    ) {
      setTheme(savedTheme);
    }

    if (savedColorMode && ["light", "dark"].includes(savedColorMode)) {
      setColorMode(savedColorMode);
    }
  }, []);

  useEffect(() => {
    // save theme and color mode to local
    localStorage.setItem("theme", theme);
    localStorage.setItem("colorMode", colorMode);
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-color-mode", colorMode);
  }, [theme, colorMode]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

