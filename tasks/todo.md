# مهام إعادة تصميم موقع قبيلة السياحين

## المهمة 1: إعادة ترتيب الأقسام وتحديث التنقل
- [ ] تحديث `src/App.tsx` بالترتيب الجديد للأقسام وإضافة فواصل الفصول.
- [ ] تحديث `src/lib/navigation.ts` بروابط الفصول المختصرة والأقسام.
- [ ] تحديث `src/components/layout/Navbar.tsx` بتنقل مبسط (5-6 عناصر).
- [ ] تحديث `src/components/layout/MobileMenu.tsx` لتدعم التنقل المبسط.
- [ ] تحديث `src/components/layout/Section.tsx` لدعم خاصية `chapter` و `noHeader` و `tone`.
- [ ] التحقق: `npm run lint` ومعاينة التنقل.

## المهمة 2: تصميم فواصل الفصول والترويسات
- [ ] إنشاء `src/components/layout/ChapterDivider.tsx`.
- [ ] تحديث `src/components/layout/SectionHeader.tsx` (رقم الفصل، زخرفة، Sadu).
- [ ] تحديث `src/index.css` بأدوات CSS جديدة للفواصل والزخارف.
- [ ] التحقق: تنسيق RTL، الوضع الفاتح/الداكن.

## المهمة 3: إعادة تصميم المدخل (Hero)
- [ ] تحديث `src/components/layout/Hero.tsx` بمدخل الديوان الجديد.
- [ ] إضافة شريط فصول سريعة أو "ابدأ الرحلة".
- [ ] تحديث `src/components/layout/ScrollFilmCanvas.tsx` إن لزم.
- [ ] التحقق: عرض المحمول، reduced motion.

## المهمة 4: توحيد أقسام المجتمع والتاريخ
- [ ] تحديث `src/components/layout/Timeline.tsx` لاستخدام `Section` الموحّد.
- [ ] تحديث `src/components/layout/Supporters.tsx` لاستخدام `Section` الموحّد.
- [ ] تحديث `src/components/layout/Contact.tsx` لاستخدام `Section` الموحّد.
- [ ] تحديث `src/components/layout/AdminSection.tsx` كبوابة صغيرة.
- [ ] التحقق: عدم كسر المحتوى أو التفاعلات.

## المهمة 5: إضافة تأثيرات بصرية وتحسين الهوية
- [ ] إضافة طبقات خلفية جديدة في `src/App.tsx` (غبار، نجوم، سدو).
- [ ] تحديث `src/index.css` و `src/styles/design-tokens.css` بالإضافات اللازمة.
- [ ] إضافة حركات انتقالية بين الفصول.
- [ ] التحقق: الأداء وعدم التوهج الزائد.

## المهمة 6: التحقق النهائي والنشر
- [ ] تشغيل `npm run lint` وإصلاح الأخطاء.
- [ ] تشغيل `npm run build:pages` والتأكد من نجاحه.
- [ ] تشغيل `npm run test`.
- [ ] فحص إمكانية الوصول (`axe` أو `npm run test:a11y`).
- [ ] معاينة محلية `npm run dev` وإصلاح أي مشاكل بصرية.
- [ ] فتح PR إلى `main` ومراقبة CI.

## نقاط التحقق
- [ ] بعد المهمة 1: الترتيب والتنقل يعملان.
- [ ] بعد المهمة 3: المدخل والفصول الأولى متناسقة.
- [ ] بعد المهمة 6: الموقع يبنى ويعمل محلياً.
