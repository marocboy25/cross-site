/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        // Cross tokens (CSS variables, from index.css)
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        line: 'var(--line)',
        muted: 'var(--muted)',
        bid: 'var(--bid)',
        ask: 'var(--ask)',
        // Flat shadcn-style keys used by the borrowed components.
        background: '#000000',
        foreground: '#FFFFFF',
        card: '#0C0C0F',
        'card-foreground': '#FFFFFF',
        border: '#2A2A30',
        input: '#2A2A30',
        ring: '#C026F5',
        primary: '#C026F5',
        'primary-foreground': '#FFFFFF',
        secondary: '#0C0C0F',
        'secondary-foreground': '#FFFFFF',
        'muted-foreground': '#8C8C96',
        accent: '#1A1A1F',
        'accent-foreground': '#FFFFFF',
        destructive: '#DC2626',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}
