# AGENTS.md — الموقع الرسمي لقبيلة السياحين

> ملف التعليمات الموحّد لوكلاء الذكاء الاصطناعي (GitHub Copilot / Claude Code / Cursor / Codex).
> اقرأ هذا الملف بالكامل قبل كتابة أي سطر كود.

---

## 1. نظرة عامة

**alsaihani.com** — الديوان الرقمي الرسمي لقبيلة السياحين.
موقع تراثي عربي (RTL بالكامل) يوثّق نسب القبيلة، ديارها، شعرها، وأرشيفها الاستشراقي.
الموقع **ثابت بالكامل** (Static Site Export) — لا خادم Node دائم، لا ISR، لا Server Actions.

- **الموقع المباشر:** https://alsaihani.com
- **المستودع:** https://github.com/Tribe-alSayahin/Tribe-alSayahin.github.io

---

## 2. المكدّس التقني

| التقنية | الإصدار | الملاحظة |
|---------|---------|----------|
| Next.js | 15.x (App Router) | `output: 'export'`, `distDir: 'dist'` |
| React | 19.x | Server Components + Client Components |
| TypeScript | ~5.8 | صارم، `noEmit` في lint |
| Tailwind CSS | 4.x | عبر `@tailwindcss/postcss`، لا `tailwind.config` |
| Motion | 12.x | `import { motion } from 'motion/react'` |
| Supabase | 2.x | service_role وقت البناء فقط (لا يدخل client bundle)، anon عام محكوم بـ RLS |
| Leaflet | — | الخريطة التفاعلية في قسم الديار |
| lucide-react | — | الأيقونات |
| Vitest + axe-core | — | الاختبارات وإمكانية الوصول |

---

## 3. أوامر التطوير والبناء

```bash
npm run dev          # خادم التطوير — http://localhost:3000
npm run lint         # tsc --noEmit + ESLint (شغّله قبل كل commit)
npm run build:pages  # بناء ثابت إلى dist/ — يُستخدم في CI
npm run build        # مرادف لـ build:pages
npm run test         # Vitest run (اختبارات الوحدة)
npm run test:a11y    # اختبارات إمكانية الوصول (axe-core)
npm run test:watch   # Vitest في وضع المراقبة
npm run clean        # حذف dist/ و.next/
```

قبل كل commit: شغّل `npm run lint` وتأكد من صفر تحذيرات.
قبل فتح PR: شغّل `npm run test` و `npm run test:a11y`.

## 3.1 تعريف الإنجاز (Definition of Done)

لا يُعتبر أي PR مكتملاً إلا بتحقّق كل ما يلي:

- ✅ `npm run lint` ينجح بصفر أخطاء وصفر تحذيرات.
- ✅ `npm run build:pages` ينجح بصفر أخطاء (يؤكد توافق التصدير الثابت).
- ✅ `npm run test` و `npm run test:a11y` يمرّان.
- ✅ كل صفحة معدّلة تحتوي H1 واحداً فقط وبيانات وصفية كاملة (title، description، canonical).
- ✅ لا مسار مفهرس مكسور، ولا رابط sitemap محذوف دون redirect.
- ✅ لا سرّ أو مفتاح ظاهر في الكود أو سجلات البناء.

---

## 4. بنية المشروع

```
src/
├── app/                       # مسارات Next.js App Router
│   ├── layout.tsx             # الترويسة العامة (RTL، metadata، JSON-LD، Navbar/Footer)
│   ├── page.tsx               # الصفحة الرئيسية
│   ├── nasab/page.tsx         # النسب والفخوذ
│   ├── diyar/page.tsx         # الديار والخرائط
│   ├── hawiya/page.tsx        # الهوية والشعر
│   ├── tarikh/page.tsx        # التاريخ والأرشيف
│   ├── news/page.tsx          # قائمة الأخبار
│   ├── news/[slug]/page.tsx   # صفحة خبر فردي (SSG + generateStaticParams)
│   ├── admin/page.tsx         # لوحة الإدارة (noindex — مستثناة من sitemap)
│   ├── sitemap.ts             # Sitemap.xml مُولَّد وقت البناء (روابط معروفة مسبقاً)
│   └── robots.ts              # robots.txt
├── lib/
│   ├── posts.ts               # جلب الأخبار من Supabase build-time (service_role)
│   ├── supabase.ts            # عميل Supabase العام (NEXT_PUBLIC_*)
│   ├── seo.ts                 # buildSeoExcerpt + setSeoMeta
│   ├── motion-presets.ts      # إعدادات الحركة الموحدة
│   └── branding.ts            # OFFICIAL_LOGO_IMAGE_URL وثوابت العلامة التجارية
├── hooks/
│   ├── useTheme.ts            # مفتاح localStorage: siyahin-theme
│   └── useScrollState.ts
├── index.css                  # @theme + متغيرات الألوان + أدوات CSS مخصصة
├── styles/design-tokens.css   # مقاييس المسافات والتوهج والحركة
└── components/
    ├── layout/                # Navbar، Hero، Footer، Section، SectionHeader، MobileMenu
    ├── ui/                    # Button، Card، Badge، Modal
    ├── LineageTree/           # شجرة النسب (data + types + subcomponents)
    └── PoetryCouncil/         # ديوان الشعر (data + hooks + subcomponents)
```

