---
name: accessibility-audit
description: قائمة تدقيق إمكانية الوصول لمواقع العربية RTL — WCAG 2.1 AA وتجربة قارئات الشاشة
---

# تدقيق إمكانية الوصول (A11y)

## نقاط التدقيق الإلزامية

### 1. نسب التباين اللوني
- نص عادي على خلفية: نسبة ≥ 4.5:1
- نص كبير (≥18px عريض أو ≥24px عادي): ≥ 3:1
- العناصر التفاعلية (حدود الأزرار، الأيقونات): ≥ 3:1

اختبر باستخدام DevTools → Accessibility → Contrast أو أداة axe.

### 2. التنقل بلوحة المفاتيح
كل عنصر تفاعلي يجب أن:
- يكون قابلاً للوصول بـ `Tab`.
- يملك حالة تركيز واضحة: `focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none`.
- لا يختفي من تدفق DOM عند الإخفاء البصري — استخدم `sr-only` للمحتوى المرئي للقارئ فقط.

### 3. دعم قارئات الشاشة (RTL)
- `dir="rtl"` و `lang="ar"` على عنصر `<html>` (موجودان في `index.html`).
- الصور الزخرفية تحمل `alt=""` (لإخفائها من القارئ).
- الصور المعلوماتية تحمل `alt` بنص عربي وصفي.
- العناصر الحوارية (`Modal`, `Dropdown`) تحمل `role` مناسباً وتعيد التركيز عند الإغلاق.

### 4. التسلسل الهرمي للعناوين
- `<h1>` واحد فقط في الصفحة (اسم القبيلة في Hero).
- `<h2>` لعناوين الأقسام الرئيسية.
- لا تخطّ مستوى (من `<h2>` مباشرةً إلى `<h4>`).

### 5. الحركة والأمان
- احترم تفضيل `prefers-reduced-motion`:
  ```tsx
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  ```
  مكتبة Motion تدعمها تلقائياً عبر `MotionConfig reducedMotion="user"`.
- لا وميض يتجاوز 3 مرات في الثانية.

## أدوات التدقيق

```bash
# تثبيت axe CLI لمرة واحدة
npm install -g @axe-core/cli

# تشغيل الفحص على الخادم المحلي
npm run dev &
axe http://localhost:3000 --tags wcag2a,wcag2aa
```

## معيار القبول

لا يُسمح بنشر تعديل ينتج عنه خطأ `critical` أو `serious` جديد في تقرير axe.
