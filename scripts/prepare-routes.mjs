import fs from 'fs';
import path from 'path';

const ROUTES = [
  'home',
  'on-field',
  'off-field',
  'foundation',
  'partnerships',
  'journal',
  'inquiries',
  'privacy',
  'terms',
];

const LOCAL_VIDEO_UUIDS = [
  'a6226ad6-724a-4beb-8923-f021bc92c1d0',
  '682c1738-0725-442b-9c06-eddc1d499b1d',
  '5a6411a7-99fd-48a9-b7c4-ef0a3fe04152',
  'df40c88a-9166-4ff6-a11c-e00e939b7afe',
  'eae64093-2258-41fd-9e38-cc4921c7276c',
  '4bdeef73-cb99-489a-af9b-590ccbd33886',
  '2e11fb02-f0c0-4661-8c97-94961a64b1ac',
  '5e61be2e-3c28-440f-a7d0-9fa131bb4b7a',
];

const srcDir = 'clone-workspace/02-extraction/live-routes';
const outDir = 'public/rsc-routes';
fs.mkdirSync(outDir, { recursive: true });

function rewriteUrls(text) {
  let out = text;

  // 1. Decode /_next/image?url=... in HTML (&amp; or &)
  out = out.replace(
    /\/_next\/image\?url=([^"&\\\s]+)(?:&amp;|&)w=\d+(?:&amp;|&)q=\d+/g,
    (_, encodedUrl) => {
      try {
        let decoded = decodeURIComponent(encodedUrl);
        decoded = decoded.replace(
          /^https:\/\/cdn\.sanity\.io\/images\/zil8k06j\/production\//,
          '/sanity/images/'
        );
        return decoded;
      } catch {
        return _;
      }
    }
  );

  // 2. Replace direct Sanity image URLs with local /sanity/images/
  out = out.replace(
    /https:\/\/cdn\.sanity\.io\/images\/zil8k06j\/production\//g,
    '/sanity/images/'
  );

  // 3. Replace Hero reflection video URLs with local /3d-hero/textures/reflection*.mp4
  out = out.replace(
    /https:\/\/vz-e818877b-c14\.b-cdn\.net\/67930c38-9688-44a9-a18c-abdd33993820\/play_1080p\.mp4#sanity=zil8k06j\/production\/7fa83d5c29e25cda0579fd884b811805dc089054\.mp4/g,
    '/3d-hero/textures/reflection.mp4'
  );
  out = out.replace(
    /https:\/\/vz-e818877b-c14\.b-cdn\.net\/67930c38-9688-44a9-a18c-abdd33993820\/play_720p\.mp4#sanity=zil8k06j\/production\/7fa83d5c29e25cda0579fd884b811805dc089054\.mp4/g,
    '/3d-hero/textures/reflection-phone.mp4'
  );

  // 4. Replace downloaded Home & Partnership BunnyCDN video UUIDs with local /videos/<uuid>.mp4
  for (const uuid of LOCAL_VIDEO_UUIDS) {
    const pattern = new RegExp(
      `https://vz-e818877b-c14\\.b-cdn\\.net/${uuid}/play_\\d+p\\.mp4(?:#[^"\\\\\\s<]*)?`,
      'g'
    );
    out = out.replace(pattern, `/videos/${uuid}.mp4`);
  }

  // 5. Replace Vercel deployment ID with cache-busting deployment ID matching client runtime
  out = out.replace(
    /dpl_B6r43D1sg9kPDLaRWJLRCWTPSzbq/g,
    'dpl_B6r43D1sg9kPDLaRWJLRCWTPjj07'
  );

  // 6. Rewrite external Adobe Typekit URL to local /_next/static/css/typekit-local.css
  out = out.replace(
    /https:\/\/use\.typekit\.net\/asi3hwd\.css/g,
    '/_next/static/css/typekit-local.css'
  );

  return out;
}

const syncBootstrapScript = `<script>(function(){var cs=document.currentScript;if(cs&&cs.parentNode)cs.parentNode.removeChild(cs);if(window.__JJETTAS_RUNTIME_INSTALLED__)return;window.__JJETTAS_RUNTIME_INSTALLED__=true;var S={"/":"home","/on-field":"on-field","/off-field":"off-field","/foundation":"foundation","/partnerships":"partnerships","/journal":"journal","/inquiries":"inquiries","/privacy":"privacy","/terms":"terms"};var nf=window.fetch.bind(window);window.fetch=function(input,init){try{var raw=typeof input==="string"?input:input instanceof URL?input.toString():input.url;var u=new URL(raw,window.location.origin);var h=new Headers(init&&init.headers||(input instanceof Request?input.headers:undefined));var isRsc=h.get("rsc")==="1"||h.get("RSC")==="1"||u.searchParams.has("_rsc");if(u.origin===window.location.origin&&isRsc){var p=u.pathname==="/"?"/":u.pathname.replace(/\\/+$/,"");var slug=S[p];if(slug){return nf("/rsc-routes/"+slug+".rsc?v=jj07").then(function(r){return r.text()}).then(function(b){return new Response(b,{status:200,headers:{"content-type":"text/x-component; charset=utf-8","x-nextjs-stale-time":"300"}})})}}}catch(e){}return nf(input,init)};window.addEventListener("error",function(ev){var t=ev.target;if(t&&t.tagName==="VIDEO"){var src=t.getAttribute("src")||t.currentSrc||"";var idx=src.indexOf("#sanity=");if(idx!==-1&&!t.dataset.sanityFallbackTried){t.dataset.sanityFallbackTried="1";var sp=new URLSearchParams(src.slice(idx+1)).get("sanity");if(sp){t.src="https://cdn.sanity.io/files/"+sp;t.load();t.play().catch(function(){});return}}if(!t.dataset.localFallbackTried){t.dataset.localFallbackTried="1";t.src="/3d-hero/textures/reflection.mp4";t.load();t.play().catch(function(){})}}},true);function unlockLoader(){var el=document.querySelector("[data-home-loader]");if(el){el.style.transition="opacity 320ms ease, transform 420ms cubic-bezier(0.65,0.05,0.36,1)";el.style.opacity="0";el.style.pointerEvents="none";el.style.transform="translate3d(-110%,0,0)";setTimeout(function(){if(el){el.style.visibility="hidden";el.style.display="none"}},380)}document.documentElement.style.overflow="";if(document.body)document.body.style.overflow=""}setTimeout(unlockLoader,1600);setTimeout(unlockLoader,2600)})();</script>`;

for (const slug of ROUTES) {
  const rawHtml = fs.readFileSync(path.join(srcDir, `${slug}.html`), 'utf8');
  const rawRsc = fs.readFileSync(path.join(srcDir, `${slug}.rsc`), 'utf8');

  let cleanHtml = rewriteUrls(rawHtml);
  const cleanRsc = rewriteUrls(rawRsc);

  if (!cleanHtml.includes('__JJETTAS_RUNTIME_INSTALLED__')) {
    cleanHtml = cleanHtml.replace('<head>', `<head>${syncBootstrapScript}`);
  }

  fs.writeFileSync(path.join(outDir, `${slug}.html`), cleanHtml);
  fs.writeFileSync(path.join(outDir, `${slug}.rsc`), cleanRsc);

  console.log(
    `Prepared ${slug}: html=${cleanHtml.length}B, rsc=${cleanRsc.length}B`
  );
}

const homeHtmlForBuild = fs
  .readFileSync(path.join(outDir, 'home.html'), 'utf8')
  .replace(
    '</body>',
    '<script type="module" src="/src/main.tsx"></script></body>'
  );
fs.writeFileSync('index.html', homeHtmlForBuild);
console.log('Updated root index.html');
