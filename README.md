# الموقع الرسمي لقبيلة السياحين

البوابة الرقمية الموثقة لقبيلة السياحين من الروقة من عتيبة — توثيق النسب والديار والفروع، الديوان التفاعلي للشعر النبطي، والأرشيف الاستشراقي المصوّر.

**الموقع المباشر:** https://tribe-alsayahin.github.io

## التقنيات

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Motion (Framer Motion) للحركة

## التشغيل محلياً

المتطلبات: Node.js 20 أو أحدث

```bash
npm install
npm run dev        # خادم التطوير على http://localhost:3000
```

## الأوامر

| الأمر | الوصف |
|---|---|
| `npm run dev` | تشغيل خادم التطوير (Express + Vite) |
| `npm run build` | بناء كامل (الموقع + الخادم) |
| `npm run build:pages` | بناء النسخة الثابتة للنشر على GitHub Pages |
| `npm run lint` | فحص أنواع TypeScript |

## النشر

إعداد GitHub Pages الحالي ينشر محتوى مجلد `docs/` من الفرع `main` مباشرة، لذا يجب إعادة البناء وتحديث المجلد عند كل تعديل:

```bash
npm run build:pages && rm -rf docs && cp -r dist docs && touch docs/.nojekyll
```

**الأفضل:** تحويل مصدر النشر إلى GitHub Actions من إعدادات المستودع (Settings ← Pages ← Source ← GitHub Actions)؛ عندها يبني الموقع تلقائياً عند كل دفع عبر `.github/workflows/deploy.yml` ويمكن حذف مجلد `docs/` نهائياً.

## بنية المشروع

```
src/
├── App.tsx                    # الصفحة الرئيسية وتجميع الأقسام
├── components/
│   ├── layout/                # الترويسة، التذييل، البطل، التواصل...
│   ├── ui/                    # مكوّنات الأزرار والبطاقات والنوافذ
│   ├── LineageTree/           # شجرة النسب التفاعلية
│   ├── PoetryCouncil/         # ديوان الشعر النبطي
│   ├── InteractiveMap.tsx     # خريطة الديار
│   ├── OppenheimArchive.tsx   # الأرشيف الاستشراقي
│   ├── CelestialCompass.tsx   # البوصلة السماوية
│   └── WasmGallery.tsx        # معرض الوسوم المتجهي
├── hooks/                     # useTheme, useScrollState
└── styles/                    # رموز التصميم
```
