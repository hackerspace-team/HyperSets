import type { Config } from "tailwindcss"
const { fontFamily } = require("tailwindcss/defaultTheme")
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "rainbow-cycle": {
          from: { color: "#6666ff" },
          '10%': { color: "#0099ff" },
          '50%': { color: "#00ff00" },
          '75%': { color: "#ff3399" },
          '100%': { color: "#6666ff" },
        },
        "rainbow-animation": {
          '10%': { backgroundPosition: "0% 0%" },
          '50%': { backgroundPosition: "100% 0%" },
          '100%': { backgroundPosition: "0% 0%" },
        },
        "move": {
          to: { backgroundPosition: "4500vh" }
        },
        "rgb-ring": {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "400% 0%" },
          "100%": { backgroundPosition: "0% 0%" }
        },
        "swipe": {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        }
      },
      animation: {
        aurora: "aurora 60s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "rainbow-cycle": "rainbow-cycle 6s linear 0s infinite",
        "rainbow-animation": "rainbow-animation 1s ease-in-out infinite",
        "move": "move 1500s linear infinite",
        "rgb-ring": "rgb-ring 2000s linear infinite",
        "swipe": "swipe 2s ease-in infinite",
        "spin": "spin 2.5s linear infinite",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      }
    },
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors],
} satisfies Config

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}

export default config