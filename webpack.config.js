const path = require('path');

module.exports = {
  // ...existing webpack configuration...
  resolve: {
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
    },
  },
  node: {
    fs: 'empty',
  },
};
