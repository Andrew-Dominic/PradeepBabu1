# Architecture & Component Map — `https://jjettas.com/` Clone

- `/src/index.css`: Complete compiled CSS from `jjettas.com` + `@font-face` declarations for `beachwood-variable`, `fontBody`, `fontMono`, `fontNuMono`.
- `/src/data/extractedRsc.json`: Complete Sanity CMS & RSC payload data for all routes with local `/sanity/images/` paths.
- `/src/utils/cloneLogic.ts` & `/src/utils/cloneLogic.test.ts`: Decoupled pure logic for 3D camera dive interpolation, yardline formatting, route theme resolution, and stat calculations, verified via `node:test`.
- `/src/components/AudioEngine.ts`: Web Audio API synthesizer & `/audio/*.m4a` sample player.
- `/src/components/JJHero3D.tsx`: Three.js WebGL depth-displaced portrait + sunglasses lens reflection shader (`diffuse.webp`, `depth.webp`, `alpha.png`, `reflection-2.png`, `shades-reflection-1.png`, `shades-logo.png`, `reflection.mp4` with canvas fallback and `isSoftwareGl` frame pacing).
- `/src/components/DepthSlide.tsx`: Three.js 2.5D depth-map parallax shader for cleats, partnerships, and journal cards.
- `/src/components/SiteFrame.tsx`: Global header, hamburger menu overlay (`#site-navigation`), Lottie signature (`/signature/optimised.json`), interactive cursor (`[data-interaction-cursor]`), sound toggle (`[data-sound-toggle]`), and dynamic route footer (`footer[data-footer="true"]`).
- `/src/pages/HomePage.tsx`: Complete Home page with 3D hero stage, Rookie Card modal, Signature Moments 3D cards & video lightbox, Quote & Photo stack, Foundation snap gallery, Partnerships showcase with 2.5D `DepthSlide`, and Make A Play dual marquee rails.
- `/src/pages/OnFieldPage.tsx`: On-Field route with Hero video, Career Stats Timeline, Live Total Yards, NFL Career Table, 16 Record Book cards with audio clips, Influence cutout, Cleats Marquee, and Instagram Reels.
- `/src/pages/OffFieldPage.tsx`: Off-Field route with Hero print, Quote, Lane Nav, Fashion rail, Digital grid, Appearances rail, and Features switcher.
- `/src/pages/FoundationPage.tsx`: Foundation route with Hero, Manifesto, JJets Foundation logo, Collage, Impact Stats, Programs, and Tiers.
- `/src/pages/PartnershipsPage.tsx`: Partnerships route with light sand theme and 13 expandable brand partnerships.
- `/src/pages/JournalPage.tsx`: Interactive 2D draggable/filterable Journal canvas + item detail modal (`?item=cleat-lv`).
- `/src/pages/InquiriesPage.tsx`: Inquiries route with category tabs and interactive contact form.
- `/src/pages/LegalPage.tsx`: Privacy and Terms routes.
