"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" && "bg-blue-600 hover:bg-blue-700 text-white",
          variant === "secondary" && "bg-purple-600 hover:bg-purple-700 text-white",
          variant === "outline" && cn(
            "border-2 bg-transparent",
            isDark 
              ? "border-white/20 hover:border-white/40 text-white" 
              : "border-gray-300 hover:border-gray-400 text-gray-800"
          ),
          variant === "ghost" && cn(
            isDark 
              ? "hover:bg-white/10 text-white bg-transparent" 
              : "hover:bg-gray-100 text-gray-800 bg-transparent"
          ),
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-3 text-base",
          size === "lg" && "px-8 py-4 text-lg",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };