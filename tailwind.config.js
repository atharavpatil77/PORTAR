/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          bg: 'var(--space-bg)',
          neon: {
            blue: 'var(--neon-blue)',
            purple: 'var(--neon-purple)'
          }
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'neon-pulse': 'neon-pulse 1.5s ease-in-out infinite alternate',
        'hologram-flicker': 'hologram-flicker 2s linear infinite',
        'cosmic-spin': 'cosmic-spin 1.5s linear infinite',
        'portal-expand': 'portal-expand 2s ease-out infinite',
        'space-float': 'space-float 30s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      backgroundImage: {
        'gradient-space': 'linear-gradient(45deg, var(--neon-blue), var(--neon-purple))',
      }
    },
  },
  plugins: [],
}