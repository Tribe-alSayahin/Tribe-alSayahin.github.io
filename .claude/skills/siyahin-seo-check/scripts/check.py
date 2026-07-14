#!/usr/bin/env python3
"""
siyahin-seo-check — سكربت فحص شامل لموقع alsaihani.com
Next.js static export (output: 'export') + Supabase.
بلا اعتماديات خارجية (stdlib فقط). يعمل من جذر المستودع.

الاستخدام:
    python3 .claude/skills/siyahin-seo-check/scripts/check.py
    python3 .claude/skills/siyahin-seo-check/scripts/check.py --json
    python3 .claude/skills/siyahin-seo-check/scripts/check.py --src src --no-build
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

# ---------- أدوات مساعدة ----------

PASS, WARN, FAIL = "PASS", "WARN", "FAIL"
ICON = {PASS: "✅", WARN: "⚠️", FAIL: "⛔"}

results = []  # (section, name, status, detail, fix)


def add(section, name, status, detail="", fix=""):
    results.append((section, name, status, detail, fix))


def read_text(path):
    try:
        return Path(path).read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""


def walk_files(root, exts=(".ts", ".tsx", ".js", ".jsx")):
    root = Path(root)
    if not root.exists():
        return []
    return [p for p in root.rglob("*") if p.suffix in exts and p.is_file()]


def grep(root, pattern, exts=(".ts", ".tsx", ".js", ".jsx"), flags=0):
    """يعيد قائمة (ملف، رقم السطر، السطر) للأسطر المطابقة."""
    rx = re.compile(pattern, flags)
    hits = []
    for f in walk_files(root, exts):
        for i, line in enumerate(read_text(f).splitlines(), 1):
            if rx.search(line):
                hits.append((str(f), i, line.strip()))
    return hits


# ---------- القسم 1: SEO ----------

def check_seo(src):
    app = Path(src) / "app"
    pages = list(app.rglob("page.tsx")) if app.exists() else []

    if not pages:
        add("SEO", "اكتشاف الصفحات", WARN,
            f"لم يُعثر على page.tsx تحت {app}", "تحقّق من مسار --src")
        return

    # تكرار title/description
    titles, descs = {}, {}
    for p in pages:
        txt = read_text(p)
        t = re.findall(r"title:\s*['\"`]([^'\"`]{1,120})['\"`]", txt)
        d = re.findall(r"description:\s*['\"`]([^'\"`]{1,300})['\"`]", txt)
        for x in t:
            titles.setdefault(x, []).append(str(p))
        for x in d:
            descs.setdefault(x, []).append(str(p))

    dup_t = {k: v for k, v in titles.items() if len(v) > 1}
    dup_d = {k: v for k, v in descs.items() if len(v) > 1}
    add("SEO", "تفرّد title", FAIL if dup_t else PASS,
        f"عناوين مكررة: {list(dup_t)}" if dup_t else "كل العناوين فريدة",
        "اجعل كل title فريداً" if dup_t else "")
    add("SEO", "تفرّد description", FAIL if dup_d else PASS,
        f"أوصاف مكررة: {len(dup_d)}" if dup_d else "لا تكرار",
        "اجعل كل description فريداً" if dup_d else "")

    # طول description 120–160
    bad_len = []
    for d, files in descs.items():
        if not (120 <= len(d) <= 160):
            bad_len.append((files[0], len(d)))
    add("SEO", "طول description (120–160)", WARN if bad_len else PASS,
        f"خارج النطاق: {bad_len[:5]}" if bad_len else "ضمن النطاق",
        "عدّل الطول ليقع بين 120 و160 حرفاً" if bad_len else "")

    # canonical
    missing_canon = [str(p) for p in pages if "canonical" not in read_text(p)
                     and "metadata" in read_text(p)]
    add("SEO", "canonical موجود", WARN if missing_canon else PASS,
        f"ناقص في: {missing_canon[:5]}" if missing_canon else "موجود",
        "أضف alternates.canonical لكل صفحة" if missing_canon else "")

    # JSON-LD
    jsonld = grep(src, r"application/ld\+json|schema\.org")
    add("SEO", "JSON-LD (Organization/Article/BreadcrumbList)",
        PASS if jsonld else WARN,
        f"{len(jsonld)} إشارة JSON-LD" if jsonld else "لم يُعثر على JSON-LD",
        "أضف Organization في / وArticle في الأخبار وBreadcrumbList داخلياً" if not jsonld else "")


# ---------- القسم 2: الأمان ----------

def check_security(src):
    # service_role في NEXT_PUBLIC_
    pub_secret = grep(src, r"NEXT_PUBLIC_[A-Z_]*(SERVICE_ROLE|SECRET)")
    add("الأمان", "لا service_role في NEXT_PUBLIC_",
        FAIL if pub_secret else PASS,
        f"{pub_secret[:3]}" if pub_secret else "نظيف",
        "انقل المفتاح إلى GitHub Actions Secrets (بلا NEXT_PUBLIC_)" if pub_secret else "")

    # أسرار محتملة في المصدر (JWT / secret keys)
    secrets = grep(src, r"eyJ[A-Za-z0-9_-]{20,}|sb_secret_|service_role_key\s*=")
    add("الأمان", "لا أسرار في الكود المصدري",
        FAIL if secrets else PASS,
        f"{[(s[0], s[1]) for s in secrets[:3]]}" if secrets else "نظيف",
        "احذف السرّ فوراً واستخدم متغيّر بيئة ثم دوّر المفتاح" if secrets else "")

    # عزل service_role عن العميل
    client_files = {h[0] for h in grep(src, r"['\"]use client['\"]")}
    leak = []
    for f in client_files:
        t = read_text(f)
        if "service_role" in t or re.search(r"lib/posts", t):
            if "service_role" in t:
                leak.append(f)
    add("الأمان", "عزل service_role عن حزمة العميل",
        FAIL if leak else PASS,
        f"وصول محتمل من: {leak[:3]}" if leak else "معزول",
        "لا تستورد ملف build-time داخل مكوّن 'use client'" if leak else "")

    # .gitignore يحوي .env
    gi = read_text(".gitignore")
    add("الأمان", ".env في .gitignore",
        PASS if re.search(r"^\.env", gi, re.M) else FAIL,
        "موجود" if re.search(r"^\.env", gi, re.M) else ".env غير مُدرج",
        "أضف .env إلى .gitignore" if not re.search(r"^\.env", gi, re.M) else "")

    # وجود .env حقيقي مدفوع
    real_env = [str(p) for p in Path(".").glob("**/.env")
                if ".env.example" not in str(p) and "node_modules" not in str(p)]
    add("الأمان", "لا ملف .env حقيقي في الشجرة",
        WARN if real_env else PASS,
        f"{real_env}" if real_env else "نظيف",
        "احذفه من التتبّع ودوّر المفاتيح إن كان مدفوعاً" if real_env else "")


# ---------- القسم 3: توافق التصدير الثابت ----------

def check_static(src):
    server_actions = grep(src, r"['\"]use server['\"]")
    add("التصدير الثابت", "لا Server Actions",
        FAIL if server_actions else PASS,
        f"{server_actions[:3]}" if server_actions else "نظيف",
        "أزل 'use server' — الموقع ثابت" if server_actions else "")

    # Leaflet بلا ssr:false
    leaflet_imports = grep(src, r"import.*[Ll]eaflet")
    risky = []
    for f, ln, line in leaflet_imports:
        t = read_text(f)
        if "ssr: false" not in t and "ssr:false" not in t:
            risky.append((f, ln))
    add("التصدير الثابت", "Leaflet داخل dynamic({ssr:false})",
        WARN if risky else PASS,
        f"{risky[:3]}" if risky else "سليم",
        "استخدم dynamic(() => import(...), { ssr: false })" if risky else "")

    # next/image بلا unoptimized
    img = grep(src, r"from ['\"]next/image['\"]")
    cfg = read_text("next.config.ts") + read_text("next.config.js") + read_text("next.config.mjs")
    unopt = "unoptimized" in cfg
    add("التصدير الثابت", "next/image مع unoptimized",
        PASS if (not img or unopt) else WARN,
        "لا استخدام لـ next/image" if not img else ("مضبوط عالمياً" if unopt else "تحقّق يدوياً"),
        "أضف images.unoptimized=true أو unoptimized لكل <Image>" if (img and not unopt) else "")

    # next.config: output export + distDir
    add("التصدير الثابت", "output:'export' في next.config",
        PASS if re.search(r"output:\s*['\"]export['\"]", cfg) else FAIL,
        "مضبوط" if re.search(r"output:\s*['\"]export['\"]", cfg) else "غير موجود",
        "لا تحذف output:'export' — إعداد نشر حرج" if not re.search(r"output:\s*['\"]export['\"]", cfg) else "")


# ---------- القسم 4: المسارات المفهرسة ----------

def check_routes(src):
    sitemap = read_text(Path(src) / "app" / "sitemap.ts")
    robots = read_text(Path(src) / "app" / "robots.ts")

    add("المسارات", "sitemap.ts موجود",
        PASS if sitemap else WARN,
        "موجود" if sitemap else "لم يُعثر عليه",
        "أنشئ app/sitemap.ts" if not sitemap else "")

    # /admin مستثنى من sitemap
    admin_in_sitemap = "admin" in sitemap
    add("المسارات", "/admin مستثنى من sitemap",
        FAIL if admin_in_sitemap else PASS,
        "admin مذكور في sitemap!" if admin_in_sitemap else "مستثنى",
        "احذف /admin من قائمة sitemap" if admin_in_sitemap else "")

    # robots يحظر /admin
    admin_blocked = bool(re.search(r"admin", robots))
    add("المسارات", "robots يحظر /admin",
        PASS if admin_blocked else WARN,
        "محظور" if admin_blocked else "غير محظور",
        "أضف disallow: '/admin/' في robots.ts" if not admin_blocked else "")

    # noindex في صفحة admin
    admin_page = read_text(Path(src) / "app" / "admin" / "page.tsx")
    has_noindex = "noindex" in admin_page.lower()
    add("المسارات", "/admin يحمل noindex",
        PASS if (has_noindex or not admin_page) else WARN,
        "noindex موجود" if has_noindex else ("لا صفحة admin" if not admin_page else "ناقص"),
        "أضف robots: { index:false, follow:false } لصفحة admin" if (admin_page and not has_noindex) else "")

    # تطابق navigation.ts
    nav = read_text(Path(src) / "lib" / "navigation.ts")
    add("المسارات", "navigation.ts موجود (مصدر روابط Navbar/MobileMenu)",
        PASS if nav else WARN,
        "موجود" if nav else "لم يُعثر عليه",
        "وحّد روابط القائمة في src/lib/navigation.ts" if not nav else "")


# ---------- بوابة الإنجاز: أوامر npm ----------

def run_cmd(cmd):
    try:
        r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=600)
        return r.returncode == 0, (r.stdout + r.stderr)[-500:]
    except Exception as e:
        return False, str(e)


def check_build(run_build):
    checks = [("npm run lint", "lint"),
              ("npm run test", "test"),
              ("npm run test:a11y", "a11y")]
    if run_build:
        checks.insert(1, ("npm run build:pages", "build"))
    for cmd, name in checks:
        ok, out = run_cmd(cmd)
        add("البناء", name, PASS if ok else FAIL,
            "نجح" if ok else out.strip()[:200],
            f"أصلح فشل {name}" if not ok else "")


# ---------- التقرير ----------

def report(as_json):
    sections = {}
    for sec, name, status, detail, fix in results:
        sections.setdefault(sec, []).append((name, status, detail, fix))

    if as_json:
        out = {sec: [{"name": n, "status": s, "detail": d, "fix": f}
                     for n, s, d, f in items]
               for sec, items in sections.items()}
        print(json.dumps(out, ensure_ascii=False, indent=2))
    else:
        print("\nتقرير siyahin-seo-check")
        print("=" * 40)
        for sec, items in sections.items():
            p = sum(1 for _, s, _, _ in items if s == PASS)
            print(f"\n{sec}: {p}/{len(items)} PASS")
            for n, s, d, f in items:
                print(f"  {ICON[s]} {n} — {d}")
                if f and s != PASS:
                    print(f"      ↳ إصلاح: {f}")

    fails = [r for r in results if r[2] == FAIL]
    warns = [r for r in results if r[2] == WARN]
    print("\n" + "=" * 40)
    if fails:
        print("القرار: يحتاج إصلاحاً ⛔")
        return 1
    print(f"القرار: جاهز للدمج ✅ ({len(warns)} تحذير)")
    return 0


def main():
    ap = argparse.ArgumentParser(description="siyahin-seo-check")
    ap.add_argument("--src", default="src", help="مجلد المصدر (افتراضي: src)")
    ap.add_argument("--json", action="store_true", help="مخرجات JSON")
    ap.add_argument("--no-build", action="store_true",
                    help="تخطّي أوامر npm (lint/build/test) — أسرع")
    args = ap.parse_args()

    check_seo(args.src)
    check_security(args.src)
    check_static(args.src)
    check_routes(args.src)
    if not args.no_build:
        check_build(run_build=True)

    sys.exit(report(args.json))


if __name__ == "__main__":
    main()
