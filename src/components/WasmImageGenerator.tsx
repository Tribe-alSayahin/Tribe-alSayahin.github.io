import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Download,
  ShieldAlert,
  HelpCircle,
  FileText,
  Compass,
  Check,
  ChevronRight,
  User,
  MapPin,
  Calendar,
  Layers,
  Sparkle
} from "lucide-react";

interface CamelType {
  id: string;
  name: string;
  enDescription: string;
  arDescription: string;
  colorHex: string;
}

interface SceneOption {
  id: string;
  name: string;
  enDescription: string;
  arDescription: string;
}

const CAMEL_TYPES: CamelType[] = [
  { id: "Wadhah (White)", name: "وضحاء (مغاتير) - البيضاء", enDescription: "majestic pure white Arabian camel", arDescription: "الوضح الأجمل والأكثر طلباً، بيضاء ناصعة تسر الناظرين.", colorHex: "#f3f4f6" },
  { id: "Mjahim (Dark)", name: "مجاهيم (ملحاء) - السوداء", enDescription: "large noble dark-black Arabian camel", arDescription: "المجاهيم النجدية العريقة، سوداء داكنة وضخمة البنية هادئة الطباع.", colorHex: "#1f2937" },
  { id: "Shaal (Yellow)", name: "شعل - الذهبية الصفراء", enDescription: "golden yellow sand-colored Arabian camel", arDescription: "الشعل الذهبية التي تميل إلى الحمرة الخفيفة بلون النفود.", colorHex: "#d97706" },
  { id: "Hamra (Red)", name: "حمر - الحمراء البنية", enDescription: "rich reddish-brown Arabian camel", arDescription: "الحمر الأصيلة ذات اللون البني المحمر اللامع.", colorHex: "#9a3412" },
  { id: "Safra (Beige)", name: "صفر - الرملية الفاتحة", enDescription: "light beige sand-colored Arabian camel", arDescription: "الصفر الرمادية الفاتحة ذات الشعر الناعم والأصيل.", colorHex: "#ca8a04" }
];

const BRAND_VARIATIONS = [
  { id: "classic", name: "الباب الأصيل", arMeaning: "هيكل الباب الكلاسيكي المعتمد لعامة قبيلة السياحين." },
  { id: "mutraq", name: "الباب والمطرق", arMeaning: "هيكل الباب الأساسي مع مطرق إضافي من اليمين للتخصيص العائلي." },
  { id: "mighzal", name: "الباب والمغزل", arMeaning: "دمج هيكل الباب التاريخي مع ميسم المغزل المتقاطع للأفخاذ العريقة." },
  { id: "damah", name: "الباب والدمعة", arMeaning: "ميسم الباب التاريخي ومعه نقطة دائرية (دمعة) في أسفل المنحر." },
  { id: "arqah", name: "الباب والعرقاة", arMeaning: "وسم الباب بجانبه علامة العرقاة المتقاطعة لتمييز الهجن الأصايل." },
  { id: "kabsh", name: "البابين المتداخلين (الكبش)", arMeaning: "وسم مزدوج فخم ومستعرض يوضع لنادر الحلال وخياره في القبيلة." }
];

const SCENE_OPTIONS: SceneOption[] = [
  { id: "red sand dunes of Dahna desert under golden sunrise light", name: "نفود الدهناء الحمراء - شروق الشمس الذهبي", enDescription: "Dahna desert with red sand dunes under golden sunrise", arDescription: "كثبان رملية متموجة بلون الذهب الأحمر في قلب نجد تحت أشعة البكور." },
  { id: "oasis in Najd surrounded by ancient palm trees at twilight sunset", name: "واحة نجد التاريخية - وقت الغروب", enDescription: "lush oasis surrounded by historical date palms at sunset", arDescription: "الواحات القديمة المحاطة بظلال النخيل الباسق ومصادر المياه العذبة." },
  { id: "vast stony desert plateau of Al-Aridh under clear starry night", name: "هضاب ديار القبيلة الشامخة - نهار مشمس", enDescription: "majestic sunny desert plateau with rocky mountains in the background", arDescription: "مساحات برية فسيحة في جبال العارض مع هواء عليل تحت زرقة السماء الصافية." },
  { id: "classic oil painting heritage style of desert caravan", name: "أسلوب لوحة فنية زيتية تراثية عتيقة", enDescription: "classic oil painting heritage canvas style depicting historical camel caravan", arDescription: "إخراج فني يحاكي لوحات الاستشراق والتوثيق القديم على قماش الكانفاس." }
];

