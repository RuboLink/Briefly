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

> APITube permite peticiones desde el navegador en cualquier origen, pero Vite incorpora la clave al cliente y queda visible en el tráfico y los archivos compilados. Para un despliegue público, utiliza una clave de prueba con restricciones o mueve las peticiones a un backend para proteger la clave.
