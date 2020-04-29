"use strict";

const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const version = require("./package.json").version;

module.exports = {
  mode: "production",

  context: `${__dirname}/src/`,

  entry: {
    [`pochi-v${version}`]: "./index.js",
    [`pochi-v${version}.min`]: "./index.js",
  },

  output: {
    path: `${__dirname}/dist/`,
    filename: "[name].js",
    library: "pochi",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: `${__dirname}/node_modules`,
        use: "babel-loader",
      },
    ],
  },

  performance: { hints: false },

  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        include: /\.min\.js$/,
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          compress: true,
          ie8: false,
          ecma: 5,
          output: { comments: false },
          warnings: false,
        },
      }),
    ],
  },
};
