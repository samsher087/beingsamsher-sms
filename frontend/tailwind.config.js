/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B192C',
          royal: '#1E3E62',
          accent: '#008170',
          emerald: '#005B41',
          gold: '#FFB800',
          light: '#F8FAFC',
          card: '#FFFFFF',
          darkBg: '#080E18',
          darkCard: '#101B2B',
          darkBorder: '#1F2E45'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
