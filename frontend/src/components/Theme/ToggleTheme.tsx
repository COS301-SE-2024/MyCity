import React from 'react';
import { useDarkMode } from "@/hooks/useDarkMode"; // assuming you created a custom hook

export default function ThemeToggle() {
    const [theme, toggleTheme] = useDarkMode(); // destructure the returned values
  
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded bg-gray-200 dark:bg-gray-800"
      >
        {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
    );
  }