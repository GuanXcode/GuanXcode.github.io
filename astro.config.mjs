// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://guanxcode.vip',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/about.html': '/#about',
    '/portfolio.html': '/#projects',
    '/tags.html': '/blog/',
    '/resume.html': '/#skills',
  },
});
