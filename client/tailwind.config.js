/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F7F4EF',
          primary: '#191817',
          charcoal: '#2B2A27',
          taupe: '#A79A8C',
          beige: '#D8C9B8',
          cream: '#EFEBE4',
          gold: '#B69A67',
          goldHover: '#9F8454',
          white: '#FFFFFF',
          border: '#E5DFD5'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.18em',
        editorial: '0.12em',
      }
    },
  },
  plugins: [],
}
