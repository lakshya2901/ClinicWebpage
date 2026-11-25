import { defineConfig } from 'vite';
import { config } from './src/config.js';
import { renderApp, renderJsonLd } from './src/templates/sections.js';

/**
 * Renders the page markup from src/config.js at build/dev time, so the shipped HTML is fully
 * static (good for SEO and LCP) while all copy still lives in one config file.
 */
function renderFromConfig() {
  return {
    name: 'render-from-config',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
        return html
          .replace('<!--APP-->', renderApp(config))
          .replace('<!--JSONLD-->', renderJsonLd(config))
          .replaceAll('%TITLE%', esc(config.site.title))
          .replaceAll('%DESCRIPTION%', esc(config.site.description))
          .replaceAll('%URL%', esc(config.site.url))
          .replaceAll('%OGIMAGE%', esc(config.site.url + config.site.ogImage))
          .replaceAll('%SITENAME%', esc(config.clinic.name))
          .replaceAll('%LOCALE%', esc(config.site.locale));
      },
    },
  };
}

// Reload the browser when content/templates change in dev.
function reloadOnContentChange() {
  return {
    name: 'reload-on-content-change',
    handleHotUpdate({ file, server }) {
      if (/src[\\/](config|templates)/.test(file)) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
}

export default defineConfig({
  plugins: [renderFromConfig(), reloadOnContentChange()],
  build: { target: 'es2020', chunkSizeWarningLimit: 700 },
});
