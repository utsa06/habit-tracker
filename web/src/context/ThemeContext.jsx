import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

const THEME_KEY = "habit_tracker_theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [isLoading, setIsLoading] = useState(true);

  // Restore theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setIsLoading(false);
  }, []);

  function applyTheme(themeName) {
    const html = document.documentElement;
    if (themeName === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }

  function toggleTheme() {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, newTheme);
      applyTheme(newTheme);
      return newTheme;
    });
  }

  const value = { theme, toggleTheme, isLoading };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
