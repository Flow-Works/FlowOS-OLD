const HtmlWebpackPlugin = require('html-webpack-plugin');
const { FilerWebpackPlugin } = require('filer/webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');

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
    clean: true,
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
    }),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 50000, // Minimum number of characters
    }),
    new webpack.optimize.SplitChunksPlugin({
      minSize: 45000,
      maxSize: 110000
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },
  },
};