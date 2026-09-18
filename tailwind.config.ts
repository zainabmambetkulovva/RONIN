import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // RONIN brand colors
        ronin: {
          black: "#0a0a0f",
          dark: "#0d0d1a",
          navy: "#0f0f2e",
          purple: "#1a0a3e",
          "purple-mid": "#2d1b69",
          "purple-light": "#6b21a8",
          neon: "#a855f7",
          "neon-bright": "#c084fc",
          "neon-glow": "#e879f9",
          blue: "#1e40af",
          "blue-neon": "#3b82f6",
          cyan: "#06b6d4",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "ronin-gradient": "linear-gradient(135deg, #0a0a0f 0%, #0f0f2e 50%, #1a0a3e 100%)",
        "neon-glow": "linear-gradient(135deg, #6b21a8 0%, #1e40af 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(26,10,62,0.8) 0%, rgba(15,15,46,0.8) 100%)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(168,85,247,0.4), 0 0 40px rgba(168,85,247,0.2)",
        "neon-blue": "0 0 20px rgba(59,130,246,0.4), 0 0 40px rgba(59,130,246,0.2)",
        "neon-cyan": "0 0 20px rgba(6,182,212,0.4)",
        card: "0 4px 24px rgba(0,0,0,0.6)",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(168,85,247,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(168,85,247,0.8), 0 0 80px rgba(168,85,247,0.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
