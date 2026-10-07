/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Exactly the app's families (app.usecrossp2p.com): Inter for text and
      // headlines, Space Grotesk for card titles, IBM Plex Mono for numbers/labels.
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        title: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      // The app's palette (its CSS variables). Names describe the role, so
      // `paper` is the page and `ink` is the main text, on a dark theme.
      colors: {
        paper: '#050508', // app --bg
        wash: '#0A0912', // app --bg-2: bands
        card: {
          DEFAULT: '#0E0C1A', // app --panel-solid: panels
          raised: '#15122A', // app --panel-2: cards floating on panels
        },
        ink: '#F2F1F7', // app --text
        dim: '#8B8A99', // app --muted: secondary copy
        line: {
          DEFAULT: 'rgba(120, 56, 240, 0.16)', // app --line
          strong: 'rgba(120, 56, 240, 0.38)', // app --line-strong
        },
        violet: {
          DEFAULT: '#7838F0', // app --violet: buttons, highlights
          light: '#A78BFA', // violet text, readable on the dark background
          soft: 'rgba(120, 56, 240, 0.22)', // app's selected-chip fill
        },
        magenta: '#C026F5', // app --magenta: end of the primary gradient
        bid: {
          DEFAULT: '#3DDC97', // app --bid: positive numbers, checks
          light: '#7FF0C0', // app's chip-bid text
        },
      },
      maxWidth: {
        page: '1200px',
      },
    },
  },
  plugins: [],
}
