export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6F42C1',
        'primary-light': '#8A5DDE',
        'primary-dark': '#5A349A',
        secondary: '#F87171',
        'dark-bg': '#111827',
        'dark-card': '#1F2937',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'slide-up': 'slide-up 0.5s ease-out forwards',
      },
      keyframes: {
        blink: {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: '#6F42C1' },
        },
        'slide-up': {
          'from': { transform: 'translateY(100%)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    }
  },
  plugins: [],
}
