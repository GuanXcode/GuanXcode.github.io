// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://guanxcode.vip',
  output: 'server',
  adapter: vercel(),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/about.html': '/#about',
    '/portfolio.html': '/me#projects',
    '/tags.html': '/blog/',
    '/resume.html': '/me#skills',
  },
});
