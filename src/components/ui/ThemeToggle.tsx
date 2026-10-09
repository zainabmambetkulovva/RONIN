"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("light", savedTheme === "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  return (
    <label className="cosmic-toggle">
      <input
        className="toggle"
        type="checkbox"
        checked={theme === "light"}
        onChange={toggleTheme}
      />
      <div className="slider">
        <div className="cosmos"></div>
        <div className="energy-line"></div>
        <div className="energy-line"></div>
        <div className="energy-line"></div>
        <div className="toggle-orb">
          <div className="inner-orb"></div>
          <div className="ring"></div>
        </div>
        <div className="particles">
          <div style={{ "--angle": "30deg" } as React.CSSProperties} className="particle"></div>
          <div style={{ "--angle": "60deg" } as React.CSSProperties} className="particle"></div>
          <div style={{ "--angle": "90deg" } as React.CSSProperties} className="particle"></div>
          <div style={{ "--angle": "120deg" } as React.CSSProperties} className="particle"></div>
          <div style={{ "--angle": "150deg" } as React.CSSProperties} className="particle"></div>
          <div style={{ "--angle": "180deg" } as React.CSSProperties} className="particle"></div>
        </div>
      </div>
    </label>
  );
}