---

## 5. أسلوب الكود

- TypeScript صارم: لا `any` ضمنية، لا `!` غير ضرورية.
- نمط دالّي: تجنّب الكلاسات — استخدم functions وhooks ومكوّنات صغيرة.
- مكوّنات صغيرة: كل مكوّن ملف منفرد، مسؤولية واحدة.
- Tailwind للتنسيق: لا CSS inline إلا للقيم الديناميكية.
- استيرادات: استخدم `motion/react` (ليس `framer-motion`).
- Server vs Client: فضّل Server Components — أضف `'use client'` فقط عند الحاجة (hooks، events).
- لا نصوص إنجليزية ظاهرة: كل النصوص المرئية للمستخدم بالعربية.
- لا ألوان Tailwind عامة: استخدم متغيرات الثيم فقط (brass، ink، sand، ...).

### الخطوط الإلزامية

| الفئة | الكلاس | الخط |
|-------|--------|------|
| عناوين الأقسام والـ Hero | `font-ruqaa` | Aref Ruqaa |
| العناوين الداخلية والنصوص التراثية | `font-serif` | Amiri |
| النصوص العامة | `font-sans` | IBM Plex Sans Arabic |
| الشارات والتسميات | `font-kufi` | Reem Kufi |

---

## 6. متطلبات SEO (إلزامية)

كل مسار (`/nasab`، `/diyar`، `/hawiya`، `/tarikh`، `/news`، `/news/[slug]`):

- `title` وصفي وفريد.
- `description` بين 120–160 حرفاً.
- `canonical` مطابق للمسار الفعلي.

JSON-LD في كل صفحة ذات صلة:

- `Organization` في الصفحة الرئيسية.
- `Article` في صفحات الأخبار الفردية.
- `BreadcrumbList` في الصفحات الداخلية.

- H1 واحد فقط لكل صفحة — لا تكسر التسلسل الهرمي للعناوين.
- Sitemap: محدَّث تلقائياً — لا تحذف مساراً مفهرساً.
- Sitemap/robots: مُولَّدان وقت البناء فقط — ممنوع أي اعتماد على بيانات وقت التشغيل (متوافق مع `output: 'export'`). كل الروابط يجب أن تكون معروفة عند البناء.
- robots.txt: `/admin` مستثنى (`Disallow: /admin/`).
- Open Graph + Twitter Cards في كل صفحة رئيسية وخبر.

---

## 7. قواعد المحتوى والهوية البصرية

- `dir="rtl"` في `<html>` — لا تغيّره.
- الثيمان (داكن/فاتح) يعملان عبر متغيرات CSS في `src/index.css` — الفئة `dark` على `<html>`.
- مفتاح localStorage للثيم: `siyahin-theme`.
- نقشة السدو والألوان النحاسية تُعرَّف في `@theme` — لا تستبدلها بألوان Tailwind خام.
- اسم الموقع الرسمي: «الموقع الرسمي لقبيلة السياحين» — استخدمه في أي عنوان أو وسم جديد.
- عند إضافة قسم جديد: اتبع مهارة `new-section` — روابط Navbar وMobileMenu يجب أن تتطابق في `src/lib/navigation.ts`.

---

## 8. النشر وإعادة البناء

