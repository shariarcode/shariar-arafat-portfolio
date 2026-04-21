import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const constantsPath = resolve(root, 'src/constants.ts');
const robotsPath = resolve(root, 'public/robots.txt');
const sitemapPath = resolve(root, 'public/sitemap.xml');

const rawConstants = readFileSync(constantsPath, 'utf8');

const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://yourwebsite.com').replace(/\/+$/, '');
const urlRegex = /url:\s*["'`](\/blog\/[^"'`]+)["'`]/g;
const blogUrls = new Set();

let match;
while ((match = urlRegex.exec(rawConstants)) !== null) {
  blogUrls.add(match[1]);
}

const robotsContent = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
writeFileSync(robotsPath, robotsContent, 'utf8');

const sitemapEntries = [
  { loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0' },
  ...Array.from(blogUrls).map((path) => ({
    loc: `${siteUrl}${path}`,
    changefreq: 'monthly',
    priority: '0.8',
  })),
];

const sitemapBody = sitemapEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n');

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapBody}
</urlset>
`;

writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log(`Generated robots.txt and sitemap.xml for ${siteUrl}`);
