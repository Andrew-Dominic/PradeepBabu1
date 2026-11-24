/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import Lenis from 'lenis';
import { SiteFrame } from './components/SiteFrame';
import { HomePage } from './pages/HomePage';
import { OnFieldPage } from './pages/OnFieldPage';
import { OffFieldPage } from './pages/OffFieldPage';
import { AcademyPage } from './pages/FoundationPage';
import RecognitionPage from './pages/PartnershipsPage';
import JournalPage from './pages/JournalPage';
import InquiriesPage from './pages/InquiriesPage';
import LegalPage from './pages/LegalPage';
import { resolveRouteTheme } from './utils/cloneLogic';

export default function App() {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname || '/');
  const [search, setSearch] = useState<string>(() => window.location.search || '');

  // Sync theme attribute on <body> with active route
  useEffect(() => {
    const theme = resolveRouteTheme(pathname);
    document.body.setAttribute('data-theme', theme.dataTheme);
  }, [pathname]);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      setPathname(window.location.pathname || '/');
      setSearch(window.location.search || '');
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Global client-side navigation handler
  const navigate = useCallback((href: string) => {
    try {
      const url = new URL(href, window.location.origin);
      window.history.pushState({}, '', url.pathname + url.search + url.hash);
      setPathname(url.pathname || '/');
      setSearch(url.search || '');
      if (url.hash) {
        setTimeout(() => {
          const target = document.querySelector(url.hash);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 60);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    } catch {
      window.history.pushState({}, '', href);
      setPathname(href.split('?')[0] || '/');
      setSearch(href.includes('?') ? `?${href.split('?')[1]}` : '');
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, []);

  // Intercept internal <a> clicks so all route transitions stay instant & SPA-driven
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = (e.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      if (href.startsWith('#')) {
        return;
      }
      e.preventDefault();
      navigate(href);
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [navigate]);

  const queryParams = new URLSearchParams(search);
  const journalItemParam = queryParams.get('item');

  const renderPage = () => {
    switch (pathname) {
      case '/on-field':
        return <OnFieldPage />;
      case '/off-field':
        return <OffFieldPage />;
      case '/foundation':
        return <AcademyPage onNavigate={navigate} />;
      case '/partnerships':
        return <RecognitionPage />;
      case '/journal':
        return (
          <JournalPage
            initialItemSlug={journalItemParam}
            onSelectItemSlug={(slug) => {
              const nextUrl = slug ? `/journal?item=${slug}` : '/journal';
              window.history.replaceState({}, '', nextUrl);
              setSearch(slug ? `?item=${slug}` : '');
            }}
          />
        );
      case '/inquiries':
        return <InquiriesPage />;
      case '/privacy':
        return <LegalPage type="privacy" />;
      case '/terms':
        return <LegalPage type="terms" />;
      case '/':
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <SiteFrame currentPath={pathname} onNavigate={navigate}>
      {renderPage()}
    </SiteFrame>
  );
}
