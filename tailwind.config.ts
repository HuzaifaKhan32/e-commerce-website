
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#C9A96E", // Champagne Gold
        secondary: "#3E2723", // Rich Espresso Brown
        ivory: "#FAF7F2", // Warm Ivory
        taupe: "#D4C5B9", // Soft Taupe
        grey: "#4A4A4A",
        "background-light": "#FAF7F2",
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "serif": ["Playfair Display", "serif"],
      },
      animation: {
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'fade-in-up': 'fadeInUp 1s ease-out 0.3s forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
