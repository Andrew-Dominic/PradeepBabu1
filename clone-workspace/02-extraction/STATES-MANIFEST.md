# Interactive States & Motion Manifest — `https://jjettas.com/`

## 1. Global Chrome (`SiteFrame`)
- **Fixed Header (`header[data-nav="true"]`)**:
  - Contains JJ mark (`a[data-nav-logo="true"]`) with `/svg/logo.svg` and Menu toggle button (`button[data-hamburger="true"]`).
  - `data-state="closed"` -> `"open"` toggles `#site-navigation[data-open="true"]`.
- **Full-Screen Navigation Overlay (`#site-navigation`)**:
  - Displays 7 primary routes (`Home`, `On-Field`, `Off-Field`, `Foundation`, `Partnerships`, `Journal`, `Inquiries`) with index numbers `01`–`07` and hover sound (`/audio/hover.m4a`).
  - Featured Journal preview card (`?item=cleat-lv`, Monogram PE Gold Cleat) with 2.5D `DepthSlide` canvas.
  - Animated Lottie signature (`/signature/optimised.json`).
  - Social links (`Instagram`, `TikTok`, `X`, `Twitch`) and Legal links (`Privacy`, `Terms`).
- **Sound Toggle (`button[data-sound-toggle="true"]`)**:
  - Bottom-right fixed button toggling Web Audio API engine (`bed.m4a` ambient loop + UI SFX).
- **Custom Cursor (`div[data-interaction-cursor="true"]`)**:
  - Tracks pointer coordinates with contextual labels (`Watch`, `Drag`, `Explore`, `View`).

## 2. Home Route (`/`)
- **Hero Stage (`[data-section="home-stage"]` / `[data-home-pin]`)**:
  - `JJHero3D` WebGL canvas with mouse-driven parallax tilt and scroll-driven camera zoom (`z: 2.65 -> 0.565`) diving through the right sunglasses lens into the highlight video.
  - Giant SVG wordmarks (`/svg/justin.svg`, `/svg/jefferson.svg`).
  - Editorial story copy and interactive 2020 Rookie Card modal trigger (`[data-hero-card="true"]`).
- **Signature Moments (`[data-home-moments="true"]`)**:
  - Yardline markers (`10 20 30 40 50 40 30 20 10`).
  - 5 holographic 3D-tilt trading cards (`The Peach Bowl`, `Single Season Record`, `The Catch`, `Offensive Player of the Year`, `Pro Bowl Selection`).
  - Clicking any card opens the video highlight lightbox modal with audio commentary.
- **Quote & Photo Stack (`[data-section="quote-photos"]`)**:
  - `"I want people to remember me for more than football"` over `/textures/grass.webp` and purple tone backdrop.
  - Interactive photo stack of 3 framed editorial portraits that cycle on click/scroll.
- **Foundation Section (`[data-section="foundation"]`)**:
  - `"Building something that lasts"` with 5-card horizontal drag/snap gallery (`[data-snap-rail="true"]`).
- **Partnerships Showcase (`[data-section="partnerships"]`)**:
  - Infinite partner logo marquee (`@keyframes jj-partner-marquee`).
  - 6 interactive featured partner tabs (`Under Armour`, `Gatorade`, `Pepsi`, `General Mills`, `Oakley`, `Beats`) with 2.5D `DepthSlide` WebGL preview and campaign modal/video support.
- **Make A Play (`[data-section="make-a-play"]`)**:
  - `"18 is gonna go out there and make a play"` with dual counter-scrolling polaroid/card rails (`12` cards linking to respective sections).

## 3. Secondary Routes
- **`/on-field`**: Hero video & Vikings badge, `"Records are meant to be broken"`, interactive Career Stats Timeline (`2020`–`2026`), Live Total Yards counter (`8,873`), full NFL Career Table, 16 Record Book cards filterable by category (`All`, `Fastest`, `Youngest`, `First`, `Only`, `Most`) with audio replay clips (`/audio/onfield/*.m4a`), Griddy Influence cutout, 2.5D Cleats Marquee, and Instagram Reels carousel (`Setting the Pace`).
- **`/off-field`**: Hero print, `"How you show up matters as much as what you do"`, sticky Lane Nav (`Fashion`, `Digital`, `Appearances`, `Features`), horizontal Fashion gallery, Digital social stats & phone video grid, Appearances rail, and interactive Features switcher (`The Undercovers`, `GetYourGuide Rome`, `Going Global`, `GQ Sports`, `Under Armour Doc`, `A Football Life`, `Mic'd Up`).
- **`/foundation`**: Hero photos, `"BUILDING MINDSETS THAT PERFORM AND CREATE MEANINGFUL CHANGE"`, JJets Foundation mission logo, 8-photo collage, Impact Stats (`1,443 Kids Impacted`, `$105K Money Raised`, `7 Schools Supported`), 3 Programs (`Football Camp`, `Fashion Show`, `Turkey Drive`), and 3 Sponsorship Tiers (`Supporter`, `Fan`, `Superstar`).
- **`/partnerships`**: Light sand theme with `/textures/light-01.webp` wash and interactive list of all 13 brand partnerships (`Under Armour`, `Gatorade`, `Pepsi`, `General Mills`, `Oakley`, `Raising Cane's`, `Beats`, `Lowe's`, `U.S. Bank`, `EA Sports`, `Little Caesars`, `Abercrombie & Fitch`, `Sleep Number`) with expandable galleries.
- **`/journal`**: Interactive 2D draggable/pannable canvas of 21 Journal items (with category filters `All`, `Feature`, `Big Moment`, `Collaboration`, `Style`, `Footwear`, `Cards`, `Campaign`, `Eyewear`, `News`, `Digital` and detail drawer supporting `?item=cleat-lv`).
- **`/inquiries`**: Deep purple pebble/leather backdrop with `"PARTNER WITH JUSTIN"` and interactive inquiry category selector (`Partnerships`, `Media & Press`, `Booking & Appearances`) + inquiry form.
