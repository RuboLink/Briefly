import CATEGORY_IDS from '../src/api/categoryIds.js';
import { normalizeNewsLanguages } from '../src/api/languages.js';

const APITUBE_URL = 'https://api.apitube.io';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ message: 'Método no permitido.' });
  }

  const apiKey = process.env.__APITUBE_API_KEY__;
  if (!apiKey) {
    return response.status(500).json({
      message: 'No se ha configurado __APITUBE_API_KEY__ en las variables de entorno de Vercel.',
    });
  }

  const category = request.query.category || 'all';
  if (category !== 'all' && category !== 'world' && !CATEGORY_IDS[category]) {
    return response.status(400).json({ message: 'La categoría solicitada no es válida.' });
  }

  const endpoint = category === 'world'
    ? '/v1/news/everything'
    : CATEGORY_IDS[category]
      ? `/v1/news/category/iptc_mediatopics/${CATEGORY_IDS[category]}`
      : '/v1/news/top-headlines';
  const upstreamUrl = new URL(endpoint, APITUBE_URL);
  upstreamUrl.searchParams.set('per_page', '10');
  upstreamUrl.searchParams.set('language.code', normalizeNewsLanguages(request.query.languages).join(','));
  upstreamUrl.searchParams.set('sort.by', 'published_at');
  upstreamUrl.searchParams.set('sort.order', 'desc');

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: { 'X-API-Key': apiKey },
    });
    const body = await upstreamResponse.text();
    const contentType = upstreamResponse.headers.get('content-type');

    if (contentType) response.setHeader('Content-Type', contentType);
    return response.status(upstreamResponse.status).send(body);
  } catch {
    return response.status(502).json({ message: 'No se pudo conectar con APITube. Inténtalo de nuevo.' });
  }
}
