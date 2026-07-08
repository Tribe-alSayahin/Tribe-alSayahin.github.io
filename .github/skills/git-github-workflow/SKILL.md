---
name: git-github-workflow
description: قواعد سير العمل بـ Git وGitHub — تسمية الفروع، رسائل الالتزام، وإجراءات طلبات الدمج
---

# سير العمل بـ Git وGitHub

## تسمية الفروع

النمط: `type/short-description` باللغة الإنجليزية وأحرف صغيرة وشُرط.

| النوع | متى تستخدمه |
|---|---|
| `feat/` | ميزة جديدة أو قسم جديد في الموقع |
| `fix/` | إصلاح خطأ أو مشكلة بصرية |
| `chore/` | مهام صيانة، تحديث حزم، إعادة هيكلة |
| `docs/` | تحديث وثائق أو CLAUDE.md |
| `style/` | تعديلات CSS/تصميم بحتة |

أمثلة:
```bash
feat/add-heroes-section
fix/navbar-mobile-overlap
chore/adopt-official-skills-structure
docs/update-deployment-guide
```

## رسائل الالتزام (Conventional Commits)

```
type: short English description (max 72 chars)
```

- الفعل في المضارع المبني للمعلوم: `add`, `fix`, `move`, `update` لا `added`, `fixed`.
- لا نقطة في النهاية.
- استخدم الجسم (body) للتوضيح إن كان الالتزام غير بديهي.

أمثلة صحيحة:
```
feat: add TribesMap section with Leaflet
fix: correct brass token contrast ratio in light mode
chore: move skills to .github/skills for Copilot compatibility
```

## إجراء طلب الدمج (PR)

1. **قبل الدفع**: نفّذ `npm run lint && npm run build:pages` — لا دفع مع أخطاء.
2. **الدفع**: إلى الفرع الخاص بك دائماً، لا إلى `main` مباشرةً.
3. **فتح PR**: عنوان الـ PR بالعربية مع وصف ما تغيّر ولماذا.
4. **المراجعة**: انتظر مراجعة قبل الدمج أو ادمج بنفسك إن كنت المالك.
5. **بعد الدمج**: لا تنسَ تحديث `docs/` عبر مهارة `deploy-pages` إن كانت التغييرات تؤثر على الموقع.

## دفع التغييرات

```bash
# أول دفع للفرع
git push -u origin feat/your-feature-name

# دفوعات لاحقة
git push
```

## قاعدة صارمة

لا دفع مباشر إلى `main`. الفرع `main` محمي ويستقبل فقط عبر طلبات الدمج.
