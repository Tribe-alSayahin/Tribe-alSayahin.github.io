# خطة الترحيل: SEO وقابلية الفهرسة الكاملة (Next.js App Router + SSG)

## السياق
- المكدّس الحالي: React 19 + TypeScript + Next.js 15 + Tailwind CSS 4 + Supabase + GitHub Pages.
- الهدف: جعل كل المحتوى قابلاً للفهرسة بمسارات مستقلة، وصفوف meta ديناميكية، JSON-LD، sitemap، و Core Web Vitals عالية.

## المسار المعتمد
**Next.js 15 (App Router) + `output: 'export'` + Static Site Generation (SSG).**

### لماذا Next.js وليس Vite+SSG؟
- `Metadata API` مدمج لكل مسار.
- `generateStaticParams` لصفحات الأخبار الديناميكية.
- `sitemap.ts` و `robots.ts` مدمجان لتوليد `sitemap.xml` و `robots.txt`.
- `dynamic` import للـ code splitting بسيط.
- GitHub Pages يدعم التصدير الثابت عبر `output: 'export'` و `trailingSlash: true`.

## المسارات
| المسار | المحتوى |
|---|---|
| `/` | الرئيسية (Hero + ملخص + روابط للأقسام) |
| `/nasab/` | النسب والفخوذ والأنساب (Jathum + LineageTree + Constellation) |
| `/diyar/` | الديار والخرائط والمعرض (Map + HeritageGallery) |
| `/hawiya/` | الوسم والشعر النبطي (WasmGallery + PoetryCouncil) |
| `/tarikh/` | التاريخ والأرشيف (Timeline + OppenheimArchive) |
| `/news/` | قائمة الأخبار والمناسبات |
| `/news/[slug]/` | صفحة مستقلة لكل خبر |
| `/admin/` | لوحة الإدارة (client-only، `noindex`) |

## آلية إعادة البناء عند نشر خبر
- **لا ISR** لأن `output: 'export'` مع GitHub Pages لا يدعم خادم Node.js دائم.
- **GitHub Actions + Supabase Webhook**:
  1. Supabase Database Webhook يُطلق على `INSERT`/`UPDATE`/`DELETE` في `admin_posts`.
  2. Webhook يستدعي Edge Function `supabase/functions/rebuild-news/index.ts`.
  3. Edge Function تستدعي `POST` إلى `https://api.github.com/repos/Tribe-alSayahin/Tribe-alSayahin.github.io/dispatches` مع `event_type: rebuild-news`.
  4. GitHub Actions workflow `.github/workflows/deploy.yml` يستمع إلى `repository_dispatch` ويبني الموقع وينشره.
  5. وقت البناء يُقرأ `admin_posts` من Supabase بـ `service_role` ويُولد صفحات `/news/[slug]/` ثابتة.

## الأمن
- **Service Role Key**: يُستخدم **build-time فقط** ويُخزن في `GitHub Actions Secrets` (`SUPABASE_SERVICE_ROLE_KEY` أو `SUPABASE_SECRET_KEY`). لا يُنشر في `NEXT_PUBLIC_*` ولا يصل للمتصفح.
- **القراءة العامة**: تتم عبر `anon` key مع RLS تسمح بقراءة الأخبار `status = 'published'` فقط (محدّث في `supabase-setup.sql`).
- **الكتابة**: محمية بـ RLS تتحقق من `auth.uid()` و `admin_users.role = 'super_admin'` (محدّث في `supabase-setup.sql`).
- **لوحة الإدارة**: `<meta name="robots" content="noindex, nofollow">` واستثناء من `sitemap` و `robots.txt`.
- **مفاتيح العميل**: `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` فقط للعرض العام.

## الأقسام التنفيذية
1. **تهيئة Next.js** ✅
   - `next.config.ts` (`output: 'export'`, `trailingSlash: true`, `distDir: 'dist'`, `images.unoptimized: true`).
   - `postcss.config.mjs` (`@tailwindcss/postcss`).
   - `tsconfig.json` محدّث لـ Next.js.
   - نقل `src/components`, `src/hooks`, `src/styles`, `public`, `src/lib`.
   - إنشاء `src/app/layout.tsx` مع RTL + metadata + viewport + JSON-LD + Navbar/Footer.
2. **نظام المسارات** ✅
   - `app/layout.tsx` + `app/page.tsx` + `app/HomePage.tsx`.
   - `app/nasab/page.tsx`، `app/diyar/page.tsx`، `app/hawiya/page.tsx`، `app/tarikh/page.tsx`.
   - `app/news/page.tsx` + `app/news/[slug]/page.tsx` مع `generateStaticParams`.
   - `app/admin/page.tsx` (noindex).
   - `app/not-found.tsx`.
