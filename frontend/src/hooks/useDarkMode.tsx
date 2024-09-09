import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === "dark" ? "light" : "dark");
    root.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  console.log("Theme" + theme);
  // Return as a tuple (array) so it can be destructured
  return [theme, toggleTheme] as const;
}
