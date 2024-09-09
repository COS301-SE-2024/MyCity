import React from "react";
import { useDarkMode } from "@/hooks/useDarkMode"; // assuming you created a custom hook

export default function ThemeToggle() {
  const [theme, toggleTheme] = useDarkMode(); // destructure the returned values

  return (
    <div
      className="relative w-12 h-6 rounded-full dark:bg-green-400 bg-gray-400"
      onClick={toggleTheme}
    >
      <div className="absolute w-6 h-6 bg-white rounded-full transition-transform shadow-md transform dark:translate-x-6 translate-x-0"></div>
    </div>
  );
}