3. **البيانات الديناميكية** ✅
   - `src/lib/posts.ts` لجلب `admin_posts` من Supabase بـ `service_role` أثناء `build`.
   - `generateStaticParams` لـ `/news/[slug]/`.
4. **Metadata & JSON-LD** ✅
   - `metadata` لكل page.
   - Open Graph/Twitter لكل مسار.
   - JSON-LD لـ `Organization` (عام)، `Article` (خبر)، `BreadcrumbList` (كل مسار).
5. **Sitemap & Robots** ✅
   - `app/sitemap.ts` يولّد `sitemap.xml` (المسارات + الأخبار).
   - `app/robots.ts` يولّد `robots.txt` ويستثني `/admin/*`.
6. **الأداء** ✅
   - `next/image` مع `unoptimized: true`.
   - `font-display: swap` (خيوط Google Fonts محمّلة بالطريقة المعتادة).
   - تحديد أبعاد الصور (`width`/`height`).
   - كل المسارات تصيّر HTML كامل بدون انتظار JS.
7. **الوصولية** ✅
   - H1 واحد لكل page.
   - تدرج منطقي للعناوين.
   - `alt` وصفي للصور.
   - عناصر دلالية (`main`, `article`, `nav`, `section`).
   - رابط تخطي إلى المحتوى الرئيسي.
8. **الاختبارات** ✅
   - `npm run lint` (tsc + eslint) يمر.
   - `npm run test` (vitest) يمر.
   - `npm run build` يمر وينتج `dist/`.
   - `Lighthouse` desktop/mobile ≥ 95 بعد النشر.
9. **النشر** ✅
   - `.github/workflows/deploy.yml` محدّث لـ Next.js `static export` ويستجيب لـ `repository_dispatch`.
   - Edge Function `supabase/functions/rebuild-news/index.ts` للـ webhook.
   - RLS محدّث في `supabase-setup.sql`.
10. **ما بعد النشر** (يتطلب خطوات يدوية)
   - إضافة الأسرار في GitHub → Settings → Secrets → Actions:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (أو `SUPABASE_SECRET_KEY`)
   - إضافة `GITHUB_TOKEN` (PAT مع `repo` scope) في Supabase Edge Function secrets:
     - `supabase secrets set GITHUB_TOKEN <token> --project-ref <ref>`
     - `supabase secrets set WEBHOOK_SECRET <random-secret> --project-ref <ref>`
   - نشر Edge Function: `supabase functions deploy rebuild-news --project-ref <ref>`
   - إعداد Supabase Database Webhook:
     - Table: `public.admin_posts`
     - Events: `INSERT`, `UPDATE`, `DELETE`
     - URL: `https://<project-ref>.supabase.co/functions/v1/rebuild-news`
     - Headers: `Authorization: Bearer <anon-key>` + `X-Webhook-Secret: <WEBHOOK_SECRET>`
   - رفع `sitemap.xml` في Google Search Console وطلب فهرسة كل مسار.
   - فحص Lighthouse على `https://alsaihani.com/`.

## قائمة التحقق النهائية للفهرسة
- [ ] `https://alsaihani.com/` يعيد HTML كامل.
- [ ] `https://alsaihani.com/nasab/` فهرستها متاحة.
- [ ] `https://alsaihani.com/diyar/` فهرستها متاحة.
- [ ] `https://alsaihani.com/hawiya/` فهرستها متاحة.
- [ ] `https://alsaihani.com/tarikh/` فهرستها متاحة.
- [ ] `https://alsaihani.com/news/` فهرستها متاحة.
- [ ] `https://alsaihani.com/news/<slug>/` فهرستها متاحة لكل خبر.
- [ ] `https://alsaihani.com/sitemap.xml` يتضمن كل المسارات والأخبار.
- [ ] `https://alsaihani.com/robots.txt` يسمح بالفهرسة ويستثني `/admin/`.
- [ ] `/admin/` تحمل `noindex` ولا تظهر في `sitemap.xml`.
- [ ] لا توجد أسرار في `NEXT_PUBLIC_*` أو في الكود العلني.
- [ ] Lighthouse SEO ≥ 95 لكل صفحة.

## المخرجات
- كل مسار يعيد HTML كامل بدون JavaScript.
- `sitemap.xml` يتضمن المسارات والأخبار.
- درجات Lighthouse ≥ 95.
- لا تسرب لمفاتيح حساسة.
