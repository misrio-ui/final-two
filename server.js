const express = require('express');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DEEZER_API_URL = 'https://api.deezer.com';

app.disable('x-powered-by');

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'deezer-music-player' });
});

app.use('/api/deezer', async (req, res) => {
  const endpoint = req.url.replace(/^\/+/, '');
  const deezerUrl = new URL(endpoint || '', `${DEEZER_API_URL}/`);

  if (req.query && Object.keys(req.query).length > 0) {
    for (const [key, value] of Object.entries(req.query)) {
      deezerUrl.searchParams.set(key, Array.isArray(value) ? value[0] : String(value));
    }
  }

  try {
    const response = await fetch(deezerUrl.toString(), {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Deezer API returned ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Deezer proxy error:', error.message);
    res.status(502).json({
      error: 'ไม่สามารถเชื่อมต่อ Deezer API ได้',
      message: error.message,
    });
  }
});

app.use(express.static(path.join(__dirname), {
  extensions: ['html'],
  maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0,
}));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ให้ listen เฉพาะตอนรันในเครื่อง (Local)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Music player running at http://localhost:${PORT}`);
  });
}

// ส่งออก app ให้ Vercel Serverless Function นำไปใช้งาน
module.exports = app;
