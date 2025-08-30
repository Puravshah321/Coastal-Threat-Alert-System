/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e6f7ff",
          100: "#b3ebff",
          200: "#80deff",
          300: "#4dd2ff",
          400: "#1ac5ff",
          500: "#00abff",
          600: "#0086cc",
          700: "#006099",
          800: "#003a66",
          900: "#001433"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(0,171,255,0.25)",
      }
    },
  },
  plugins: [],
}
