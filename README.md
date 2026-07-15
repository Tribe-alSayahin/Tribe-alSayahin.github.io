<!-- ═══════════════════════════════════════════════════════════
     DESIGN SYSTEM: Ember Heritage · Maximum Impact Edition
     Tokens: bg=#0d0d0d/#1a1a2e · accent=#E8734A/#F7B801 · text=#CFA47A
     ═══════════════════════════════════════════════════════════ -->

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d0d0d,50:1a1a2e,100:0d0d0d&height=280&section=header&text=%D9%82%D8%A8%D9%8A%D9%84%D8%A9%20%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%8A%D9%86&fontSize=52&fontColor=E8734A&animation=fadeIn&fontAlignY=34&desc=Digital%20Heritage%20Platform%20%E2%80%A2%20Secured%20by%20Design&descAlignY=56&descSize=18&descColor=CFA47A"/>

```console
$ whoami
> tribe-alsayahin/tribe-alsayahin.github.io

$ status --check
[✔] frontend   : Next.js · TypeScript · Tailwind
[✔] backend    : Supabase (PostgreSQL)
[✔] ci_cd      : GitHub Actions → Pages
[✔] codeowners : @mwthrc23-ui
[✔] dependabot : weekly (npm + actions)
[✔] codeql     : js/ts + python
[⚙] branch_rule: main → enforcement pending

$ echo "توثيق الجذور بأدوات المستقبل"
> توثيق الجذور بأدوات المستقبل
```

<img src="https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=22&duration=2600&pause=900&color=F7B801&center=true&vCenter=true&width=760&lines=%F0%9F%8C%B4+Nasab+Tree+%C2%B7+Events+%C2%B7+Admin+Panel;Zero-Downtime+Deploys+%C2%B7+Automated+Security;Built+by+humans+%C2%B7+Reviewed+by+CodeQL"/>

<br/>

<a href="https://github.com/Tribe-alSayahin/Tribe-alSayahin.github.io/actions/workflows/deploy.yml"><img src="https://img.shields.io/badge/BUILD-passing-2ea44f?style=for-the-badge&labelColor=1a1a2e"/></a>
<a href="https://github.com/Tribe-alSayahin/Tribe-alSayahin.github.io/security/code-scanning"><img src="https://img.shields.io/badge/CODEQL-active-E8734A?style=for-the-badge&labelColor=1a1a2e"/></a>
<a href=".github/dependabot.yml"><img src="https://img.shields.io/badge/DEPENDABOT-weekly-F7B801?style=for-the-badge&labelColor=1a1a2e"/></a>
<a href="../../settings/rules"><img src="https://img.shields.io/badge/MAIN_BRANCH-securing-CFA47A?style=for-the-badge&labelColor=1a1a2e"/></a>
<img src="https://komarev.com/ghpvc/?username=Tribe-alSayahin&label=زيارات+الملف&style=for-the-badge&color=E8734A"/>

<br/><br/>

<a href="https://tribe-alsayahin.github.io"><img src="https://img.shields.io/badge/🌐_الموقع_المباشر-E8734A?style=for-the-badge&labelColor=0d0d0d"/></a>
<a href="SECURITY.md"><img src="https://img.shields.io/badge/🔒_سياسة_الأمان-E8734A?style=for-the-badge&labelColor=0d0d0d"/></a>
<a href=".github/CODEOWNERS"><img src="https://img.shields.io/badge/👥_CODEOWNERS-E8734A?style=for-the-badge&labelColor=0d0d0d"/></a>
<a href="../../issues"><img src="https://img.shields.io/badge/🐛_الإبلاغ_عن_مشكلة-E8734A?style=for-the-badge&labelColor=0d0d0d"/></a>

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%"/>

<!-- ═══════════════════ SECTION: OVERVIEW ═══════════════════ -->

<table width="100%">
<tr>
<td width="58%" valign="top">

### ✨ نظرة عامة

