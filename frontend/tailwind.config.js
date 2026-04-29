/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        surface: {
          950: '#030712',
          900: '#0a0f1e',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
        },
        accent: {
          purple: '#a855f7',
          blue:   '#3b82f6',
          cyan:   '#06b6d4',
          gold:   '#f59e0b',
          pink:   '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'pop':        'pop 0.3s cubic-bezier(0.68,-0.55,0.27,1.55)',
        'slide-up':   'slide-up 0.4s ease-out',
        'fade-in':    'fade-in 0.3s ease-out',
        'bounce-in':  'bounce-in 0.5s cubic-bezier(0.68,-0.55,0.27,1.55)',
        'fire':       'fire 1s ease-in-out infinite alternate',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34,197,94,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(34,197,94,0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pop: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-in': {
          '0%':   { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fire: {
          '0%':   { filter: 'hue-rotate(0deg) brightness(1)' },
          '100%': { filter: 'hue-rotate(20deg) brightness(1.2)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(at 40% 20%, #0f172a 0px, transparent 50%), radial-gradient(at 80% 0%, #1e1b4b 0px, transparent 50%), radial-gradient(at 0% 50%, #042f2e 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
