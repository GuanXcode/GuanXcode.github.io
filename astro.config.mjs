// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://guanxcode.vip',
  output: 'server',
  adapter: vercel(),
  // Keep content data-store alongside .astro/ so `astro sync` and `astro dev` share one cache
  cacheDir: './.astro',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/about.html': '/#about',
    '/portfolio.html': '/me#projects',
    '/tags.html': '/research/',
    '/blog': '/research/',
    '/works': '/projects/',
    '/resume.html': '/me#skills',
  },
});
