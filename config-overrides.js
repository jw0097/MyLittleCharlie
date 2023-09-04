const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    url: require.resolve("url"),
    assert: require.resolve("assert"),
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify"),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  return config;
};

// const webpack = require("webpack");

// module.exports = function override(config) {
//   const fallback = config.resolve.fallback || {};
//   Object.assign(fallback, {
//     assert: require.resolve("assert"),
//     url: require.resolve("url"),
//     https: require.resolve("https-browserify"),
//     process: require.resolve("process/browser"),
//     Buffer: [require.resolve("buffer/"), "Buffer"],
//   });
//   config.resolve.fallback = fallback;
//   config.plugins = (config.plugins || []).concat([
//     new webpack.ProvidePlugin({
//       process: "process/browser",
//       Buffer: ["buffer", "Buffer"],
//     }),
//   ]);
//   return config;
// };
