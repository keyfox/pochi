const pkg = require("./package.json");

module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    "@babel/proposal-class-properties",
    [
      "@comandeer/babel-plugin-banner",
      {
        banner: `/*! @keyfox/pochi v${pkg.version} | (c) 2020 ${pkg.author} | MIT license (see LICENSE) */`,
      },
    ],
  ],
};
