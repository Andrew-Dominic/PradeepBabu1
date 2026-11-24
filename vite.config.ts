import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

const ROUTE_SLUGS: Record<string, string> = {
  '/': 'home',
  '/on-field': 'on-field',
  '/off-field': 'off-field',
  '/foundation': 'foundation',
  '/partnerships': 'partnerships',
  '/journal': 'journal',
  '/inquiries': 'inquiries',
  '/privacy': 'privacy',
  '/terms': 'terms',
};

function jjettasRoutesPlugin(): Plugin {
  return {
    name: 'jjettas-routes-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        res.setHeader(
          'Cache-Control',
          'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        const parsed = new URL(req.url, 'http://localhost:3000');
        const cleanPath =
          parsed.pathname === '/'
            ? '/'
            : parsed.pathname.replace(/\/+$/, '');

        // 1. Next.js RSC Flight navigation requests
        const isRsc =
          req.headers['rsc'] === '1' || parsed.searchParams.has('_rsc');
        const slug = ROUTE_SLUGS[cleanPath];

        if (isRsc && slug) {
          const rscPath = path.resolve(
            __dirname,
            'public/rsc-routes',
            `${slug}.rsc`
          );
          if (fs.existsSync(rscPath)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/x-component; charset=utf-8');
            res.setHeader('x-nextjs-stale-time', '300');
            res.end(fs.readFileSync(rscPath));
            return;
          }
        }

        // 2. Direct /_next/image requests -> redirect to local asset
        if (cleanPath === '/_next/image') {
          const target = parsed.searchParams.get('url');
          if (target) {
            const localUrl = decodeURIComponent(target).replace(
              /^https?:\/\/cdn\.sanity\.io\/images\/zil8k06j\/production\//,
              '/sanity/images/'
            );
            res.statusCode = 302;
            res.setHeader('Location', localUrl);
            res.end();
            return;
          }
        }

        // 3. Direct HTML route loads (/, /on-field, /off-field, /foundation, /partnerships, /journal, /inquiries, /privacy, /terms)
        if (
          req.method === 'GET' &&
          slug &&
          !parsed.pathname.includes('.')
        ) {
          const htmlPath = path.resolve(
            __dirname,
            'public/rsc-routes',
            `${slug}.html`
          );
          if (fs.existsSync(htmlPath)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(fs.readFileSync(htmlPath));
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [jjettasRoutesPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
