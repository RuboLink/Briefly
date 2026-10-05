# Briefly — Dashboard de noticias

Aplicación de React con JavaScript que consulta la API de noticias de APITube mediante Axios. Permite explorar noticias por categoría y guardar o quitar artículos de favoritos, con persistencia en el almacenamiento local del navegador.

## Requisitos

- Node.js 20 o superior
- Una clave de APITube en `.env` con el nombre `__APITUBE_API_KEY__`

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

> Las peticiones pasan por `/api/news` para evitar el error CORS de APITube y mantener la clave fuera del navegador. En Vercel configura `__APITUBE_API_KEY__` en **Project Settings → Environment Variables** y vuelve a desplegar. En desarrollo local, la misma ruta se proxifica mediante Vite usando la clave del `.env`. Los resultados se limitan al castellano y a los idiomas configurados en el navegador, siempre priorizando el español. «Mundo» consulta noticias globales ordenadas por fecha.
