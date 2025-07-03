/** @type {import('tailwindcss').Config} */
export default {
    content: [
    './src/app/**/*.{html,js,jsx,ts,tsx}', // Include all JavaScript/TypeScript files in the pages directory
    './src/**/*.{html,js,jsx,ts,tsx}', // Include all JavaScript/TypeScript files in the components directory
  ],
  darkMode: 'class', // Enable dark mode support
  theme: {
    extend: {},
  },
  plugins: [],
}