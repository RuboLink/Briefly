import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { getLatestNews } from './api/gnews.js';
import NewsCard from './components/NewsCard.jsx';
import useFavorites from './hooks/useFavorites.js';

const CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'world', label: 'Mundo' },
  { id: 'business', label: 'Negocios' },
  { id: 'technology', label: 'Tecnología' },
  { id: 'science', label: 'Ciencia' },
  { id: 'health', label: 'Salud' },
  { id: 'sports', label: 'Deportes' },
  { id: 'entertainment', label: 'Entretenimiento' },
];

function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Briefly, inicio">
      <span className="brand__mark" aria-hidden="true">b.</span>
      <span>briefly<span className="brand__period">.</span></span>
    </Link>
  );
}

function Header({ favoriteCount }) {
  const { pathname } = useLocation();
  const exploring = pathname === '/';
  const viewingFavorites = pathname === '/favoritos';

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Brand />
        <nav className="main-nav" aria-label="Navegación principal">
          <Link
            className={`main-nav__link${exploring ? ' is-active' : ''}`}
            to="/"
            aria-current={exploring ? 'page' : undefined}
          >
            Explorar
          </Link>
          <Link
            className={`main-nav__link${viewingFavorites ? ' is-active' : ''}`}
            to="/favoritos"
            aria-current={viewingFavorites ? 'page' : undefined}
          >
            Favoritos <span className="nav-count">{favoriteCount}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function PageIntro({ favoriteCount }) {
  return (
    <section className="page-intro">
      <div className="page-intro__text">
        <p className="eyebrow"><span className="eyebrow__line" /> TU MUNDO, EN POCAS PALABRAS</p>
        <h1>Las noticias que <span>importan.</span></h1>
        <p className="page-intro__subtitle">
          Una mirada clara a lo que está pasando, seleccionada para ti.
        </p>
      </div>
      <div className="reading-stat">
        <span className="reading-stat__icon" aria-hidden="true">♡</span>
        <span><strong>{favoriteCount}</strong><small>guardadas para después</small></span>
      </div>
    </section>
  );
}

function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="category-row" aria-label="Filtrar noticias por categoría">
      <span className="category-row__label">Categorías</span>
      <div className="category-list">
        {CATEGORIES.map((category) => (
          <button
            className={`category-chip${selected === category.id ? ' category-chip--active' : ''}`}
            key={category.id}
            type="button"
            aria-pressed={selected === category.id}
            onClick={() => onSelect(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NewsGrid({ articles, isFavorite, onToggleFavorite }) {
  if (articles.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon" aria-hidden="true">✳</span>
        <h2>Aún no hay noticias por aquí</h2>
        <p>Prueba otra categoría o vuelve a intentarlo en un momento.</p>
      </div>
    );
  }

  return (
    <div className="news-grid">
      {articles.map((article, index) => (
        <NewsCard
          key={article.id || article.url || `${article.title}-${index}`}
          article={article}
          favorite={isFavorite(article)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="loading-grid" role="status" aria-label="Cargando noticias">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="loading-card" key={index}>
          <div className="skeleton loading-card__image" />
          <div className="loading-card__body">
            <div className="skeleton loading-card__line loading-card__line--short" />
            <div className="skeleton loading-card__line loading-card__line--title" />
            <div className="skeleton loading-card__line" />
            <div className="skeleton loading-card__line loading-card__line--short" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NewsPage({ category, setCategory, articles, loading, error, retry, favoritesApi }) {
  return (
    <>
      <PageIntro favoriteCount={favoritesApi.favorites.length} />
      <CategoryFilter selected={category} onSelect={setCategory} />
      <section className="feed-section" aria-labelledby="feed-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">AL DÍA</p>
            <h2 id="feed-heading">Lo más reciente</h2>
          </div>
          {!loading && !error && (
            <span className="result-count">{articles.length} noticias</span>
          )}
        </div>
        {favoritesApi.error && <p className="inline-notice" role="alert">{favoritesApi.error}</p>}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="error-state" role="alert">
            <span className="error-state__icon" aria-hidden="true">!</span>
            <div>
              <h2>No se pudieron cargar las noticias</h2>
              <p>{error}</p>
              <button className="button button--dark" type="button" onClick={retry}>Intentar de nuevo</button>
            </div>
          </div>
        ) : (
          <NewsGrid
            articles={articles}
            isFavorite={favoritesApi.isFavorite}
            onToggleFavorite={favoritesApi.toggleFavorite}
          />
        )}
      </section>
    </>
  );
}

function FavoritesPage({ favoritesApi }) {
  return (
    <>
      <section className="page-intro page-intro--favorites">
        <div className="page-intro__text">
          <p className="eyebrow"><span className="eyebrow__line" /> TU COLECCIÓN PERSONAL</p>
          <h1>Para leer <span>después.</span></h1>
          <p className="page-intro__subtitle">Todo lo que guardaste, en un solo lugar.</p>
        </div>
        <div className="reading-stat">
          <span className="reading-stat__icon" aria-hidden="true">♡</span>
          <span><strong>{favoritesApi.favorites.length}</strong><small>noticias guardadas</small></span>
        </div>
      </section>
      <section className="feed-section" aria-labelledby="favorites-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TU LISTA</p>
            <h2 id="favorites-heading">Tus favoritos</h2>
          </div>
          <span className="result-count">{favoritesApi.favorites.length} noticias</span>
        </div>
        {favoritesApi.error && <p className="inline-notice" role="alert">{favoritesApi.error}</p>}
        <NewsGrid
          articles={favoritesApi.favorites}
          isFavorite={favoritesApi.isFavorite}
          onToggleFavorite={favoritesApi.toggleFavorite}
        />
      </section>
    </>
  );
}

export default function App() {
  const [category, setCategory] = useState('all');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const favoritesApi = useFavorites();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    getLatestNews(category, controller.signal)
      .then(setArticles)
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        const message = requestError.response?.data?.message || requestError.message;
        setError(message || 'Ha ocurrido un error inesperado.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [category, reloadKey]);

  const favoriteCount = useMemo(() => favoritesApi.favorites.length, [favoritesApi.favorites]);

  return (
    <div className="app-shell">
      <Header favoriteCount={favoriteCount} />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <NewsPage
                category={category}
                setCategory={setCategory}
                articles={articles}
                loading={loading}
                error={error}
                retry={() => setReloadKey((current) => current + 1)}
                favoritesApi={favoritesApi}
              />
            }
          />
          <Route path="/favoritos" element={<FavoritesPage favoritesApi={favoritesApi} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        <Brand />
        <span>Menos ruido. Más contexto.</span>
        <span>Noticias de GNews</span>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404 — PÁGINA NO ENCONTRADA</p>
      <h1>Esta noticia se perdió.</h1>
      <Link className="button button--dark" to="/">Volver a explorar</Link>
    </section>
  );
}
