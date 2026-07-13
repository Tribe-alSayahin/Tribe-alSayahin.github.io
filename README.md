# الموقع الرسمي لقبيلة السياحين

البوابة الرقمية الموثقة لقبيلة السياحين من الروقة من عتيبة — توثيق النسب والديار والفروع، الديوان التفاعلي للشعر النبطي، والأرشيف الاستشراقي المصوّر.

**الموقع المباشر:** https://tribe-alsayahin.github.io

## التقنيات

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Motion (يُستورد من `motion/react`) للحركة
- Supabase للمصادقة وقاعدة البيانات والتخزين

## التشغيل المحلي

### المتطلبات

- Node.js 20 أو أحدث

### الخطوات السريعة

```bash
npm install
npm run dev
```

### روابط التشغيل المحلي

- الموقع العام: http://localhost:3000
- لوحة الإدارة: http://localhost:3000/admin

## الأوامر

| الأمر | الوصف |
|---|---|
| `npm run dev` | تشغيل خادم التطوير (Express + Vite) |
| `npm run build` | بناء كامل (الموقع + الخادم) |
| `npm run build:pages` | بناء النسخة الثابتة للنشر على GitHub Pages |
| `npm run lint` | فحص أنواع TypeScript |

## إعداد لوحة الإدارة (الأخبار والمناسبات)

لوحة الإدارة تعمل عبر Supabase في مسار مستقل: `/admin`.

### 1) إنشاء مشروع Supabase

1. افتح https://supabase.com
2. أنشئ حساباً جديداً
3. أنشئ مشروعاً جديداً
4. احفظ **Project URL** و **Publishable key** من Settings → API

### 2) إعداد قاعدة البيانات وسياسات RLS

#### الطريقة الأولى: SQL Editor (الأبسط)

1. افتح مشروعك في Supabase Dashboard
2. اذهب إلى SQL Editor
3. انسخ محتوى ملف `supabase-setup.sql` في هذا المستودع
4. الصقه في SQL Editor واضغط Run
5. سيُنشأ جدول `public.admin_posts` مع سياسات:
   - قراءة للجميع
   - insert / update / delete للمستخدمين `authenticated` فقط

#### الطريقة الثانية: Supabase CLI (للفرق والـ CI)

```bash
# تثبيت Supabase CLI
npm install -g supabase

# ربط المشروع بمشروعك في Supabase
supabase link --project-ref <your-project-ref>

# تطبيق migrations
supabase db push
```

ملف الـ migration موجود في `supabase/migrations/20240101000000_create_admin_posts.sql`.

### 3) إنشاء مستخدم مشرف

1. اذهب إلى Authentication في Supabase Dashboard
2. اختر Add user
3. أدخل البريد الإلكتروني وكلمة المرور

### 4) متغيرات البيئة

> جميع القيم أدناه **أمثلة وهمية فقط**. لا تضع أي مفاتيح حقيقية داخل المستودع.

#### محلياً (ملف `.env`)

1. أنشئ ملف `.env` من `.env.example`:

```bash
cp .env.example .env
```

2. عدّل القيم في `.env`:

```bash
# متغيرات الواجهة (تُحقن في كود المتصفح)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-anon-key"

# مفتاح الخادم — وقت البناء فقط، لا يصل للمتصفح
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

#### على GitHub Actions

1. اذهب إلى **Settings → Secrets and variables → Actions**
2. أضف Secret باسم: `NEXT_PUBLIC_SUPABASE_URL`
3. أضف Secret باسم: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. أضف Secret باسم: `SUPABASE_SERVICE_ROLE_KEY`

#### متطلبات أمان إلزامية

- لا تضع `service_role key` أو `SUPABASE_SERVICE_ROLE_KEY` في متغيرات `NEXT_PUBLIC_*` أبداً.
- متغيرات الواجهة تقتصر على القيم العامة فقط (`NEXT_PUBLIC_*`).
- الأمان يعتمد على Supabase Auth + RLS.

#### استكشاف خطأ `Could not find the table 'public.admin_posts' in the schema cache`

هذا الخطأ يحدث غالباً في حالتين:

1. **الجدول لم يُنشأ بعد** — نفّذ `supabase-setup.sql` أو `supabase db push`.
2. **schema cache قديمة** — نفّذ هذا الأمر في SQL Editor بعد إنشاء الجدول:

   ```sql
   notify pgrst, 'reload schema';
   ```

   أو اذهب إلى **Supabase Dashboard → Database → PostgREST** واضغط **Reload Schema Cache**.

## النشر

### إعداد GitHub Pages (مهم جداً)

هذا المشروع يعتمد على **GitHub Actions** للنشر، وليس على "Deploy from branch".

1. افتح المستودع في GitHub.
2. اذهب إلى **Settings → Pages**.
3. تحت **Build and deployment / Source**، اختر **GitHub Actions**.
4. لا تتركه مضبوطاً على **Deploy from a branch**.

بعد أي push إلى الفرع `main`، سيتم بناء الموقع تلقائياً ونشره من مجلد `dist/` عبر workflow `.github/workflows/deploy.yml`.

### دليل استكشاف أخطاء النشر

إذا ظهرت شاشة تحميل فقط على الموقع المنشور:

1. تأكد أن GitHub Pages مضبوط على **GitHub Actions** وليس **Deploy from branch**.
2. افتح **Actions** في المستودع وتأكد أن workflow **Deploy to GitHub Pages** يعمل بنجاح.
3. بعد نجاح الـ workflow، تأكد أن الرابط النهائي يخدم ملفات `assets/` وليس `/src/main.tsx`.

## بنية المشروع

```text
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

