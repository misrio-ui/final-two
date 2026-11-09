const app = require('../backend/server');

module.exports = (req, res) => {
  const requestUrl = new URL(req.url, 'http://localhost');

  if (!requestUrl.pathname.startsWith('/api/')) {
    const route = requestUrl.searchParams.get('path') || req.query?.path;
    const routePath = Array.isArray(route) ? route.join('/') : route;

    if (routePath) {
      requestUrl.searchParams.delete('path');
      requestUrl.searchParams.delete('path[]');
      requestUrl.pathname = `/api/${String(routePath).replace(/^\/+/, '')}`;
      req.url = `${requestUrl.pathname}${requestUrl.search}`;
    } else if (requestUrl.pathname === '/health' || requestUrl.pathname.startsWith('/deezer/')) {
      req.url = `/api${requestUrl.pathname}${requestUrl.search}`;
    }
  }

  return app(req, res);
};
