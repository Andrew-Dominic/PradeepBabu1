import React, { useState } from 'react';
import rscData from '../data/extractedRsc.json';
import { soundEngine } from '../components/AudioEngine';
import { DepthSlide } from '../components/DepthSlide';

export const OnFieldPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYearIdx, setSelectedYearIdx] = useState<number>(6); // 2026 cumulative

  const hero = (rscData as any).onFieldHero;
  const quote = (rscData as any).onFieldQuote;
  const timeline = (rscData as any).onFieldTimeline.timeline;
  const totalYards = (rscData as any).onFieldTotalYards;
  const careerTable = (rscData as any).onFieldCareerTable;
  const recordsData = (rscData as any).onFieldRecords;
  const influence = rscData.onFieldInfluence;
  const cleats = rscData.onFieldCleats;
  const reels = rscData.onFieldReels;

  const categories = ['all', 'fastest', 'youngest', 'first', 'only', 'most'];
  const filteredRecords =
    selectedCategory === 'all'
      ? recordsData.records
      : recordsData.records.filter((r: any) => r.category === selectedCategory);

  const audioClipForIndex = (idx: number) => {
    const clips = [
      '42_games_1.m4a',
      '52_games_1.m4a',
      '62_games_1.m4a',
      '84_games_1.m4a',
      '23_years_1.m4a',
      '25_years_1.m4a',
      '26_years_1.m4a',
      '1400_yards_1.m4a',
      '3016_yards_1.m4a',
      '2022_opoy_1.m4a',
      '3_seasons_1.m4a',
      '4825_yards_1.m4a',
      '7000_yards_1.m4a',
      '324_rec_1.m4a',
      '8480_yards_1.m4a',
      '96_5_ypg_1.m4a',
    ];
    return clips[idx % clips.length];
  };

  return (
    <div className="relative bg-[#2D2D2D] text-[#F4EFE6]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-repeat opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "url('/textures/grass.webp')",
          backgroundSize: '170px',
        }}
      />

      {/* Hero Section */}
      <section
        data-section="on-hero"
        className="relative isolate flex min-h-svh w-full flex-col justify-between overflow-hidden px-6 pb-20 pt-32 md:px-12"
      >
        <div className="absolute inset-0 -z-10">
          <img
            src="/pradeep/p35.jpg"
            alt={hero.heroPoster.alt}
            className="h-full w-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0A0F]/80 via-transparent to-[#2D2D2D]" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1640px] items-start justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#D4A24A]">
              Zen Isshinryu Karate · Shihan
            </span>
            <h1
              className="display mt-2 uppercase text-[#F4EFE6]"
              style={{
                fontSize: 'clamp(76px, 14vw, 240px)',
                lineHeight: 0.84,
                fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0',
              }}
            >
              {hero.heroTitle}
            </h1>
          </div>
          <img
            src={hero.heroBadge.src}
            alt={hero.heroBadge.alt}
            className="h-24 w-auto object-contain md:h-32"
          />
        </div>

        <div className="relative z-10 mx-auto mt-24 w-full max-w-[1640px]">
          <blockquote
            className="display max-w-4xl uppercase text-[#F4EFE6]"
            style={{
              fontSize: 'clamp(42px, 6.2vw, 108px)',
              lineHeight: 0.92,
              fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0',
            }}
          >
            {quote.quoteLines.map((l: string, i: number) => (
              <span key={i} className={i === 1 ? 'block text-[#D4A24A]' : 'block'}>
                {l}
              </span>
            ))}
          </blockquote>
        </div>
      </section>

      {/* Cumulative Career Timeline Interactive Scrub */}
      <section className="relative z-10 mx-auto max-w-[1640px] px-6 py-24 md:px-12">
        <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-8 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D4A24A]">
              Cumulative Trajectory (2020–2026)
            </span>
            <h2
              className="display mt-2 text-6xl uppercase text-[#F4EFE6] md:text-8xl"
              style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
            >
              Pace Setter
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {timeline.years.slice(1).map((yr: number, idx: number) => {
              const actualIdx = idx + 1;
              const active = selectedYearIdx === actualIdx;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => {
                    soundEngine.play('tick');
                    setSelectedYearIdx(actualIdx);
                  }}
                  className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors ${
                    active
                      ? 'bg-[#D4A24A] text-[#171220]'
                      : 'border border-white/20 text-[#F4EFE6]/70 hover:border-white'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-5">
          {[
            { label: 'Seminars & Workshops', value: timeline.games[selectedYearIdx] },
            { label: 'Black Belts Mentored', value: timeline.receptions[selectedYearIdx] },
            {
              label: 'Students Trained',
              value: timeline.yards[selectedYearIdx]?.toLocaleString(),
            },
            { label: 'Major Honors', value: timeline.touchdowns[selectedYearIdx] },
            { label: 'Avg / Session', value: timeline.yardsPerGame[selectedYearIdx] },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-white/15 bg-[#171220]/90 p-6"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-[#9E6DE9]">
                {stat.label}
              </p>
              <p
                className="display mt-2 text-5xl uppercase text-[#F4EFE6] md:text-7xl"
                style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Total Students Live Banner */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border border-[#D4A24A]/40 bg-[#1E1035] p-8 md:flex-row md:p-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D4A24A]" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#D4A24A]">
                {totalYards.label} · Lifetime Impact
              </span>
            </div>
            <p className="mt-2 text-sm text-[#F4EFE6]/75">
              Empowering individuals and shaping leaders through Zen Isshinryu Karate since 2011.
            </p>
          </div>
          <p
            className="display text-7xl uppercase text-[#D4A24A] md:text-9xl"
            style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
          >
            {totalYards.yards.toLocaleString()}+ STUDENTS
          </p>
        </div>
      </section>

      {/* Martial Arts Career Table */}
      <section className="relative z-10 mx-auto max-w-[1640px] px-6 py-16 md:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3
              className="display text-6xl uppercase text-[#F4EFE6] md:text-7xl"
              style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
            >
              {careerTable.heading}
            </h3>
            <div className="mt-6 overflow-hidden border-[8px] border-[#F4EFE6] bg-[#171220]">
              <img
                src={careerTable.photo.src}
                alt={careerTable.photo.alt}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="overflow-x-auto lg:col-span-7">
            <table className="w-full border-collapse text-left font-mono text-xs md:text-sm">
              <thead>
                <tr className="border-b border-white/20 text-[#D4A24A] uppercase">
                  <th className="py-4 pr-4">Year</th>
                  <th className="py-4 px-3">Milestone</th>
                  <th className="py-4 px-3">Seminars</th>
                  <th className="py-4 px-3">Black Belts</th>
                  <th className="py-4 px-3">Students</th>
                  <th className="py-4 px-3">Growth</th>
                  <th className="py-4 px-3">Scope</th>
                  <th className="py-4 pl-3">Honours</th>
                </tr>
              </thead>
              <tbody>
                {careerTable.stats.seasons.map((row: any) => (
                  <tr
                    key={row.year}
                    className="border-b border-white/10 transition-colors hover:bg-white/5"
                  >
                    <td className="py-4 pr-4 font-bold text-[#F4EFE6]">{row.year}</td>
                    <td className="py-4 px-3 text-[#F4EFE6]/75">{row.team}</td>
                    <td className="py-4 px-3">{row.games}</td>
                    <td className="py-4 px-3">{row.receptions}</td>
                    <td className="py-4 px-3 font-bold text-[#D4A24A]">
                      {row.yards.toLocaleString()}+
                    </td>
                    <td className="py-4 px-3">{row.avg}</td>
                    <td className="py-4 px-3">{row.long}</td>
                    <td className="py-4 pl-3">{row.touchdowns}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[#D4A24A] bg-[#171220] font-bold text-[#F4EFE6]">
                  <td className="py-4 pr-4 uppercase text-[#D4A24A]">Total</td>
                  <td className="py-4 px-3">Zen Isshinryu</td>
                  <td className="py-4 px-3">{careerTable.stats.career.games}+</td>
                  <td className="py-4 px-3">{careerTable.stats.career.receptions}+</td>
                  <td className="py-4 px-3 text-[#D4A24A]">
                    {careerTable.stats.career.yards.toLocaleString()}+
                  </td>
                  <td className="py-4 px-3">{careerTable.stats.career.avg}</td>
                  <td className="py-4 px-3">Global</td>
                  <td className="py-4 pl-3">{careerTable.stats.career.touchdowns}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Rewriting the Record Books (16 Filterable Cards + Audio Clips) */}
      <section className="relative z-10 mx-auto max-w-[1640px] px-6 py-24 md:px-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D4A24A]">
              Career Milestones &amp; Honours
            </span>
            <h2
              className="display mt-2 text-6xl uppercase text-[#F4EFE6] md:text-8xl"
              style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
            >
              {recordsData.heading}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  soundEngine.play('click');
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#D4A24A] text-[#171220]'
                    : 'border border-white/20 text-[#F4EFE6]/75 hover:border-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredRecords.map((rec: any, idx: number) => (
            <article
              key={`${rec.short}-${idx}`}
              onClick={() => soundEngine.playOnFieldClip(audioClipForIndex(idx))}
              data-cursor="Watch"
              className="group cursor-pointer flex flex-col justify-between border border-white/15 bg-[#171220] p-5 transition-transform duration-300 hover:-translate-y-2 hover:border-[#D4A24A]"
            >
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <img
                    src={rec.image}
                    alt={rec.short}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 bg-[#1E1035]/90 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#D4A24A]">
                    {rec.category}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-[#0B0A0F]/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#F4EFE6]">
                    🔊 Broadcast Call
                  </span>
                </div>

                <div className="mt-5 flex items-baseline gap-2">
                  <span
                    className="display text-6xl uppercase text-[#D4A24A]"
                    style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
                  >
                    {rec.value}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#F4EFE6]/75">
                    {rec.unit}
                  </span>
                </div>

                <h4 className="mt-2 text-lg font-extrabold text-[#F4EFE6]">
                  {rec.short}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#F4EFE6]/70">
                  {rec.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* The Definition of Influence (Kata Cutout + Stadium Field) */}
      <section className="relative isolate overflow-hidden py-28">
        <img
          src={influence.field.src}
          alt={influence.field.alt}
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div className="relative z-10 mx-auto flex max-w-[1640px] flex-col items-center px-6 text-center md:px-12">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#D4A24A]">
            {influence.headingTop}
          </p>
          <h2
            className="display mt-2 uppercase text-[#F4EFE6]"
            style={{
              fontSize: 'clamp(72px, 15vw, 250px)',
              lineHeight: 0.84,
              fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0',
            }}
          >
            {influence.headingWord}
          </h2>
          <div className="-mt-10 h-[460px] w-auto md:h-[580px]">
            <img
              src={influence.cutout.src}
              alt={influence.cutout.alt}
              className="h-full w-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.75)]"
            />
          </div>
        </div>
      </section>

      {/* Cleats Marquee + 2.5D Depth Cleat Showcase */}
      <section data-section="on-cleats" className="relative overflow-hidden bg-[#171220] py-24">
        <div className="mx-auto max-w-[1640px] px-6 md:px-12">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D4A24A]">
                Karate Principles &amp; Discipline
              </span>
              <h2
                className="display mt-2 text-6xl uppercase text-[#F4EFE6] md:text-8xl"
                style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
              >
                {cleats.phrases[0]}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#F4EFE6]/75">
                “{cleats.phrases[1]}” — Fostering strength of character, physical mastery, and respect across dojos, colleges, and national platforms.
              </p>
              <div className="mt-6 h-[280px] w-full border border-white/15 bg-[#1E1035] p-4">
                <DepthSlide
                  src="/on-field/cleats/cleat-06-3d.webp"
                  depthSrc="/on-field/cleats/cleat-06-depth.png"
                  alt="Custom UA Cleat 3D"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-7">
              {cleats.cleats.slice(0, 9).map((c, i) => (
                <div
                  key={c.src}
                  className="group relative aspect-[1920/1621] overflow-hidden border border-white/10 bg-[#0B0A0F] p-3"
                >
                  <img
                    src={c.src}
                    alt={`Custom Cleat ${i + 1}`}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Setting The Pace (Instagram Reels Snapshot Strip) */}
      <section className="relative mx-auto max-w-[1640px] px-6 py-24 md:px-12">
        <h2
          className="display text-6xl uppercase text-[#F4EFE6] md:text-8xl"
          style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
        >
          {reels.heading}
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {reels.reels.map((reel) => (
            <a
              key={reel.id}
              href={reel.url}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col justify-between overflow-hidden border border-white/15 bg-[#171220]"
            >
              <div className="aspect-[9/16] w-full overflow-hidden">
                <img
                  src={reel.thumb}
                  alt={reel.caption}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-[#F4EFE6]/85 line-clamp-2">{reel.caption}</p>
                <span className="mt-2 inline-block font-mono text-[10px] uppercase tracking-widest text-[#D4A24A]">
                  Instagram Reel ↗
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
