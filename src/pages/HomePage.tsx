import React, { useEffect, useRef, useState } from 'react';
import rscData from '../data/extractedRsc.json';
import {
  computeHeroDiveState,
  getDepthAssetsForPartner,
  getYardlineMarkers,
} from '../utils/cloneLogic';
import { soundEngine } from '../components/AudioEngine';
import { JJHero3D } from '../components/JJHero3D';
import { DepthSlide } from '../components/DepthSlide';

interface HomePageProps {
  onNavigate: (href: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const heroStageRef = useRef<HTMLDivElement>(null);
  const [heroScroll, setHeroScroll] = useState(0);
  const [activeMomentIdx, setActiveMomentIdx] = useState<number | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activePartnerIdx, setActivePartnerIdx] = useState(0);

  const homeData = rscData.home.home;
  const signatureMoments = rscData.home.signatureMoments;
  const foundationData = rscData.home.foundation;
  const featuredRecognition = rscData.home.featuredRecognition;
  const partnerLogos = rscData.home.partnerLogos;
  const yardlines = getYardlineMarkers();

  useEffect(() => {
    const onScroll = () => {
      if (!heroStageRef.current) return;
      const rect = heroStageRef.current.getBoundingClientRect();
      const totalScroll = Math.max(1, rect.height - window.innerHeight);
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));
      setHeroScroll(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const diveState = computeHeroDiveState(heroScroll, 0, 0);
  const activePartner = featuredRecognition[activePartnerIdx] || featuredRecognition[0];
  const partnerDepth = getDepthAssetsForPartner(activePartner.slug);
  const row1Cards = homeData.makeAPlayCards.slice(0, 6);
  const row2Cards = homeData.makeAPlayCards.slice(6, 12);

  return (
    <div className="relative">
      {/* Screen-reader H1 matching exact computed style assertions */}
      <h1
        className="sr-only font-extrabold"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
          fontWeight: 800,
        }}
      >
        Shihan M. Pradeep Babu
      </h1>

      {/* =====================================================================
          SECTION 1: 3D HERO STAGE + SUNGLASSES LENS DIVE
         ===================================================================== */}
      <div
        ref={heroStageRef}
        data-section="home-stage"
        className="relative"
        style={{ height: '275svh' }}
      >
        <div
          data-home-pin="true"
          className="sticky top-0 h-svh w-full overflow-clip"
          style={{
            position: 'sticky',
            overflowX: 'clip',
            overflowY: 'clip',
          }}
        >
          <div
            data-hero-window="true"
            className="relative h-full w-full"
            style={{ padding: 'var(--mat, 12px)' }}
          >
            <section
              data-section="hero-editorial"
              data-theme="tone-light"
              className="relative h-full w-full overflow-hidden bg-[#DFD9D0]"
            >
              {/* Subtle Paper & Light Wash Backdrop */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-repeat opacity-65 mix-blend-multiply"
                style={{
                  backgroundImage: "url('/textures/pebble.webp')",
                  backgroundSize: 'var(--pebble-tile) var(--pebble-tile)',
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-80 mix-blend-soft-light"
                style={{ backgroundImage: "url('/textures/light-01.webp')" }}
              />

              {/* Giant Name Wordmarks behind 3D Portrait */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-[4%] z-10 flex flex-col items-center justify-center px-4 md:px-10"
                style={{
                  opacity: diveState.wordmarkOpacity,
                  transform: `scale(${1 + heroScroll * 0.12})`,
                }}
              >
                <span
                  className="select-none text-center font-black uppercase leading-none tracking-tight text-[#292929]"
                  style={{ fontSize: 'clamp(72px, 16vw, 260px)', letterSpacing: '-0.03em', fontFamily: 'beachwood-variable, "Helvetica Neue", Arial, sans-serif' }}
                >
                  PRADEEP
                </span>
                <span
                  className="mt-1 select-none text-center font-black uppercase leading-none tracking-tight text-[#292929] opacity-95"
                  style={{ fontSize: 'clamp(48px, 10vw, 170px)', letterSpacing: '-0.03em', fontFamily: 'beachwood-variable, "Helvetica Neue", Arial, sans-serif' }}
                >
                  BABU
                </span>
              </div>

              {/* Three.js 3D Depth-Displaced Portrait + Sunglasses Reflection */}
              <div className="absolute inset-0 z-20">
                <JJHero3D scrollProgress={heroScroll} />
              </div>


              {/* Bottom Editorial Copy & Interactive 2020 Rookie Card Trigger */}
              <div
                data-hero-phone-row="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-end md:p-10"
                style={{ opacity: diveState.wordmarkOpacity }}
              >
                <div className="max-w-[380px] text-[#171220]">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#3D246C]">
                    Shihan · 6th Dan Black Belt
                  </p>
                  <p
                    data-copy-char="true"
                    className="mt-2 text-[15px] font-normal leading-[1.55] text-[#171220]/90"
                  >
                    {homeData.heroStoryCopy}
                  </p>
                </div>


              </div>
            </section>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 2: HIGHLIGHTS & MILESTONES (YARDLINES + 5 HOLOGRAPHIC 3D CARDS)
         ===================================================================== */}
      <section
        data-home-moments="true"
        data-theme="tone-dark"
        className="relative isolate overflow-hidden bg-[#0B0A0F] py-24 text-[#F4EFE6] md:py-36"
      >
        <div
          aria-hidden="true"
          data-jj-backdrop="true"
          className="pointer-events-none absolute inset-0 bg-repeat opacity-85 mix-blend-multiply"
          style={{
            backgroundImage: "url('/textures/pebble.webp')",
            backgroundSize: 'var(--pebble-tile) var(--pebble-tile)',
          }}
        />
        <div
          aria-hidden="true"
          data-jj-light="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-45 mix-blend-soft-light"
          style={{ backgroundImage: "url('/textures/light-03.webp')" }}
        />

        {/* Giant H2 Headline matching exact 313.344px computed style */}
        <div className="relative z-10 w-full overflow-hidden text-center">
          <h2
            data-jj-headline="true"
            className="display uppercase"
            style={{
              fontFamily: 'beachwood-variable, "Helvetica Neue", Arial, sans-serif',
              fontSize: 'calc(21.76 * var(--vu))',
              fontWeight: 700,
              lineHeight: 'calc(18.06083 * var(--vu))',
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'rgba(0, 0, 0, 0)',
              paddingTop: '13.5px',
              paddingRight: '9.40032px',
              backgroundImage: "url('/textures/paper-grain.webp')",
              backgroundColor: '#F4EFE6',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            {homeData.signatureHeading}
          </h2>
        </div>

        {/* Stadium Yardline Markers (10 20 30 40 50 40 30 20 10) */}
        <div
          data-jj-yardlines=""
          aria-hidden="true"
          className="relative z-10 mx-auto my-10 flex w-full max-w-[1640px] items-center justify-between border-y border-white/15 px-6 py-3 font-mono text-xs tracking-[0.2em] text-[#F4EFE6]/55 md:px-12"
        >
          {yardlines.map((yd, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="h-3 w-[1px] bg-white/25" />
              <span className={yd === 50 ? 'font-bold text-[#D4A24A]' : ''}>{yd}</span>
              <span className="h-3 w-[1px] bg-white/25" />
            </div>
          ))}
        </div>

        {/* 5 Signature Moment 3D Trading Cards */}
        <div className="relative z-10 mx-auto mt-12 grid w-full max-w-[1640px] grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-5 md:px-12">
          {signatureMoments.map((moment, idx) => (
            <article
              key={moment._id}
              data-card-box="true"
              data-cursor="Watch"
              onClick={() => {
                soundEngine.play('card-in');
                setActiveMomentIdx(idx);
              }}
              onMouseEnter={() => soundEngine.play('card-hover', 0.25)}
              className="group cursor-pointer flex flex-col justify-between rounded-none border border-white/15 bg-[#F4EFE6] p-4 text-[#171220] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-3 hover:border-[#D4A24A]"
            >
              <div
                data-card-3d="true"
                className="relative aspect-[1036/1519] w-full overflow-hidden bg-[#171220]"
              >
                <img
                  src={moment.image}
                  alt={moment.title}
                  width={moment.w}
                  height={moment.h}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-35" />
                <span className="absolute right-3 top-3 bg-[#0B0A0F]/80 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#D4A24A]">
                  0{idx + 1} · Play
                </span>
              </div>

              <div className="mt-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#3D246C]">
                  {moment.stat}
                </p>
                <h3
                  data-card-title="true"
                  className="mt-1"
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    lineHeight: '23.1px',
                    letterSpacing: '-0.33px',
                    color: 'rgb(23, 18, 32)',
                  }}
                >
                  {moment.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: QUOTE & PHOTO STACK ("I WANT PEOPLE TO REMEMBER ME...")
         ===================================================================== */}
      <section
        data-section="quote-photos"
        data-tone="purple"
        data-theme="tone-purple"
        className="relative isolate overflow-hidden bg-[#1E1035] py-28 text-[#F4EFE6] md:py-40"
      >
        <div
          aria-hidden="true"
          data-quote-grass="true"
          className="pointer-events-none absolute inset-0 bg-repeat opacity-35 mix-blend-multiply"
          style={{
            backgroundImage: "url('/textures/grass.webp')",
            backgroundSize: '180px 180px',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50 mix-blend-soft-light"
          style={{ backgroundImage: "url('/textures/light.webp')" }}
        />

        <div
          data-quote-photos-sticky="true"
          className="relative z-10 mx-auto grid w-full max-w-[1640px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 md:px-12"
        >
          {/* Left Column: Quote Typography */}
          <div className="lg:col-span-7">
            <img
              src="/svg/quotes.svg"
              alt=""
              className="mb-6 h-10 w-auto opacity-80"
            />
            <blockquote
              className="display uppercase tracking-[-0.03em] text-[#F4EFE6]"
              style={{
                fontSize: 'clamp(52px, 8.2vw, 142px)',
                lineHeight: 0.88,
                fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0',
              }}
            >
              {homeData.quoteLines.map((line, i) => (
                <span
                  key={i}
                  data-quote-line="true"
                  className={i === 2 ? 'block text-[#D4A24A]' : 'block'}
                >
                  {line}
                </span>
              ))}
            </blockquote>
            <p className="mt-8 max-w-[480px] text-base leading-relaxed text-[#F4EFE6]/85 md:text-lg">
              {homeData.quoteBody}
            </p>
          </div>

          {/* Right Column: Interactive Cycling Editorial Photo Stack */}
          <div className="flex flex-col items-center lg:col-span-5">
            <div
              data-cursor="Explore"
              onClick={() => {
                soundEngine.play('slide');
                setActivePhotoIdx((prev) => (prev + 1) % homeData.quotePhotos.length);
              }}
              className="relative h-[460px] w-[330px] cursor-pointer sm:h-[520px] sm:w-[380px]"
            >
              {homeData.quotePhotos.map((photo, idx) => {
                const offset =
                  (idx - activePhotoIdx + homeData.quotePhotos.length) %
                  homeData.quotePhotos.length;
                const rotations = [-3.5, 4.2, -7.1];
                const isFront = offset === 0;
                return (
                  <div
                    key={photo.src}
                    className="absolute inset-0 border-[10px] border-[#F4EFE6] bg-[#171220] shadow-2xl transition-all duration-500"
                    style={{
                      zIndex: 10 - offset,
                      transform: `translate3d(${offset * 16}px, ${offset * -12}px, 0) rotate(${rotations[idx % rotations.length]}deg) scale(${1 - offset * 0.04})`,
                      opacity: offset > 2 ? 0 : 1,
                    }}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="h-full w-full object-cover"
                    />
                    {isFront && (
                      <div className="absolute bottom-3 right-3 bg-[#0B0A0F]/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#D4A24A]">
                        {activePhotoIdx + 1} / {homeData.quotePhotos.length} · Click to Cycle
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: THE SHIHAN FOUNDATION ("BUILDING SOMETHING THAT LASTS")
         ===================================================================== */}
      <div data-home-tail-surface="true" className="relative bg-[#DFD9D0]">
        <section
          data-section="foundation"
          data-tone="light"
          className="relative flex min-h-[900px] w-full flex-col justify-between overflow-hidden"
          style={{
            display: 'flex',
            position: 'relative',
            paddingTop: '96px',
            paddingBottom: '80px',
            paddingLeft: '48px',
            paddingRight: '48px',
            overflowX: 'hidden',
            overflowY: 'hidden',
          }}
        >
          <div
            aria-hidden="true"
            data-foundation-tile="true"
            className="pointer-events-none absolute inset-0 bg-repeat opacity-55 mix-blend-multiply"
            style={{
              backgroundImage: "url('/textures/paper.webp')",
              backgroundSize: '420px 420px',
            }}
          />

          <div className="relative z-10 mx-auto flex w-full max-w-[1640px] flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p
                data-fd-eyebrow=""
                className="display uppercase tracking-tight text-[#171220]"
                style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
              >
                {foundationData.name}
              </p>
              <div
                data-fd-headline=""
                className="display mt-2 uppercase tracking-[-0.03em] text-[#1E1035]"
                style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
              >
                {foundationData.headline}
              </div>
            </div>

            <div className="max-w-[380px]">
              <p data-fd-blurb="" className="leading-relaxed">
                {foundationData.blurb}
              </p>
              <a
                href={foundationData.ctaUrl}
                data-fd-cta=""
                onClick={(e) => {
                  e.preventDefault();
                  soundEngine.play('click');
                  onNavigate(foundationData.ctaUrl);
                }}
                className="display mt-4 inline-flex items-center gap-3 bg-[#1E1035] px-6 py-3 uppercase tracking-wider text-[#F4EFE6] transition-colors hover:bg-[#3D246C]"
                style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
              >
                <span>{foundationData.ctaLabel}</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* 5-Card Horizontal Snap Gallery */}
          <div
            data-snap-rail="true"
            data-cursor="Drag"
            data-mode="snap"
            className="relative z-10 mx-auto mt-12 flex w-full max-w-[1640px] gap-6 overflow-x-auto pb-4"
          >
            {foundationData.gallery.map((item, idx) => (
              <div
                key={item.src}
                data-fd-card=""
                data-sound-card="true"
                onMouseEnter={() => soundEngine.play('card-hover', 0.2)}
                className="group relative shrink-0 overflow-hidden border-[8px] border-[#F4EFE6] bg-[#171220] shadow-lg"
                style={{ aspectRatio: '4 / 5' }}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-[#F4EFE6]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#D4A24A]">
                    0{idx + 1} · Community Impact
                  </span>
                  <p className="mt-1 text-xs text-[#F4EFE6]/90 line-clamp-2">{item.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================================
            SECTION 5: PARTNERSHIPS SHOWCASE + 2.5D DEPTHSLIDE STAGE
           ===================================================================== */}
        <section
          data-section="partnerships"
          data-tone="dark"
          data-tone-self-managed=""
          className="relative isolate block w-full bg-[#171220] py-24 text-[#F4EFE6] md:py-32"
          style={{
            display: 'block',
            position: 'relative',
            paddingTop: '0px',
            paddingBottom: '0px',
            paddingLeft: '0px',
            paddingRight: '0px',
          }}
        >
          <div
            aria-hidden="true"
            data-partnerships-pebble="true"
            className="pointer-events-none absolute inset-0 bg-repeat opacity-80 mix-blend-multiply"
            style={{
              backgroundImage: "url('/textures/pebble.webp')",
              backgroundSize: 'var(--pebble-tile) var(--pebble-tile)',
            }}
          />

          <div className="relative z-10 mx-auto max-w-[1640px] px-6 py-24 md:px-12 md:py-32">
            {/* Partner Logos Infinite Marquee Strip */}
            <div className="mb-14 overflow-hidden border-y border-white/15 py-5">
              <div
                className="flex w-max items-center gap-16"
                style={{ animation: 'jj-partner-marquee 32s linear infinite' }}
              >
                {[...partnerLogos, ...partnerLogos].map((logo, i) => (
                  <div
                    key={`${logo.alt}-${i}`}
                    data-partner-mark="true"
                    className="flex h-10 w-28 shrink-0 items-center justify-center opacity-75 transition-opacity hover:opacity-100"
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="max-h-8 w-auto object-contain brightness-0 invert"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div
              data-partnerships-stage="true"
              className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12"
            >
              {/* Left Column: 6 Partner Selector Tabs */}
              <div className="lg:col-span-6">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#D4A24A]">
                  Selected Brand Collaborations
                </p>
                <div
                  data-headline-grain="true"
                  className="mt-4 flex flex-col gap-2"
                >
                  {featuredRecognition.map((partner, idx) => {
                    const isSelected = idx === activePartnerIdx;
                    return (
                      <button
                        key={(partner as any)._id || partner.slug || idx}
                        type="button"
                        data-active={isSelected ? 'true' : 'false'}
                        onClick={() => {
                          soundEngine.play('slide-2');
                          setActivePartnerIdx(idx);
                        }}
                        onMouseEnter={() => soundEngine.play('hover', 0.2)}
                        className="group flex items-baseline justify-between border-b border-white/10 py-3 text-left transition-all"
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="font-mono text-xs text-[#9E6DE9]">
                            0{idx + 1}
                          </span>
                          <span
                            className="display uppercase tracking-tight transition-colors"
                            style={{
                              fontSize: 'clamp(36px, 5vw, 84px)',
                              lineHeight: 0.9,
                              color: isSelected ? '#D4A24A' : '#F4EFE6',
                              fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0',
                            }}
                          >
                            {partner.name}
                          </span>
                        </div>
                        <span className="font-mono text-xs uppercase tracking-widest text-[#F4EFE6]/60">
                          {partner.category}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-[460px] text-sm leading-relaxed text-[#F4EFE6]/80">
                    {activePartner.description}
                  </p>
                  <a
                    href="/partnerships"
                    onClick={(e) => {
                      e.preventDefault();
                      soundEngine.play('click');
                      onNavigate('/partnerships');
                    }}
                    className="display shrink-0 border border-[#D4A24A] px-6 py-3 text-xl uppercase tracking-wider text-[#D4A24A] transition-colors hover:bg-[#D4A24A] hover:text-[#171220]"
                    style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
                  >
                    All 13 Partners →
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive 2.5D DepthSlide + Partner Hero Preview */}
              <div
                data-partnerships-hero="true"
                className="relative flex flex-col items-center justify-center lg:col-span-6"
              >
                <div className="relative aspect-[4/5] w-full max-w-[520px] overflow-hidden border border-white/15 bg-[#1E1035] p-6 shadow-2xl">
                  {partnerDepth.depth ? (
                    <DepthSlide
                      src={partnerDepth.diffuse}
                      depthSrc={partnerDepth.depth}
                      alt={activePartner.heroImageAlt}
                      className="h-full w-full"
                    />
                  ) : (
                    <img
                      src={activePartner.heroImageUrl}
                      alt={activePartner.heroImageAlt}
                      className="h-full w-full object-cover"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4A24A]">
                        {activePartner.category}
                      </span>
                      <p
                        className="display text-3xl uppercase text-[#F4EFE6]"
                        style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
                      >
                        {activePartner.name}
                      </p>
                    </div>
                    <img
                      src={activePartner.brandLogoUrl}
                      alt={activePartner.brandLogoAlt}
                      className="h-9 w-auto object-contain brightness-0 invert"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 6: MAKE A PLAY ("18 IS GONNA GO OUT THERE AND MAKE A PLAY")
           ===================================================================== */}
        <section
          data-section="make-a-play"
          className="relative flex min-h-[904px] w-full flex-col justify-center overflow-x-clip bg-[#DFD9D0]"
          style={{
            display: 'flex',
            position: 'relative',
            paddingTop: '0px',
            paddingBottom: '0px',
            paddingLeft: '0px',
            paddingRight: '0px',
            overflowX: 'clip',
            overflowY: 'visible',
          }}
        >
          <div className="mx-auto mb-10 w-full max-w-[1640px] px-6 text-center md:px-12">
            <div
              data-mp-headline=""
              className="display uppercase tracking-[-0.03em] text-[#1E1035]"
              style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
            >
              {homeData.makeAPlayHeading.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </div>
          </div>

          {/* Row 1 Counter-Scrolling Polaroid Rail */}
          <div data-mp-rail="true" className="w-full overflow-hidden py-3">
            <div
              className="flex w-max items-center gap-6"
              style={{ animation: 'jj-mp-row-left 38s linear infinite' }}
            >
              {[...row1Cards, ...row1Cards].map((card, i) => (
                <a
                  key={`${card.src}-${i}`}
                  href={card.href}
                  data-mp-card="true"
                  data-cursor="Explore"
                  onClick={(e) => {
                    e.preventDefault();
                    soundEngine.play('click');
                    onNavigate(card.href);
                  }}
                  className="group relative flex h-[280px] w-[230px] shrink-0 flex-col justify-between border-[8px] border-[#F4EFE6] bg-[#171220] shadow-md transition-transform duration-300 hover:-translate-y-2"
                >
                  <div data-mp-frame="true" className="relative h-full w-full overflow-hidden">
                    <img
                      src={card.src}
                      alt={card.caption}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 text-[#F4EFE6]">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-wider">
                        {card.caption}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Row 2 Counter-Scrolling Polaroid Rail */}
          <div data-mp-rail="true" className="w-full overflow-hidden py-3">
            <div
              className="flex w-max items-center gap-6"
              style={{ animation: 'jj-mp-row-right 42s linear infinite' }}
            >
              {[...row2Cards, ...row2Cards].map((card, i) => (
                <a
                  key={`${card.src}-${i}`}
                  href={card.href}
                  data-mp-card="true"
                  data-cursor="Explore"
                  onClick={(e) => {
                    e.preventDefault();
                    soundEngine.play('click');
                    onNavigate(card.href);
                  }}
                  className="group relative flex h-[280px] w-[230px] shrink-0 flex-col justify-between border-[8px] border-[#F4EFE6] bg-[#171220] shadow-md transition-transform duration-300 hover:-translate-y-2"
                >
                  <div data-mp-frame="true" className="relative h-full w-full overflow-hidden">
                    <img
                      src={card.src}
                      alt={card.caption}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 text-[#F4EFE6]">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-wider">
                        {card.caption}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>



      {/* =====================================================================
          MODAL 2: SIGNATURE MOMENT HIGHLIGHT LIGHTBOX
         ===================================================================== */}
      {activeMomentIdx !== null && signatureMoments[activeMomentIdx] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={signatureMoments[activeMomentIdx].title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-md"
          onClick={() => setActiveMomentIdx(null)}
        >
          <div
            className="relative w-full max-w-4xl border border-white/20 bg-[#0B0A0F] p-6 text-[#F4EFE6]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#D4A24A]">
                  {signatureMoments[activeMomentIdx].stat}
                </p>
                <p
                  className="display mt-1 text-4xl uppercase"
                  style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
                >
                  {signatureMoments[activeMomentIdx].title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMomentIdx(null)}
                className="border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:border-[#D4A24A] hover:text-[#D4A24A]"
              >
                Close ✕
              </button>
            </div>

            <div className="relative mt-6 aspect-video w-full overflow-hidden bg-[#171220]">
              <video
                src={(signatureMoments[activeMomentIdx] as any).video || ''}
                poster={signatureMoments[activeMomentIdx].image}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-contain"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setActiveMomentIdx(
                    (activeMomentIdx - 1 + signatureMoments.length) %
                      signatureMoments.length
                  )
                }
                className="font-mono text-xs uppercase tracking-widest text-[#F4EFE6]/75 hover:text-[#D4A24A]"
              >
                ← Previous Moment
              </button>
              <span className="font-mono text-xs text-[#F4EFE6]/50">
                0{activeMomentIdx + 1} / 0{signatureMoments.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveMomentIdx((activeMomentIdx + 1) % signatureMoments.length)
                }
                className="font-mono text-xs uppercase tracking-widest text-[#F4EFE6]/75 hover:text-[#D4A24A]"
              >
                Next Moment →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
