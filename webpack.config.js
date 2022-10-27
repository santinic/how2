const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './lib/index.js',
  target: 'node',
  externals: ['pty.js', 'term.js'],
  externalsPresets: {
    node: true
  },
  output: {
    filename: 'dist/build.js',
    path: __dirname
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i
      })
    ]
  }
}
