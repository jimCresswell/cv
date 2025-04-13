"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState, useRef, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/hooks/use-click-outside";

const validThemes = ["light", "dark", "system"] as const;
type Theme = (typeof validThemes)[number];
function isTheme(value: string | undefined): value is Theme {
  const stringThemes: readonly string[] = validThemes;
  return typeof value === "string" && stringThemes.includes(value);
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Use the hook to close the menu on outside click
  // Explicitly type the hook call with <HTMLElement>
  useClickOutside<HTMLElement>([buttonRef, menuRef], () => {
    setIsOpen(false);
  });

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelectTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false); // Close menu on selection
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" onKeyDown={handleKeyDown}>
      <Button
        ref={buttonRef}
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select theme"
        variant="outline"
        size="icon"
      >
        <Moon className="dark-only h-[1.2rem] w-[1.2rem]" />
        <Sun className="light-only h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Select theme</span>
      </Button>
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={buttonRef.current?.id || undefined}
          className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none z-50"
        >
          <MenuItem onClick={() => handleSelectTheme("light")} currentTheme={theme} value="light">
            Light
          </MenuItem>
          <MenuItem onClick={() => handleSelectTheme("dark")} currentTheme={theme} value="dark">
            Dark
          </MenuItem>
          <MenuItem onClick={() => handleSelectTheme("system")} currentTheme={theme} value="system">
            System
          </MenuItem>
        </div>
      )}
    </div>
  );
}

interface MenuItemProps {
  children: React.ReactNode;
  onClick: () => void;
  currentTheme?: string;
  value: Theme;
}

function MenuItem({ children, onClick, currentTheme, value }: Readonly<MenuItemProps>) {
  const isSelected = isTheme(currentTheme) && currentTheme === value;
  return (
    <button
      onClick={onClick}
      role="menuitem"
      className={`block w-full text-left px-2 py-1.5 text-sm rounded-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
        isSelected ? "bg-accent" : ""
      }`}
      aria-current={isSelected ? "true" : undefined}
    >
      {children}
    </button>
  );
}
