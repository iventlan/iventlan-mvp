import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        // Mapeo a variables de globals.css
        'brand-primary': 'var(--brand-primary)',
        'brand-accent': 'var(--brand-accent)',
        'brand-slate': 'var(--slate)',
        'brand-ink': 'var(--ink)',
        'brand-cloud': 'var(--cloud)',
        // Tintes suaves para fondos
        'brand-tint': '#ECE7FF',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '3xl': '32px',
      },
      boxShadow: {
        card: '0 8px 30px rgba(2,6,23,.06)',
        cardHover: '0 14px 40px rgba(2,6,23,.12)',
      },
    },
  },
  plugins: [],
} satisfies Config
