/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#051F20',
          secondary: '#0B2B26',
        },
        surface: {
          DEFAULT: '#163832',
          hover: '#1e4840',
          border: 'rgba(142, 182, 155, 0.15)',
        },
        accent: {
          primary: '#235347',
          secondary: '#8EB69B',
          light: '#DAF1DE',
        },
        status: {
          operational: '#8EB69B',
          healthy: '#235347',
          atRisk: '#D9A441',
          degraded: '#C97A4A',
          failed: '#C95C5C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(35, 83, 71, 0.3)',
        'glow-lg': '0 0 30px rgba(142, 182, 155, 0.2)',
        'glow-alert': '0 0 20px rgba(201, 92, 92, 0.3)',
        'card-depth': '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
