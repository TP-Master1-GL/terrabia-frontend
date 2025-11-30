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
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce4bc',
          300: '#8fd18f',
          400: '#5cb55c',
          500: '#3a9a3a',
          600: '#2a7a2a',
          700: '#236123',
          800: '#1f4e1f',
          900: '#1a411a',
        },
        secondary: {
          50: '#fff9ed',
          100: '#fef2d6',
          200: '#fce0ad',
          300: '#f9c978',
          400: '#f7b155',
          500: '#f38c1c',
          600: '#e46c12',
          700: '#bd4c12',
          800: '#973c16',
          900: '#7a3315',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}