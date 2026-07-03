---
name: react-component-structure
description: قواعد بناء مكوّنات React في هذا المشروع — الملفات، التسمية، الاستيرادات، والأنماط المعتمدة
---

# بنية مكوّنات React

## القاعدة العامة

كل مكوّن يقع في `src/components/` — المكوّنات البسيطة في ملف `.tsx` واحد، والمركّبة في مجلد فرعي خاص بها يضم:
```
ComponentName/
├── index.tsx          # نقطة التصدير (export default أو named)
├── types.ts           # أنواع TypeScript المحلية
├── data.ts            # البيانات الثابتة إن وجدت
└── SubComponent.tsx   # مكوّنات فرعية داخلية
```

## قواعد الملف

- اسم الملف بـ PascalCase يطابق اسم المكوّن المُصدَّر.
- التصدير الافتراضي (`export default`) للمكوّن الرئيسي في كل ملف.
- لا تصدير عشوائي من الملف الواحد — صدّر ما يحتاجه المستورِد فقط.

## الاستيرادات

الترتيب المعتمد (مجموعة لكل نوع مفصولة بسطر فارغ):
```tsx
// 1. مكتبات خارجية
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

// 2. مكوّنات مشتركة
import SectionHeader from '../layout/SectionHeader';

// 3. أنواع وبيانات محلية
import type { TribeRegion } from './types';
import { regions } from './data';
```

## الأنماط المعتمدة

### الحركة
استخدم الإعدادات الجاهزة من `src/lib/motion-presets.ts` بدل كتابة قيم الحركة يدوياً:
```tsx
import { fadeInUp, staggerContainer } from '../../lib/motion-presets';
<motion.div {...fadeInUp} viewport={{ once: true }}>
```

### الألوان والخطوط
الرموز المعرّفة في `src/index.css` فقط — راجع مهارة `design-system`.

### RTL وأرقام عربية
- النصوص الظاهرة للمستخدم بالعربية حصراً.
- الأرقام الظاهرة بالصيغة العربية المشرقية: `٠١٢٣٤٥٦٧٨٩`.
- لا `dir` أو `text-align` يدوي — المستند بالكامل `dir="rtl"`.

### التحميل الكسول
المكوّنات الثقيلة (خرائط، رسوم بيانية) تُحمَّل كسولاً:
```tsx
const MapSection = React.lazy(() => import('./components/MapSection'));
```

## التحقق

```bash
npm run lint   # فحص TypeScript قبل أي commit
```
