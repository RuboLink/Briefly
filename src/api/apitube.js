import axios from 'axios';
import { getBrowserNewsLanguages } from './languages.js';

const apitubeClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

export async function getLatestNews(category, signal) {
  const languages = getBrowserNewsLanguages();
  let data;
  try {
    const response = await apitubeClient.get('/news', {
      params: { category, languages: languages.join(','), per_page: 10 },
      signal,
    });
    data = response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('APITube rechazó la clave (401). Comprueba la variable __APITUBE_API_KEY__ del servidor.');
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

  const languagePriority = new Map(languages.map((language, index) => [language, index]));

  return data.results
    .map((article) => ({
      id: article.id || article.href,
      url: article.href,
      title: article.title,
      description: article.description,
      image: article.image,
      published: article.published_at,
      author: article.source?.domain || article.author?.name || '',
      language: article.language,
    }))
    .sort((first, second) =>
      (languagePriority.get(first.language) ?? languages.length)
      - (languagePriority.get(second.language) ?? languages.length));
}
