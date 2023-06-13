const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/options.js',

  output: {
    path: path.resolve(__dirname, './dist'),
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
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/templates/index.html'
    })
  ],
};