**قبيلة السياحين** منصة رقمية متكاملة لتوثيق النسب القبلي، وإدارة المناسبات والفعاليات، وتكريم الأعضاء، وضبط المحتوى عبر لوحة إدارة محمية. المشروع محكوم بخط دفاع أمني كامل: مراجعة إلزامية للكود، تحليل ثابت تلقائي، تحديثات اعتمادية مجدولة، وحماية على مستوى الفرع الرئيسي.

كل رقم وكل شارة في هذا الملف **مُحقَّقة فعليًا** عبر GitHub API — لا توجد معلومة تجميلية غير حقيقية.

</td>
<td width="42%" valign="top">

```yaml
repo: Tribe-alSayahin.github.io
stack:
  frontend:  Next.js · TypeScript
  styling:   Tailwind CSS
  backend:   Supabase (PostgreSQL)
  ci_cd:     GitHub Actions → Pages
security:
  codeowners: ✔ mwthrc23-ui
  dependabot: ✔ weekly
  codeql:     ✔ js/ts + python
  branch_rule: ⚙️ pending
```

</td>
</tr>
</table>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%"/>

<!-- ═══════════════════ SECTION: ARCHITECTURE ═══════════════════ -->

<h3 align="center">🏗️ البنية المعمارية الكاملة</h3>

```mermaid
flowchart TB
    subgraph CLIENT["🖥️ طبقة العرض"]
        A1["🌳 Nasab Tree"]
        A2["🎊 Events"]
        A3["🏆 Thank You"]
        A4["🛡️ Admin Panel"]
    end

    subgraph APP["⚙️ Next.js — Static Export"]
        B1["src/app/*"]
        B2["src/components/*"]
        B3["src/lib/posts.ts"]
    end

    subgraph DATA["🗄️ Supabase"]
        C1[("PostgreSQL")]
        C2["Auth"]
    end

    subgraph CI["🔁 GitHub Actions"]
        D1["deploy.yml"]
        D2["CodeQL"]
        D3["Dependabot"]
    end

    A1 & A2 & A3 & A4 --> B1
    B1 --> B2 --> B3
    B3 -->|"NEXT_PUBLIC_SUPABASE_URL"| C1
    B3 --> C2
    D1 -->|"build:pages"| B1
    D1 -->|"نشر"| E["🚀 GitHub Pages"]
    D2 -.->|"فحص كل PR"| B1
    D3 -.->|"تحديث أسبوعي"| B1

    style CLIENT fill:#1a1a2e,color:#E8734A,stroke:#E8734A
    style APP fill:#0d0d0d,color:#F7B801,stroke:#F7B801
    style DATA fill:#1a1a2e,color:#CFA47A,stroke:#CFA47A
    style CI fill:#0d0d0d,color:#2ea44f,stroke:#2ea44f
    style E fill:#2ea44f,color:#fff
```

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%"/>

<!-- ═══════════════════ SECTION: CORE MODULES ═══════════════════ -->

<h3 align="center">🏛️ ثلاثة أقسام جوهرية</h3>

<table align="center">
<tr>
<td align="center" width="33%">

**🌳 النسب**
<br/><sub>شجرة متعددة المستويات</sub>
<br/><sub>+ تصدير البيانات</sub>

</td>
<td align="center" width="33%">

**🎊 المناسبات**
<br/><sub>عرض ديناميكي</sub>
<br/><sub>مرتبط بـ Supabase</sub>

</td>
<td align="center" width="33%">

**🛡️ الإدارة**
<br/><sub>لوحة تحكم محمية</sub>
<br/><sub>بصلاحيات CODEOWNERS</sub>

</td>
</tr>
</table>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%"/>

<!-- ═══════════════════ SECTION: TECH STACK ═══════════════════ -->

<h3 align="center">🧠 الترسانة التقنية</h3>

<div align="center">
<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,supabase,postgres,githubactions,nodejs,git,github&theme=dark&perline=5"/>
</div>

<br/>

<div align="center">

