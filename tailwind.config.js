module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        999: '999',
      },
    },
  },
  variants: {
    extend: {
      ringColor: ['hover', 'active'],
      divideColor: ['group-hover'],
    },
  },
  plugins: [],
};
