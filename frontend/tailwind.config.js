/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fdf6e3",
        "cream-dark": "#f5ead0",
        ink: "#111111",
        "ink-soft": "#333333",
        punch: "#e91e8c",
        "punch-dark": "#c4176f",
        golden: "#f5c518",
        "golden-dark": "#d4a800",
        sky: "#00b4d8",
        "sky-dark": "#0096c7",
        success: "#22c55e",
        danger: "#ef4444",
        warn: "#f59e0b",
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Bebas Neue"', 'sans-serif'],
      },
      boxShadow: {
        brutal: "4px 4px 0px #111111",
        "brutal-md": "6px 6px 0px #111111",
        "brutal-lg": "8px 8px 0px #111111",
        "brutal-punch": "6px 6px 0px #e91e8c",
        "brutal-gold": "6px 6px 0px #f5c518",
        "brutal-sky": "6px 6px 0px #00b4d8",
        "brutal-inset": "inset 4px 4px 0px #111111",
      },
      animation: {
        "cursor-blink": "cursorBlink 1s step-end infinite",
        "slide-up": "slideUp 0.35s ease-out both",
        "fade-in": "fadeIn 0.4s ease-out both",
        "pop-in": "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        "log-line": "logLine 0.2s ease-out both",
        "bar-fill": "barFill 1s ease-out both",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        cursorBlink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        logLine: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        barFill: {
          "0%": { width: "0%" },
        },
      },
    },
  },
  plugins: [],
}
