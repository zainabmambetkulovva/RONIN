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
        // RONIN brand colors - Dark Theme
        ronin: {
          black: "#000000",
          dark: "#0a0a1e",
          navy: "#0d0d24",
          purple: "#1a0a2e",
          "purple-mid": "#2d1b69",
          "purple-light": "#6b21a8",
          neon: "#8B5CF6",
          "neon-bright": "#A855F7",
          "neon-glow": "#C084FC",
          blue: "#1e40af",
          "blue-neon": "#3B82F6",
          "blue-light": "#60A5FA",
          cyan: "#06b6d4",
        },
        // RONIN 2026 — Premium Futuristic Gaming (новый дизайн)
        rn: {
          void: "#05040b",       // фон страницы
          night: "#0b0818",      // фон секций
          surface: "#130d26",    // карточки
          "surface-2": "#1b1336",
          line: "#2a1f4d",       // границы
          violet: "#8b5cf6",
          purple: "#a855f7",
          magenta: "#d946ef",
          pink: "#ff3d9a",
          electric: "#3b6bff",
          cyan: "#22d3ee",
          muted: "#a29cbd",      // вторичный текст
        },
        // Light Theme Colors (минимализм)
        light: {
          base: "#FFFFFF",
          surface: "#F9FAFB",
          "surface-2": "#F3F4F6",
          border: "#E5E7EB",
          text: "#111827",
          "text-secondary": "#374151",
          "text-muted": "#6B7280",
          accent: "#7C3AED",
          "accent-blue": "#2563EB",
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
      fontFamily: {
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "ronin-gradient": "linear-gradient(135deg, #000000 0%, #0a0a1e 50%, #1a0a2e 100%)",
        "ronin-gradient-blue": "linear-gradient(135deg, #0d0d24 0%, #1a0a2e 100%)",
        "neon-glow": "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(26,10,46,0.8) 0%, rgba(13,13,36,0.8) 100%)",
        // Light theme gradients
        "light-gradient": "linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)",
        "light-surface": "linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.2)",
        "neon-blue": "0 0 20px rgba(59,130,246,0.4), 0 0 40px rgba(59,130,246,0.2)",
        "neon-cyan": "0 0 20px rgba(6,182,212,0.4)",
        card: "0 4px 24px rgba(0,0,0,0.6)",
        // Light theme shadows
        "light-card": "0 4px 24px rgba(139,92,246,0.1), 0 2px 8px rgba(0,0,0,0.05)",
        "light-hover": "0 8px 32px rgba(139,92,246,0.15), 0 4px 12px rgba(0,0,0,0.08)",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "rn-drift": "rn-drift 18s ease-in-out infinite alternate",
        "rn-pulse": "rn-pulse 3s ease-in-out infinite",
        "rn-scan": "rn-scan 6s linear infinite",
        "rn-float": "rn-float 7s ease-in-out infinite",
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
        "rn-drift": {
          "0%": { transform: "translate3d(-4%, -2%, 0) scale(1)" },
          "100%": { transform: "translate3d(4%, 3%, 0) scale(1.08)" },
        },
        "rn-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "rn-scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "rn-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
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
