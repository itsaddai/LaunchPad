// components/DarkModeToggle.jsx
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react"; // or any icon lib

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() =>
    // start with saved preference OR system preference
    localStorage.theme ?
      localStorage.theme === "dark" :
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Apply class & persist preference
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      root.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label="Toggle dark mode"
      className="fixed bottom-4 right-4 p-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] shadow"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
