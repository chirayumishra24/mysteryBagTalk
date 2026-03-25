/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          light: '#ffffff',
          DEFAULT: '#f8fafc',
        },
        primary: {
          light: '#fef08a',
          DEFAULT: '#facc15',
          dark: '#ca8a04',
        },
        secondary: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
        },
        accent: {
          light: '#86efac',
          DEFAULT: '#4ade80',
          dark: '#16a34a',
        },
        bag: {
          light: '#d97706',
          DEFAULT: '#92400e',
          dark: '#78350f',
        }
      },
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        body: ['Fredoka', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'star-pop': 'star-pop 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'star-pop': {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '60%': { transform: 'scale(1.3) rotate(10deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
