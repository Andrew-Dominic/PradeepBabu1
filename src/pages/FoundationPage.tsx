import React from 'react';
import rscData from '../data/extractedRsc.json';
import { soundEngine } from '../components/AudioEngine';

interface AcademyPageProps {
  onNavigate: (href: string) => void;
}

export const AcademyPage: React.FC<AcademyPageProps> = ({ onNavigate }) => {
  const { content, programs } = rscData.foundation;

  return (
    <div className="relative bg-[#DFD9D0] text-[#171220]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-repeat opacity-55 mix-blend-multiply"
        style={{
          backgroundImage: "url('/textures/paper.webp')",
          backgroundSize: '420px 420px',
        }}
      />

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-[1640px] px-6 pb-20 pt-32 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#3D246C]">
              {content.heroEyebrow}
            </span>
            <h1
              className="display mt-2 uppercase text-[#1E1035]"
              style={{
                fontSize: 'clamp(72px, 13vw, 220px)',
                lineHeight: 0.84,
                fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0',
              }}
            >
              {content.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#171220]/85">
              {content.heroIntro}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-5">
            {content.heroPhotos.map((p) => (
              <div
                key={p.src}
                className="overflow-hidden border-[8px] border-[#F4EFE6] bg-[#171220] shadow-xl"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  className="aspect-[3/4] h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Manifesto & Logo */}
      <section className="relative z-10 bg-[#1E1035] py-24 text-[#F4EFE6]">
        <div className="mx-auto max-w-[1640px] px-6 text-center md:px-12">
          <img
            src={content.missionLogo.src}
            alt={content.missionLogo.alt}
            className="mx-auto mb-10 h-16 w-auto object-contain brightness-0 invert md:h-24"
          />
          <h2
            className="display uppercase text-[#F4EFE6]"
            style={{
              fontSize: 'clamp(44px, 7.5vw, 136px)',
              lineHeight: 0.88,
              fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0',
            }}
          >
            {content.manifestoLines.map((line, idx) => (
              <span
                key={idx}
                className={idx === 2 ? 'block text-[#D4A24A]' : 'block'}
              >
                {line}
              </span>
            ))}
          </h2>

          {/* Impact Stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-white/15 pt-12 sm:grid-cols-3">
            {content.impactStats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <p
                  className="display text-7xl uppercase text-[#D4A24A] md:text-8xl"
                  style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
                >
                  {stat.value.toLocaleString()}
                  {stat.suffix || ''}
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[#F4EFE6]/80">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="relative z-10 mx-auto max-w-[1640px] px-6 py-24 md:px-12">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#3D246C]">
          Core Initiatives
        </span>
        <h2
          className="display mt-2 text-6xl uppercase text-[#1E1035] md:text-8xl"
          style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
        >
          Community Programs
        </h2>

        <div className="mt-12 flex flex-col gap-16">
          {programs.map((prog, idx) => (
            <article
              key={prog._id}
              className="grid grid-cols-1 items-center gap-8 border-t border-[#171220]/15 pt-12 lg:grid-cols-12"
            >
              <div className="lg:col-span-5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#3D246C]">
                  0{idx + 1} · Partner: {prog.partner}
                </span>
                <h3
                  className="display mt-2 text-5xl uppercase text-[#1E1035]"
                  style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
                >
                  {prog.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#171220]/80">
                  {prog.body}
                </p>
                <a
                  href={prog.cta.href}
                  onClick={(e) => {
                    e.preventDefault();
                    soundEngine.play('click');
                    onNavigate(prog.cta.href);
                  }}
                  className="display mt-6 inline-flex items-center gap-2 bg-[#1E1035] px-6 py-3 text-xl uppercase tracking-wider text-[#F4EFE6]"
                  style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
                >
                  {prog.cta.label} →
                </a>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
                {prog.media.slice(0, 2).map((m) => (
                  <div
                    key={m.src}
                    className="overflow-hidden border-[8px] border-[#F4EFE6] bg-[#171220] shadow-md"
                  >
                    <img
                      src={m.src}
                      alt={m.alt}
                      className="aspect-[4/3] h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Ways You Can Help (Sponsorship Tiers) */}
      <section className="relative z-10 mx-auto max-w-[1640px] px-6 pb-28 pt-12 md:px-12">
        <h2
          className="display text-center text-6xl uppercase text-[#1E1035] md:text-8xl"
          style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
        >
          {content.waysHeading}
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {content.tiers.map((tier) => (
            <div
              key={tier.tier}
              className="flex flex-col justify-between border border-[#171220]/15 bg-[#F4EFE6] p-8 shadow-lg"
            >
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#3D246C]">
                  {tier.tier}
                </span>
                <h3
                  className="display mt-2 text-5xl uppercase text-[#1E1035]"
                  style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
                >
                  {tier.name}
                </h3>
                <p
                  className="display mt-3 text-3xl uppercase text-[#3D246C]"
                  style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
                >
                  {tier.range.replace('$$', '$')}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[#171220]/80">
                  {tier.body}
                </p>
              </div>
              <a
                href={tier.cta.href}
                className="display mt-8 inline-block bg-[#1E1035] px-6 py-3 text-center text-xl uppercase tracking-wider text-[#F4EFE6] transition-colors hover:bg-[#3D246C]"
                style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
              >
                {tier.cta.label} →
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
