const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, 'public/index.html'),
  favicon: path.resolve(__dirname, 'public/favicon.ico'),
  filename: 'index.html',
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeEmptyAttributes: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  },
});

const dotenv = require('dotenv').config({
  path: path.join(__dirname, '.env'),
});

module.exports = {
  mode: 'production',
  entry: [
    path.resolve(__dirname, './public/index.js'),
    path.resolve(__dirname, './src/fonts/index.css'),
  ],
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
        include: path.resolve(__dirname, './src/fonts'),
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: ['babel-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.module\.s(a|c)ss$/,
        use: [
          'style-loader',
          'resolve-url-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
  },
  output: {
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(),
    HtmlWebpackPluginConfig,
    new MiniCssExtractPlugin({
      filename: '[name].hash.css',
      chunkFilename: '[id].[hash].css',
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_GOOGLE_OAUTH_ID': JSON.stringify(
        process.env.REACT_APP_GOOGLE_OAUTH_ID
      ),
      'process.env.REACT_APP_BACKEND_API_URL': JSON.stringify(
        process.env.REACT_APP_BACKEND_API_URL
      ),
    }),
  ],
};
