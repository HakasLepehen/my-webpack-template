const path = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === "development";

const filename = (ext) =>
  !isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (!isDev) {
    config.minimizer = [new CssMinimizerPlugin(), new TerserWebpackPlugin()];
  }

  return config;
};

module.exports = {
  context: path.resolve(__dirname),
  entry: path.join(__dirname, "src/js", "index.js"),
  output: {
    filename: `./js/${filename('js')}`,
    path: path.resolve(__dirname, "app")
  },

  optimization: optimization(),

  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
      title: "My App",
      filename: "index.html",
      minify: {
          collapseWhitespace: isDev
      },
      publicPath: ''
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
        filename: `./css/${filename('css')}`
    })
  ],

  module: {
    rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
  }
};
