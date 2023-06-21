const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/options/options.js',

  output: {
    path: path.resolve(__dirname, './rocketblock-dist'),
    filename: 'options_bundle.js',
  },


  module: {

    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },

      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'RocketBlock Settings',
      filename: 'options.html',
      template: './src/options/templates/options.html'
    })
  ],
};