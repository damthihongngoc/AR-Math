/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bernoru: ['"Bernoru Expanded"', 'sans-serif'],
        alfa: ['"Alfa Slab One"', 'cursive'],
      },
      colors: {
        blueprint: {
          soft: '#e6f0ff',
          light: '#c2dcff',
          dark: '#00357a',
        },
      },
    },
  },
  plugins: [],
}
