/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earthyGreen: '#2D5A27',
        terracotta: '#C05A2E',
        cream: '#F9F7F2',
      },
      fontFamily: {
        olChiki: ['"Noto Sans Ol Chiki"', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
