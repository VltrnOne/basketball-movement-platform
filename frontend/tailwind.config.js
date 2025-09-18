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
          orange: '#FF7A00',
          dark: '#1a202c', // A dark blue/grey for backgrounds
        },
        success: '#10B981', // Green
        warning: '#F59E0B', // Amber
        danger: '#EF4444',  // Red
        basketball: {
          orange: '#FF7A00', // Updated to match brand
          brown: '#8B4513',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
