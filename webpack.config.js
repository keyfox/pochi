"use strict";

const version = require("./package.json").version;
const TerserPlugin = require("terser-webpack-plugin");
const { BannerPlugin } = require("webpack");
const pkg = require("./package.json");

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
    extensions: [".ts", ".js"],
  },
  performance: { hints: false },

  optimization: {
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
        sourceMap: false,
        terserOptions: {
          // output: {
          //   comments: /license/i,
          // },
        },
        extractComments: false,
      }),
    ],
  },

  plugins: [
    new BannerPlugin({
      banner: `@keyfox/pochi v${pkg.version} | (c) 2020 ${pkg.author} | MIT license (see LICENSE)`,
    }),
  ],
};
