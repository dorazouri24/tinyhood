/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Suez One"', "Georgia", "serif"],
        sans: [
          '"Assistant"',
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        paper: {
          50: "#FDF9EE",
          100: "#FBF5E5",
          200: "#F5EBCF",
          300: "#EFDFB4",
        },
        ink: {
          900: "#1F1A14",
          800: "#2C2519",
          700: "#3D3324",
          600: "#5A4D38",
          500: "#7A6A50",
          400: "#A09078",
        },
        clay: {
          50: "#FCEFE5",
          100: "#F8E0CE",
          200: "#F0BFA0",
          300: "#E5996A",
          400: "#D67A45",
          500: "#B5532A",
          600: "#913E1F",
          700: "#6F2D14",
        },
        olive: {
          50: "#EEF2E2",
          100: "#D7E2C5",
          200: "#B6C998",
          300: "#90AB6A",
          400: "#6E8B49",
          500: "#4F6B3A",
          600: "#3B502B",
          700: "#2A391E",
        },
        rose: {
          50: "#FBE0E5",
          100: "#F6C2CD",
          200: "#EE99AB",
          300: "#E8889A",
          500: "#C95C72",
        },
        butter: {
          200: "#FAE3A6",
          300: "#F4C45A",
          400: "#E5A920",
        },
      },
      boxShadow: {
        sticker: "3px 4px 0 0 rgba(31,26,20,0.92)",
        "sticker-sm": "2px 3px 0 0 rgba(31,26,20,0.92)",
        "sticker-clay": "3px 4px 0 0 #913E1F",
        "sticker-olive": "3px 4px 0 0 #3B502B",
        soft: "0 8px 24px -12px rgba(31,26,20,0.25)",
        pressed: "inset 2px 2px 0 0 rgba(31,26,20,0.12)",
      },
      borderRadius: {
        blob: "28px 32px 30px 26px / 30px 28px 32px 26px",
      },
      letterSpacing: {
        tight2: "-0.025em",
      },
      animation: {
        "fade-in": "fadeIn 0.35s ease-out",
        "slide-up": "slideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        "tilt-in": "tiltIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "wiggle-once": "wiggle 0.6s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        tiltIn: {
          "0%": { opacity: "0", transform: "rotate(-3deg) translateY(10px)" },
          "100%": { opacity: "1", transform: "rotate(-1.5deg) translateY(0)" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(0)" },
          "25%": { transform: "rotate(-4deg)" },
          "75%": { transform: "rotate(4deg)" },
        },
      },
    },
  },
  plugins: [],
};
