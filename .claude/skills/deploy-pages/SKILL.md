---
name: deploy-pages
description: نشر الموقع إلى GitHub Pages — تلقائي عبر GitHub Actions عند كل دفعة إلى main؛ خطوات التحقق بعد النشر
---

# نشر الموقع إلى GitHub Pages

إعداد Pages الحالي (منذ 2026-07-04): **GitHub Actions**. كل دفعة إلى `main` تشغّل
`.github/workflows/deploy.yml` الذي يفحص الأنواع (`npm run lint`) ثم يبني (`npm run build:pages`)
وينشر مجلد `dist/` تلقائياً. لا يوجد مجلد `docs/` ولا خطوات نشر يدوية.

## خطوات النشر

1. تحقق قبل الدمج:
   ```bash
   npm run lint
   npm run build:pages
   ```
2. ادمج التغييرات في `main` (عبر PR إن لم تكن هناك صلاحية كتابة مباشرة).
3. تابع الـ workflow حتى ينجح (~دقيقة):
   ```bash
   gh run list -R Tribe-alSayahin/Tribe-alSayahin.github.io --limit 3
   ```
4. تحقق بعد النشر:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" https://tribe-alsayahin.github.io/
   curl -s https://tribe-alsayahin.github.io/ | grep -o 'assets/index-[^"]*\.js'
   # ثم تأكد أن ملف الـ JS المذكور يعيد 200
   ```

## تنبيهات

- **لا تُعِد مصدر Pages إلى "Deploy from a branch"** — هذا ما كسر الموقع في 2026-07-04:
  Pages قدّم `index.html` المصدري (يطلب `/src/main.tsx` فيعيد 404) وبقيت شاشة التحميل تدور.
  التشخيص السريع لهذه الحالة: `curl -s https://tribe-alsayahin.github.io/ | grep main.tsx` —
  إن ظهر `src="/src/main.tsx"` فالمصدر خاطئ.
- `build:pages` ينسخ `index.html` إلى `404.html` لدعم التوجيه على Pages — لا تحذفها.
- إن علِق نشر Pages في حالة `building` طويلاً، دفعة جديدة إلى `main` تفكّه عادةً.
- حساب `gh` المحلي (`AZIIZALOYIBI`) قراءة فقط: الدفع عبر remote ‏`fork2`
  وإنشاء الـ PR بـ `gh api repos/.../pulls -F head_repo=AZIIZALOYIBI/tribe-alsayahin-fork`.
