/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useScrollState } from './hooks/useScrollState';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/layout/Hero';
import { SectionHeader } from './components/layout/SectionHeader';
import { Footer } from './components/layout/Footer';
import { Contact } from './components/layout/Contact';
import LineageTree from './components/LineageTree';
import JathumMonument from './components/JathumMonument';
import ConstellationDiagram from './components/ConstellationDiagram';
import InteractiveMap from './components/InteractiveMap';
import HeritageGallery from './components/HeritageGallery';
import CelestialCompass from './components/CelestialCompass';
import { WasmGallery } from './components/WasmGallery';
import PoetryCouncil from './components/PoetryCouncil/index';
import OppenheimArchive from './components/OppenheimArchive';
import { ScrollFilmCanvas } from './components/ScrollFilmCanvas';
import { NotFound } from './components/NotFound';
import { Timeline } from './components/layout/Timeline';
import { Supporters } from './components/layout/Supporters';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const isScrolled = useScrollState(40);
  const [activeSection, setActiveSection] = useState('home');

  // Routing state for unknown paths
  const [isNotFound, setIsNotFound] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hostname = window.location.hostname;
      const cleanPath = path.replace(/\/$/, '').replace(/\/index\.html$/, '');
      const segments = cleanPath.split('/').filter(Boolean);
      
      const isGitHubPages = hostname.endsWith('github.io');
      
      if (isGitHubPages) {
        const isRootUserPage = hostname === 'tribe-alsayahin.github.io';
        
        if (isRootUserPage) {
          return segments.length > 0;
        } else {
          return segments.length > 1;
        }
      } else {
        return segments.length > 0;
      }
    }
    return false;
  });

  const handleBackToHome = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isGitHubPages = hostname.endsWith('github.io');
      const isRootUserPage = hostname === 'tribe-alsayahin.github.io';
      
      let homePath = '/';
      if (isGitHubPages && !isRootUserPage) {
        const pathname = window.location.pathname;
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
          homePath = `/${segments[0]}/`;
        }
      }
      
      window.history.pushState({}, '', homePath);
    }
    setIsNotFound(false);
  };

  // Intersection Observer for scroll reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const revealElements = document.querySelectorAll('.reveal-el');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const sections = ['home', 'jathum', 'lineage', 'constellation', 'map', 'gallery', 'compass', 'wasm', 'poetry', 'archive', 'timeline', 'supporters', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isNotFound) {
    return <NotFound onBackToHome={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-ink text-sand select-none relative overflow-x-hidden font-sans">
      {/* BACKGROUND GRAPHICS */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full bg-radial from-brass/15 to-transparent blur-3xl" />
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-radial from-olive-2/10 to-transparent blur-3xl" />
      </div>

      {/* Skip to main content - for keyboard/screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[9999] focus:bg-brass focus:text-ink focus:px-4 focus:py-2 focus:rounded focus:font-sans focus:font-bold"
      >
        انتقل إلى المحتوى الرئيسي
      </a>

      {/* HEADER & NAVBAR */}
      <Navbar
        isScrolled={isScrolled}
        theme={theme}
        onToggleTheme={toggleTheme}
        scrollToSection={scrollToSection}
        activeSection={activeSection}
      />

      {/* HERO SECTION */}
      <Hero scrollToSection={scrollToSection} />

      {/* TRANSITIONAL SCROLL FILM */}
      <ScrollFilmCanvas />

      <main id="main-content">
      {/* SECTION 0: JATHUM — THE FOUNDATION */}
      <section id="jathum" className="section bg-ink-2 px-6 relative z-10 py-16">
        <div className="max-w-[1160px] mx-auto">
          <SectionHeader
            serialNumber="٠٠"
            badgeText="الأساس والمنطلق"
            title="هجرة الجثوم — أساس الديار"
            description="قبل كل الأقسام تأتي الجثوم: أول هجرة رسمية أسسها السياحين في عالية نجد، ومنها انطلق الاستقرار والتحضر وامتدت بقية الديار."
          />
          <div className="reveal-el opacity-0 translate-y-10 transition-all duration-800">
            <JathumMonument scrollToSection={scrollToSection} />
          </div>
        </div>
      </section>

      {/* SECTION 1: LINEAGE TREE */}
      <section id="lineage" className="section bg-ink-2 px-6 relative z-10 py-16">
        <div className="max-w-[1160px] mx-auto">
          <SectionHeader
            serialNumber="٠١"
            badgeText="النسب والجذر"
            title="ديوان نسب القبيلة الأصيل"
            description="التوثيق المتسلسل لعمود نسب فخذ السياحين من المزاحمة من الروقة من عتيبة الهيلا، وصولاً لعدنان."
          />
          <div className="reveal-el opacity-0 translate-y-10 transition-all duration-800">
            <LineageTree />
          </div>
        </div>
      </section>

      {/* SECTION 2: CONSTELLATION DIAGRAM */}
      <section id="constellation" className="section bg-ink px-6 relative z-10 py-16">
        <div className="max-w-[1160px] mx-auto">
          <SectionHeader
            serialNumber="٠٢"
            badgeText="الأنساب السبعة"
            title="الخلاصة الكوكبية للأنساب"
            description="تمثيل فلكي رمزي يربط الأنساب السبعة الكبرى في فضاء كوكبي مترابط يبرز التلاحم والأصل المشترك للقبيلة."
          />
          <div className="reveal-el opacity-0 translate-y-10 transition-all duration-800">
            <ConstellationDiagram />
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE MAP */}
      <section id="map" className="section bg-ink-2 px-6 relative z-10 py-16">
        <div className="max-w-[1160px] mx-auto">
          <SectionHeader
            serialNumber="٠٣"
            badgeText="الديار والهجرات"
            title="الديار ومنازل الاستقرار"
            description="استكشف التوزيع الجغرافي لديار السياحين التاريخية، من منازلهم في نجد العذية وهجرهم المعتمدة ومناهل المياه القديمة."
          />
          <div className="reveal-el opacity-0 translate-y-10 transition-all duration-800">
            <InteractiveMap />
          </div>
        </div>
      </section>

      {/* SECTION 4: HERITAGE GALLERY */}
      <section id="gallery" className="section bg-ink px-6 relative z-10 py-16">
        <div className="max-w-[1160px] mx-auto">
          <SectionHeader
            serialNumber="٠٤"
            badgeText="الشاهد البصري"
            title="معرض التراث والمقتنيات"
            description="شواهد بصرية ومقتنيات تراثية تعكس تاريخ القبيلة العريق وصوراً من ذاكرة الصحراء والديار المأهولة."
          />
          <div className="reveal-el opacity-0 translate-y-10 transition-all duration-800">
            <HeritageGallery />
          </div>
        </div>
      </section>

      {/* SECTION 5: CELESTIAL COMPASS */}
      <section id="compass" className="section bg-ink-2 px-6 relative z-10 py-16">
        <div className="max-w-[1160px] mx-auto">
          <SectionHeader
            serialNumber="٠٥"
            badgeText="اللوحة الفلكية"
            title="البوصلة الفلكية وحساب الأنواء"
            description="البوصلة النجدية الفلكية التقليدية لحساب طلوع النجوم ومواسم الأمطار وحركة الأفلاك في البادية."
          />
          <div className="reveal-el opacity-0 translate-y-10 transition-all duration-800">
            <CelestialCompass />
          </div>
        </div>
      </section>

      {/* SECTION 6: WASM GALLERY */}
      <section id="wasm" className="section bg-ink px-6 relative z-10 py-16">
        <div className="max-w-[1160px] mx-auto">
          <SectionHeader
            serialNumber="٠٦"
            badgeText="علامات الوسم"
            title="وسم الإبل وعلامة الباب"
            description="وسم «الباب» الشهير للسياحين على الرقبة من الجهة اليسرى، رمز الهوية والأصالة في البادية."
          />
          <div className="max-w-[720px] mx-auto reveal-el opacity-0 translate-y-10 transition-all duration-800">
            <WasmGallery />
          </div>
        </div>
      </section>

      {/* SECTION 7: POETRY COUNCIL */}
      <section id="poetry" className="section bg-ink-2 px-6 relative z-10 py-16">
        <div className="max-w-[1160px] mx-auto">
          <SectionHeader
            serialNumber="٠٧"
            badgeText="مجلس الشعراء"
            title="الديوان التفاعلي للشعر النبطي"
            description="أبيات وقصائد خالدة لشعراء قبيلة السياحين تصف الشجاعة، الكرم، ومآثر الديار النجدية."
          />
          <div className="reveal-el opacity-0 translate-y-10 transition-all duration-800">
            <PoetryCouncil />
          </div>
        </div>
      </section>

      {/* SECTION 8: OPPENHEIM ARCHIVE */}
      <section id="archive" className="section bg-ink px-6 relative z-10 py-16">
        <div className="max-w-[1160px] mx-auto">
          <SectionHeader
            serialNumber="٠٨"
            badgeText="الأرشيف والمصادر"
            title="التوثيق الاستشراقي والمدونات التاريخية"
            description="شهادات وملاحظات المستشرقين والرحالة الغربيين حول نسب وقوة ومواقف السياحين في تاريخ الجزيرة العربية."
          />
          <div className="reveal-el opacity-0 translate-y-10 transition-all duration-800">
            <OppenheimArchive />
          </div>
        </div>
      </section>

      {/* SECTION 8.5: TIMELINE */}
      <Timeline />

      {/* SECTION 8.7: SUPPORTERS */}
      <Supporters />

      {/* CONTACT SECTION */}
      <Contact />
      </main>

      {/* FOOTER */}
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
}
