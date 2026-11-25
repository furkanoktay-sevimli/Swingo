// Swingo Global Leaderboard — Zero-dependency Vercel Serverless Function
// Works automatically when Upstash Redis (or Vercel KV) is connected in Vercel Storage.

function getTodayKey() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
  return { url: url.replace(/\/$/, ''), token };
}

async function redisCommand(cfg, commandArray) {
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commandArray)
  });
  if (!res.ok) {
    throw new Error(`Redis HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.result;
}

function parseZRangeWithScores(arr) {
  const entries = [];
  if (!Array.isArray(arr)) return entries;
  for (let i = 0; i < arr.length; i += 2) {
    entries.push({
      name: String(arr[i]),
      score: Number(arr[i + 1]) || 0
    });
  }
  return entries;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const cfg = getRedisConfig();
  const hasRedis = Boolean(cfg.url && cfg.token);

  if (req.method === 'GET') {
    const mode = req.query.mode === 'daily' ? 'daily' : 'endless';
    const boardKey = mode === 'daily' ? `swingo:lb:daily:${getTodayKey()}` : 'swingo:lb:endless';

    if (!hasRedis) {
      return res.status(200).json({ source: 'unconfigured', entries: [] });
    }

    try {
      const raw = await redisCommand(cfg, ['ZREVRANGE', boardKey, 0, 19, 'WITHSCORES']);
      return res.status(200).json({
        source: 'kv',
        mode,
        entries: parseZRangeWithScores(raw)
      });
    } catch (err) {
      return res.status(500).json({ error: 'Leaderboard okunamadı' });
    }
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const mode = body && body.mode === 'daily' ? 'daily' : 'endless';
    const rawName = String((body && body.name) || '').trim().replace(/[<>]/g, '').slice(0, 16);
    const score = Math.floor(Number(body && body.score));

    if (rawName.length < 2) {
      return res.status(400).json({ error: 'Oyuncu adı en az 2 karakter olmalı' });
    }
    if (!Number.isFinite(score) || score <= 0 || score > 9999) {
      return res.status(400).json({ error: 'Geçersiz skor' });
    }

    if (!hasRedis) {
      return res.status(503).json({ error: 'Vercel Storage (Upstash Redis) henüz bağlı değil' });
    }

    const boardKey = mode === 'daily' ? `swingo:lb:daily:${getTodayKey()}` : 'swingo:lb:endless';

    try {
      // GT keeps the player's highest score only
      await redisCommand(cfg, ['ZADD', boardKey, 'GT', score, rawName]);
      if (mode === 'daily') {
        await redisCommand(cfg, ['EXPIRE', boardKey, 60 * 60 * 24 * 7]);
      }
      const rankZero = await redisCommand(cfg, ['ZREVRANK', boardKey, rawName]);
      const rawTop = await redisCommand(cfg, ['ZREVRANGE', boardKey, 0, 19, 'WITHSCORES']);

      return res.status(200).json({
        ok: true,
        rank: typeof rankZero === 'number' ? rankZero + 1 : null,
        entries: parseZRangeWithScores(rawTop)
      });
    } catch (err) {
      return res.status(500).json({ error: 'Skor kaydedilemedi' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
