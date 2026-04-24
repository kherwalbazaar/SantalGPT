/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earthyGreen: '#2D5A27',
        terracotta: '#C05A2E',
        cream: '#F0F9F1',
      },
      fontFamily: {
        olChiki: ['"Noto Sans Ol Chiki"', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
