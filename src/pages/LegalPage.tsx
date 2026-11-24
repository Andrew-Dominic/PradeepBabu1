import React from 'react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
}

export default function LegalPage({ type }: LegalPageProps) {
  const isPrivacy = type === 'privacy';

  return (
    <main className="page-legal" data-page={type}>
      <section className="legal-container">
        <span className="legal-eyebrow">LEGAL // {isPrivacy ? 'PRIVACY POLICY' : 'TERMS OF USE'}</span>
        <h1 className="legal-title">{isPrivacy ? 'PRIVACY POLICY' : 'TERMS & CONDITIONS'}</h1>
        <p className="legal-updated">LAST UPDATED: MAY 2025</p>

        <div className="legal-body">
          {isPrivacy ? (
            <>
              <h2>1. INFORMATION WE COLLECT</h2>
              <p>
                Welcome to the official digital platform of M. Pradeep Babu (pradeepbabu.com). When you
                explore this website or submit a partnership, media, or booking inquiry, we collect
                only the information you voluntarily provide (such as your name, email address,
                organization, and project details) alongside anonymized performance telemetry.
              </p>
              <h2>2. HOW WE USE YOUR INFORMATION</h2>
              <p>
                Information submitted through our Inquiries channels is used exclusively by Pradeep
                Pradeep Babu&apos;s authorized representation and management team to evaluate and
                respond to commercial, philanthropic, and press requests.
              </p>
              <h2>3. MEDIA &amp; INTELLECTUAL PROPERTY</h2>
              <p>
                All photography, 3D likenesses, logos, trademarks, and broadcast audio clips featured
                on this platform remain the exclusive property of M. Pradeep Babu, the Pradeep
                Pradeep Babu Academy, and their respective licensing partners.
              </p>
            </>
          ) : (
            <>
              <h2>1. ACCEPTANCE OF TERMS</h2>
              <p>
                By accessing and using pradeepbabu.com, you agree to comply with these Terms and
                Conditions. All content, custom 3D shaders, brand marks, and archival materials are
                provided for informational and editorial experience purposes.
              </p>
              <h2>2. INTELLECTUAL PROPERTY RIGHTS</h2>
              <p>
                The PradeepBabu emblem, signature marks, and site design are protected by copyright and
                trademark laws. Unauthorized reproduction, redistribution, or commercial exploitation
                of any asset on this site is strictly prohibited.
              </p>
              <h2>3. THIRD-PARTY LINKS &amp; PARTNERS</h2>
              <p>
                This platform highlights official collaborations and philanthropic initiatives.
                External links to partner platforms are governed by their respective terms and
                privacy policies.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
