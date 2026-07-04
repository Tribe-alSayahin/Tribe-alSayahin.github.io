---
name: design-system
description: نظام التصميم — لوحة الألوان النحاسية، الخطوط العربية الثلاثة، أدوات CSS المخصصة، وقواعد الثيمين الداكن والفاتح
---

# نظام تصميم الموقع الرسمي لقبيلة السياحين

الهوية: فخامة تراثية نجدية — نحاس وذهب على حبر داكن، نقوش سدو، أسطرلاب فلكي.

## الألوان (معرّفة في `src/index.css`)

| الرمز | الاستخدام | داكن | فاتح |
|---|---|---|---|
| `ink` / `ink-2` | الخلفيات | `#070503` / `#0f0b07` | `#fcfbf7` / `#f4f0e6` |
| `sand` / `sand-dim` | النصوص | `#fcf8f0` / `#bba989` | `#241a10` / `#6b5d47` |
| `brass` / `brass-lt` | التمييز الذهبي | `#d4af37` / `#ebd481` | `#b8892a` / `#8a661f` |
| `indigo` | لمسات فلكية | `#162435` | `#d6dde6` |
| `coffee`, `olive`, `olive-2`, `parchment` | خلفيات ثانوية | — | — |

**قاعدة صارمة:** استخدم هذه الرموز حصراً (`text-sand`, `bg-ink-2`, `border-brass/20`...).
ألوان Tailwind العامة (`gray-500`, `amber-400`...) تكسر الوضع الفاتح — الاستثناء الوحيد
هو وثائق الرق المُحاكاة في Footer (درجات amber مقصودة لمظهر الورق العتيق).

## الخطوط

- `font-serif` — Amiri: العناوين h1–h3 والاقتباسات
- `font-sans` — Tajawal: النصوص الجارية (الافتراضي على body)
- `font-kufi` — Reem Kufi: الشارات والتسميات والأزرار الصغيرة

## أدوات CSS مخصصة (src/index.css)

- `.text-gold-gradient` — تدرّج ذهبي للنص (لتمييز جزء من عنوان)
- `.gold-hairline` — فاصل ذهبي رفيع يتلاشى عند الطرفين (ارتفاع 1px، حدد العرض بنفسك)
- `.sadu-band` — شريط نقش سدو أفقي مكرر
- `.bg-grid-pattern` — نقاط شبكية نحاسية خافتة
- `var(--sadu)` — خلفية نقش سدو للتكرار (`backgroundImage: 'var(--sadu)'`)

## المقاييس (src/styles/design-tokens.css)

- مسافات: `--space-1` (4px) حتى `--space-16` (64px)
- توهج: `shadow-glow-sm/md/lg` (توهج نحاسي متدرج)
- حركة: `--duration-fast/base/slow` + `--ease-brand` — وإعدادات جاهزة في `src/lib/motion-presets.ts`

## أنماط مكررة

- ترويسة قسم: مكوّن `SectionHeader` (رقم ترتيبي غيمي + شارة + عنوان + نقش سدو + وصف)
- شارة (pill): `font-kufi text-xs text-brass-lt bg-brass/5 border border-brass/10 rounded-full px-4 py-1.5`
- زر أساسي: تدرّج `from-brass to-brass-lt text-ink` + رفع عند التحويم؛ زر ثانوي: حد `border-brass/35`
- كل عنصر تفاعلي يحتاج `focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none`
- الثيم يُحفظ في localStorage بمفتاح `siyahin-theme` (متزامن مع سكربت في index.html)
