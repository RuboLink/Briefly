import axios from 'axios';

const apitubeClient = axios.create({
  baseURL: 'https://api.apitube.io/v1/news',
  timeout: 15000,
});

const CATEGORY_IDS = {
  business: 'medtop:04000000',
  technology: 'medtop:13000000',
  science: 'medtop:13000000',
  health: 'medtop:07000000',
  sports: 'medtop:15000000',
  entertainment: 'medtop:01000000',
};

export async function getLatestNews(category, signal) {
  if (!__APITUBE_API_KEY__) {
    throw new Error('No se ha configurado __APITUBE_API_KEY__ en el archivo .env.');
  }

  const endpoint = CATEGORY_IDS[category]
    ? `/category/iptc_mediatopics/${CATEGORY_IDS[category]}`
    : '/top-headlines';

  let data;
  try {
    const response = await apitubeClient.get(endpoint, {
      headers: { 'X-API-Key': __APITUBE_API_KEY__ },
      params: { per_page: 10, language: 'es' },
      signal,
    });
    data = response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('APITube rechazó la clave (401). Comprueba que __APITUBE_API_KEY__ sea válida y esté activa.');
    }
    if (error.response?.status === 403) {
      throw new Error(error.response.data?.message || 'APITube no autoriza esta petición (403).');
    }
    if (error.response?.status === 429) {
      throw new Error('Se alcanzó el límite de peticiones de APITube (429). Inténtalo de nuevo más tarde.');
    }
    throw error;
  }

  if (data.status !== 'ok' || !Array.isArray(data.results)) {
    throw new Error(data.message || 'La respuesta de APITube no contiene artículos.');
  }

  return data.results.map((article) => ({
    id: article.id || article.href,
    url: article.href,
    title: article.title,
    description: article.description,
    image: article.image,
    published: article.published_at,
    author: article.source?.domain || article.author?.name || '',
  }));
}
