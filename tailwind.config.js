import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003D73',
          dark: '#00274B',
          light: '#0A569C',
          50: '#EBF4FF',
          100: '#D6E8FF',
          600: '#003D73',
          700: '#002F59',
          800: '#002240',
          900: '#00162B',
        },
        navy: {
          DEFAULT: '#003D73',
          dark: '#00274B',
          light: '#0A569C',
        },
        actionRed: {
          DEFAULT: '#DE111E',
          hover: '#C20E1A',
          light: '#FF3342',
        },
        secondary: {
          DEFAULT: '#DE111E',
          hover: '#C20E1A',
        },
        surface: '#F8FAFC',
        canvas: '#F8FAFC',
        charcoal: '#0F172A',
        darkCharcoal: '#0F172A',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        shopTheme: {
          "primary": "#003D73",
          "secondary": "#DE111E",
          "accent": "#DE111E",
          "neutral": "#0F172A",
          "base-100": "#FFFFFF",
          "base-200": "#F8FAFC",
          "base-300": "#E2E8F0",
          "info": "#003D73",
          "success": "#16a34a",
          "warning": "#f59e0b",
          "error": "#DE111E",
        },
      },
      "light",
    ],
  },
}
