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
  plugins: [],
}
