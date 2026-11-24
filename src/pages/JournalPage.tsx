import React, { useState, useEffect } from 'react';
import rscData from '../data/extractedRsc.json';
import { DepthSlide } from '../components/DepthSlide';
import { soundEngine } from '../components/AudioEngine';

interface JournalPageProps {
  initialItemSlug?: string | null;
  onSelectItemSlug?: (slug: string | null) => void;
}

export default function JournalPage({ initialItemSlug, onSelectItemSlug }: JournalPageProps) {
  const items = (rscData.journal?.items || []) as Array<any>;
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'canvas'>('grid');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialItemSlug || null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (initialItemSlug !== undefined) {
      setSelectedSlug(initialItemSlug);
    }
  }, [initialItemSlug]);

  const categories = [
    'ALL',
    ...Array.from(new Set(items.map((item) => String(item.category || 'Archive')))),
  ];

  const filteredItems =
    activeCategory === 'ALL'
      ? items
      : items.filter((item) => String(item.category || 'Archive') === activeCategory);

  const selectedItem = items.find((item) => item.id === selectedSlug) || null;

  const handleOpenItem = (slug: string) => {
    soundEngine.play('reveal');
    setSelectedSlug(slug);
    onSelectItemSlug?.(slug);
  };

  const handleCloseItem = () => {
    soundEngine.play('click');
    setSelectedSlug(null);
    onSelectItemSlug?.(null);
  };

  const getItemTitle = (item: any) => item.label || item.title || item.id;
  const getItemSub = (item: any) => item.brand || item.tag || item.contentKind || 'JJ18';
  const getItemDepth = (item: any) => item.depth?.depthSrc || item.depthSrc || null;
  const getItemSrc = (item: any) => item.depth?.src || item.poster || item.src;
  const getBodyParagraphs = (item: any): string[] => {
    if (!item?.body || item.body === '$undefined') return [];
    if (Array.isArray(item.body)) return item.body.map(String);
    return [String(item.body)];
  };

  return (
    <main className="page-journal" data-page="journal">
      {/* Subtle Light Texture */}
      <div className="journal-bg" aria-hidden="true">
        <img src="/textures/light-02.webp" alt="" className="journal-bg__img" decoding="async" />
      </div>

      {/* Header & Controls */}
      <section className="journal-header">
        <div className="journal-header__top">
          <div>
            <span className="journal-header__eyebrow">06 // ARCHIVE &amp; ARTIFACTS</span>
            <h1 className="journal-header__title">THE JOURNAL</h1>
          </div>

          <div className="journal-header__view-toggle" role="group" aria-label="View mode">
            <button
              type="button"
              className={`journal-view-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
              onClick={() => {
                soundEngine.play('tick');
                setViewMode('grid');
              }}
            >
              INDEX GRID
            </button>
            <button
              type="button"
              className={`journal-view-btn ${viewMode === 'canvas' ? 'is-active' : ''}`}
              onClick={() => {
                soundEngine.play('tick');
                setViewMode('canvas');
              }}
            >
              INFINITE CANVAS
            </button>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="journal-filters" role="tablist" aria-label="Filter journal by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`journal-filter-pill ${activeCategory === cat ? 'is-active' : ''}`}
              onMouseEnter={() => soundEngine.play('hover')}
              onClick={() => {
                soundEngine.play('tick');
                setActiveCategory(cat);
              }}
            >
              {cat}
              <span className="journal-filter-pill__count">
                {cat === 'ALL'
                  ? items.length
                  : items.filter((i) => String(i.category || 'Archive') === cat).length}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area: Grid or Draggable Infinite Canvas */}
      {viewMode === 'grid' ? (
        <section className="journal-grid-section" aria-label="Journal Entries">
          <div className="journal-grid">
            {filteredItems.map((item, idx) => {
              const title = getItemTitle(item);
              const sub = getItemSub(item);
              const imgSrc = getItemSrc(item);
              const depthSrc = getItemDepth(item);

              return (
                <article
                  key={item.id}
                  className="journal-card"
                  data-journal-id={item.id}
                  onMouseEnter={() => soundEngine.play('card-hover')}
                  onClick={() => handleOpenItem(item.id)}
                >
                  <div className="journal-card__media">
                    {depthSrc ? (
                      <DepthSlide
                        src={imgSrc}
                        depthSrc={depthSrc}
                        alt={title}
                        intensity={0.03}
                      />
                    ) : (
                      <img
                        src={imgSrc}
                        alt={title}
                        className="journal-card__img"
                        loading={idx < 6 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    )}
                    <span className="journal-card__badge">{item.category}</span>
                  </div>

                  <div className="journal-card__info">
                    <div className="journal-card__meta">
                      <span>{sub}</span>
                      <span>//</span>
                      <span>{item.category}</span>
                    </div>
                    <h2 className="journal-card__title">{title}</h2>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        <section
          className={`journal-canvas-viewport ${isDragging ? 'is-dragging' : ''}`}
          aria-label="Draggable Infinite Canvas"
          onPointerDown={(e) => {
            setIsDragging(true);
            setDragOrigin({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
          }}
          onPointerMove={(e) => {
            if (!isDragging) return;
            setCanvasOffset({
              x: e.clientX - dragOrigin.x,
              y: e.clientY - dragOrigin.y,
            });
          }}
          onPointerUp={() => setIsDragging(false)}
          onPointerLeave={() => setIsDragging(false)}
        >
          <div className="journal-canvas-hint">
            DRAG TO EXPLORE ARCHIVE // CLICK ANY ARTIFACT TO INSPECT
          </div>
          <div
            className="journal-canvas-plane"
            style={{
              transform: `translate3d(${canvasOffset.x}px, ${canvasOffset.y}px, 0)`,
            }}
          >
            {filteredItems.map((item, idx) => {
              const col = idx % 5;
              const row = Math.floor(idx / 5);
              const staggerY = (col % 2) * 70;
              const title = getItemTitle(item);
              const imgSrc = getItemSrc(item);
              return (
                <div
                  key={item.id}
                  className="journal-canvas-node"
                  style={{
                    left: `${col * 360 + 80}px`,
                    top: `${row * 420 + staggerY + 60}px`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenItem(item.id);
                  }}
                >
                  <div className="journal-canvas-node__img-wrap">
                    <img src={imgSrc} alt={title} decoding="async" draggable={false} />
                  </div>
                  <div className="journal-canvas-node__caption">
                    <span>{getItemSub(item)}</span>
                    <strong>{title}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Detail Drawer / Lightbox for Selected Journal Item (e.g. ?item=cleat-lv) */}
      {selectedItem && (
        <div
          className="journal-drawer-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={getItemTitle(selectedItem)}
          onClick={handleCloseItem}
        >
          <div className="journal-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="journal-drawer__top">
              <div className="journal-drawer__meta">
                <span className="journal-drawer__cat">{selectedItem.category}</span>
                <span>{getItemSub(selectedItem)}</span>
              </div>
              <button
                type="button"
                className="journal-drawer__close"
                onClick={handleCloseItem}
              >
                CLOSE [×]
              </button>
            </div>

            <div className="journal-drawer__content">
              <div className="journal-drawer__media">
                {getItemDepth(selectedItem) ? (
                  <div className="journal-drawer__depth">
                    <DepthSlide
                      src={getItemSrc(selectedItem)}
                      depthSrc={getItemDepth(selectedItem)}
                      alt={getItemTitle(selectedItem)}
                      intensity={0.04}
                    />
                  </div>
                ) : (
                  <img
                    src={getItemSrc(selectedItem)}
                    alt={getItemTitle(selectedItem)}
                    className="journal-drawer__img"
                  />
                )}
              </div>

              <div className="journal-drawer__body">
                <span className="journal-drawer__tag">{getItemSub(selectedItem)}</span>
                <h2 className="journal-drawer__title">{getItemTitle(selectedItem)}</h2>
                <div className="journal-drawer__paragraphs">
                  {getBodyParagraphs(selectedItem).map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                {Array.isArray(selectedItem.details) && selectedItem.details.length > 0 && (
                  <div className="journal-drawer__gallery">
                    <h3 className="journal-drawer__gallery-title">SPECIFICATIONS</h3>
                    <div className="journal-drawer__gallery-grid">
                      {selectedItem.details.map((det: any, dIdx: number) => (
                        <div key={dIdx} className="p-3 border border-white/15">
                          <span className="block text-xs opacity-60 uppercase">{det.label}</span>
                          <strong className="text-sm uppercase text-[#D4A24A]">{det.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
