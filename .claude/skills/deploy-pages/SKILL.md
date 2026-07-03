---
name: deploy-pages
description: نشر الموقع إلى GitHub Pages — إعادة بناء مجلد docs/ ودفعه، لأن Pages ينشر من main:/docs وليس من Actions
---

# نشر الموقع إلى GitHub Pages

إعداد Pages الحالي: "Deploy from a branch" → `main:/docs`. الـ workflow في
`.github/workflows/deploy.yml` يعمل لكن نتيجته **تُتجاهل**؛ ما يُنشر فعلياً هو محتوى `docs/`.

## خطوات النشر

1. تحقق قبل البناء:
   ```bash
   npm run lint
   ```
2. ابنِ وحدّث `docs/`:
   ```bash
   npm run build:pages
   rm -rf docs && cp -r dist docs && touch docs/.nojekyll
   ```
3. ادفع إلى `main` (أو افتح PR إن لم تكن هناك صلاحية كتابة مباشرة).
4. تحقق بعد الدمج (قد يستغرق النشر ~دقيقة):
   ```bash
   curl -s -o /dev/null -w "%{http_code}" https://tribe-alsayahin.github.io/
   curl -s https://tribe-alsayahin.github.io/ | grep -o '<title>[^<]*</title>'
   ```

## تنبيهات

- `docs/.nojekyll` إلزامي — بدونه يعالج Jekyll الملفات ويكسر الموقع.
- لا تعدّل ملفات `docs/` يدوياً؛ هي ناتج بناء يُستبدل بالكامل كل مرة.
- `build:pages` ينسخ `index.html` إلى `404.html` لدعم التوجيه على Pages — لا تحذفها.
- إن حُوّل مصدر Pages مستقبلاً إلى "GitHub Actions" من إعدادات المستودع، احذف مجلد `docs/`
  نهائياً وحدّث CLAUDE.md وREADME — يصبح النشر تلقائياً عبر الـ workflow.