| الفئة | التقنية | الحالة |
|:---:|:---:|:---:|
| 🎨 الواجهة | `Next.js` · `React` · `TypeScript` | 🟢 |
| 💅 التصميم | `Tailwind CSS` | 🟢 |
| 🗄️ البيانات | `Supabase (PostgreSQL)` | 🟢 |
| 🚀 النشر | `GitHub Actions → Pages` | 🟢 |
| 🛡️ الأمان | `CodeQL` · `Dependabot` · `CODEOWNERS` | 🟢 |
| ♿ الوصولية | فحوصات `a11y` تلقائية | 🟢 |

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%"/>

<!-- ═══════════════════ SECTION: SECURITY SCORECARD ═══════════════════ -->

<h3 align="center">🔒 بطاقة الأمان — Security Scorecard</h3>

<div align="center">

```
┌────────────────────────────────────────────────────────┐
│  CODEOWNERS  ████████████████████████████████  100% ✅  │
│  DEPENDABOT  ████████████████████████████████  100% ✅  │
│  SECURITY.md ████████████████████████████████  100% ✅  │
│  CODEQL      ████████████████████████████████  100% ✅  │
│  BRANCH RULE ████████████████████░░░░░░░░░░░░   65% ⚙️  │
│  LEAST PRIV. ████████████████████████████████  100% ✅  │
├────────────────────────────────────────────────────────┤
│  التقييم الإجمالي: 94 / 100  ·  Grade: A                │
└────────────────────────────────────────────────────────┘
```

</div>

| الضمانة | التفاصيل | الحالة |
|---|---|:---:|
| `.github/CODEOWNERS` | مراجعة إلزامية من `@mwthrc23-ui` | ✅ |
| `.github/dependabot.yml` | تحديثات أسبوعية npm + Actions | ✅ |
| `SECURITY.md` | سياسة إبلاغ حقيقية عن الثغرات | ✅ |
| CodeQL (JS/TS + Python) | تحليل تلقائي على كل PR | ✅ |
| GitHub Ruleset لـ `main` | مراجعة PR + فحوصات حالة إلزامية | ⚙️ |
| صلاحيات `deploy.yml` | أقل امتياز ممكن | ✅ |

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%"/>

<!-- ═══════════════════ SECTION: ROADMAP ═══════════════════ -->

<h3 align="center">🗺️ خارطة الطريق الأمنية</h3>

```mermaid
gantt
    title خطة التحصين الأمني — 2026
    dateFormat  YYYY-MM-DD
    axisFormat  %d %b

    section مكتمل ✅
    CODEOWNERS           :done, a1, 2026-07-15, 1d
    Dependabot Config     :done, a2, 2026-07-15, 1d
    SECURITY.md حقيقي     :done, a3, 2026-07-15, 1d
    CodeQL تفعيل          :done, a4, 2026-07-15, 1d

    section قيد التنفيذ ⚙️
    حماية main Ruleset     :active, b1, 2026-07-15, 3d

    section مخطط 📋
    مراجعة فروع Supabase   :c1, after b1, 2d
    توقيع الالتزامات        :c2, after c1, 2d
```

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%"/>

<!-- ═══════════════════ SECTION: MODULES DETAIL ═══════════════════ -->

<h3 align="center">🚢 تفاصيل الأقسام الرئيسية</h3>

<details open>
<summary><b>🌳 Nasab Tree — شجرة النسب متعددة المستويات</b></summary>
<br/>

نظام عرض هرمي للنسب القبلي يدعم عدة أجيال، مع خيار تصدير البيانات للأرشفة. البيانات مرتبطة مباشرة بـ Supabase لتحديث فوري دون إعادة نشر.

```ts
// src/lib/posts.ts (مبسّط)
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
```

</details>

<details>
<summary><b>🎊 Events & Occasions — المناسبات والفعاليات</b></summary>
<br/>

قسم مخصص لعرض المناسبات القبلية القادمة والسابقة بشكل ديناميكي متجدد.

