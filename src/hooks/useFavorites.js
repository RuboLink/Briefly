import { useEffect, useState } from 'react';

const STORAGE_KEY = 'briefly-favorite-news-v1';

function readFavorites() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const favorites = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(favorites)) {
      throw new Error('El formato de las noticias favoritas no es válido.');
    }

    return { favorites, loadError: '', error: '' };
  } catch (error) {
    const message = `No se pudieron cargar las noticias favoritas: ${error.message}`;
    return {
      favorites: [],
      loadError: message,
      error: message,
    };
  }
}

export default function useFavorites() {
  const [storedState, setStoredState] = useState(readFavorites);
  const { favorites, error } = storedState;

  useEffect(() => {
    if (storedState.loadError) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      setStoredState((current) => (current.error ? { ...current, error: '' } : current));
    } catch (storageError) {
      setStoredState((current) => ({
        ...current,
        error: `No se pudieron guardar las noticias favoritas: ${storageError.message}`,
      }));
    }
  }, [favorites, storedState.loadError]);

  function toggleFavorite(article) {
    const articleId = article.id || article.url;
    if (!articleId) {
      setStoredState((current) => ({
        ...current,
        error: 'No se puede guardar esta noticia porque no tiene un identificador.',
      }));
      return;
    }

    setStoredState((current) => {
      const exists = current.favorites.some((item) => (item.id || item.url) === articleId);
      return {
        ...current,
        favorites: exists
          ? current.favorites.filter((item) => (item.id || item.url) !== articleId)
          : [article, ...current.favorites],
      };
    });
  }

  function isFavorite(article) {
    const articleId = article.id || article.url;
    return favorites.some((item) => (item.id || item.url) === articleId);
  }

  return { favorites, error, toggleFavorite, isFavorite };
}
