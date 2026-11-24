import React, { useState } from 'react';
import rscData from '../data/extractedRsc.json';
import { soundEngine } from '../components/AudioEngine';

export const OffFieldPage: React.FC = () => {
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);

  const fashionItems = rscData.offFieldFashion.items;
  const features = rscData.offFieldFeatures.slides;
  const digitalCols = (rscData.offFieldDigital as any)[3].children[2][3].columns;
  const appearancesItems = (rscData.offFieldAppearances as any)[3].children[2][3].items;
  const activeFeature = features[activeFeatureIdx] || features[0];

  return (
    <div className="relative bg-[#2D2D2D] text-[#F4EFE6]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-repeat opacity-75 mix-blend-multiply"
        style={{
          backgroundImage: "url('/textures/pebble.webp')",
          backgroundSize: 'var(--pebble-tile)',
        }}
      />

      {/* Life Hero */}
      <section className="relative z-10 mx-auto max-w-[1640px] px-6 pb-20 pt-32 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#9E6DE9]">
              Culture · Runway · Digital · Screen
            </span>
            <h1
              className="display mt-2 uppercase text-[#F4EFE6]"
              style={{
                fontSize: 'clamp(76px, 14vw, 230px)',
                lineHeight: 0.84,
                fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0',
              }}
            >
              Life
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#F4EFE6]/85">
              Before the catches, before the celebrations, before the culture shifted around him, there was a kid from India who understood one thing…
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden border-[10px] border-[#F4EFE6] bg-[#171220] shadow-2xl">
              <img
                src="/pradeep/p34.jpg"
                alt="M. Pradeep Babu in a custom jacket"
                className="h-[480px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Quote */}
      <section
        data-section="off-quote"
        className="relative z-10 flex items-center justify-center px-6 py-20 text-center"
      >
        <blockquote
          className="display uppercase text-[#F4EFE6]"
          style={{
            fontSize: 'clamp(44px, 8.5vw, 156px)',
            lineHeight: 0.94,
            fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0',
          }}
        >
          <span className="block">
            How you show up <span className="text-[#9E6DE9]">matters</span>
          </span>
          <span className="block">
            <span className="text-[#9E6DE9]">as much</span> as what you do.
          </span>
        </blockquote>
      </section>

      {/* Sticky Lane Nav */}
      <nav
        aria-label="Life Lanes"
        className="sticky top-20 z-30 border-y border-white/15 bg-[#171220]/90 px-6 py-4 backdrop-blur-md md:px-12"
      >
        <div className="mx-auto flex max-w-[1640px] flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#9E6DE9]">
            4 Cultural Lanes
          </span>
          <div className="flex flex-wrap gap-6 font-mono text-xs font-bold uppercase tracking-[0.18em]">
            <a href="#fashion" className="hover:text-[#D4A24A]">01 · Fashion</a>
            <a href="#digital" className="hover:text-[#D4A24A]">02 · Digital</a>
            <a href="#appearances" className="hover:text-[#D4A24A]">03 · Appearances</a>
            <a href="#features" className="hover:text-[#D4A24A]">04 · Features</a>
          </div>
        </div>
      </nav>

      {/* Lane 1: Fashion */}
      <section id="fashion" data-section="fashion" className="relative z-10 mx-auto max-w-[1640px] px-6 py-24 md:px-12">
        <h2
          className="display text-7xl uppercase text-[#F4EFE6] md:text-9xl"
          style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
        >
          Fashion
        </h2>
        <p className="mt-3 max-w-lg text-base text-[#F4EFE6]/80">
          From the tunnel walk to the runway, Pradeep treats every entrance as a chance to say something without speaking.
        </p>

        <div className="mt-10 flex gap-6 overflow-x-auto pb-6">
          {fashionItems.slice(0, 14).map((item, idx) => (
            <div
              key={`${item.src}-${idx}`}
              className="group relative h-[420px] w-[300px] shrink-0 overflow-hidden border-[6px] border-[#F4EFE6] bg-[#171220]"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Lane 2: Digital */}
      <section id="digital" data-section="digital" className="relative z-10 mx-auto max-w-[1640px] px-6 py-24 md:px-12">
        <h2
          className="display text-7xl uppercase text-[#F4EFE6] md:text-9xl"
          style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
        >
          Digital
        </h2>
        <p className="mt-3 max-w-lg text-base text-[#F4EFE6]/80">
          Streaming, TikTok, podcast guest spots, viral moments, YouTube appearances. The algorithm lane, where he shows up in people's feeds.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {digitalCols.map((col: any[], cIdx: number) => (
            <div key={cIdx} className="flex flex-col gap-6">
              {col.map((card: any, idx: number) =>
                card.type === 'stat' ? (
                  <div
                    key={idx}
                    className="border border-white/15 bg-[#1E1035] p-6"
                  >
                    <p
                      className="display text-6xl uppercase text-[#D4A24A]"
                      style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
                    >
                      {card.value}
                    </p>
                    <p className="mt-2 font-bold uppercase tracking-wider text-[#F4EFE6]">
                      {card.label}
                    </p>
                    <p className="mt-1 font-mono text-xs text-[#9E6DE9]">
                      {card.caption}
                    </p>
                  </div>
                ) : (
                  <div
                    key={idx}
                    className="relative aspect-[9/16] overflow-hidden border border-white/15 bg-[#171220]"
                  >
                    <img
                      src={card.poster}
                      alt={card.alt}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4">
                      <p className="text-xs font-semibold text-[#F4EFE6]">{card.alt}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Lane 3: Appearances */}
      <section id="appearances" data-section="appearances" className="relative z-10 mx-auto max-w-[1640px] px-6 py-24 md:px-12">
        <h2
          className="display text-7xl uppercase text-[#F4EFE6] md:text-9xl"
          style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
        >
          Appearances
        </h2>
        <p className="mt-3 max-w-lg text-base text-[#F4EFE6]/80">
          Campaign commercials, brand activations, red carpet / event appearances, guest slots, cameos. The screen lane.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {appearancesItems.slice(0, 8).map((item: any, idx: number) => (
            <div
              key={idx}
              className="group relative aspect-[4/3] overflow-hidden border border-white/15 bg-[#171220]"
            >
              <img
                src={item.poster || item.src}
                alt={item.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4">
                <p className="text-xs text-[#F4EFE6]/90 line-clamp-2">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lane 4: Features */}
      <section id="features" data-section="features" className="relative z-10 mx-auto max-w-[1640px] px-6 py-24 md:px-12">
        <h2
          className="display text-7xl uppercase text-[#F4EFE6] md:text-9xl"
          style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
        >
          {rscData.offFieldFeatures.title}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-2 lg:col-span-5">
            {features.map((feat, idx) => {
              const active = idx === activeFeatureIdx;
              return (
                <button
                  key={feat.id}
                  type="button"
                  onClick={() => {
                    soundEngine.play('slide');
                    setActiveFeatureIdx(idx);
                  }}
                  className={`flex items-center justify-between border-b border-white/15 py-4 text-left transition-colors ${
                    active ? 'text-[#D4A24A]' : 'text-[#F4EFE6]/75 hover:text-[#F4EFE6]'
                  }`}
                >
                  <span
                    className="display text-4xl uppercase"
                    style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
                  >
                    {feat.nav}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest">
                    {feat.logoText}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden border border-white/15 bg-[#171220] p-6">
              <div className="aspect-video w-full overflow-hidden bg-black">
                <img
                  src={activeFeature.media.src}
                  alt={activeFeature.media.alt}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D4A24A]">
                  {activeFeature.logoText}
                </span>
                <img
                  src={activeFeature.logoImg.src}
                  alt={activeFeature.logoImg.alt}
                  className="h-7 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="mt-3 text-base leading-relaxed text-[#F4EFE6]/85">
                {activeFeature.media.caption}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
