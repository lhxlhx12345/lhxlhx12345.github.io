// generate-sitemap.js – generate a simple sitemap.xml for the Astro site
// Run after `npm run build`. It scans `src/pages` for .astro files and creates `sitemap.xml` at the project root.

const fs = require('fs');
const path = require('path');

// TODO: Replace with your actual domain (GitHub Pages URL or custom domain)
const baseUrl = 'https://lhxlhx12345.github.io'; // site domain

const pagesDir = path.resolve(__dirname, '..', 'src', 'pages');

function getAllPages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const pages = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      pages.push(...getAllPages(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.astro')) {
      // compute route: index.astro => '/', other => '/filename'
      const relative = path.relative(pagesDir, fullPath);
      let route = '/' + relative.replace(/\\/g, '/').replace(/\.astro$/, '');
      if (route.endsWith('/index')) route = route.replace('/index', '/');
      pages.push(route);
    }
  }
  return pages;
}

const routes = getAllPages(pagesDir);

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const route of routes) {
  const loc = `${baseUrl}${route}`;
  sitemap += `  <url><loc>${loc}</loc></url>\n`;
}
sitemap += '</urlset>';

fs.writeFileSync(path.resolve(__dirname, '..', 'sitemap.xml'), sitemap, 'utf8');
console.log('✅ sitemap.xml generated with', routes.length, 'pages.');
