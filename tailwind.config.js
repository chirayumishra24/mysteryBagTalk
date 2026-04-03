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
          light: "#ffe16a",
          DEFAULT: "#ffc83d",
          dark: "#f59e0b",
        },
        secondary: {
          light: "#ff9b74",
          DEFAULT: "#ff7a45",
          dark: "#d95b25",
        },
        accent: {
          light: "#92f1d9",
          DEFAULT: "#2dd4bf",
          dark: "#0f766e",
        },
        surface: {
          light: "#fffdf8",
          DEFAULT: "#fff6ed",
          card: "#ffffff",
          coral: "#fff1f2",
          bubble: "#e0f2fe",
        },
        ocean: {
          light: '#38bdf8',    // Sunny surface water
          DEFAULT: '#0284c7',  // Mid ocean
          dark: '#0f172a',     // Deep abyss
          sand: '#fef08a',     // Ocean floor sand
          coral: '#fb7185',    // Coral pink
        },
        magic: {
          glow: '#67e8f9',     // Cyan bioluminescence
          pearl: '#f8fafc',    // Pearl shine
          sonar: '#34d399',    // Sonar green
        },
        ink: {
          DEFAULT: "#432414",
          soft: "#654331",
          muted: "#8b6a59",
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'sway': 'sway 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'bubble': 'bubble 6s ease-in infinite',
        'sonar-ping': 'sonar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(103, 232, 249, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 25px rgba(103, 232, 249, 0.8))' },
        },
        bubble: {
          '0%': { transform: 'translateY(100px) scale(0.5)', opacity: 0 },
          '20%': { opacity: 0.8 },
          '100%': { transform: 'translateY(-500px) scale(1.5)', opacity: 0 },
        },
        'sonar-ping': {
          '75%, 100%': { transform: 'scale(2)', opacity: 0 },
        }
      }
    },
  },
  plugins: [],
}