- **المصادقة:** Supabase Auth بالبريد الإلكتروني وكلمة المرور.
- **الصلاحيات:** Row Level Security مفعّل على `admin_posts`.
- **الزوار:** قراءة فقط.
- **المستخدمون المسجلون:** إضافة/تعديل/حذف.
- **القاعدة الذهبية:** أسرار الخادم تبقى على الخادم فقط، ولا تُعرَض في الواجهة.

## ملاحظات

- لا يتم تخزين كلمات المرور أو الأسرار في الكود.
- السرية تعتمد على Supabase Auth و RLS، وليس على إخفاء الكود.

## نظام المناسبات والأحداث المصوّرة

تمت إضافة نظام مستقل لإدارة المناسبات بالصور داخل لوحة الإدارة.

### المسارات الجديدة

- صفحة العرض العامة: `/events/`
- صفحة تفاصيل المناسبة: `/events/[slug]/`
- داخل الأدمن: تبويب **المناسبات المصوّرة** في `/admin`

### مخطط قاعدة البيانات (Supabase)

تمت إضافة الجداول التالية:

| الجدول | الوصف |
|---|---|
| `admin_events` | بيانات المناسبة (العنوان، الوصف المختصر/الكامل، التاريخ الهجري والميلادي، المكان، حالة النشر، صورة الغلاف) |
| `admin_event_images` | صور الألبوم المرتبطة بكل مناسبة (الأصل + المصغر + الترتيب + هل هي الغلاف) |

### التخزين

- Bucket: `events` في Supabase Storage
- صيغ مفعلة: `image/jpeg`, `image/png`, `image/webp`
- الحد الأقصى: `5MB` لكل ملف
- القراءة العامة مسموحة فقط لصور المناسبات المنشورة عبر سياسات RLS/Storage

### الإعداد

1. نفّذ `supabase-setup.sql` كاملاً في SQL Editor (أو شغّل migrations عبر Supabase CLI).
2. تأكد من إنشاء bucket `events` تلقائياً بعد التنفيذ.
3. تأكد من وجود حساب في `admin_users` بدور `admin` أو `super_admin` لاستخدام تبويب المناسبات المصوّرة.

### طريقة الاستخدام (الأدمن)

1. افتح `/admin` وسجّل الدخول.
2. اذهب إلى تبويب **المناسبات المصوّرة**.
3. اضغط **إضافة مناسبة جديدة** ثم أدخل:
   - عنوان المناسبة
   - وصف مختصر
   - وصف كامل
   - التاريخ الميلادي والهجري
   - المكان (اختياري)
   - حالة النشر
4. بعد حفظ المناسبة، استخدم منطقة السحب والإفلات لرفع الصور (متعدد الملفات).
5. من الألبوم يمكنك:
   - تعيين صورة كغلاف
   - إعادة ترتيب الصور بالسحب والإفلات
   - حذف صورة مفردة
6. يمكنك نشر/إخفاء المناسبة أو حذفها بالكامل من قائمة المناسبات.

### تحسين الصور والأداء

- يتم ضغط الصور تلقائياً قبل الرفع وتوليد نسخة مصغرة لكل صورة.
- القوائم تستخدم الصور المصغرة لتسريع العرض.
- الصور في الواجهة العامة تستخدم التحميل الكسول (Lazy Loading).
