# مهام تطوير لوحة التحكم الشاملة

## المرحلة 1: البنية الأساسية ولوحة النظرة العامة
- [x] إنشاء `src/components/admin/AdminSidebar.tsx` للتنقل الجانبي.
- [x] إنشاء `src/components/admin/Toast.tsx` للإشعارات.
- [x] إنشاء `src/components/admin/ConfirmModal.tsx` لتأكيد الحذف.
- [x] إنشاء `src/components/admin/DashboardOverview.tsx` مع بطاقات الملخص.
- [x] إعادة هيكلة `src/components/admin/AdminPage.tsx` لاستخدام الشريط الجانبي.
- [x] التحقق: التنقل بين التبويبات يعمل، والشريط الجانبي متجاوب.

## المرحلة 2: إدارة الأخبار والمناسبات المحسّنة
- [x] إنشاء `src/components/admin/PostForm.tsx` مع حقلي العنوان/المحتوى/التاريخ/الحالة/الصورة المميزة.
- [x] إنشاء `src/components/admin/PostManager.tsx` مع بحث، تصفية، ترتيب، ترقيم، وإجراءات جماعية.
- [x] تحديث `src/lib/admin-posts.ts` لدعم الترقيم والتصفية والبحث.
- [x] تحديث `supabase-setup.sql` بإضافة `status` و `featured_image` و `updated_at`.
- [x] التحقق: إضافة، تعديل، حذف، بحث، تصفية، ترقيم تعمل.

## المرحلة 3: تحسين المستخدمين والتعليقات والوسائط
- [x] تحديث `src/components/admin/UserManagement.tsx` ببحث ومنع حذف super_admin الوحيد.
- [x] تحديث `src/components/admin/CommentManager.tsx` بتصفية، بحث، ونافذة تأكيد.
- [x] تحديث `src/components/admin/MediaManager.tsx` ببحث، تصفية، نسخ رابط، ونافذة تأكيد.
- [x] التحقق: العمليات الثلاث تعمل بدون أخطاء.

## المرحلة 4: الإحصائيات والنشاطات
- [x] تحديث `src/components/admin/AnalyticsDashboard.tsx` بفلترة الفترة وعرض أكثر المنشورات.
- [x] إنشاء `src/components/admin/ActivityLog.tsx`.
- [x] إنشاء `src/lib/admin-logs.ts`.
- [x] تحديث `supabase-setup.sql` بإضافة جدول `admin_logs` وRLS.
- [x] التحقق: تسجيل الأحداث وعرضها في سجل النشاطات.

## المرحلة 5: التنسيق والاختبار النهائي
- [x] تحديث `src/index.css` بأنماط لوحة التحكم (تم استخدام الأنماط الموجودة).
- [x] تشغيل `npm run lint` وإصلاح الأخطاء.
- [x] تشغيل `npm run build:pages` والتأكد من نجاحه.
- [x] تشغيل `npm run test`.
- [x] معاينة `/admin` محلياً `npx vite`.
- [ ] فتح PR إلى `main` ومراقبة CI.

## نقاط التحقق
- [x] بعد المرحلة 1: الهيكل الجديد والنظرة العامة تعملان.
- [x] بعد المرحلة 2: إدارة المنشورات كاملة.
- [x] بعد المرحلة 5: الموقع يبنى ولوحة التحكم تعمل.
