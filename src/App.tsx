/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Schedule } from "./components/Schedule";
import { Designers } from "./components/Designers";
import { PartnersSection } from "./components/PartnersSection";
import { AdminPanel } from "./components/AdminPanel";
import { ApplyPage } from "./components/ApplyPage";
import { NewsPage } from "./components/NewsPage";
import { TeamPage } from "./components/TeamPage";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { TermsPage } from "./components/TermsPage";
import { MediaPage } from "./components/MediaPage";
import { SitePopup } from "./components/SitePopup";
import { useSecretCode } from "./hooks/useSecretCode";
import { useSettings } from "./hooks/useSettings";
import { TranslationProvider } from "./contexts/TranslationContext";

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { success, reset } = useSecretCode("fashion2015");
  const { faviconUrl } = useSettings();

  useEffect(() => {
    if (faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [faviconUrl]);

  useEffect(() => {
    if (success) {
      reset();
      navigate("/admin");
    }
  }, [success, navigate, reset]);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-brand-cyan/30 flex flex-col">
      <SitePopup />
      <Navigation />
      <main className="relative flex-grow pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function MainScreen() {
  return (
    <>
      <Hero />
      <Schedule />
      <Designers />
      <PartnersSection />
    </>
  );
}

export default function App() {
  return (
    <TranslationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><MainScreen /></Layout>} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/apply" element={<Layout><ApplyPage /></Layout>} />
          <Route path="/news" element={<Layout><NewsPage /></Layout>} />
          <Route path="/team" element={<Layout><TeamPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
          <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
          <Route path="/media" element={<Layout><MediaPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TranslationProvider>
  );
}

