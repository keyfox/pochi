"use strict";

const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const version = require("./package.json").version;

module.exports = {
  mode: "production",

  context: `${__dirname}/src/`,

  entry: {
    [`pochi-v${version}`]: "./index.ts",
    [`pochi-v${version}.min`]: "./index.ts",
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
        test: /\.ts$/,
        exclude: `${__dirname}/node_modules`,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
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
