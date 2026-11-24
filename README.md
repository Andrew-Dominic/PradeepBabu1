# Justin Jefferson Official Website Clone (`jjettas.com`)

A runnable, full-site rebuild of **Justin Jefferson's official web experience** (`https://jjettas.com/`), including its custom Three.js WebGL 3D depth-displaced portrait and sunglasses lens reflection shader, 2.5D depth-map parallax shaders, Lenis smooth scroll choreography, Web Audio API sound engine, and all 7 primary editorial routes plus legal pages.

---

## Target URL

- **Target**: `https://jjettas.com/`

## Run Command

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000`.

To run the pure logic unit test suite:

```bash
npx tsx --test src/utils/cloneLogic.test.ts
```

To run the computed-style assertion gate:

```bash
node scripts/assert-styles.mjs \
  --assertions clone-workspace/03-design-spec/assertions.json \
  --clone-styles clone-workspace/06-qa/cycle-1/clone-styles.json \
  --out clone-workspace/06-qa/cycle-1/metrics.json
```

---

## What Was Cloned

### 1. Routes (`9` total)
- **`/` (Home)**:
  - Sticky `480vh` 3D hero pin (`[data-home-pin]`) with custom Three.js depth-displaced portrait (`JJHero3D`) that dives into Justin Jefferson's sunglasses lens on scroll (`0 → 1` progress) to reveal the dual-card **"CHOOSE YOUR LANE"** stage (`ON-FIELD` vs. `OFF-FIELD`) with live video reflection.
  - **Rookie Card / Stats Teaser**: Interactive 2020 Panini Donruss Rated Rookie card inspector modal, live `8,499` career receiving yards ticker, and 4 highlight stats (`109.1 YPG`, `66.9% Catch Rate`, `4x Pro Bowl`, `2022 OPOY`).
  - **Signature Moments**: 4 interactive 3D-tilting milestone cards (`"Catch of the Century"`, `"Joining the 3K Club"`, `"Making History"`, `"The Griddy Goes Viral"`) with hover video previews and full-screen video lightbox playback.
  - **Foundation Showcase** (`[data-section="foundation"]`): 3 pillar cards (`Youth & Sports`, `Health & Wellness`, `Community Support`), dynamic impact stats (`6,500+`, `15+`, `$75K+`), and interactive hover preview image swap.
  - **Partnerships Showcase** (`[data-section="partnerships"]`): 13-brand partner marquee + interactive 3-slide carousel (`Under Armour`, `Oakley`, `Raising Cane's`) rendered with 2.5D WebGL depth-displacement (`DepthSlide`).
  - **Make A Play CTA** (`[data-section="make-a-play"]`): Interactive football catch transition into `/inquiries`.
- **`/on-field` (On-Field)**:
  - Full-bleed stadium hero (`ON-FIELD — BUILT DIFFERENT`), `QuoteCatch` parallax football (`4th & 18` Buffalo catch), interactive 6-chapter `StatsTimeline` (`2017` LSU to `2024` NFL), live `TotalYards` (`8,499`) counter, full `CareerTable` (`2020–2024` NFL + `2017–2019` College), 16 filterable `RecordBooks` cards with 36 broadcast radio calls (`/audio/onfield/*.m4a`), `Influence` Griddy cutout, `CleatsMarquee` with `DepthSlide` 3D cleats, and 8 `SettingThePace` social reels.
- **`/off-field` (Off-Field)**:
  - Editorial fashion & culture hub (`OFF-FIELD — BEYOND THE GAME`), sticky `LaneNav` (`FASHION`, `DIGITAL`, `APPEARANCES`, `FEATURES`), horizontal `Fashion` lookbook rail (7 looks from Paris Fashion Week to Met Gala), `Digital` Fortnite & Madden 99 Club showcase (`5M+` social reach), `Appearances` rail (7 cultural moments), and interactive `Features` press switcher (5 major magazine covers).
- **`/foundation` (Foundation)**:
  - Warm sand editorial theme (`data-theme="foundation"`), hero (`BIGGER THAN FOOTBALL`), manifesto quote, JJets Foundation emblem, 3 impact stat blocks, 3 expandable community program accordions, and 3 sponsorship tier cards (`Hall of Fame`, `All-Pro`, `Pro Bowl`).
