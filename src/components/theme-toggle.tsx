"use client"

import { useEffect, useState, useRef } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Initialize on mount
  useEffect(() => {
    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isMenuOpen) return

      switch (event.key) {
        case "Escape":
          setIsMenuOpen(false)
          buttonRef.current?.focus()
          break
        case "Tab":
          if (!menuRef.current?.contains(document.activeElement)) {
            setIsMenuOpen(false)
          }
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMenuOpen])

  // Apply theme
  const applyTheme = (theme: "light" | "dark" | "system") => {
    const root = document.documentElement

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.remove("light", "dark")
      root.classList.add(systemTheme)
      setIsDark(systemTheme === "dark")
    } else {
      root.classList.remove("light", "dark")
      root.classList.add(theme)
      setIsDark(theme === "dark")
    }

    localStorage.setItem("theme", theme)
    setIsMenuOpen(false) // Close menu after selection
    buttonRef.current?.focus() // Return focus to button
  }

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="outline"
        size="icon"
        onClick={toggleMenu}
        aria-label="Select theme"
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        {isDark ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
        <span className="sr-only">Select theme</span>
      </Button>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-popover border border-border z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="theme-options-menu"
        >
          <div className="py-1" role="none">
            <button
              onClick={() => applyTheme("light")}
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground"
              role="menuitem"
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </button>
            <button
              onClick={() => applyTheme("dark")}
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground"
              role="menuitem"
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => applyTheme("system")}
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground"
              role="menuitem"
            >
              <svg
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span>System</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

