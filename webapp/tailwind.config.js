/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')
// import colors from 'tailwindcss/colors'

module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      // gray: colors.gray,
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#101720',
        950: '#030712',
      },
      green: colors.green,
      red: colors.red,
      blue: colors.blue,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      orange: colors.orange,
      violet: colors.violet,
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateRows: {

        // Complex site-specific row configuration
        'layout': '60px 1fr',
      },
      gridTemplateColumns: {
        // Simple 8 column grid
        'layout': '270px 1fr',
      },
      keyframes: {
        fadeInTop: {
          '0%': { opacity: '0', transform: 'translatey(-10px)' },
          '100%': { opacity: '1', transform: 'translatey(0px)' },
        },
        fadeOutBottom: {
          '0%': { opacity: '1', transform: 'translatey(0px)' },
          '100%': { opacity: '0', transform: 'translatey(10px)' },
        },
      },
      animation: {
        fadeIn: 'fadeInTop .2s ease-in',
        fadeOut: 'fadeOutBottom .2s ease-in-out',
      },
    },
  },
  plugins: [],
};
