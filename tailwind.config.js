/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rosa-principal': '#F3AFC7',
        'rosa-suave': '#FDF1F5',
        'crema': '#FFF3E4',
        'terracota': '#D98B6B',
        'gris-calido': '#A79CA0',
        'rosa-oscuro': '#8A4A61',
        'rosa-medio': '#E8879F',
        'crema-oscuro': '#F5E6D3',
      },
      fontFamily: {
        'serif-elegante': ['"Cormorant Garamond"', 'serif'],
        'sans': ['Nunito', 'sans-serif'],
        'manuscrita': ['Caveat', 'cursive'],
      },
      animation: {
        'flotar': 'flotar 3s ease-in-out infinite',
        'flotar-lento': 'flotar 5s ease-in-out infinite',
        'petal-caer': 'petalCaer 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-suave': 'pulseSuave 2s ease-in-out infinite',
      },
      keyframes: {
        flotar: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        petalCaer: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSuave: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      boxShadow: {
        'polaroid': '0 2px 8px rgba(143, 74, 97, 0.12), 0 1px 3px rgba(143, 74, 97, 0.08)',
        'polaroid-hover': '0 8px 24px rgba(143, 74, 97, 0.18), 0 2px 8px rgba(143, 74, 97, 0.12)',
        'card': '0 1px 4px rgba(167, 156, 160, 0.15)',
        'card-hover': '0 4px 16px rgba(167, 156, 160, 0.25)',
        'fab': '0 4px 20px rgba(243, 175, 199, 0.5)',
      },
      borderRadius: {
        'xl2': '1.25rem',
        '3xl': '1.5rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
