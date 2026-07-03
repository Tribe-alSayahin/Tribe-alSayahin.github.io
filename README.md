# قبيلة السياحين | الديوان الرقمي التراثي

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

يُنشر الموقع تلقائياً إلى GitHub Pages عبر GitHub Actions عند كل دفع إلى الفرع `main` (انظر `.github/workflows/deploy.yml`). النسخة المنشورة ثابتة بالكامل.

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
