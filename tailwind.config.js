/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        display: ['Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f4ff', 100: '#dbe4ff', 200: '#bac8ff', 300: '#91a7ff',
          400: '#748ffc', 500: '#5c7cfa', 600: '#4c6ef5', 700: '#4263eb',
          800: '#3b5bdb', 900: '#364fc7', 950: '#1e3a8a',
        },
        surface: {
          0: '#ffffff', 50: '#f8f9fc', 100: '#f1f3f9', 200: '#e4e8f1',
          300: '#d1d7e5', 400: '#9ba5b9', 500: '#6b7692', 600: '#4a5568',
          700: '#374151', 800: '#1f2937', 900: '#111827',
        },
      },
    },
  },
  plugins: [],
};
