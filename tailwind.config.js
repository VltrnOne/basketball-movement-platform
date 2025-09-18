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
          dark: '#1a202c',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        basketball: {
          orange: '#FF7A00',
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
