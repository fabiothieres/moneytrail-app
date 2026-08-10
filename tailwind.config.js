/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#FDF8EB',
          100: '#F9EDD0',
          200: '#F2D99E',
          300: '#EABE63',
          400: '#E4AB3A',
          500: '#D49A2A',
          600: '#B47B1E',
          700: '#8F5F1A',
          800: '#764E1C',
          900: '#63411C',
          950: '#39210D',
        },
        surface: {
          DEFAULT: '#0A0A0F',
          card:    '#13131A',
          elevated:'#1C1C26',
          border:  '#2A2A38',
          muted:   '#4A4A58',
        },
      },
      animation: {
        'fade-in':       'fadeIn .4s ease forwards',
        'slide-up':      'slideUp .6s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-up-delay':'slideUp .6s cubic-bezier(0.16,1,0.3,1) .15s forwards',
        'slide-up-delay2':'slideUp .6s cubic-bezier(0.16,1,0.3,1) .3s forwards',
        'float':         'float 6s ease-in-out infinite',
        'float-slow':    'float 8s ease-in-out infinite',
        'float-delay':   'float 6s ease-in-out 2s infinite',
        'shimmer':       'shimmer 3s ease-in-out infinite',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
        'pulse-slow':    'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':     'spin 20s linear infinite',
        'sparkle':       'sparkle 2s ease-in-out infinite',
        'badge-float':   'badgeFloat 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':      { transform: 'translateY(-20px) rotate(1deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,154,42,0.2), 0 0 60px rgba(212,154,42,0.1)' },
          '50%':      { boxShadow: '0 0 40px rgba(212,154,42,0.4), 0 0 80px rgba(212,154,42,0.2)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '50%':      { opacity: '1', transform: 'scale(1) rotate(180deg)' },
        },
        badgeFloat: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%':      { transform: 'translateY(-8px) translateX(4px)' },
          '66%':      { transform: 'translateY(4px) translateX(-4px)' },
        },
      },
    },
  },
  plugins: [],
}
