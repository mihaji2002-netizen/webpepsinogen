/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Vazirmatn drives the whole Persian UI, with sane system fallbacks.
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Core "classified file" palette — kept intentionally small & reusable.
        ink: {
          900: '#04060d', // deepest black used for the page background
          800: '#070b16',
          700: '#0b1120', // deep navy
          600: '#111a2e',
        },
        accent: {
          red: '#ff3b47', // TOP SECRET / danger accent
          gold: '#e7b64b', // CONFIDENTIAL / classified stamp accent
          blue: '#4c8dff', // intel / info accent
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 40px -12px rgba(0,0,0,0.7)',
        'glow-red': '0 0 30px -6px rgba(255,59,71,0.45)',
        'glow-gold': '0 0 30px -6px rgba(231,182,75,0.45)',
        'glow-blue': '0 0 30px -6px rgba(76,141,255,0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
        scan: 'scan 4s linear infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
