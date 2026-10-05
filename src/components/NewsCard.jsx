function getSource(article) {
  if (article.author) return article.author;
  if (!article.url) return 'NewsAPI';

  try {
    return new URL(article.url).hostname.replace(/^www\./, '');
  } catch {
    return 'NewsAPI';
  }
}

function formatDate(date) {
  if (!date) return 'Fecha no disponible';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return 'Fecha no disponible';

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
}

export default function NewsCard({ article, favorite, onToggleFavorite }) {
  return (
    <article className="news-card">
      <div className="news-card__image-wrap">
        {article.image && article.image !== 'None' ? (
          <img
            className="news-card__image"
            src={article.image}
            alt=""
            loading="lazy"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        ) : (
          <div className="news-card__image-placeholder" aria-hidden="true">
            <span>Briefly</span>
          </div>
        )}
        <button
          className={`favorite-button${favorite ? ' favorite-button--active' : ''}`}
          type="button"
          aria-label={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          aria-pressed={favorite}
          onClick={() => onToggleFavorite(article)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m12 20.25-1.45-1.32C5.4 14.26 2 11.18 2 7.4A5.4 5.4 0 0 1 7.45 2 5.9 5.9 0 0 1 12 4.13 5.9 5.9 0 0 1 16.55 2 5.4 5.4 0 0 1 22 7.4c0 3.78-3.4 6.86-8.55 11.54L12 20.25Z" />
          </svg>
        </button>
      </div>

      <div className="news-card__content">
        <div className="news-card__meta">
          <span className="news-card__source">{getSource(article)}</span>
          <span className="news-card__date">{formatDate(article.published)}</span>
        </div>
        <h2 className="news-card__title">{article.title || 'Noticia sin título'}</h2>
        <p className="news-card__description">
          {article.description || 'No hay una descripción disponible para esta noticia.'}
        </p>
        <a
          className="news-card__link"
          href={article.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Leer noticia: ${article.title || 'Noticia sin título'}`}
        >
          Leer noticia <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
