const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://15.164.61.1:65400",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/upload", // rewrite path
      },
    })
  );
};
