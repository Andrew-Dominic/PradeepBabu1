// Bootstrap runtime for the authentic pradeepbabu.com Next.js client bundle

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

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function normalizeAssetUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl;
  let out = rawUrl;
  if (out.startsWith('/_next/image')) {
    try {
      const parsed = new URL(out, window.location.origin);
      const inner = parsed.searchParams.get('url');
      if (inner) {
        out = decodeURIComponent(inner);
      }
    } catch {
      // ignore
    }
  }
  if (out.includes('cdn.sanity.io/images/zil8k06j/production/')) {
    out = out.replace(
      /https?:\/\/cdn\.sanity\.io\/images\/zil8k06j\/production\//g,
      '/sanity/images/'
    );
  }
  return out;
}

declare global {
  interface Window {
    __JJETTAS_RUNTIME_INSTALLED__?: boolean;
  }
}

export function installJjettasRuntime(): void {
  if (typeof window === 'undefined' || window.__JJETTAS_RUNTIME_INSTALLED__) {
    return;
  }
  window.__JJETTAS_RUNTIME_INSTALLED__ = true;

  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    try {
      const rawUrl =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      const url = new URL(rawUrl, window.location.origin);

      const headers = new Headers(
        init?.headers || (input instanceof Request ? input.headers : undefined)
      );
      const isRsc =
        headers.get('rsc') === '1' ||
        headers.get('RSC') === '1' ||
        url.searchParams.has('_rsc');

      if (url.origin === window.location.origin && isRsc) {
        const cleanPath = normalizePathname(url.pathname);
        const slug = ROUTE_SLUGS[cleanPath];
        if (slug) {
          const rscRes = await nativeFetch(`/rsc-routes/${slug}.rsc`);
          const rscBody = await rscRes.text();
          return new Response(rscBody, {
            status: 200,
            headers: {
              'content-type': 'text/x-component; charset=utf-8',
              'x-nextjs-stale-time': '300',
            },
          });
        }
      }

      if (url.origin === window.location.origin && url.pathname === '/_next/image') {
        const innerUrl = url.searchParams.get('url');
        if (innerUrl) {
          return nativeFetch(normalizeAssetUrl(innerUrl), init);
        }
      }
    } catch {
      // Fall through to nativeFetch
    }
    return nativeFetch(input, init);
  };

  // Global video fallback listener so any blocked external stream falls back cleanly
  window.addEventListener(
    'error',
    (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLVideoElement) {
        const src = target.getAttribute('src') || target.currentSrc || '';
        const hashIdx = src.indexOf('#sanity=');
        if (hashIdx !== -1 && !target.dataset.sanityFallbackTried) {
          target.dataset.sanityFallbackTried = '1';
          const params = new URLSearchParams(src.slice(hashIdx + 1));
          const sanityPath = params.get('sanity');
          if (sanityPath) {
            target.src = `https://cdn.sanity.io/files/${sanityPath}`;
            target.load();
            target.play().catch(() => {});
            return;
          }
        }
        if (!target.dataset.localFallbackTried) {
          target.dataset.localFallbackTried = '1';
          target.src = '/3d-hero/textures/reflection.mp4';
          target.load();
          target.play().catch(() => {});
        }
      }
    },
    true
  );
}

installJjettasRuntime();
