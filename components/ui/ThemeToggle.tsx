"use client";

import { useTheme } from "@/context/ThemeContext";
import { BiMoon, BiSun } from "react-icons/bi";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <BiMoon className="w-5 h-5 text-white" />
      ) : (
        <BiSun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
};

export default ThemeToggle;