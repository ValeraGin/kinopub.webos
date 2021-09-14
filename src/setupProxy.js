const { createProxyMiddleware } = require('http-proxy-middleware');

const DEFAULT_TARGET = 'https://api.service-kp.com';

const createProxy = (target, headers) => ({
  target,
  headers: {
    Origin: target,
    ...headers,
  },
  changeOrigin: true,
  followRedirects: true,
  cookieDomainRewrite: '',
  pathRewrite: {
    '/api/': '',
  },
  onProxyRes: (proxyRes) => {
    const setCookieHeader = proxyRes.headers['set-cookie'];

    if (Array.isArray(setCookieHeader)) {
      proxyRes.headers['set-cookie'] = setCookieHeader.map((v) => v.replace(/;\s+secure/gi, ''));
    }
  },
});

module.exports = function setupProxy(app) {
  app.use(
    [`${process.env.REACT_APP_KINOPUB_API_BASE_URL}`],
    createProxyMiddleware(createProxy(process.env.PROXY_KINOPUB_API_BASE_URL || DEFAULT_TARGET)),
  );
};
