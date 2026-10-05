import axios from 'axios';

const newsApiClient = axios.create({
  baseURL: 'https://newsapi.org/v2',
  timeout: 15000,
});

export async function getLatestNews(category, signal) {
  if (!__NEWS_API_KEY__) {
    throw new Error('No se ha configurado __NEWS_API_KEY__ en el archivo .env.');
  }

  const params = {
    country: 'es',
    pageSize: 10,
    apiKey: __NEWS_API_KEY__,
  };

  if (category && category !== 'all') {
    params.category = category === 'world' ? 'general' : category;
  }

  let data;
  try {
    const response = await newsApiClient.get('/top-headlines', { params, signal });
    data = response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('NewsAPI rechazó la clave (401). Comprueba que __NEWS_API_KEY__ sea válida y esté activa.');
    }
    if (error.response?.status === 429) {
      throw new Error('Se alcanzó el límite de peticiones de NewsAPI (429). Inténtalo de nuevo más tarde.');
    }
    throw error;
  }

  if (data.status !== 'ok' || !Array.isArray(data.articles)) {
    throw new Error(data.message || 'La respuesta de NewsAPI no contiene artículos.');
  }

  return data.articles.map((article) => ({
    id: article.url,
    url: article.url,
    title: article.title,
    description: article.description,
    image: article.urlToImage,
    published: article.publishedAt,
    author: article.source?.name || '',
  }));
}
