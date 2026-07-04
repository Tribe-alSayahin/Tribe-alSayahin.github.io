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

## النشر — مهم جداً

GitHub Pages ينشر من مجلد `main:/docs` (وضع "Deploy from a branch")، **وليس** من GitHub Actions.
أي تعديل على الموقع لا يظهر حتى يُعاد بناء `docs/` ويُدفع:

```bash
npm run build:pages && rm -rf docs && cp -r dist docs && touch docs/.nojekyll
```

لا تنسَ `docs/.nojekyll` وإلا كسر Jekyll الملفات. راجع مهارة `deploy-pages` للتفاصيل.
ملف `.github/workflows/deploy.yml` موجود لكنه غير مُفعّل النتيجة حالياً (يُتجاهل ما دام مصدر Pages هو الفرع).

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
- الخطوط: `font-serif` (Amiri) للعناوين، `font-sans` (Tajawal) للنصوص، `font-kufi` (Reem Kufi) للشارات والتسميات.
- `vite.config.ts` يستخدم `base: './'` — لا تغيّره، النشر يعتمد عليه.
- اسم الموقع الرسمي: «الموقع الرسمي لقبيلة السياحين» — استخدمه في أي عنوان أو وسم جديد.
- عند إضافة قسم جديد اتبع مهارة `new-section` (روابط Navbar وMobileMenu يجب أن تتطابق).
