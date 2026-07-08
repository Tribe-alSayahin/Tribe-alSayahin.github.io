# الموقع الرسمي لقبيلة السياحين

البوابة الرقمية الموثقة لقبيلة السياحين من الروقة من عتيبة — توثيق النسب والديار والفروع، الديوان التفاعلي للشعر النبطي، والأرشيف الاستشراقي المصوّر.

**الموقع المباشر:** https://tribe-alsayahin.github.io

## التقنيات

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Motion (Framer Motion) للحركة
- Supabase للمصادقة وقاعدة البيانات والتخزين

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

### إعداد GitHub Pages (مهم جداً)

هذا المشروع يعتمد على **GitHub Actions** للنشر، وليس على "Deploy from branch".

1. افتح المستودع في GitHub
2. اذهب إلى **Settings → Pages**
3. تحت **Build and deployment / Source**، اختر **GitHub Actions**
4. لا تتركه مضبوطاً على **Deploy from a branch**

بعد أي push إلى الفرع `main`، سيتم بناء الموقع تلقائياً ونشره من مجلد `dist/` عبر workflow `.github/workflows/deploy.yml`.

### دليل استكشاف الأخطاء

إذا رأيت شاشة تحميل فقط على الموقع المنشور:

1. تأكد أن GitHub Pages مضبوط على **GitHub Actions** وليس **Deploy from branch**
2. افتح **Actions** في المستودع وتأكد أن workflow **Deploy to GitHub Pages** يعمل بنجاح
3. بعد نجاح الـ workflow، تأكد أن الرابط النهائي يخدم ملفات `assets/` وليس `/src/main.tsx`

## إعداد لوحة الإدارة (الأخبار والمناسبات)

لوحة الإدارة تعمل عبر Supabase في مسار مستقل: `/admin`.

### 1) إنشاء مشروع Supabase

1. افتح https://supabase.com
2. أنشئ حساباً جديداً
3. أنشئ مشروعاً جديداً
4. احفظ **Project URL** و **Publishable key** من Settings → API

### 2) إعداد قاعدة البيانات وسياسات RLS

1. افتح مشروعك في Supabase Dashboard
2. اذهب إلى SQL Editor
3. انسخ محتوى ملف `supabase-setup.sql` في هذا المستودع
4. الصقها في SQL Editor واضغط Run
5. سيُنشأ جدول `public.admin_posts` مع سياسات:
   - قراءة للجميع
   - insert / update / delete للمستخدمين `authenticated` فقط

### 3) إنشاء مستخدم مشرف

1. اذهب إلى Authentication في Supabase Dashboard
2. اختر Add user
3. أدخل البريد الإلكتروني وكلمة المرور

### 4) متغيرات البيئة

#### محلياً

1. أنشئ ملف `.env` من `.env.example`
2. أضف مفاتيح الواجهة:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-public-key"
```

3. أضف مفاتيح الخادم والـ API handlers:

```bash
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-publishable-public-key"
SUPABASE_SECRET_KEY="your-secret-server-key"
SUPABASE_JWKS_URL="https://your-project-id.supabase.co/auth/v1/.well-known/jwks.json"
```

> في Supabase Edge Functions يتم حقن هذه القيم تلقائياً، أما في Express داخل هذا المشروع فيلزم تعريفها في البيئة محلياً أو داخل أسرار النشر.

#### على GitHub Actions

1. اذهب إلى **Settings → Secrets and variables → Actions**
2. أضف Secret باسم: `NEXT_PUBLIC_SUPABASE_URL`
3. أضف Secret باسم: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. أضف Secret باسم: `SUPABASE_URL`
5. أضف Secret باسم: `SUPABASE_PUBLISHABLE_KEY`
6. أضف Secret باسم: `SUPABASE_SECRET_KEY`
7. أضف Secret باسم: `SUPABASE_JWKS_URL`

**هام:**
- لا تضع `service_role key` في الواجهة أبداً
- الأمان يعتمد على Supabase Auth + RLS
- المسار الخادمي `/api/auth/session` يتحقق من ترويسة `Authorization` عبر الحزمة `@supabase/server` ثم يجلب بيانات المستخدم من Supabase على الخادم

### 5) التشغيل المحلي

```bash
npm install
npm run dev
```

- الموقع العام: http://localhost:3000
- لوحة الإدارة: http://localhost:3000/admin

## بنية المشروع

```
src/
├── App.tsx                        # الصفحة الرئيسية وتجميع الأقسام
├── lib/
│   ├── supabase.ts               # عميل Supabase قابل لإعادة الاستخدام
│   ├── admin-posts.ts            # أنواع واستعلامات admin_posts
│   └── navigation.ts             # روابط التنقل
├── components/
│   ├── layout/                   # الترويسة، التذييل، البطل، التواصل...
│   ├── ui/                       # مكوّنات الأزرار والبطاقات والنوافذ
│   ├── admin/
│   │   └── AdminPage.tsx         # صفحة /admin (دخول + إضافة/حذف)
│   ├── LineageTree/              # شجرة النسب التفاعلية
│   ├── PoetryCouncil/            # ديوان الشعر النبطي
│   ├── InteractiveMap.tsx        # خريطة الديار
│   ├── OppenheimArchive.tsx      # الأرشيف الاستشراقي
│   ├── CelestialCompass.tsx      # البوصلة السماوية
│   ├── WasmGallery.tsx           # معرض الوسوم المتجهي
│   ├── NewsEvents.tsx            # قسم الأخبار والمناسبات العام
│   └── NewsEvents.data.ts        # البيانات الافتراضية للأخبار
├── hooks/                        # useTheme, useScrollState
└── styles/                       # رموز التصميم
```

## جداول Supabase

| الجدول | الوصف |
|---|---|
| `admin_posts` | عناصر الأخبار والمناسبات المُدارة من لوحة الإدارة |

## الأمان

- **المصادقة:** Supabase Auth بالبريد الإلكتروني وكلمة المرور
- **الصلاحيات:** Row Level Security مفعّل على `admin_posts`
- **الزوار:** قراءة فقط
- **المستخدمون المسجلون:** إضافة/تعديل/حذف

## ملاحظات

- لا يتم تخزين كلمات المرور أو الأسرار في الكود
- السرية تعتمد على Supabase Auth و RLS، وليس على إخفاء الكود
