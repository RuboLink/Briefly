import axios from 'axios';

const gnewsClient = axios.create({
  baseURL: 'https://gnews.io/api/v4',
  timeout: 15000,
});

export async function getLatestNews(category, signal) {
  if (!__GNEWS_API_KEY__) {
    throw new Error(
      'No se ha configurado una clave de GNews en .env (GNEWS_API_KEY o la variable de clave existente).',
    );
  }

  const params = {
    apikey: __GNEWS_API_KEY__,
    lang: 'es',
    category: category && category !== 'all' ? category : 'general',
    max: 10,
    nullable: 'image,description',
  };

  let data;
  try {
    const response = await gnewsClient.get('/top-headlines', { params, signal });
    data = response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error(
        'GNews rechazó la clave (401). Comprueba que GNEWS_API_KEY contiene una clave válida y activa.',
      );
    }
    if (error.response?.status === 403) {
      throw new Error('GNews no autoriza esta petición (403). Comprueba los permisos y el plan de tu cuenta.');
    }
    if (error.response?.status === 429) {
      throw new Error('Se alcanzó el límite de peticiones de GNews (429). Inténtalo de nuevo más tarde.');
    }
    throw error;
  }

  if (!Array.isArray(data.articles)) {
    throw new Error(data.errors?.[0] || 'La respuesta de GNews no contiene artículos.');
  }

  return data.articles.map((article) => ({
    id: article.url,
    url: article.url,
    title: article.title,
    description: article.description,
    image: article.image,
    published: article.publishedAt,
    author: article.source?.name || '',
  }));
}