- مصدر GitHub Pages: GitHub Actions (workflow: `.github/workflows/deploy.yml`).
- لا مجلد `docs/` — لا تنشر يدوياً — فقط ادمج في `main`.
- لا تُعِد مصدر Pages إلى "Deploy from a branch" — هذا يكسر الموقع.
- إعادة البناء التلقائي للأخبار: Supabase Webhook → `repository_dispatch` (`rebuild-news`) → GitHub Actions.
- لا symlinks في `.claude/skills/` — استخدم ملفات حقيقية (symlinks تكسر نشر Pages).

---

## 9. الأمان — إلزامي (Critical Security Rules)

> ⚠️ مخالفة أي من هذه القواعد قد تُعرّض أسرار القبيلة وبيانات Supabase للاختراق.

### 9.1 مفاتيح Supabase

| المفتاح | الاستخدام المسموح | الملاحظة الأمنية |
|---------|-------------------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | واجهة المتصفح | عنوان عام — لا خطر |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | واجهة المتصفح (anon + RLS) | آمن للكشف العلني (محكوم بـ RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub Actions Secrets (build-time فقط) | ⛔ محظور في أي `NEXT_PUBLIC_*` — يتجاوز RLS بالكامل |
| `SUPABASE_SECRET_KEY` | احتياطي لـ service_role | ⛔ محظور في أي `NEXT_PUBLIC_*` — يتجاوز RLS بالكامل |

⛔ **لا تضع `SUPABASE_SERVICE_ROLE_KEY` أو `SUPABASE_SECRET_KEY` في أي متغير يبدأ بـ `NEXT_PUBLIC_`.**
هذا المفتاح يمنح وصولاً كاملاً لقاعدة البيانات ويتجاوز RLS.

⚠️ مع `output: 'export'` يُستخدم service_role فقط في سكربتات Node وقت البناء (`lib/posts.ts`).
تأكّد أن حزمة العميل النهائية (client bundle) لا تستورد service_role إطلاقاً — لا تستورد ملف build-time داخل أي مكوّن يحمل `'use client'`.

### 9.2 سياسات RLS

- الجدول `admin_posts`: القراءة العامة محصورة في `status = 'published'` فقط.
- لا تُضعف سياسات RLS أو تُعطّلها تحت أي ذريعة.
- استخدم anon key للعرض العلني، وservice_role للبناء فقط.

### 9.3 ملفات البيئة

- `.env` مدرج في `.gitignore` — لا ترفع أي ملف `.env` حقيقي إلى المستودع أبداً.
- الملف الوحيد المسموح برفعه: `.env.example` (بقيم وهمية فقط).
- لا تكتب أي سرّ أو مفتاح في كود المصدر — استخدم متغيرات البيئة دائماً.

### 9.4 لوحة الإدارة

- `/admin` تحمل `noindex,nofollow` في `<meta robots>`.
- `/admin` مستثناة من `sitemap.ts` و `robots.ts`.
- صلاحيات الإدارة تعتمد على Supabase RPC/RLS فقط (`current_admin_role`، `has_admin_role`).

### 9.5 سجلات البناء

- لا تطبع أي سرّ أو مفتاح في `console.log` أو سجلات GitHub Actions.
- تحقق من عدم ظهور الأسرار في output البناء قبل دمج أي PR.

### 9.6 اعتماديات خارجية

- لا تضف حزمة npm جديدة دون التحقق من سجل الثغرات (GitHub Advisory Database).
- راجع آخر إصدار ونجوم الحزمة قبل إضافتها.

---

## 10. الأوامر المخصصة (Claude Slash Commands)

موجودة في `.claude/commands/`:

| الأمر | الوصف |
|-------|-------|
| `/git/cm` | commit مع رسالة عربية |
| `/git/cp` | cherry-pick |
| `/git/pr` | فتح PR |
| `/review` | مراجعة شاملة للكود |
| `/security-scan` | فحص أمني |
| `/update-docs` | تحديث التوثيق |

---

## 11. نصائح للوكلاء

- لا تُعدّل `next.config.ts` دون إذن — `output: 'export'` إعداد حرج للنشر.
- لا تُضف `'use server'` — هذا موقع ثابت، لا Server Actions.
- لا تُضف Leaflet SSR — استخدم `dynamic(() => import(...), { ssr: false })`.
- لا تُضف صور بتنسيق `<Image>` بدون `unoptimized` — الموقع ثابت.
- لا تكسر مسار أو عنوان URL مفهرس في Google دون ضرورة قصوى وإعداد redirect.
- عند الشك: شغّل `npm run lint` أولاً وأصلح كل تحذير.
