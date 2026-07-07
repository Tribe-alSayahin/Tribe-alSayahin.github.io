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

## إعداد لوحة التحكم

لوحة التحكم تعتمد على **Supabase** كمصادقة وقاعدة بيانات وتخزين صور. هذه الخدمة تسمح بإدارة محتوى الموقع من واجهة إدارة حقيقية دون الحاجة إلى Backend تقليدي، ومناسبة تماماً لاستضافة GitHub Pages.

### 1) إنشاء مشروع Supabase

1. افتح https://supabase.com
2. أنشئ حساباً جديداً
3. أنشئ مشروعاً جديداً New Project
4. احفظ **Project URL** و **anon public key** من Settings → API

### 2) إعداد قاعدة البيانات

1. افتح مشروعك في Supabase Dashboard
2. اذهب إلى SQL Editor
3. انسخ محتوى ملف `supabase-setup.sql` في هذا المستودع
4. الصقها في SQL Editor واضغط Run
5. هذا سينشئ الجداول والتريجرز وتفعيل RLS والسياسات

### 3) إعداد Storage

1. اذهب إلى Storage في Supabase Dashboard
2. أنشئ Bucket جديد باسم: `site-images`
3. اجعل Bucket عاماً Public
4. اذهب إلى Storage Policies واتبع التعليمات في `supabase-setup.sql` لإنشاء السياسات

### 4) إنشاء مستخدم Admin

1. اذهب إلى Authentication في Supabase Dashboard
2. اختر Create User
3. أدخل بريدك الإلكتروني وكلمة المرور
4. هذا المستخدم سيكون مسؤول الدخول للوحة التحكم

### 5) ربط المشروع بـ Supabase

1. في جذر المشروع، أنشئ ملف `.env` من `.env.example`
2. ضع القيم الحقيقية:

```
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

**هام:**
- لا تضع `service_role key` في Frontend أبداً
- الأمان يعتمد على RLS Policies التي أنشأتها في Supabase

### 6) تشغيل الموقع محلياً

```bash
npm install
npm run dev
```

ثم افتح:
- الموقع العام: http://localhost:3000
- لوحة التحكم: http://localhost:3000/#/admin

### 7) الدخول للوحة التحكم

استخدم البريد الإلكتروني وكلمة المرور التي أنشأتها في Supabase Authentication.

### 8) طريقة النشر

```bash
git status
git add .
git commit -m "Add Supabase admin dashboard"
git push
```

سيتم البناء والنشر تلقائياً عبر GitHub Actions.

## بنية المشروع

```
src/
├── App.tsx                        # الصفحة الرئيسية وتجميع الأقسام
├── lib/
│   ├── supabase.ts               # اتصال Supabase
│   └── navigation.ts             # روابط التنقل
├── components/
│   ├── layout/                   # الترويسة، التذييل، البطل، التواصل...
│   ├── ui/                       # مكوّنات الأزرار والبطاقات والنوافذ
│   ├── admin/                    # لوحة التحكم
│   │   ├── AdminShell.tsx        # حماية noindex
│   │   ├── AdminLayout.tsx       # تخطيط لوحة التحكم مع Sidebar
│   │   ├── AdminLogin.tsx        # تسجيل دخول بالإيميل وكلمة المرور
│   │   ├── AdminDashboard.tsx    # الإحصائيات والوصول السريع
│   │   ├── NewsManager.tsx       # إدارة الأخبار والمناسبات
│   │   ├── GalleryManager.tsx    # إدارة معرض الصور
│   │   ├── ContentManager.tsx    # إدارة محتوى الموقع
│   │   ├── SocialManager.tsx     # إدارة روابط التواصل
│   │   └── SettingsManager.tsx   # إعدادات الموقع العامة
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
| `news` | الأخبار والمناسبات |
| `gallery` | معرض الصور |
| `site_content` | محتوى الأقسام النصية |
| `social_links` | روابط التواصل |
| `site_settings` | إعدادات الموقع العامة |

## الأمان

- **المصادقة:** Supabase Auth بالبريد الإلكتروني وكلمة المرور
- **الصلاحيات:** Row Level Security مفعّل على جميع الجداول
- **الزوار:** يمكنهم قراءة البيانات المنشورة فقط
- **المستخدمون المسجلون:** يمكنهم إضافة/تعديل/حذف البيانات
- ** Storage:** قراءة عامة للصور، رفع/edit محصور بالمستخدمين المسجلين

## ملاحظات

- لوحة التحكم محمية بـ `noindex, nofollow` ولا تظهر في محركات البحث
- لا يتم تخزين كلمات المرور أو الأسرار في الكود
- السرية تعتمد على Supabase Auth و RLS، وليس على إخفاء الكود
- `site-images` bucket عام لقراءة الصور من الزوار