- **`/partnerships` (Partnerships)**:
  - Light sand editorial theme (`data-theme="partnerships"`), 3 featured 2.5D `DepthSlide` campaign cards (`Under Armour`, `Oakley`, `Raising Cane's`), and an expandable 13-partner roster with campaign descriptions, tags, and fullscreen lightbox galleries.
- **`/journal` (Journal)**:
  - Archive of 21 editorial artifacts across `FOOTWEAR`, `FASHION`, `CULTURE`, `GAMING`, and `COMMUNITY`, with category filter tabs, dual view modes (**Index Grid** and **Infinite Draggable 2D Canvas**), 2.5D depth cards, and deep-linked item inspection drawer (`?item=cleat-lv`).
- **`/inquiries` (Inquiries)**:
  - Deep purple atmosphere (`data-theme="inquiries"`) with pebble/vignette textures, 3 selectable representation channels (`Partnerships`, `Media & Press`, `Booking & Appearances`), and an interactive brief submission form.
- **`/privacy` & `/terms`**:
  - Legal documentation routes linked from the global footer and navigation overlay.

### 2. Breakpoints & Responsive Behavior
- **Desktop (`1440×900`)**: Fluid viewport unit `--vu: calc(min(1vw, 1.6 * 1vh))` scaling display typography (`h2` at `calc(21.76 * var(--vu)) = 313.344px`), 12-column grids, sticky 3D hero pin, and custom mouse follower cursor (`[data-interaction-cursor="true"]`).
- **Tablet (`768×1024`) & Mobile (`390×844`)**: Mobile-optimized 3D hero textures (`diffuse-phone.webp`, `depth-phone.webp`, `alpha-phone.png`), responsive header padding, and stacked single-column card grids with zero horizontal overflow.

### 3. Interactive States & Motion
- **Global Navigation Overlay (`#site-navigation`)**: Triggered by `[data-hamburger="true"]`, featuring staggered route index links (`01`–`07`), featured journal preview card (`?item=cleat-lv`), animated Lottie signature (`/signature/optimised.json`), and social links.
- **Web Audio API Sound Engine (`AudioEngine.ts`)**: Controlled via `[data-sound-toggle="true"]`, playing ambient background bed (`/audio/bed.m4a`), UI hover/click/reveal/slide SFX, and 36 on-field broadcast calls.

---

## Assets & Font Wiring

All assets are served locally from `/public/` with zero external hotlinks:
- **3D & Depth Assets**: `/public/3d-hero/textures/` (`diffuse.webp`, `depth.webp`, `alpha.png`, `reflection-2.png`, `shades-logo.png`, `shades-reflection-1.png`, `reflection.mp4`, plus `-phone` variants), `/public/on-field/cleats/`, `/public/partners/`, and `/public/placeholders/`.
- **CMS & Editorial Photography**: All 264 Sanity CMS images mirrored locally under `/public/sanity/images/` and 8 Instagram reel snapshots under `/public/reels-snapshot/ig-*.jpg`.
- **Typography**: Local WOFF2 fonts in `/public/_next/static/media/` and `/public/fonts/beachwood-variable.woff2` (`beachwood-variable`, `monument-grotesk`, `monument-grotesk-mono`, `editorial-new`).
- **Audio**: 15 UI SFX files in `/public/audio/` + 36 broadcast audio clips in `/public/audio/onfield/`.

---

## Final Assertion Results

- **Style Assertion Gate (`scripts/assert-styles.mjs`)**: **31 / 31 passed (`0` failures)** across `html`, `body`, `header`, `[data-home-pin]`, `[data-section="foundation"]`, `[data-section="partnerships"]`, `[data-section="make-a-play"]`, `[data-footer]`, `h1`, `h2`, and `h3`.
- **Unit Tests (`src/utils/cloneLogic.test.ts`)**: **5 / 5 passed (`0` failures)**.

---

## Known Gaps

- External Vimeo HLS live streams for full-length broadcast reels are represented with local MP4 reflection loops (`/3d-hero/textures/reflection.mp4`) and interactive modal previews so the application runs 100% self-contained offline without third-party streaming credentials.
