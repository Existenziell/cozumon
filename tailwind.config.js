module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Gotu', 'Arial', 'sans-serif'],
      },
      colors: {
        'brand': 'var(--color-brand)',
        'brand-dark': 'var(--color-brand-dark)',
        'cta': 'var(--color-cta)',
        'grey': 'var(--color-grey)',
        'grey-dark': 'var(--color-grey-dark)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
