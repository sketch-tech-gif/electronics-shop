module.exports = {
  plugins: {
    'postcss-import': { filter: (id) => !id.startsWith('@tailwind') },
    tailwindcss: {},
    autoprefixer: {},
  },
}