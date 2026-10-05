# Briefly — Dashboard de noticias

Aplicación de React con JavaScript que consulta NewsAPI mediante Axios. Permite explorar noticias por categoría y guardar o quitar artículos de favoritos, con persistencia en el almacenamiento local del navegador.

## Requisitos

- Node.js 20 o superior
- Una clave de NewsAPI en `.env` con el nombre `__NEWS_API_KEY__`

## Desarrollo

```bash
npm install
npm run dev
```

Para generar una compilación de producción:

```bash
npm run build
npm run preview
```

La aplicación ofrece las páginas **Explorar** y **Favoritos**. Los favoritos se guardan en `localStorage` bajo la clave `briefly-favorite-news-v1`; su persistencia corresponde al perfil del navegador y no a una cuenta de usuario.

> Vite incorpora la clave a la aplicación cliente para que el navegador pueda llamar a NewsAPI. Por ello, queda visible para quien inspeccione el tráfico o los archivos compilados. Además, el plan Developer de NewsAPI está limitado al desarrollo y restringe las peticiones de navegador a `localhost`; para producción, usa un plan que permita ese origen o realiza las peticiones desde un backend y no publiques la clave.
