import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
          400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
          800: '#065f46', 900: '#064e3b',
        },
        warm: {
          50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
          400: '#fb923c', 500: '#f97316', 600: '#ea580c',
        },
        coral: {
          50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af',
          400: '#fb7185', 500: '#f43f5e', 600: '#e11d48',
        },
        pet: {
          happy: '#fbbf24',
          neutral: '#94a3b8',
          sad: '#60a5fa',
          sleeping: '#a78bfa',
          sick: '#f87171',
        },
        surface: {
          DEFAULT: '#1e293b',
          light: '#334155',
          dark: '#0f172a',
          card: '#1a1f35',
          border: '#2d3a50',
        },
        pastel: {
          pink: '#f9a8d4',
          coral: '#fb7185',
          peach: '#fda4af',
          orange: '#fdba74',
          cream: '#fef3c7',
          yellow: '#fde68a',
          mint: '#a7f3d0',
          aqua: '#67e8f9',
          sky: '#7dd3fc',
          lavender: '#c4b5fd',
          purple: '#a78bfa',
          moon: '#e9d5ff',
          rose: '#fecdd3',
          walnut: '#d4a574',
          foreground: '#334155',
          muted: '#94a3b8',
          card: '#f1f5f9',
          border: '#e2e8f0',
        },
      },
      fontFamily: {
        display: ['"Fredoka One"', '"Comic Neue"', 'cursive'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'wiggle': 'wiggle 0.8s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.4s ease-out',
        'float-up': 'float-up 0.8s ease-out forwards',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'pop': 'pop 0.3s ease-out',
        'bounce-gentle': 'bounce-gentle 1s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(167, 139, 250, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(167, 139, 250, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