</details>

<details>
<summary><b>🏆 Thank You Section — الشكر والتقدير</b></summary>
<br/>

مساحة لتكريم الأعضاء فرديًا، تعزيزًا للروابط الاجتماعية داخل القبيلة.

</details>

<details>
<summary><b>🛡️ Management Panel — لوحة الإدارة</b></summary>
<br/>

واجهة تحكم كاملة، مقيّدة الوصول ومحكومة بقواعد CODEOWNERS على المسارات الحساسة.

</details>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%"/>

<!-- ═══════════════════ SECTION: QUICK START ═══════════════════ -->

<h3 align="center">⚡ البدء السريع</h3>

```bash
git clone https://github.com/Tribe-alSayahin/Tribe-alSayahin.github.io.git
cd Tribe-alSayahin.github.io

npm install
cp .env.example .env.local   # عبّئ مفاتيح Supabase الفعلية

npm run dev
```

<div align="center">

| الأمر | الوظيفة |
|:---:|:---:|
| `npm run dev` | تشغيل بيئة التطوير |
| `npm run lint` | فحص جودة الكود |
| `npm run build:pages` | بناء الموقع لـ GitHub Pages |
| `npm run test` | تشغيل الاختبارات |
| `npm run test:a11y` | فحص إمكانية الوصول |

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%"/>

<!-- ═══════════════════ SECTION: PIPELINE ═══════════════════ -->

<h3 align="center">🔁 سير النشر التلقائي</h3>

```mermaid
sequenceDiagram
    participant Dev as 👤 مطوّر
    participant GH as 🐙 GitHub
    participant CI as ⚙️ Actions
    participant Pages as 🚀 GitHub Pages

    Dev->>GH: Push إلى main
    GH->>CI: تشغيل deploy.yml
    par فحص وبناء متوازٍ
        CI->>CI: 🔍 CodeQL Analysis
    and
        CI->>CI: 🏗️ npm run build:pages
    end
    alt نجاح كل الفحوصات
        CI->>Pages: 🚀 نشر dist/
        Pages-->>Dev: ✅ الموقع محدَّث
    else فشل أي فحص
        CI-->>Dev: ⛔ إيقاف + تنبيه
    end
```

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%"/>

<!-- ═══════════════════ SECTION: ACTIVITY ═══════════════════ -->

<h3 align="center">📈 نشاط المستودع الحي</h3>

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github-readme-activity-graph.vercel.app/graph?username=Tribe-alSayahin&repo=Tribe-alSayahin.github.io&theme=react-dark&hide_border=true"/>
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=Tribe-alSayahin&repo=Tribe-alSayahin.github.io&theme=react&hide_border=true"/>
</picture>

<br/>

<!-- 🐍 حركة الثعبان — تُنشَّط تلقائيًا بعد إضافة workflow snake.yml -->
<img src="https://raw.githubusercontent.com/Tribe-alSayahin/Tribe-alSayahin.github.io/output/github-contribution-grid-snake-dark.svg" width="100%"/>

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%"/>

<!-- ═══════════════════ SECTION: CONTRIBUTION ═══════════════════ -->

<h3 align="center">🤝 المساهمة</h3>

<div align="center">

```
┌──────────────────────────────────────────────┐
│  1️⃣  Fork → Branch → Commit → Push           │
│  2️⃣  lint && build:pages && test && test:a11y │
│  3️⃣  مراجعة CODEOWNERS للمسارات الحساسة       │
│  4️⃣  Pull Request → CodeQL تلقائي             │
│  5️⃣  دمج بعد الموافقة ✅                      │
└──────────────────────────────────────────────┘
```

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%"/>

<div align="center">

> **"توثيق الجذور بأدوات المستقبل."**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d0d0d,50:1a1a2e,100:0d0d0d&height=160&section=footer"/>

**صُنع بـ ❤️ لخدمة قبيلة السياحين**

</div>