const LOADING_MESSAGES = [
  "يتم استدعاء نموذج التوليد الصوري المتطور Gemini Image...",
  "يتم رسم وبر الناقة العربية الأصيلة وتفاصيل الرقبة...",
  "يتم كي الميسم التاريخي لـ «الباب» بدقة بالغة بالذكاء الاصطناعي...",
  "يتم إسقاط ظلال كثبان رمال الدهناء ونور الشمس الذهبي...",
  "يتم وضع اللمسات النهائية وإعداد شهادة الوسم المعتمدة..."
];

export function WasmImageGenerator() {
  const [selectedCamel, setSelectedCamel] = useState<string>(CAMEL_TYPES[0].id);
  const [selectedBrand, setSelectedBrand] = useState<string>(BRAND_VARIATIONS[0].id);
  const [selectedScene, setSelectedScene] = useState<string>(SCENE_OPTIONS[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>("");

  // Mode switcher: "vector" (Client-side interactive vector canvas) or "ai" (Gemini AI image generator)
  const [viewMode, setViewMode] = useState<"vector" | "ai">("vector");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState<number>(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [promptUsed, setPromptUsed] = useState<string>("");
  const [errorType, setErrorType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rotate loading messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorType(null);
    setErrorMessage(null);
    setLoadingMsgIdx(0);
    setViewMode("ai"); // Switch view mode to AI to show loading status

    const camelObj = CAMEL_TYPES.find((c) => c.id === selectedCamel);
    const brandObj = BRAND_VARIATIONS.find((b) => b.id === selectedBrand);
    const sceneObj = SCENE_OPTIONS.find((s) => s.id === selectedScene);

    try {
      const response = await fetch("/api/generate-wasm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          camelType: camelObj?.enDescription || selectedCamel,
          brandId: selectedBrand,
          scene: sceneObj?.enDescription || selectedScene,
          customPrompt: customPrompt
        })
      });

      // On static hosting (GitHub Pages) there is no backend: the request returns
      // an HTML 404 page instead of JSON, so parse defensively.
      let data: any = null;
      try {
        data = await response.json();
      } catch {
        setErrorType("STATIC_HOSTING");
        setErrorMessage("توليد الصور بالذكاء الاصطناعي غير متاح في هذه النسخة من الموقع لأنها استضافة ثابتة بدون خادم. يمكنكم استخدام «الاستعراض الرقمي المتجهي الفوري» أعلاه فهو يعمل بالكامل داخل المتصفح وبدون قيود.");
        setViewMode("vector");
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        setErrorType(data.error);
        setErrorMessage(data.message);
        setIsLoading(false);
        // Automatically pivot back to vector view with an explanation since AI failed due to quota/limits
        return;
      }

      setGeneratedImage(data.imageUrl);
      setPromptUsed(data.promptUsed || "");
    } catch (err: any) {
      console.error(err);
      setErrorType("CONNECTION_ERROR");
      setErrorMessage("عذراً، فشل الاتصال بالخادم الداخلي لتوليد الصورة. يرجى مراجعة إعدادات الشبكة ومحاولة إعادة تشغيل الخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (viewMode === "ai" && generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `Siyahin_Camel_Wasm_${selectedBrand}_AI.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Download the SVG element as a high quality SVG file
      const svgElement = document.getElementById("vector-camel-svg");
      if (!svgElement) return;
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      const link = document.createElement("a");
      link.href = svgUrl;
      link.download = `Siyahin_Camel_Wasm_${selectedBrand}_Vector.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const selectedCamelObj = CAMEL_TYPES.find((c) => c.id === selectedCamel);
  const selectedBrandObj = BRAND_VARIATIONS.find((b) => b.id === selectedBrand);
  const selectedSceneObj = SCENE_OPTIONS.find((s) => s.id === selectedScene);

  // Generate a mock authentic certificate reference
  const certificateRef = `MITHAQ-WASM-${selectedBrand.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

  // Mapping Brand Marks to precise SVG rendering data
  const getBrandPathData = (id: string) => {
    switch (id) {
      case "classic":
        return { path: "M55,160 L55,60 L145,60 L145,160" };
      case "mutraq":
        return { path: "M45,160 L45,60 L125,60 L125,160" };
      case "mighzal":
        return { path: "M45,160 L45,60 L125,60 L125,160" };
      case "damah":
        return { path: "M55,150 L55,60 L145,60 L145,150" };
      case "arqah":
        return { path: "M45,160 L45,60 L125,60 L125,160" };
      case "kabsh":
        return { path: "M40,150 L40,80 L90,80 L90,150" };
      default:
        return { path: "M55,160 L55,60 L145,60 L145,160" };
    }
  };

  // Breed color specs for the vector camel gradients
  const getCamelColorInfo = (id: string) => {
    switch (id) {
      case "Wadhah (White)":
        return { stop1: "#f8fafc", stop2: "#cbd5e1", stroke: "#94a3b8" };
      case "Mjahim (Dark)":
        return { stop1: "#334155", stop2: "#0f172a", stroke: "#1e293b" };
      case "Shaal (Yellow)":
        return { stop1: "#fbbf24", stop2: "#b45309", stroke: "#78350f" };
      case "Hamra (Red)":
        return { stop1: "#ea580c", stop2: "#7c2d12", stroke: "#451a03" };
      case "Safra (Beige)":
        return { stop1: "#fef08a", stop2: "#ca8a04", stroke: "#854d0e" };
      default:
        return { stop1: "#f8fafc", stop2: "#cbd5e1", stroke: "#94a3b8" };
    }
  };

  const brandPathInfo = getBrandPathData(selectedBrand);
  const camelColorInfo = getCamelColorInfo(selectedCamel);

  return (
    <section id="wasm-generator" className="section bg-ink px-6 relative z-10 py-16 border-t border-brass/15 text-right">
      <div className="max-w-[1160px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="font-kufi text-xs text-brass-lt font-semibold block mb-2">
            ✦ تقنيات التوثيق المعاصرة ✦
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-sand font-bold">
            مُولد صور الإبل والوسام التفاعلي
          </h2>
          <div className="w-[84px] h-[26px] mx-auto mt-4 opacity-70 bg-repeat" style={{ backgroundImage: 'var(--sadu)' }}></div>
          <p className="max-w-[720px] mx-auto mt-4 text-sand-dim text-sm md:text-base leading-relaxed">
            استمتع بتجربة محاكاة حية وتوليد صور تراثية فائقة الدقة للإبل العربية الأصيلة الحاملة لوسام «الباب» التاريخي. اختر نوع الإبل والمحيط لمشاهدة المخطط المتجهي الفوري أو التوليد الواقعي.
          </p>
        </div>

        {/* Generator Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Right Side: Options Form */}
          <div className="lg:col-span-6 space-y-6 bg-ink-2/50 border border-brass/10 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-sm relative overflow-hidden">
            
            {/* Ambient pattern */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-radial from-brass/5 to-transparent blur-xl pointer-events-none" />

            {/* Step 1: Camel Selection */}
            <div className="space-y-3">
              <label className="block font-kufi text-xs text-brass-lt font-bold mb-1 flex items-center justify-between">
                <span>1. اختر سلالة ولون الإبل:</span>
                <span className="text-[10px] text-sand-dim font-normal font-sans">الألوان التقليدية عند البادية</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAMEL_TYPES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCamel(item.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-right transition-all duration-250 cursor-pointer ${
                      selectedCamel === item.id
                        ? "bg-[#18283a] border-brass shadow-[0_2px_10px_rgba(201,151,62,0.1)]"
                        : "bg-ink/40 border-brass/10 hover:border-brass/30 hover:bg-ink/70"
                    }`}
                  >
                    {/* Circle Color Preview */}
                    <div
                      className="w-5 h-5 rounded-full border border-brass/30 shrink-0 shadow-inner"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    <div className="grow">
                      <h4 className="font-serif text-xs font-bold text-sand">{item.name}</h4>
                      <p className="text-[10px] text-sand-dim line-clamp-1 mt-0.5">{item.arDescription}</p>
                    </div>
                    {selectedCamel === item.id && (
                      <div className="w-4 h-4 rounded-full bg-brass flex items-center justify-center text-ink shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Wasm Selection */}
            <div className="space-y-3">
              <label className="block font-kufi text-xs text-brass-lt font-bold mb-1 flex items-center justify-between">
                <span>2. تباين وسم الباب على المطية:</span>
                <span className="text-[10px] text-sand-dim font-normal font-sans">الأوسمة العائلية الموثقة</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BRAND_VARIATIONS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedBrand(item.id)}
                    className={`p-3 rounded-lg border text-right text-xs transition-all cursor-pointer ${
                      selectedBrand === item.id
                        ? "bg-[#18283a] border-brass text-brass-lt font-bold"
                        : "bg-ink/40 border-brass/10 text-sand-dim hover:text-sand hover:border-brass/30"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span>{item.name}</span>
                      {selectedBrand === item.id && <span className="text-brass">✦</span>}
                    </div>
                    <p className="text-[9px] text-sand-dim/80 leading-normal line-clamp-1 font-normal font-sans">
                      {item.arMeaning}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Scene Selection */}
            <div className="space-y-3">
              <label className="block font-kufi text-xs text-brass-lt font-bold mb-1">
                3. البيئة الجغرافية والمناظر الطبيعية:
              </label>
              <div className="space-y-2">
                {SCENE_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedScene(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      selectedScene === item.id
                        ? "bg-[#18283a] border-brass text-sand shadow-[0_1px_8px_rgba(201,151,62,0.05)]"
                        : "bg-ink/40 border-brass/10 text-sand-dim hover:border-brass/25 hover:bg-ink/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Compass className={`w-4 h-4 ${selectedScene === item.id ? "text-brass" : "text-brass/40"}`} />
                      <div className="text-right">
                        <span className="text-xs font-bold block">{item.name}</span>
                        <span className="text-[10px] text-sand-dim/90 block mt-0.5 font-sans">{item.arDescription}</span>
                      </div>
                    </div>
                    {selectedScene === item.id && (
                      <span className="w-2 h-2 rounded-full bg-brass shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Custom Prompts */}
            <div className="space-y-2">
              <label className="block font-kufi text-xs text-brass-lt font-bold flex items-center justify-between">
                <span>4. تفاصيل إضافية مخصصة (اختياري للذكاء الاصطناعي):</span>
                <span className="text-[9px] text-sand-dim font-sans font-normal">باللغة العربية أو الإنجليزية</span>
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="مثال: ناقة ترفع رأسها بشموخ، تفاصيل وبر واضحة، الكثبان الرملية ناعمة، ألوان دافئة وعميقة..."
                className="w-full h-20 bg-ink/70 border border-brass/15 rounded-xl p-3 text-xs text-sand placeholder:text-sand-dim/40 focus:outline-none focus:border-brass/50 resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Action buttons split: Local simulation vs Cloud Gen */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setViewMode("vector")}
                className={`py-3.5 rounded-xl font-kufi text-[11px] font-bold transition-all border cursor-pointer ${
                  viewMode === "vector"
                    ? "bg-[#18283a] text-brass-lt border-brass shadow-[0_0_12px_rgba(201,151,62,0.15)]"
                    : "bg-ink/40 border-brass/10 text-sand-dim hover:border-brass/30 hover:text-sand"
                }`}
              >
                ✦ استعراض رقمي فوري
              </button>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="py-3.5 rounded-xl font-kufi text-[11px] font-bold transition-all bg-gradient-to-l from-brass-lt to-brass hover:from-brass hover:to-brass-lt text-ink border border-brass cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>توليد بالذكاء الاصطناعي</span>
              </button>
            </div>
          </div>

          {/* Left Side: Display & Certificate Panel */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#0b141f] border border-brass/15 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
              
              {/* Decorative Corner Borders */}
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-brass/30 pointer-events-none" />
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-brass/30 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-brass/30 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-brass/30 pointer-events-none" />

              {/* Top View Mode Switcher Header */}
              <div className="flex border-b border-brass/10 pb-4 mb-4 items-center justify-between gap-4 z-10 relative">
                <span className="font-kufi text-xs text-brass-lt font-bold">لوحة المعاينة التفاعلية:</span>
                
                <div className="flex bg-black/40 p-1 rounded-xl border border-brass/10">
                  <button
                    onClick={() => setViewMode("vector")}
                    className={`px-3 py-1.5 rounded-lg text-center font-kufi text-[10px] font-bold transition-all cursor-pointer ${
                      viewMode === "vector"
                        ? "bg-brass text-ink"
                        : "text-sand-dim hover:text-sand"
                    }`}
                  >
                    رقمي متجهي فوري
                  </button>
                  <button
                    onClick={() => {
                      setViewMode("ai");
                      if (!generatedImage && !isLoading && !errorType) {
                        handleGenerate();
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-center font-kufi text-[10px] font-bold transition-all cursor-pointer ${
                      viewMode === "ai"
                        ? "bg-brass text-ink"
                        : "text-sand-dim hover:text-sand"
                    }`}
                  >
                    لوحة فنية بالذكاء الاصطناعي
                  </button>
                </div>
              </div>

              {/* Content Panel Area */}
              <div className="flex-1 flex flex-col justify-center">
                {isLoading ? (
                  /* State 1: Loading State */
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-6">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 rounded-full border-4 border-brass/10 border-t-4 border-t-brass animate-spin" />
                      <div className="absolute inset-3 rounded-full border border-brass/15 border-b-2 border-b-brass-lt animate-spin [animation-duration:1.5s]" />
                      <div className="absolute inset-0 flex items-center justify-center text-brass">
                        <Compass className="w-8 h-8 animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-w-[340px] px-4">
                      <h4 className="font-kufi text-xs text-brass-lt font-bold animate-pulse">يتم الآن رسم لوحة الإرث الميداني</h4>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={loadingMsgIdx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.4 }}
                          className="text-xs text-sand-dim leading-relaxed min-h-[40px] font-sans"
                        >
                          {LOADING_MESSAGES[loadingMsgIdx]}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                ) : viewMode === "vector" ? (
                  /* State 2: Dynamic Vector Canvas (Instant, Quota-Safe!) */
                  <div className="space-y-6">
                    {/* Glowing Vector Preview Container */}
                    <div className="relative aspect-square rounded-2xl border border-brass/20 overflow-hidden shadow-2xl bg-black">
                      
                      {/* Dynamic Vector Canvas Render */}
                      <svg id="vector-camel-svg" viewBox="0 0 500 500" className="w-full h-full">
                        <defs>
                          {/* Sky gradients */}
                          <linearGradient id="sky-dahna" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#fdba74" />
                            <stop offset="60%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#7c2d12" />
                          </linearGradient>

                          <linearGradient id="sky-oasis" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1e1b4b" />
                            <stop offset="50%" stopColor="#311060" />
                            <stop offset="100%" stopColor="#111122" />
                          </linearGradient>

                          <linearGradient id="sky-aridh" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="60%" stopColor="#0284c7" />
                            <stop offset="100%" stopColor="#075985" />
                          </linearGradient>

                          <linearGradient id="sky-oil" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#92400e" />
                            <stop offset="75%" stopColor="#451a03" />
                            <stop offset="100%" stopColor="#1c1917" />
                          </linearGradient>

                          {/* Sun glow */}
                          <radialGradient id="sun-glow">
                            <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                          </radialGradient>

                          {/* Brand glow behind the mark */}
                          <radialGradient id="brand-glow">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#b45309" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                          </radialGradient>

                          {/* Camel Breed Gradients */}
                          <linearGradient id="camel-grad-Wadhah" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f8fafc" />
                            <stop offset="100%" stopColor="#94a3b8" />
                          </linearGradient>
                          <linearGradient id="camel-grad-Mjahim" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#475569" />
                            <stop offset="100%" stopColor="#0f172a" />
                          </linearGradient>
                          <linearGradient id="camel-grad-Shaal" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#78350f" />
                          </linearGradient>
                          <linearGradient id="camel-grad-Hamra" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ea580c" />
                            <stop offset="100%" stopColor="#451a03" />
                          </linearGradient>
                          <linearGradient id="camel-grad-Safra" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fef08a" />
                            <stop offset="100%" stopColor="#854d0e" />
                          </linearGradient>
                        </defs>

                        {/* 1. SCENE BACKGROUNDS */}
                        {selectedScene === SCENE_OPTIONS[0].id && (
                          <g>
                            <rect width="500" height="500" fill="url(#sky-dahna)" />
                            <circle cx="380" cy="180" r="100" fill="url(#sun-glow)" />
                            {/* Desert Dunes */}
                            <path d="M -50 360 Q 150 260 350 340 T 550 320 L 550 500 L -50 500 Z" fill="#b45309" opacity="0.85" />
                            <path d="M -50 410 Q 250 310 550 420 L 550 500 L -50 500 Z" fill="#78350f" opacity="0.95" />
                            <path d="M -50 450 Q 150 410 550 460 L 550 500 L -50 500 Z" fill="#451a03" />
                          </g>
                        )}

                        {selectedScene === SCENE_OPTIONS[1].id && (
                          <g>
                            <rect width="500" height="500" fill="url(#sky-oasis)" />
                            {/* Moon */}
                            <path d="M 400 90 A 25 25 0 1 0 425 115 A 20 20 0 1 1 400 90 Z" fill="#fef08a" />
                            {/* Sparkly Starry Sky */}
                            <g fill="#fff">
                              <circle cx="80" cy="70" r="1.5" className="animate-pulse" />
                              <circle cx="160" cy="120" r="1.2" />
                              <circle cx="280" cy="60" r="2" />
                              <circle cx="340" cy="140" r="1" />
                            </g>
                            {/* Palm Tree Silhouettes */}
                            <path d="M 40 500 Q 60 410 45 310" stroke="#311708" strokeWidth="8" fill="none" />
                            <path d="M 45 310 Q 10 300 0 320 M 45 310 Q 15 280 10 250 M 45 310 Q 50 260 60 230 M 45 310 Q 85 280 100 300" stroke="#064e3b" strokeWidth="4" fill="none" strokeLinecap="round" />
                            {/* Dunes */}
                            <path d="M -50 420 Q 200 350 550 440 L 550 500 L -50 500 Z" fill="#1e1e2d" />
                            <path d="M -50 460 Q 100 450 550 470 L 550 500 L -50 500 Z" fill="#0f0f18" />
                          </g>
                        )}

                        {selectedScene === SCENE_OPTIONS[2].id && (
                          <g>
                            <rect width="500" height="500" fill="url(#sky-aridh)" />
                            {/* High bright sun */}
                            <circle cx="420" cy="90" r="35" fill="#fef08a" />
                            <circle cx="420" cy="90" r="50" fill="#fef08a" opacity="0.15" />
                            {/* Jagged low-poly mountains */}
                            <path d="M -50 380 L 110 260 L 230 350 L 370 230 L 550 370 L 550 500 L -50 500 Z" fill="#0f172a" />
                            <path d="M -50 420 L 150 320 L 310 410 L 450 300 L 550 410 L 550 500 L -50 500 Z" fill="#1e293b" />
                          </g>
                        )}

                        {selectedScene === SCENE_OPTIONS[3].id && (
                          <g>
                            <rect width="500" height="500" fill="url(#sky-oil)" />
                            {/* Soft sun haze */}
                            <circle cx="370" cy="160" r="80" fill="#f59e0b" opacity="0.3" />
                            <circle cx="370" cy="160" r="40" fill="#fef08a" opacity="0.5" />
                            {/* Retro canvas dunes */}
                            <path d="M -50 360 Q 200 290 550 350 L 550 500 L -50 500 Z" fill="#451a03" />
                            <path d="M -50 420 Q 100 390 550 430 L 550 500 L -50 500 Z" fill="#292524" />
                          </g>
                        )}

                        {/* 2. THE MAJESTIC CAMEL ILLUSTRATION */}
                        <g transform="translate(35, 35) scale(0.86)">
                          <path
                            d="M 80,380 C 70,350 60,310 65,250 C 70,190 80,130 110,90 C 125,70 140,50 160,30 C 175,15 195,10 205,25 C 215,35 210,55 200,75 C 190,95 195,125 205,160 C 210,180 220,200 235,210 C 265,190 310,180 350,185 C 390,190 430,200 450,240 C 465,270 460,310 445,340 C 435,360 420,375 410,390 L 405,450 L 385,450 L 395,390 C 380,370 350,370 330,380 L 320,450 L 300,450 L 315,380 C 270,385 240,380 215,390 L 205,450 L 185,450 L 195,385 C 160,385 130,390 110,405 L 100,450 L 80,450 Z"
                            fill={`url(#camel-grad-${selectedCamel.split(" ")[0]})`}
                            stroke={camelColorInfo.stroke}
                            strokeWidth="3"
                          />

                          {/* Zooming magnifier on the left neck */}
                          <circle cx="125" cy="115" r="42" fill="none" stroke="var(--brass)" strokeWidth="1.5" strokeDasharray="5,4" className="animate-[spin_40s_linear_infinite]" />
                          <circle cx="125" cy="115" r="3" fill="var(--brass)" />
                          <path d="M 125 73 L 125 65 M 125 157 L 125 165 M 83 115 L 75 115 M 167 115 L 175 115" stroke="var(--brass-lt)" strokeWidth="1.5" />

                          {/* 3. GLOWING HOT BRAND MARK (WASM) */}
                          <g transform="translate(95, 80) scale(0.28)">
                            <circle cx="100" cy="120" r="75" fill="url(#brand-glow)" className="animate-pulse" />
                            
                            {/* Branded Marks */}
                            <path
                              d={brandPathInfo.path}
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="16"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d={brandPathInfo.path}
                              fill="none"
                              stroke="#fbbf24"
                              strokeWidth="7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            {/* Extra details of brand variations */}
                            {selectedBrand === "mutraq" && (
                              <g>
                                <path d="M155,60 L155,160" fill="none" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" />
                                <path d="M155,60 L155,160" fill="none" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" />
                              </g>
                            )}

                            {selectedBrand === "mighzal" && (
                              <g>
                                <path d="M160,70 L160,150" fill="none" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" />
                                <path d="M142,100 L178,100" fill="none" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" />
                                <path d="M160,70 L160,150" fill="none" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" />
                                <path d="M142,100 L178,100" fill="none" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" />
                              </g>
                            )}

                            {selectedBrand === "damah" && (
                              <g>
                                <circle cx="100" cy="184" r="13" fill="#ef4444" />
                                <circle cx="100" cy="184" r="6" fill="#fbbf24" />
                              </g>
                            )}

                            {selectedBrand === "arqah" && (
                              <g>
                                <path d="M145,90 L175,120" fill="none" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" />
                                <path d="M175,90 L145,120" fill="none" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" />
                                <path d="M145,90 L175,120" fill="none" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" />
                                <path d="M175,90 L145,120" fill="none" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" />
                              </g>
                            )}

                            {selectedBrand === "kabsh" && (
                              <g>
                                <path d="M110,150 L110,80 L160,80 L160,150" fill="none" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M110,150 L110,80 L160,80 L160,150" fill="none" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M30,150 L170,150" fill="none" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" />
                                <path d="M30,150 L170,150" fill="none" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
                              </g>
                            )}
                          </g>
                        </g>

                        {/* Title and watermark overlay */}
                        <text x="30" y="460" fill="var(--sand-dim)" opacity="0.6" fontSize="11" fontFamily="sans-serif">Siyahin Interactive Heritage</text>
                        <text x="470" y="460" fill="var(--brass)" opacity="0.8" fontSize="12" fontFamily="serif" textAnchor="end">ميثاق السياحين</text>
                      </svg>

                      {/* Control Overlays */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex items-end justify-between">
                        <div className="text-right">
                          <span className="font-kufi text-[9px] text-brass-lt block">✦ تجسيد رقمي فوري</span>
                          <span className="text-xs text-sand font-serif">{selectedCamelObj?.name.split(" ")[0]} الحامل لـ «{selectedBrandObj?.name}»</span>
                        </div>
                        <button
                          onClick={downloadImage}
                          className="p-2 rounded-xl bg-brass text-ink hover:bg-brass-lt transition-colors shadow-md cursor-pointer flex items-center gap-1.5 text-[10px] font-kufi font-bold"
                          title="تحميل المخطط كملف عالي الدقة"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>تحميل المتجه</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : errorType ? (
                  /* State 3: Graceful Error State inside AI Tab */
                  <div className="flex-1 flex flex-col items-center justify-center py-8 text-center px-4 space-y-5">
                    <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div className="space-y-3 max-w-[420px]">
                      <h4 className="font-kufi text-xs text-red-400 font-bold">تنبيه بخصوص توليد الصور بالذكاء الاصطناعي</h4>
                      <p className="text-[11px] text-sand-dim leading-relaxed font-sans bg-black/40 p-4 rounded-xl border border-red-500/10">
                        {errorMessage || (errorType === "API_KEY_MISSING" 
                          ? "لم يتم العثور على مفتاح واجهة برمجة تطبيقات Gemini."
                          : "لقد تجاوز هذا الحساب الحصة المجانية المتاحة لتوليد الصور اليومية من جوجل (Quota Exceeded).")}
                      </p>
                    </div>

                    <div className="bg-brass/5 border border-brass/10 p-4 rounded-xl max-w-[400px] text-[11px] text-brass-lt/90 leading-normal text-right space-y-3 font-sans">
                      <p>
                        💡 <strong>الحل الفوري لضمان تصفح كامل للتطبيق:</strong>
                      </p>
                      <ul className="list-disc pr-4 space-y-1.5">
                        <li>
                          يمكنك دائماً الانتقال إلى علامة التبويب <strong>«رقمي متجهي فوري»</strong> بالأعلى لاستعراض وسم الباب على المطية وتغيير الأشكال والبيئات فورياً وبدقة بالغة دون أي قيود.
                        </li>
                        <li>
                          إذا كنت المطور، يمكنك تزويد التطبيق بمفتاح Gemini الخاص بك ذو الحصة المدفوعة من قائمة <strong>Settings &gt; Secrets</strong> في شريط الأدوات بالأعلى للتشغيل الواقعي الفوتوغرافي.
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => setViewMode("vector")}
                      className="px-5 py-2.5 rounded-xl bg-brass text-ink hover:bg-brass-lt transition-colors font-kufi text-xs font-bold shadow-md cursor-pointer"
                    >
                      ✦ تشغيل المعاينة الرقمية المتجهة البديلة
                    </button>
                  </div>
                ) : !generatedImage ? (
                  /* State 4: Empty State (Before Generation on AI Tab) */
                  <div className="flex-1 flex flex-col items-center justify-center py-16 text-center space-y-5">
                    <div className="w-20 h-20 rounded-2xl bg-[#142232] border border-brass/10 flex items-center justify-center text-brass-lt shadow-inner">
                      <ImageIcon className="w-10 h-10 opacity-60" />
                    </div>
                    <div className="space-y-2 max-w-[360px] px-4">
                      <h4 className="font-kufi text-xs text-brass-lt font-bold">بانتظار توليد لوحتك التراثية</h4>
                      <p className="text-xs text-sand-dim leading-relaxed font-sans">
                        انقر على زر <strong>«توليد بالذكاء الاصطناعي»</strong> في القائمة الجانبية لتشغيل محرك Gemini لرسم المطية وبيئتها في لوحة فوتوغرافية فائقة الجودة والواقعية.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* State 5: Successful AI Image Display */
                  <div className="space-y-6">
                    {/* Generated Image Container */}
                    <div className="relative aspect-square rounded-2xl border border-brass/20 overflow-hidden shadow-lg group">
                      <img
                        src={generatedImage}
                        alt="AI Generated branded camel"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Hover Overlay controls */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                        <div className="text-right">
                          <span className="font-kufi text-[10px] text-brass-lt block">المطية الموسومة بالذكاء الاصطناعي</span>
                          <span className="text-xs text-sand font-serif">{selectedCamelObj?.name}</span>
                        </div>
                        <button
                          onClick={downloadImage}
                          className="p-2 rounded-xl bg-brass text-ink hover:bg-brass-lt transition-colors shadow-md cursor-pointer"
                          title="تحميل الصورة بجودة عالية"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Certificate of Tribal Authenticity (Visible always for both views!) */}
              <div className="bg-gradient-to-b from-ink-2 to-[#0c131c] border border-brass/15 rounded-2xl p-5 shadow-inner relative overflow-hidden mt-6">
                <div className="absolute top-0 left-0 w-24 h-24 bg-radial from-brass/5 to-transparent blur-md pointer-events-none" />
                
                {/* Certificate Title */}
                <div className="flex items-center justify-between border-b border-brass/10 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brass-lt animate-pulse" />
                    <span className="font-kufi text-[10px] text-brass-lt font-bold">وثيقة إثبات وسم إلكترونية</span>
                  </div>
                  <span className="font-mono text-[9px] text-sand-dim/80">{certificateRef}</span>
                </div>

                {/* Metadata Specs */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs leading-relaxed">
                  <div className="flex items-center gap-2 border-b border-brass/5 pb-2">
                    <User className="w-3.5 h-3.5 text-brass-lt shrink-0" />
                    <div className="text-right">
                      <span className="text-[9px] text-sand-dim block">المالك الأصلي:</span>
                      <span className="font-serif text-sand block font-bold">سياحين نجد العريقة</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-b border-brass/5 pb-2">
                    <Compass className="w-3.5 h-3.5 text-brass-lt shrink-0" />
                    <div className="text-right">
                      <span className="text-[9px] text-sand-dim block">المطية واللون:</span>
                      <span className="font-serif text-sand block font-bold">{selectedCamelObj?.name.split(" ")[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-b border-brass/5 pb-2">
                    <FileText className="w-3.5 h-3.5 text-brass-lt shrink-0" />
                    <div className="text-right">
                      <span className="text-[9px] text-sand-dim block">الوسم المعتمد:</span>
                      <span className="font-serif text-sand block font-bold text-brass-lt">{selectedBrandObj?.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-b border-brass/5 pb-2">
                    <MapPin className="w-3.5 h-3.5 text-brass-lt shrink-0" />
                    <div className="text-right">
                      <span className="text-[9px] text-sand-dim block">الديار والمرباع:</span>
                      <span className="font-serif text-sand block font-bold font-sans">سهول وسط الجزيرة</span>
                    </div>
                  </div>
                </div>

                {/* Branding Anatomical Note */}
                <div className="mt-3.5 bg-black/40 border border-brass/5 p-3 rounded-lg text-[10px] text-sand-dim/90 leading-relaxed font-sans text-right">
                  <strong>تفصيل الوسم:</strong> {selectedBrandObj?.arMeaning} يُوضع هذا الميسم على رقبة المطية في الجهة اليسرى ليكون صكاً جماعياً حافظاً لحقوق القبيلة التاريخية في الرعي والمورد.
                </div>

                {/* Certificate Footer */}
                <div className="flex justify-between items-center border-t border-brass/5 mt-4 pt-3 text-[9px] text-brass-lt/50">
                  <div className="flex items-center gap-1 font-sans">
                    <Calendar className="w-3 h-3" />
                    <span>تحرير: {new Date().toLocaleDateString('ar-SA')}</span>
                  </div>
                  <span>ميثاق السياحين المعتمد التفاعلي ✦</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
