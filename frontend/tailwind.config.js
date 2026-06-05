// File: frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        
        primary: {
          DEFAULT: '#4338CA', // 
          light: '#6366F1', // 
          dark: '#312E81', // 
        }
      }
    },
  },
  plugins: [],
}