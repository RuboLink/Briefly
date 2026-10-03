# Briefly — Dashboard de noticias

Aplicación de React con JavaScript que consulta GNews mediante Axios. Permite explorar noticias por categoría y guardar o quitar artículos de favoritos, con persistencia en el almacenamiento local del navegador.

## Requisitos

- Node.js 20 o superior
- Una clave de GNews en `.env` con `GNEWS_API_KEY` o `__GNEWS_API_KEY__`

También se admiten los nombres de variable `APIKEY_CURRENT` o `__CURRENTS_API_KEY__` si conservas la configuración anterior.

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

> La clave se incorpora a la aplicación cliente para que el navegador pueda llamar a GNews. Por ello, queda visible para quien inspeccione el tráfico o los archivos compilados. Para un despliegue público, utiliza una clave limitada o coloca las peticiones detrás de un backend.
