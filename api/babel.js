const handlers = {
  'browser-config': require('../lib/endpoints/browser-config'),
  'catalog': require('../lib/endpoints/catalog'),
  'country': require('../lib/endpoints/country'),
  'dossier': require('../lib/endpoints/dossier'),
  'explore': require('../lib/endpoints/explore'),
  'media-search': require('../lib/endpoints/media-search'),
  'reader': require('../lib/endpoints/reader'),
  'recipes': require('../lib/endpoints/recipes'),
  'research': require('../lib/endpoints/research'),
  'stats': require('../lib/endpoints/stats'),
  'topic': require('../lib/endpoints/topic'),
  'trends': require('../lib/endpoints/trends'),
  'webgraph': require('../lib/endpoints/webgraph'),
  'websearch': require('../lib/endpoints/websearch')
};

module.exports = async function babelApi(req, res) {
  const endpoint = String(req.query?.endpoint || '').trim().toLowerCase();
  const handler = handlers[endpoint];

  if (!handler) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({
      error: 'Unknown Babel API endpoint.',
      endpoint,
      available: Object.keys(handlers)
    }));
  }

  try {
    return await handler(req, res);
  } catch (error) {
    if (res.headersSent) return;
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.end(JSON.stringify({
      error: 'Babel API request failed.',
      endpoint,
      detail: process.env.NODE_ENV === 'development' ? String(error?.stack || error) : undefined
    }));
  }
};
