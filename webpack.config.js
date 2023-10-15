const HtmlWebpackPlugin = require('html-webpack-plugin');
const { FilerWebpackPlugin } = require('filer/webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const path = require('path');

module.exports = {
  entry: {
    flow: './src/index.ts',
  },
  devtool: 'inline-source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'images',
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },

    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
  plugins: [new HtmlWebpackPlugin(), new FilerWebpackPlugin(),
    new NodePolyfillPlugin({
      excludeAliases: ['console']
    })
  ],
};