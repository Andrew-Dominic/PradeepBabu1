import React, { useState } from 'react';
import rscData from '../data/extractedRsc.json';
import { DepthSlide } from '../components/DepthSlide';
import { getDepthAssetsForPartner } from '../utils/cloneLogic';
import { soundEngine } from '../components/AudioEngine';

function toPartnerSlug(name: string, slug?: string): string {
  if (slug) return slug;
  const n = (name || '').toLowerCase();
  if (n.includes('under armour')) return 'under-armour';
  if (n.includes('oakley')) return 'oakley';
  if (n.includes('cane')) return 'raising-canes';
  return '';
}

export default function RecognitionPage() {
  const partnerships = (rscData.partnershipsPage?.partnerships || []) as Array<any>;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  return (
    <main className="page-partnerships" data-page="partnerships">
      {/* Light Texture Wash */}
      <div className="partnerships-bg" aria-hidden="true">
        <img
          src="/textures/light-01.webp"
          alt=""
          className="partnerships-bg__img"
          decoding="async"
        />
      </div>

      {/* Hero Section */}
      <section className="partnerships-hero">
        <div className="partnerships-hero__inner">
          <div className="partnerships-hero__eyebrow">
            <span>05 // HONOURS &amp; ACCOLADES</span>
            <span>A LEGACY SHAPED BY DISCIPLINE, ENDURANCE &amp; VISIONARY TEACHING</span>
          </div>
          <h1 className="partnerships-hero__title">RECOGNITION</h1>
          <p className="partnerships-hero__sub">
            Awards &amp; Honours — A legacy shaped by discipline, endurance and visionary teaching across karate, mind-over-matter endurance, and national leadership.
          </p>
        </div>
      </section>

      {/* Featured 2.5D Depth Showcase Strip */}
      <section className="partnerships-depth-strip" aria-label="Featured Honours & Milestones">
        <div className="partnerships-depth-strip__grid">
          {[
            { name: 'World Championship Silver', slug: 'under-armour', role: 'ISSHINRYU WORLD CHAMPIONSHIP · USA', tag: '2024 · SILVER MEDAL' },
            { name: 'Karate World Record Holder', slug: 'oakley', role: '1222 BIKES · WORLD RECORD', tag: '2021 · ENDURANCE' },
            { name: 'Shihan — Master of Masters', slug: 'raising-canes', role: 'ZEN ISSHINRYU KARATE · 6TH DAN', tag: 'HONOUR · HIGHEST RANK' },
          ].map((feat) => {
            const depthAssets = getDepthAssetsForPartner(feat.slug);
            return (
              <div
                key={feat.name}
                className="partnerships-depth-card"
                onMouseEnter={() => soundEngine.play('card-hover')}
              >
                <div className="partnerships-depth-card__media">
                  <DepthSlide
                    src={depthAssets.diffuse}
                    depthSrc={depthAssets.depth}
                    alt={feat.name}
                    intensity={0.04}
                  />
                </div>
                <div className="partnerships-depth-card__meta">
                  <span className="partnerships-depth-card__tag">{feat.tag}</span>
                  <h3 className="partnerships-depth-card__title">{feat.name}</h3>
                  <span className="partnerships-depth-card__role">{feat.role}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Full 13-Partner Roster Accordion / Showcase */}
      <section className="partnerships-list-section" aria-label="All Brand Partners">
        <div className="partnerships-list">
          {partnerships.map((partner, idx) => {
            const isExpanded = expandedIndex === idx;
            const slug = toPartnerSlug(partner.name, partner.slug);
            const depthAssets =
              slug === 'under-armour' || slug === 'oakley' || slug === 'raising-canes'
                ? getDepthAssetsForPartner(slug)
                : null;
            const logoSrc = partner.brandLogoUrl || partner.logoUrl || '/svg/logo.svg';
            const heroImg = partner.heroImageUrl || partner.imageUrl || logoSrc;
            const tags: string[] = Array.isArray(partner.tags)
              ? partner.tags
              : partner.category
              ? [String(partner.category)]
              : ['PARTNER'];
            const gallery: Array<any> = Array.isArray(partner.gallery) ? partner.gallery : [];

            return (
              <article
                key={partner._id || partner.name || idx}
                className={`partner-row ${isExpanded ? 'is-expanded' : ''}`}
                data-partner-index={idx}
              >
                <button
                  type="button"
                  className="partner-row__header"
                  aria-expanded={isExpanded}
                  onMouseEnter={() => soundEngine.play('hover')}
                  onClick={() => {
                    soundEngine.play('click');
                    setExpandedIndex(isExpanded ? null : idx);
                  }}
                >
                  <div className="partner-row__index">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="partner-row__logo-wrap">
                    <img
                      src={logoSrc}
                      alt={partner.brandLogoAlt || partner.name}
                      className="partner-row__logo"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="partner-row__title-wrap">
                    <h2 className="partner-row__name">{partner.name}</h2>
                    <span className="partner-row__since">
                      {partner.partnership || partner.category || 'Official Partner'}
                    </span>
                  </div>
                  <div className="partner-row__tags">
                    {tags.map((tag) => (
                      <span key={tag} className="partner-row__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="partner-row__toggle" aria-hidden="true">
                    {isExpanded ? '—' : '+'}
                  </div>
                </button>

                {isExpanded && (
                  <div className="partner-row__body">
                    <div className="partner-row__body-grid">
                      <div className="partner-row__visual">
                        {depthAssets?.depth ? (
                          <div className="partner-row__depth-stage">
                            <DepthSlide
                              src={depthAssets.diffuse}
                              depthSrc={depthAssets.depth}
                              alt={partner.name}
                              intensity={0.035}
                            />
                            <span className="partner-row__depth-badge">
                              INTERACTIVE 3D DEPTH — MOVE CURSOR
                            </span>
                          </div>
                        ) : (
                          <div className="partner-row__hero-img-wrap">
                            <img
                              src={heroImg}
                              alt={partner.heroImageAlt || `${partner.name} campaign`}
                              className="partner-row__hero-img"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        )}
                      </div>

                      <div className="partner-row__details">
                        <div className="partner-row__quote-box">
                          <span className="partner-row__eyebrow">
                            {partner.partnership || partner.category || 'OFFICIAL COLLABORATION'}
                          </span>
                          <p className="partner-row__description">{partner.description}</p>
                        </div>

                        {gallery.length > 0 && (
                          <div className="partner-row__gallery">
                            <span className="partner-row__gallery-label">
                              CAMPAIGN GALLERY ({gallery.length})
                            </span>
                            <div className="partner-row__gallery-grid">
                              {gallery.map((gImg, gIdx) => {
                                const gSrc = gImg.src || gImg.url;
                                if (!gSrc) return null;
                                return (
                                  <button
                                    key={gIdx}
                                    type="button"
                                    className="partner-row__gallery-thumb"
                                    onClick={() => {
                                      soundEngine.play('reveal');
                                      setSelectedGalleryImage(gSrc);
                                    }}
                                  >
                                    <img
                                      src={gSrc}
                                      alt={gImg.alt || `${partner.name} gallery ${gIdx + 1}`}
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Lightbox Modal for Partner Campaign Gallery */}
      {selectedGalleryImage && (
        <div
          className="moment-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Campaign Image Lightbox"
          onClick={() => {
            soundEngine.play('click');
            setSelectedGalleryImage(null);
          }}
        >
          <div className="moment-lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="moment-lightbox__close"
              onClick={() => {
                soundEngine.play('click');
                setSelectedGalleryImage(null);
              }}
            >
              CLOSE [ESC]
            </button>
            <img
              src={selectedGalleryImage}
              alt="Campaign fullscreen"
              className="moment-lightbox__img"
            />
          </div>
        </div>
      )}
    </main>
  );
}
