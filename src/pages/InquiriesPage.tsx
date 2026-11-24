import React, { useState } from 'react';
import { soundEngine } from '../components/AudioEngine';

const INQUIRY_CATEGORIES = [
  {
    label: 'Details',
    title: 'Recognition',
    description: 'Brand partnerships, endorsements, and campaign collaborations.',
    email: 'partnerships@pradeepbabu.com',
  },
  {
    label: 'Details',
    title: 'Media & Press',
    description: 'Interviews, features, and press inquiries.',
    email: 'media@pradeepbabu.com',
  },
  {
    label: 'Details',
    title: 'Booking & Appearances',
    description: 'Events, appearances, and booking requests.',
    email: 'booking@pradeepbabu.com',
  },
];

export default function InquiriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(INQUIRY_CATEGORIES[0].title);
  const [formState, setFormState] = useState({
    name: '',
    organization: '',
    email: '',
    timeline: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.play('reveal');
    setSubmitted(true);
  };

  return (
    <main className="page-inquiries" data-page="inquiries">
      {/* Deep Purple Atmosphere + Pebble Texture */}
      <div className="inquiries-bg" aria-hidden="true">
        <img
          src="/textures/pebble.webp"
          alt=""
          className="inquiries-bg__texture"
          decoding="async"
        />
        <img
          src="/footer/texture.webp"
          alt=""
          className="inquiries-bg__vignette"
          decoding="async"
        />
      </div>

      <section className="inquiries-hero">
        <div className="inquiries-hero__inner">
          <div className="inquiries-hero__eyebrow">
            <span>07 // INQUIRIES</span>
            <span>DIRECT MANAGEMENT &amp; REPRESENTATION</span>
          </div>
          <h1 className="inquiries-hero__title">CONNECT WITH SHIHAN M. PRADEEP BABU</h1>
          <p className="inquiries-hero__lead">
            Connect directly with M. Pradeep Babu&apos;s management and commercial representation team for global brand partnerships, media features, and appearance bookings.
          </p>
        </div>
      </section>

      {/* 3 Inquiry Category Cards + Direct Submission Form */}
      <section className="inquiries-workspace" aria-label="Inquiry Channels">
        <div className="inquiries-workspace__grid">
          {/* Left Column: 3 Category Cards */}
          <div className="inquiries-categories">
            {INQUIRY_CATEGORIES.map((cat, idx) => {
              const isSelected = selectedCategory === cat.title;
              return (
                <button
                  key={cat.title}
                  type="button"
                  className={`inquiry-category-card ${isSelected ? 'is-selected' : ''}`}
                  onMouseEnter={() => soundEngine.play('hover')}
                  onClick={() => {
                    soundEngine.play('click');
                    setSelectedCategory(cat.title);
                    setSubmitted(false);
                  }}
                >
                  <div className="inquiry-category-card__top">
                    <span className="inquiry-category-card__num">
                      0{idx + 1} // {cat.email.toUpperCase()}
                    </span>
                    <span className="inquiry-category-card__status">
                      {isSelected ? 'ACTIVE SELECTION' : 'SELECT'}
                    </span>
                  </div>
                  <h2 className="inquiry-category-card__title">{cat.title}</h2>
                  <p className="inquiry-category-card__desc">{cat.description}</p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Brief Drawer / Form */}
          <div className="inquiries-form-card">
            <div className="inquiries-form-card__header">
              <span className="inquiries-form-card__eyebrow">DIRECT BRIEF SUBMISSION</span>
              <h2 className="inquiries-form-card__title">
                INQUIRE ABOUT {selectedCategory.toUpperCase()}
              </h2>
            </div>

            {submitted ? (
              <div className="inquiries-form-success" role="status">
                <div className="inquiries-form-success__badge">TRANSMISSION RECEIVED</div>
                <h3>THANK YOU, {formState.name.toUpperCase() || 'PARTNER'}.</h3>
                <p>
                  Your {selectedCategory} inquiry for{' '}
                  <strong>{formState.organization || 'your organization'}</strong> has been routed
                  to M. Pradeep Babu&apos;s representation team.
                </p>
                <button
                  type="button"
                  className="inquiries-submit-btn"
                  onClick={() => {
                    soundEngine.play('click');
                    setSubmitted(false);
                    setFormState({
                      name: '',
                      organization: '',
                      email: '',
                      timeline: '',
                      message: '',
                    });
                  }}
                >
                  SEND ANOTHER INQUIRY
                </button>
              </div>
            ) : (
              <form className="inquiries-form" onSubmit={handleSubmit}>
                <div className="inquiries-form__row">
                  <label className="inquiries-field">
                    <span className="inquiries-field__label">YOUR NAME *</span>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                  </label>

                  <label className="inquiries-field">
                    <span className="inquiries-field__label">BRAND / ORGANIZATION *</span>
                    <input
                      type="text"
                      required
                      placeholder="Company or Agency"
                      value={formState.organization}
                      onChange={(e) =>
                        setFormState({ ...formState, organization: e.target.value })
                      }
                    />
                  </label>
                </div>

                <div className="inquiries-form__row">
                  <label className="inquiries-field">
                    <span className="inquiries-field__label">EMAIL ADDRESS *</span>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    />
                  </label>

                  <label className="inquiries-field">
                    <span className="inquiries-field__label">TARGET TIMELINE</span>
                    <input
                      type="text"
                      placeholder="e.g. Q3 2025 / Martial Arts Kickoff"
                      value={formState.timeline}
                      onChange={(e) => setFormState({ ...formState, timeline: e.target.value })}
                    />
                  </label>
                </div>

                <label className="inquiries-field">
                  <span className="inquiries-field__label">PROJECT BRIEF &amp; SCOPE *</span>
                  <textarea
                    rows={4}
                    required
                    placeholder={`Share details regarding your ${selectedCategory.toLowerCase()} opportunity...`}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  />
                </label>

                <button
                  type="submit"
                  className="inquiries-submit-btn"
                  onMouseEnter={() => soundEngine.play('hover')}
                >
                  <span>SUBMIT {selectedCategory.toUpperCase()} BRIEF</span>
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
