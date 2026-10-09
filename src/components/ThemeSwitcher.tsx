"use client";

import { useState, useEffect } from "react";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("ronin-theme") as "dark" | "light";
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("light", saved === "light");
      // Apply background image for light theme
      if (saved === "light") {
        document.body.style.backgroundImage = "url('/РОНИН фон.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundAttachment = "fixed";
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("ronin-theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
    
    // Change background for light/dark theme
    if (newTheme === "light") {
      document.body.style.backgroundImage = "url('/РОНИН фон.png')";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.backgroundImage = "none";
    }
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
