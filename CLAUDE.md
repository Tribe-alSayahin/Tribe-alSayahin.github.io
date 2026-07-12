# الموقع الرسمي لقبيلة السياحين

موقع تراثي عربي (RTL بالكامل) يوثّق نسب قبيلة السياحين وديارها وشعرها وأرشيفها الاستشراقي.
الموقع المباشر: https://tribe-alsayahin.github.io / https://alsaihani.com

## التقنيات

- React 19 + TypeScript + Next.js 15 (App Router + Static Site Export)
- Tailwind CSS 4 (عبر `@tailwindcss/postcss` — لا يوجد tailwind.config؛ الألوان معرّفة في `@theme` داخل `src/index.css`)
- Motion (framer-motion الجديد، يُستورد من `motion/react`)
- Leaflet للخريطة التفاعلية، lucide-react للأيقونات
- Supabase للأخبار والإدارة (build-time عبر `service_role`، قراءة عامة عبر `anon` + RLS)

## الأوامر

```bash
npm run dev          # خادم التطوير على http://localhost:3000 (next dev)
npm run lint         # فحص أنواع TypeScript + ESLint — شغّله قبل كل commit
npm run build:pages  # بناء النسخة الثابتة إلى dist/ (Next.js static export)
npm run test         # تشغيل اختبارات Vitest
npm run test:a11y    # اختبارات إمكانية الوصول
```

## النشر

النشر تلقائي عبر GitHub Actions (مصدر Pages: **GitHub Actions** منذ 2026-07-04): كل دفعة إلى `main`
تشغّل `.github/workflows/deploy.yml` الذي يفحص الأنواع والاختبارات ثم يبني `dist/` وينشره. لا مجلد `docs/`
ولا خطوات يدوية — فقط ادمج في `main` وانتظر اكتمال الـ workflow (~دقيقة).

**تحذير:** لا تُعِد مصدر Pages إلى "Deploy from a branch" — هذا ما كسر الموقع سابقاً
(شاشة تحميل لا تنتهي لأن Pages قدّم ملفات المصدر بدل البناء).

**إعادة البناء التلقائي للأخبار:** عند إدراج/تعديل/حذف خبر في `admin_posts`، يطلق Supabase Webhook
`repository_dispatch` من نوع `rebuild-news` ليعيد GitHub Actions بناء الموقع ونشر صفحات `/news/[slug]/` الثابتة.

## بنية المشروع

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
│   ├── admin/page.tsx         # لوحة الإدارة (noindex)
│   ├── sitemap.ts             # Sitemap.xml (استيراد generateStaticParams للأخبار)
│   └── robots.ts              # robots.txt
├── lib/posts.ts               # جلب الأخبار من Supabase أثناء البناء (service_role key)
├── lib/supabase.ts            # عميل Supabase للقراءة العامة (NEXT_PUBLIC_*)
├── index.css                  # متغيرات الألوان والثيمين + @theme + أدوات CSS مخصصة
├── styles/design-tokens.css   # مقاييس المسافات والتوهج والحركة
├── lib/motion-presets.ts      # إعدادات الحركة الموحدة
├── hooks/                     # useTheme (مفتاح localStorage: siyahin-theme), useScrollState
└── components/
    ├── layout/                # Navbar, Hero, Footer, Section, SectionHeader, MobileMenu ...
    ├── ui/                    # Button, Card, Badge, Modal
    ├── LineageTree/           # شجرة النسب (data + types + subcomponents)
    └── PoetryCouncil/         # ديوان الشعر (data + hooks + subcomponents)
```

## قواعد إلزامية

- كل النصوص بالعربية والاتجاه RTL (`dir="rtl"` في html). لا تضف نصاً إنجليزياً ظاهراً للمستخدم.
- استخدم ألوان الثيم فقط (`brass`, `ink`, `sand`, ...) — لا ألوان Tailwind عامة، حتى يعمل الوضعان الداكن والفاتح. راجع مهارة `design-system`.
- الخطوط: `font-ruqaa` (Aref Ruqaa) لعناوين الأقسام الكبرى والـHero، `font-serif` (Amiri) للعناوين الداخلية والنصوص التراثية، `font-sans` (IBM Plex Sans Arabic) للنصوص، `font-kufi` (Reem Kufi) للشارات والتسميات.
- `next.config.ts` يستخدم `output: 'export'` و `trailingSlash: true` و `distDir: 'dist'` و `images.unoptimized: true`.
- مفتاح `service_role` يُستخدم **build-time فقط** في GitHub Actions Secrets (`SUPABASE_SERVICE_ROLE_KEY` أو `SUPABASE_SECRET_KEY`)، ولا يُنشر في `NEXT_PUBLIC_*`.
- القراءة العامة للأخبار تتم عبر `anon` key + RLS تسمح فقط بـ `status = 'published'`.
- لوحة الإدارة `/admin` تحمل `noindex` ولا تُضمّن في `sitemap` و `robots.txt`.
- اسم الموقع الرسمي: «الموقع الرسمي لقبيلة السياحين» — استخدمه في أي عنوان أو وسم جديد.
- عند إضافة قسم جديد اتبع مهارة `new-section` (روابط Navbar وMobileMenu يجب أن تتطابق).
