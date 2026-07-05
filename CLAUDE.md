# الموقع الرسمي لقبيلة السياحين

موقع تراثي عربي (RTL بالكامل) يوثّق نسب قبيلة السياحين وديارها وشعرها وأرشيفها الاستشراقي.
الموقع المباشر: https://tribe-alsayahin.github.io

## التقنيات

- React 19 + TypeScript + Vite 6
- Tailwind CSS 4 (عبر `@tailwindcss/vite` — لا يوجد tailwind.config؛ الألوان معرّفة في `@theme` داخل `src/index.css`)
- Motion (framer-motion الجديد، يُستورد من `motion/react`)
- Leaflet للخريطة التفاعلية، lucide-react للأيقونات
- خادم Express (`server.ts`) للتطوير المحلي فقط

## الأوامر

```bash
npm run dev          # خادم التطوير على http://localhost:3000 (Express + Vite middleware)
npm run lint         # فحص أنواع TypeScript (tsc --noEmit) — شغّله قبل كل commit
npm run build:pages  # بناء النسخة الثابتة إلى dist/ (+ نسخ index.html إلى 404.html)
```

## النشر

النشر تلقائي عبر GitHub Actions (مصدر Pages: **GitHub Actions** منذ 2026-07-04): كل دفعة إلى `main`
تشغّل `.github/workflows/deploy.yml` الذي يفحص الأنواع ثم يبني `dist/` وينشره. لا مجلد `docs/`
ولا خطوات يدوية — فقط ادمج في `main` وانتظر اكتمال الـ workflow (~دقيقة).
راجع مهارة `deploy-pages` للتحقق بعد النشر.

**تحذير:** لا تُعِد مصدر Pages إلى "Deploy from a branch" — هذا ما كسر الموقع سابقاً
(شاشة تحميل لا تنتهي لأن Pages قدّم ملفات المصدر بدل البناء).

## بنية المشروع

```
src/
├── App.tsx                    # الصفحة الرئيسية وتجميع الأقسام + منطق التوجيه (hash/hostname)
├── index.css                  # متغيرات الألوان والثيمين + @theme + أدوات CSS مخصصة
├── styles/design-tokens.css   # مقاييس المسافات والتوهج والحركة
├── lib/motion-presets.ts      # إعدادات الحركة الموحدة
├── hooks/                     # useTheme (مفتاح localStorage: siyahin-theme), useScrollState
└── components/
    ├── layout/                # Navbar, Hero, Footer, SectionHeader, MobileMenu ...
    ├── ui/                    # Button, Card, Badge, Modal
    ├── LineageTree/           # شجرة النسب (data + types + subcomponents)
    └── PoetryCouncil/         # ديوان الشعر (data + hooks + subcomponents)
```

## قواعد إلزامية

- كل النصوص بالعربية والاتجاه RTL (`dir="rtl"` في html). لا تضف نصاً إنجليزياً ظاهراً للمستخدم.
- استخدم ألوان الثيم فقط (`brass`, `ink`, `sand`, ...) — لا ألوان Tailwind عامة، حتى يعمل الوضعان الداكن والفاتح. راجع مهارة `design-system`.
- الخطوط: `font-ruqaa` (Aref Ruqaa) لعناوين الأقسام الكبرى والـHero، `font-serif` (Amiri) للعناوين الداخلية والنصوص التراثية، `font-sans` (IBM Plex Sans Arabic) للنصوص، `font-kufi` (Reem Kufi) للشارات والتسميات.
- `vite.config.ts` يستخدم `base: './'` — لا تغيّره، النشر يعتمد عليه.
- اسم الموقع الرسمي: «الموقع الرسمي لقبيلة السياحين» — استخدمه في أي عنوان أو وسم جديد.
- عند إضافة قسم جديد اتبع مهارة `new-section` (روابط Navbar وMobileMenu يجب أن تتطابق).
