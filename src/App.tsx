/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';
import { useScrollState } from './hooks/useScrollState';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/layout/Hero';
import { Section } from './components/layout/Section';
import { SectionLoader } from './components/layout/SectionLoader';
import { Footer } from './components/layout/Footer';
import { AdminSection } from './components/layout/AdminSection';
import { Contact } from './components/layout/Contact';
import LineageTree from './components/LineageTree';
import { AnimatePresence, motion } from 'motion/react';
const JathumMonument = lazy(() => import('./components/JathumMonument'));
const ConstellationDiagram = lazy(() => import('./components/ConstellationDiagram'));
const WasmGallery = lazy(() => import('./components/WasmGallery'));
import { NotFound } from './components/NotFound';
import { Timeline } from './components/layout/Timeline';
import { Supporters } from './components/layout/Supporters';
import { NAV_LINKS } from './lib/navigation';
import { setSeoMeta } from './lib/seo';

const InteractiveMap = lazy(() => import('./components/InteractiveMap'));
const HeritageGallery = lazy(() => import('./components/HeritageGallery'));
const PoetryCouncil = lazy(() => import('./components/PoetryCouncil/index'));
const OppenheimArchive = lazy(() => import('./components/OppenheimArchive'));
const NewsEvents = lazy(() => import('./components/NewsEvents'));
const ScrollFilmCanvas = lazy(() => import('./components/ScrollFilmCanvas'));

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

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
      
      const isGitHubPages = /\.github\.io$/i.test(hostname);
      
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

  const handleBackToHome = useCallback(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isGitHubPages = /\.github\.io$/i.test(hostname);
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
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

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
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (const sectionId of SECTION_IDS) {
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
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isNotFound) {
      setSeoMeta('الصفحة غير موجودة | الموقع الرسمي لقبيلة السياحين', 'noindex, nofollow');
      return;
    }

    setSeoMeta(
      'الموقع الرسمي لقبيلة السياحين | الروقة من عتيبة',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
  }, [isNotFound]);

  if (isNotFound) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="not-found"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <NotFound onBackToHome={handleBackToHome} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="main-app"
        data-app-ready="true"
        className="site-shell min-h-screen text-sand relative overflow-x-hidden font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
      {/* BACKGROUND GRAPHICS */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-12%] left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full bg-radial from-indigo/40 to-transparent blur-3xl" />
        <div className="absolute top-[12%] right-[6%] w-[420px] h-[420px] rounded-full bg-radial from-brass/8 to-transparent blur-3xl" />
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
      <Suspense fallback={<SectionLoader label="جارٍ تحميل شريط الأفلام..." />}>
        <ScrollFilmCanvas />
      </Suspense>

      <main id="main-content" className="relative">
      {/* SECTION 0: JATHUM — THE FOUNDATION */}
      <Section
        id="jathum"
        tone="ink"
        noBorder
        serialNumber="٠٠"
        badgeText="الأساس والمنطلق"
        title="هجرة الجثوم — أساس الديار"
        description="قبل كل الأقسام تأتي الجثوم: أول هجرة رسمية أسسها السياحين في عالية نجد، ومنها انطلق الاستقرار والتحضر وامتدت بقية الديار."
        loaderLabel="جارٍ تحميل الجثوم..."
      >
        <JathumMonument scrollToSection={scrollToSection} />
      </Section>

      {/* SECTION 1: LINEAGE TREE */}
      <Section
        id="lineage"
        tone="ink-2"
        serialNumber="٠١"
        badgeText="النسب والجذر"
        title="ديوان نسب القبيلة الأصيل"
        description="التوثيق المتسلسل لعمود نسب فخذ السياحين من المزاحمة من الروقة من عتيبة الهيلا، وصولاً لعدنان."
        loaderLabel="جارٍ تحميل شجرة النسب..."
      >
        <LineageTree />
      </Section>

      {/* SECTION 2: INTERACTIVE MAP */}
      <Section
        id="map"
        tone="ink"
        serialNumber="٠٢"
        badgeText="الديار والهجرات"
        title="الديار ومنازل الاستقرار"
        description="استكشف التوزيع الجغرافي لديار السياحين التاريخية، من منازلهم في نجد العذية وهجرهم المعتمدة ومناهل المياه القديمة."
        loaderLabel="جارٍ تحميل قسم الديار..."
      >
        <InteractiveMap />
      </Section>

      {/* SECTION 3: HERITAGE GALLERY */}
      <Section
        id="gallery"
        tone="ink-2"
        serialNumber="٠٣"
        badgeText="الشاهد البصري"
        title="معرض التراث والمقتنيات"
        description="شواهد بصرية ومقتنيات تراثية تعكس تاريخ القبيلة العريق وصوراً من ذاكرة الصحراء والديار المأهولة."
        loaderLabel="جارٍ تحميل معرض التراث..."
      >
        <HeritageGallery />
      </Section>

      {/* SECTION 4: WASM GALLERY */}
      <Section
        id="wasm"
        tone="ink"
        narrow
        serialNumber="٠٤"
        badgeText="علامات الوسم"
        title="وسم الإبل وعلامة الباب"
        description="وسم «الباب» الشهير للسياحين على الرقبة من الجهة اليسرى، رمز الهوية والأصالة في البادية."
        loaderLabel="جارٍ تحميل معرض الوسوم..."
      >
        <WasmGallery />
      </Section>

      {/* SECTION 5: CONSTELLATION DIAGRAM */}
      <Section
        id="constellation"
        tone="ink-2"
        serialNumber="٠٥"
        badgeText="الأنساب السبعة"
        title="الخلاصة الكوكبية للأنساب"
        description="تمثيل فلكي رمزي يربط الأنساب السبعة الكبرى في فضاء كوكبي مترابط يبرز التلاحم والأصل المشترك للقبيلة."
        loaderLabel="جارٍ تحميل الأنسب..."
      >
        <ConstellationDiagram />
      </Section>

      {/* SECTION 6: OPPENHEIM ARCHIVE */}
      <Section
        id="archive"
        tone="ink"
        serialNumber="٠٦"
        badgeText="الأرشيف والمصادر"
        title="التوثيق الاستشراقي والمدونات التاريخية"
        description="شهادات وملاحظات المستشرقين والرحالة الغربيين حول نسب وقوة ومواقف السياحين في تاريخ الجزيرة العربية."
        loaderLabel="جارٍ تحميل الأرشيف الاستشراقي..."
      >
        <OppenheimArchive />
      </Section>

      {/* SECTION 7: POETRY COUNCIL */}
      <Section
        id="poetry"
        tone="ink-2"
        serialNumber="٠٧"
        badgeText="مجلس الشعراء"
        title="ديوان الشعر النبطي"
        description="مساحة مخصصة للقصائد الموثقة وشواهد الشعر النبطي بعد مراجعتها وإسنادها إلى مصادر واضحة."
        loaderLabel="جارٍ تحميل قسم الشعر..."
      >
        <PoetryCouncil />
      </Section>

      {/* SECTION 8: NEWS & EVENTS */}
      <Section
        id="news"
        tone="ink"
        serialNumber="٠٨"
        badgeText="الأخبار والمناسبات"
        title="الأخبار والمناسبات"
        description="قسم القراءة العامة لعناصر الأخبار والمناسبات المنشورة من لوحة الإدارة."
        loaderLabel="جارٍ تحميل الأخبار والمناسبات..."
      >
        <NewsEvents />
      </Section>

      {/* SECTION 9: ADMIN */}
      <Section
        id="admin"
        tone="ink-2"
        serialNumber="٠٩"
        badgeText="بوابة الإدارة"
        title="قسم الإدارة"
        description="مركز إدارة محتوى الموقع الرسمي لقبيلة السياحين — يتيح للمشرفين نشر الأخبار وجدولة المناسبات وإدارة المحتوى المعروض للعموم."
      >
        <AdminSection />
      </Section>

      {/* SECTION 10: TIMELINE */}
      <Timeline />

      {/* SECTION 11: SUPPORTERS */}
      <Supporters />

      {/* CONTACT SECTION */}
      <Contact />
      </main>

      {/* FOOTER */}
      <Footer scrollToSection={scrollToSection} />
      </motion.div>
    </AnimatePresence>
  );
}
