/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          500: '#14b8a6',
          600: '#0d9488',
        },
        accent: {
          500: '#f97316',
          600: '#ea580c',
        },
        neon: {
          cyan: '#7dd3fc',
          purple: '#a78bfa',
        }
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(125, 211, 252, 0.3)',
        'neon-purple': '0 0 20px rgba(167, 139, 250, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}