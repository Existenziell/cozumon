module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'brand-lighter': 'var(--color-brand)',
        'brand': 'var(--color-brand)',
        'brand-dark': 'var(--color-brand)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
