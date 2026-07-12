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
import { ChapterDivider } from './components/layout/ChapterDivider';
import { AdminSection } from './components/layout/AdminSection';
import { Contact } from './components/layout/Contact';
import { Timeline } from './components/layout/Timeline';
import { Supporters } from './components/layout/Supporters';
import LineageTree from './components/LineageTree';
import { AnimatePresence, motion } from 'motion/react';
const JathumMonument = lazy(() => import('./components/JathumMonument'));
const ConstellationDiagram = lazy(() => import('./components/ConstellationDiagram'));
const WasmGallery = lazy(() => import('./components/WasmGallery'));
import { NotFound } from './components/NotFound';
const InteractiveMap = lazy(() => import('./components/InteractiveMap'));
const HeritageGallery = lazy(() => import('./components/HeritageGallery'));
const PoetryCouncil = lazy(() => import('./components/PoetryCouncil/index'));
const OppenheimArchive = lazy(() => import('./components/OppenheimArchive'));
const NewsEvents = lazy(() => import('./components/NewsEvents'));
const ScrollFilmCanvas = lazy(() => import('./components/ScrollFilmCanvas'));
import { SECTION_IDS } from './lib/navigation';
import { setSeoMeta } from './lib/seo';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const isScrolled = useScrollState(40);
  const [activeSection, setActiveSection] = useState('home');

  // Routing state
  const [isNotFound, setIsNotFound] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hostname = window.location.hostname;
      const cleanPath = path.replace(/\/$/, '').replace(/\/index\.html$/, '');
      const segments = cleanPath.split('/').filter(Boolean);
      const lastSegment = segments[segments.length - 1] ?? '';

      const isGitHubPages = /\.github\.io$/i.test(hostname);

      // `/admin` route is valid and handled separately
      if (lastSegment === 'admin') {
        return false;
      }

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
      {/* CHAPTER 1: الأصول */}
      <ChapterDivider
        id="chapter-origins"
        number={1}
        title="الأصول"
        description="الجذور الأولى: الجثوم والنسب والأنساب، حيث تبدأ قصة السياحين."
      />

      <Section
        id="jathum"
        tone="ink"
        noBorder
        chapterNumber={1}
        serialNumber="٠١"
        badgeText="الأساس والمنطلق"
        title="هجرة الجثوم — أساس الديار"
        description="قبل كل الأقسام تأتي الجثوم: أول هجرة رسمية أسسها السياحين في عالية نجد، ومنها انطلق الاستقرار والتحضر وامتدت بقية الديار."
        loaderLabel="جارٍ تحميل الجثوم..."
      >
        <JathumMonument scrollToSection={scrollToSection} />
      </Section>

      <Section
        id="lineage"
        tone="ink-2"
        chapterNumber={1}
        serialNumber="٠٢"
        badgeText="النسب والجذر"
        title="ديوان نسب القبيلة الأصيل"
        description="التوثيق المتسلسل لعمود نسب فخذ السياحين من المزاحمة من الروقة من عتيبة الهيلا، وصولاً لعدنان."
        loaderLabel="جارٍ تحميل شجرة النسب..."
      >
        <LineageTree />
      </Section>

      <Section
        id="constellation"
        tone="ink"
        chapterNumber={1}
        serialNumber="٠٣"
        badgeText="الأنساب السبعة"
        title="الخلاصة الكوكبية للأنساب"
        description="تمثيل فلكي رمزي يربط الأنساب السبعة الكبرى في فضاء كوكبي مترابط يبرز التلاحم والأصل المشترك للقبيلة."
        loaderLabel="جارٍ تحميل الأنسب..."
      >
        <ConstellationDiagram />
      </Section>

      {/* CHAPTER 2: الديار */}
      <ChapterDivider
        id="chapter-diyar"
        number={2}
        title="الديار"
        description="منازل الاستقرار والهجرات: خريطة الديار ومعرض التراث البصري."
      />

      <Section
        id="map"
        tone="ink-2"
        noBorder
        chapterNumber={2}
        serialNumber="٠٤"
        badgeText="الديار والهجرات"
        title="الديار ومنازل الاستقرار"
        description="استكشف التوزيع الجغرافي لديار السياحين التاريخية، من منازلهم في نجد العذية وهجرهم المعتمدة ومناهل المياه القديمة."
        loaderLabel="جارٍ تحميل قسم الديار..."
      >
        <InteractiveMap />
      </Section>

      <Section
        id="gallery"
        tone="ink"
        chapterNumber={2}
        serialNumber="٠٥"
        badgeText="الشاهد البصري"
        title="معرض التراث والمقتنيات"
        description="شواهد بصرية ومقتنيات تراثية تعكس تاريخ القبيلة العريق وصوراً من ذاكرة الصحراء والديار المأهولة."
        loaderLabel="جارٍ تحميل معرض التراث..."
      >
        <HeritageGallery />
      </Section>

      {/* CHAPTER 3: الهوية */}
      <ChapterDivider
        id="chapter-identity"
        number={3}
        title="الهوية"
        description="وسم الإبل وديوان الشعر: علامات الهوية والإبداع القبلي."
      />

      <Section
        id="wasm"
        tone="ink-2"
        noBorder
        chapterNumber={3}
        narrow
        serialNumber="٠٦"
        badgeText="علامات الوسم"
        title="وسم الإبل وعلامة الباب"
        description="وسم «الباب» الشهير للسياحين على الرقبة من الجهة اليسرى، رمز الهوية والأصالة في البادية."
        loaderLabel="جارٍ تحميل معرض الوسوم..."
      >
        <WasmGallery />
      </Section>

      <Section
        id="poetry"
        tone="ink"
        chapterNumber={3}
        serialNumber="٠٧"
        badgeText="مجلس الشعراء"
        title="ديوان الشعر النبطي"
        description="مساحة مخصصة للقصائد الموثقة وشواهد الشعر النبطي بعد مراجعتها وإسنادها إلى مصادر واضحة."
        loaderLabel="جارٍ تحميل قسم الشعر..."
      >
        <PoetryCouncil />
      </Section>

      {/* CHAPTER 4: التاريخ */}
      <ChapterDivider
        id="chapter-history"
        number={4}
        title="التاريخ"
        description="الخط الزمني والأرشيف الاستشراقي: شهادات الماضي وتوثيقاته."
      />

      <Section
        id="timeline"
        tone="ink-2"
        noBorder
        chapterNumber={4}
        serialNumber="٠٨"
        badgeText="من تاريخ القبيلة"
        title="صفحات من مآثر وإرث القبيلة"
        description="تسلسل زمني يوثق أبرز المحطات التاريخية لفروسية ومواقف قبيلة السياحين وإسهامها الوطني المعتمد."
      >
        <Timeline />
      </Section>

      <Section
        id="archive"
        tone="ink"
        chapterNumber={4}
        serialNumber="٠٩"
        badgeText="الأرشيف والمصادر"
        title="التوثيق الاستشراقي والمدونات التاريخية"
        description="شهادات وملاحظات المستشرقين والرحالة الغربيين حول نسب وقوة ومواقف السياحين في تاريخ الجزيرة العربية."
        loaderLabel="جارٍ تحميل الأرشيف الاستشراقي..."
      >
        <OppenheimArchive />
      </Section>

      {/* CHAPTER 5: المجتمع */}
      <ChapterDivider
        id="chapter-community"
        number={5}
        title="المجتمع"
        description="الأخبار والداعمين والتواصل: حاضر القبيلة وتواصلها مع الأجيال."
      />

      <Section
        id="news"
        tone="ink-2"
        noBorder
        chapterNumber={5}
        serialNumber="١٠"
        badgeText="الأخبار والمناسبات"
        title="الأخبار والمناسبات"
        description="قسم القراءة العامة لعناصر الأخبار والمناسبات المنشورة من لوحة الإدارة."
        loaderLabel="جارٍ تحميل الأخبار والمناسبات..."
      >
        <NewsEvents />
      </Section>

      <Section
        id="supporters"
        tone="ink"
        chapterNumber={5}
        serialNumber="١١"
        badgeText="بدعمهم نستمر"
        title="داعمو وثيقة وإرث القبيلة"
        description="تقديراً وعرفاناً لرجالات وأبناء قبيلة السياحين الذين ساهموا بسخاء ودعم مستمر في توثيق هذا الإرث التاريخي العريق وصونه للأجيال."
      >
        <Supporters />
      </Section>

      <Section
        id="contact"
        tone="ink-2"
        chapterNumber={5}
        serialNumber="١٢"
        badgeText="على تواصل"
        title="تواصل معنا"
        description="لأي استفسار أو إضافة معلومة موثّقة عن القبيلة، يسعدنا تواصلكم."
      >
        <Contact />
      </Section>

      <Section
        id="admin"
        tone="ink"
        noBorder
        chapterNumber={5}
        serialNumber="١٣"
        badgeText="بوابة الإدارة"
        title="قسم الإدارة"
        description="مركز إدارة محتوى الموقع الرسمي لقبيلة السياحين — يتيح للمشرفين نشر الأخبار وجدولة المناسبات وإدارة المحتوى المعروض للعموم."
      >
        <AdminSection />
      </Section>
      </main>

      {/* FOOTER */}
      <Footer scrollToSection={scrollToSection} />
      </motion.div>
    </AnimatePresence>
  );
}
