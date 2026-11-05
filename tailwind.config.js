/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Baloo 2"', 'Fredoka', 'system-ui', 'sans-serif'],
      },
      colors: {
        tierra: '#7a4a24',
        ocre: '#e0a63a',
        cantuta: '#d6336c',
        laguna: '#2a8bbf',
        pasto: '#4f9d3a',
        crema: '#fff6e5',
      },
    },
  },
  plugins: [],
};
