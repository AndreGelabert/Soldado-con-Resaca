/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './Soldado con resaca Web.html',
    './main.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#39FF14',
        secondary: '#1a1a1a',
        'accent-blue': '#111111',
        'background-light': '#ffffff',
        'background-dark': '#000000',
        'surface-dark': '#121212',
        'surface-light': '#f8f9fa'
      },
      fontFamily: {
        display: ['Staatliches', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.5rem'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries')
  ]
};
