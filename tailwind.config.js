export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00df8f',
        'primary-light': '#33ebd2',
        'primary-dark': '#00b373',
        secondary: '#00b373',
        'dark-bg': '#0d1116',
        'dark-surface': '#14181f',
        'dark-card': '#161b22',
        'dark-border': 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
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
