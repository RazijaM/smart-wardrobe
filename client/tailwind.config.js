/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        dusty: {
          50: '#FDF6F6',
          100: '#FAEDED',
          200: '#F5E0E0',
          300: '#E8C9C9',
          400: '#D9AFAF',
          500: '#C9A0A0',
          600: '#B88787',
          700: '#A07070',
          800: '#8B5E5E',
          900: '#6B4848',
        },
        'dusty-pink': '#C9A0A0',
        'dusty-pink-light': '#E8C9C9',
        'dusty-pink-soft': '#F5E0E0',
        'dusty-neutral': '#8B8682',
      },
      borderRadius: {
        'soft': '12px',
        'btn': '10px',
      },
    },
  },
  plugins: [],
}