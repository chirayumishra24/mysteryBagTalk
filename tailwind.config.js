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
          DEFAULT: "#ffd700",
          dark: "#f59e0b",
        },
        secondary: {
          light: "#a78bfa",
          DEFAULT: "#7c3aed",
          dark: "#6d28d9",
        },
        accent: {
          teal: "#2dd4bf",
          red: "#e74c3c",
          pink: "#ff6b9d",
        },
        surface: {
          warm: "#faf3e0",
          card: "#ffffff",
        },
        ink: {
          DEFAULT: "#1e293b",
          soft: "#475569",
          muted: "#64748b",
        },
      },
      fontFamily: {
        display: ['"Fredoka One"', 'cursive'],
        body: ['Nunito', 'sans-serif'],
        marker: ['"Permanent Marker"', 'cursive'],
      },
      borderWidth: {
        3: '3px',
      },
    },
  },
  plugins: [],
}
