import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import rscData from '../data/extractedRsc.json';
import { resolveRouteTheme } from '../utils/cloneLogic';
import { soundEngine } from './AudioEngine';
import { DepthSlide } from './DepthSlide';

interface SiteFrameProps {
  currentPath: string;
  onNavigate: (href: string) => void;
  children: React.ReactNode;
}

export const SiteFrame: React.FC<SiteFrameProps> = ({
  currentPath,
  onNavigate,
  children,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(soundEngine.isEnabled());
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100, active: false });
  const sigContainerRef = useRef<HTMLDivElement>(null);

  const theme = resolveRouteTheme(currentPath);
  const settings = rscData.siteFrame.settings;
  const footerCtas = rscData.siteFrame.footerCtas;
  const activeFooter = footerCtas[theme.footerKey] || footerCtas.home;
  const cleanPath = (currentPath || '/').split('?')[0].replace(/\/+$/, '') || '/';
  const hideFooter = cleanPath === '/journal' || cleanPath === '/inquiries';

  useEffect(() => {
    document.body.setAttribute('data-theme', theme.dataTheme);
  }, [theme.dataTheme]);

  useEffect(() => {
    return soundEngine.subscribe(setSoundOn);
  }, []);

  useEffect(() => {
    if (!sigContainerRef.current) return;
    const anim = lottie.loadAnimation({
      container: sigContainerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/signature/optimised.json',
    });
    return () => anim.destroy();
  }, []);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const cursorEl = target?.closest?.('[data-cursor]') as HTMLElement | null;
      const label = cursorEl?.getAttribute('data-cursor') || '';
      setCursorLabel(label);
      setCursorPos({ x: e.clientX, y: e.clientY, active: Boolean(label) });
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    soundEngine.play('click');
    setMenuOpen(false);
    onNavigate(href);
  };

  const toggleMenu = () => {
    const next = !menuOpen;
    soundEngine.play(next ? 'reveal' : 'click');
    setMenuOpen(next);
  };

  return (
    <div
      data-site-frame="true"
      className="relative"
      style={
        {
          '--theme-bg': theme.themeBg,
          '--theme-fg': theme.themeFg,
          '--theme-accent': theme.themeAccent,
          '--theme-surface': theme.themeSurface,
          '--logo-color': menuOpen ? '#f6f3ef' : theme.logoColor,
          '--hamburger-halo': 'drop-shadow(0 1px 5px #0b0a0f8c)',
          '--pebble-multiply-opacity': '1',
          '--pebble-screen-opacity': '0',
          '--marquee-opacity': '0',
        } as React.CSSProperties
      }
    >
      <div
        data-site-chrome="true"
        style={{
          opacity: 1,
          transition: 'opacity 360ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          aria-hidden="true"
          data-home-background=""
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          style={{
            zIndex: -1,
            backgroundColor: theme.themeBg,
            transition: 'background-color 0.35s ease',
          }}
        >
          <div
            className="absolute inset-0 bg-repeat mix-blend-multiply"
            style={{
              backgroundImage: "url('/textures/pebble.webp')",
              backgroundSize: 'var(--pebble-tile) var(--pebble-tile)',
              opacity: 'var(--pebble-multiply-opacity, 1)',
            }}
          />
          <div
            className="absolute inset-0 bg-repeat mix-blend-screen"
            style={{
              backgroundImage: "url('/textures/pebble.webp')",
              backgroundSize: 'var(--pebble-tile) var(--pebble-tile)',
              opacity: 'var(--pebble-screen-opacity, 0)',
            }}
          />
        </div>

        {/* Fixed Site Header */}
        <header
          data-nav="true"
          className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 md:py-7"
          style={{ color: menuOpen ? '#f6f3ef' : 'var(--logo-color)' }}
        >
          <a
            aria-label="M. Pradeep Babu — Home"
            data-nav-logo="true"
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            onMouseEnter={() => soundEngine.play('hover', 0.2)}
            className="pointer-events-auto relative inline-flex items-center transition-opacity duration-300 hover:opacity-75"
          >
            <img
              src="/svg/logo.svg"
              alt="JJ"
              className="block h-[40px] w-auto md:h-[48px]"
              style={{
                filter:
                  !menuOpen && theme.logoColor === '#171220'
                    ? 'brightness(0) saturate(100%)'
                    : 'brightness(0) invert(1)',
              }}
            />
          </a>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            data-hamburger="true"
            data-state={menuOpen ? 'open' : 'closed'}
            onClick={toggleMenu}
            onMouseEnter={() => soundEngine.play('hover', 0.2)}
            className="group pointer-events-auto relative flex h-12 w-12 items-center justify-center"
            style={{ filter: 'var(--hamburger-halo, none)' }}
          >
            <span className="relative block h-[14px] w-[30px]">
              <span
                className="absolute inset-x-0 top-0 h-[2px] bg-current transition-transform duration-300"
                style={{
                  transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="absolute inset-x-0 top-[6px] h-[2px] bg-current transition-opacity duration-200"
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className="absolute inset-x-0 bottom-0 h-[2px] bg-current transition-transform duration-300"
                style={{
                  transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
                }}
              />
            </span>
          </button>
        </header>

        {/* Full-Screen Site Navigation Overlay */}
        <div
          id="site-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          aria-hidden={!menuOpen}
          data-lenis-prevent="true"
          data-open={menuOpen ? 'true' : 'false'}
          className="fixed inset-0 z-40 overflow-hidden bg-[#171220] text-[#F4EFE6]"
          style={{
            opacity: menuOpen ? 1 : 0,
            visibility: menuOpen ? 'visible' : 'hidden',
            pointerEvents: menuOpen ? 'auto' : 'none',
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-repeat mix-blend-multiply"
            style={{
              backgroundImage: "url('/textures/pebble.webp')",
              backgroundSize: 'var(--pebble-tile) var(--pebble-tile)',
              opacity: 0.85,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cover bg-center mix-blend-soft-light"
            style={{
              backgroundImage: "url('/footer/light-04.webp')",
              opacity: 0.55,
            }}
          />

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1728px] flex-col justify-between px-6 pb-8 pt-24 md:px-12 md:pb-12 md:pt-28">
            <div className="grid flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-12">
              {/* Primary Navigation Links */}
              <nav aria-label="Primary" className="lg:col-span-7">
                <ul className="flex flex-col gap-1 md:gap-2">
                  {settings.navLinks.map((item, idx) => {
                    const isActive = cleanPath === item.href;
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          onClick={(e) => handleNavClick(e, item.href)}
                          onMouseEnter={() => soundEngine.play('hover', 0.25)}
                          className="group inline-flex items-baseline gap-4 transition-transform duration-300 hover:translate-x-3"
                        >
                          <span className="font-mono text-xs tracking-widest text-[#9E6DE9] opacity-80">
                            0{idx + 1}
                          </span>
                          <span
                            className="display uppercase tracking-[-0.03em] transition-colors duration-200"
                            style={{
                              fontSize: 'clamp(44px, 6.2vw, 108px)',
                              lineHeight: 0.88,
                              color: isActive ? '#D4A24A' : '#F4EFE6',
                              fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0',
                            }}
                          >
                            {item.label}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Featured Journal Card + Lottie Signature */}
              <div className="hidden flex-col items-end justify-center gap-6 lg:col-span-5 lg:flex">
                <a
                  href="/journal?item=cleat-lv"
                  data-journal-latest="cleat-lv"
                  onClick={(e) => handleNavClick(e, '/journal?item=cleat-lv')}
                  onMouseEnter={() => soundEngine.play('card-hover', 0.3)}
                  className="group relative flex w-full max-w-[420px] flex-col overflow-hidden border border-white/15 bg-[#1E1035]/90 p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#D4A24A]">
                    <span>Latest in Journal</span>
                    <span>Under Armour · Footwear</span>
                  </div>
                  <div className="relative my-4 h-[210px] w-full">
                    <DepthSlide
                      src="/on-field/cleats/cleat-gold-3d.webp"
                      depthSrc="/on-field/cleats/cleat-gold-depth.png"
                      alt="Monogram PE Gold Cleat"
                    />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p
                        className="display text-3xl uppercase text-[#F4EFE6]"
                        style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
                      >
                        Monogram PE
                      </p>
                      <p className="mt-1 text-xs text-[#F4EFE6]/70">
                        Gold Louis Vuitton-inspired cleats celebrating Madden 26 99 Club.
                      </p>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#D4A24A] group-hover:underline">
                      Explore →
                    </span>
                  </div>
                </a>

                <div
                  ref={sigContainerRef}
                  aria-hidden="true"
                  className="h-20 w-52 opacity-75"
                />
              </div>
            </div>

            {/* Menu Footer Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.14em] text-[#F4EFE6]/70">
              <div className="flex items-center gap-6">
                {settings.socialLinks.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-[#D4A24A]"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-6">
                {settings.legalLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => handleNavClick(e, l.href)}
                    className="transition-colors hover:text-[#F4EFE6]"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href={settings.footerCredit.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-[#F4EFE6]"
                >
                  {settings.footerCredit.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Route Content */}
      <main className="relative z-10">{children}</main>

      {/* Dynamic Route Footer */}
      {!hideFooter && (
        <div data-home-footer="">
          <footer
            data-footer="true"
            className="relative isolate w-full overflow-hidden bg-[#171220] text-[#F4EFE6]"
            style={{ minHeight: '900px' }}
          >
            {/* Leather & Light Textures */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-repeat opacity-90 mix-blend-multiply"
              style={{
                backgroundImage: "url('/footer/texture.webp')",
                backgroundSize: 'var(--leather-tile) var(--leather-tile)',
              }}
            />
            <div
              aria-hidden="true"
              data-home-footer-light=""
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-70 mix-blend-soft-light"
              style={{ backgroundImage: "url('/footer/light-04.webp')" }}
            />

            {/* Next Route Invitation Stage */}
            <div
              data-footer-center="true"
              data-footer-invitation="false"
              className="relative mx-auto flex min-h-[900px] w-full max-w-[1728px] flex-col items-center justify-between px-6 pb-10 pt-24 md:px-12"
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#D4A24A]">
                  Up Next · {activeFooter.cta.label}
                </span>
                <a
                  href={activeFooter.cta.href}
                  onClick={(e) => handleNavClick(e, activeFooter.cta.href)}
                  onMouseEnter={() => soundEngine.play('hover', 0.25)}
                  data-cursor="Explore"
                  className="group mt-4 block"
                >
                  <div
                    data-footer-headline="true"
                    className="display uppercase tracking-[-0.03em] text-[#F4EFE6] transition-colors duration-300 group-hover:text-[#D4A24A]"
                    style={{
                      fontSize: 'clamp(64px, 10.5vw, 196px)',
                      lineHeight: 0.86,
                      fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0',
                    }}
                  >
                    {activeFooter.headline.map((line: string) => (
                      <span key={line} data-text={line} className="block">
                        {line}
                      </span>
                    ))}
                  </div>
                </a>
              </div>

              {/* Player Cutout Image */}
              <div
                data-footer-cutout="true"
                className="pointer-events-none relative z-10 -my-8 flex h-[430px] w-full max-w-[540px] items-end justify-center md:h-[500px]"
              >
                <img
                  src={activeFooter.image}
                  alt={activeFooter.imageAlt}
                  width={activeFooter.imageW}
                  height={activeFooter.imageH}
                  className="h-full w-auto object-contain object-bottom drop-shadow-[0_24px_48px_rgba(0,0,0,0.65)]"
                />
              </div>

              {/* Bottom Footer Panel */}
              <div
                data-footer-panel="true"
                className="relative z-20 w-full border-t border-white/15 pt-8"
              >
                <div
                  data-footer-panel-inner="true"
                  className="flex flex-col justify-between gap-8 md:flex-row md:items-end"
                >
                  <div data-footer-panel-logo="true" className="flex items-center gap-5">
                    <img
                      src="/svg/logo.svg"
                      alt="JJ"
                      className="h-12 w-auto brightness-0 invert"
                    />
                    <div>
                      <p
                        className="display text-2xl uppercase tracking-tight text-[#F4EFE6]"
                        style={{ fontVariationSettings: '"wdth" 75, "wght" 700, "slnt" 0' }}
                      >
                        {settings.legalName}
                      </p>
                      <p className="text-xs uppercase tracking-[0.16em] text-[#F4EFE6]/60">
                        Zen Isshinryu Karate · Shihan Chief Instructor
                      </p>
                    </div>
                  </div>

                  <div
                    data-footer-panel-content="true"
                    className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-[0.14em]"
                  >
                    {settings.navLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="text-[#F4EFE6]/80 transition-colors hover:text-[#D4A24A]"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>

                  <div
                    data-footer-panel-bottom="true"
                    className="flex flex-wrap items-center gap-5 text-xs uppercase tracking-[0.14em] text-[#F4EFE6]/60"
                  >
                    {settings.socialLinks.map((s) => (
                      <a
                        key={s.platform}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-colors hover:text-[#F4EFE6]"
                      >
                        {s.platform}
                      </a>
                    ))}
                    {settings.legalLinks.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        onClick={(e) => handleNavClick(e, l.href)}
                        className="transition-colors hover:text-[#F4EFE6]"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* Sound Toggle Button */}
      <button
        type="button"
        data-sound-toggle="true"
        aria-label={soundOn ? 'Mute site audio' : 'Unmute site audio'}
        aria-pressed={soundOn}
        onClick={() => soundEngine.toggle()}
        className="fixed bottom-6 right-6 z-50 flex h-11 items-center gap-2.5 rounded-none border border-white/20 bg-[#0B0A0F]/85 px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F4EFE6] backdrop-blur-md transition-colors hover:border-[#D4A24A] hover:text-[#D4A24A]"
      >
        <span className="flex items-end gap-[3px] h-3.5">
          {[0, 1, 2, 3].map((bar) => (
            <span
              key={bar}
              className="w-[2px] bg-current transition-all duration-300"
              style={{
                height: soundOn ? `${6 + ((bar * 3) % 8)}px` : '3px',
              }}
            />
          ))}
        </span>
        <span>{soundOn ? 'Sound On' : 'Sound Off'}</span>
      </button>

      {/* Custom Interaction Cursor */}
      <div
        data-interaction-cursor="true"
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 hidden md:flex items-center justify-center bg-[#D4A24A] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#171220] transition-opacity duration-150"
        style={{
          transform: `translate3d(${cursorPos.x + 16}px, ${cursorPos.y + 16}px, 0)`,
          opacity: cursorPos.active ? 1 : 0,
        }}
      >
        {cursorLabel}
      </div>
    </div>
  );
};
