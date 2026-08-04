/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pb: {
          bg: "#FAF7F2",
          "bg-alt": "#F8FAFC",
          card: "rgba(255, 255, 255, 0.75)",
          border: "rgba(226, 232, 240, 0.8)",
          "border-active": "rgba(0, 82, 255, 0.3)",
          text: "#0B132B",
          muted: "#475569",
          subtle: "#64748B",
          blue: "#0052FF",
          "blue-light": "#3B82F6",
          "blue-glow": "rgba(0, 82, 255, 0.12)",
          accent: "#0A84FF",
          navy: "#0A192F",
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      maxWidth: {
        'editorial': '960px',
        'standard': '1180px',
        'visual': '1280px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
