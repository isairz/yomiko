module.exports = {
  root: true,
  extends: [
    'standard',
  ],
  plugins: [
    'html',
  ],
  'rules': {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'comma-dangle': [1, 'always-multiline'],
    'max-len': [1, 180, 2],
    'arrow-body-style': [0],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  }
}
