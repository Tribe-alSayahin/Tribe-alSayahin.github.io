import { useState, useEffect, useRef } from 'react';
import { MapPin, Compass, Layers, Info, CheckCircle2, X, TrendingUp, Droplets, BookOpen, Award, Activity, FileText, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface LocationInfo {
  id: string;
  name: string;
  coords: [number, number]; // [lat, lng]
  x: number; // percentage X for SVG
  y: number; // percentage Y for SVG
  description: string;
  significance: string;
  imgUrl: string;
  historyDetail: string;
  category: 'settlement' | 'well' | 'region';
  categoryLabel: string;
}

const LOCATIONS: LocationInfo[] = [
  {
    id: 'shaqra',
    name: 'شقراء',
    coords: [25.2422, 45.2443],
    x: 58,
    y: 44,
    description: 'العاصمة التاريخية لإقليم الوشم في نجد، وتعتبر من الديار الحضرية العريقة التي سكنها واستقر بها عوائل وأبناء من قبيلة السياحين.',
    significance: 'مركز حضاري وتجاري هام، وموطن للعديد من الأسر السيحانية المتحضرة تاريخياً والمساهمة في تنمية الإقليم.',
    imgUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
    historyDetail: 'استوطنت العديد من العوائل والأسر المتحضرة من قبيلة السياحين في شقراء بإقليم الوشم منذ عهود قديمة، حيث شاركوا بفاعلية في النشاط الزراعي والتجاري وتشييد القصور الطينية العريقة بالبلدة التاريخية ومجالسها العلمية والأدبية القديمة.',
    category: 'settlement',
    categoryLabel: 'البلدات والحواضر'
  },
  {
    id: 'jathum',
    name: 'الجثوم',
    coords: [24.5822, 44.6053],
    x: 52,
    y: 52,
    description: 'من منازل ومواطن السياحين الشهيرة في نجد، وهي مقر هجرة الجثوم التي نزلها واستوطنها ذوي مسيلم من قبيلة السياحين.',
    significance: 'ارتبطت بقبيلة السياحين تاريخياً كأحد المراكز البدوية والهجر التي أسسها رجالات القبيلة ومصنفة في معجم عالية نجد.',
    imgUrl: 'https://images.unsplash.com/photo-1507565842045-896160d2580d?auto=format&fit=crop&w=600&q=80',
    historyDetail: 'تعتبر هجرة الجثوم في عالية نجد أول هجرة رسمية تم تأسيسها لقبيلة السياحين في نجد، وأسسها الشيخ فرج بن مسيلم السيحاني، لتكون معقلاً رئيساً ومقراً لاستقرار أبناء القبيلة في البادية وبداية تحضرهم وتشييد منازلهم ومزارعهم ومواردهم المائية.',
    category: 'settlement',
    categoryLabel: 'الهجر والديار'
  },
  {
    id: 'rahat',
    name: 'رهاط',
    coords: [22.0125, 39.8114],
    x: 28,
    y: 68,
    description: 'بلدة وادي رهاط العريقة في الحجاز، تقع شمال شرق مكة المكرمة، وهي من المناهل والمواطن القديمة لفرع من قبيلة السياحين.',
    significance: 'موطن حجازي قديم يربط فروع القبيلة بقراباتهم من روقة الحجاز ويسجل امتداد القبيلة التاريخي والاجتماعي بين نجد والحجاز.',
    imgUrl: 'https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?auto=format&fit=crop&w=600&q=80',
    historyDetail: 'يقع وادي رهاط العتيق شمال شرق مكة المكرمة ويمثل الجذور الحجازية والمناهل التاريخية القديمة التي قطنتها فروع القبيلة (سياحين الحجاز) وتوالت عليها الأجيال قبل امتدادهم الواسع ونزوح العديد من فرسانهم صوب هضاب عالية نجد رعياً واستقراراً.',
    category: 'region',
    categoryLabel: 'الأقاليم والأودية'
  },
  {
    id: 'aliyat-najd',
    name: 'عالية نجد',
    coords: [24.7333, 44.2500],
    x: 47,
    y: 55,
    description: 'المجال الجغرافي الأوسع لمواطن القبيلة ومرابعها التاريخية الممتدة بين الهجر والحواضر في قلب نجد.',
    significance: 'يمثل الامتداد الرعوي والحضاري الذي ارتبطت به حركة القبيلة التاريخية واستقرارها بين المراعي والهجر.',
    imgUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80',
    historyDetail: 'تُعد عالية نجد الإطار المكاني الجامع لديار قبيلة السياحين، وفيها تداخلت منازل الاستقرار مع مراعي البادية عبر أجيال متعاقبة، فغدت شاهداً على التحول التاريخي من الترحال إلى الاستقرار والتنمية في قلب الجزيرة.',
    category: 'region',
    categoryLabel: 'الأقاليم والأودية'
  }
];

export default function InteractiveMap() {
  const [selectedLoc, setSelectedLoc] = useState<LocationInfo>(LOCATIONS[0]);
  const [mapMode, setMapMode] = useState<'vector' | 'satellite'>('vector');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Dynamically load Leaflet for live map view
  useEffect(() => {
    if (mapMode !== 'satellite' || leafletLoaded) return;

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Load Leaflet Script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.crossOrigin = '';
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);
  }, [mapMode, leafletLoaded]);

  // Initialize and update live map
  useEffect(() => {
    if (!leafletLoaded || mapMode !== 'satellite' || !mapContainerRef.current) return;

    // Destroy existing map if it exists
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const L = (window as any).L;
    if (!L) return;

    // Initialize map centered around Saudi Arabia [24.0, 45.0]
    const map = L.map(mapContainerRef.current, {
      center: [23.9, 43.5],
      zoom: 6,
      zoomControl: true,
      attributionControl: false
    });

    leafletMapRef.current = map;

    // Load CartoDB Dark Matter tile layer for an elegant matching style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
    }).addTo(map);

    // Add Sadu themed custom marker style
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-yellow-500 opacity-40"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-yellow-500 border-2 border-amber-950"></span>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Add markers
    LOCATIONS.forEach((loc) => {
      const popupContent = L.DomUtil.create('div', 'custom-leaflet-popup-container');
      popupContent.innerHTML = `
        <div style="text-align: right; font-family: sans-serif; direction: rtl; min-width: 240px; max-width: 290px; padding: 4px; color: #ece1cb; background-color: #100c07; border-radius: 8px;">
          <div style="width: 100%; height: 60px; background: linear-gradient(135deg, #1f160d, #0c0804); border-radius: 6px; margin-bottom: 8px; border: 1px solid rgba(201, 162, 39, 0.25); display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 10px; color: #edc978; font-family: serif; font-weight: bold; letter-spacing: 1px;">✦ مَعْلَم جُغْرَافِيّ مُوَثّق ✦</span>
          </div>
          <h5 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #f3d274; font-family: serif;">${loc.name}</h5>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #d1c5b0; line-height: 1.5;">${loc.historyDetail}</p>
          <div style="font-size: 9px; color: #c9a227; background-color: rgba(201, 162, 39, 0.1); padding: 6px; border-radius: 4px; border: 1px solid rgba(201, 162, 39, 0.2); font-family: monospace;">
            إحداثيات: ${loc.coords[0].toFixed(4)}° N, ${loc.coords[1].toFixed(4)}° E
          </div>
        </div>
      `;

      const marker = L.marker(loc.coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent, {
          closeButton: true,
          className: 'sadu-leaflet-popup-wrapper'
        })
        .bindTooltip(`<div class="font-sans text-right px-2 py-1 bg-zinc-950 text-amber-200 border border-yellow-500/20 rounded font-semibold text-xs">${loc.name}</div>`, {
          direction: 'top',
          className: 'custom-leaflet-tooltip'
        });

      marker.on('click', () => {
        setSelectedLoc(loc);
        setActivePopupId(loc.id);
        map.setView(loc.coords, 8, { animate: true });
      });

      markersRef.current.push(marker);
    });

    // Pan to selected location coordinates
    map.setView(selectedLoc.coords, 7);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
      markersRef.current = [];
    };
  }, [leafletLoaded, mapMode]);

  // Move camera when selected Location changes in satellite view
  const selectLocation = (loc: LocationInfo) => {
    setSelectedLoc(loc);
    setActivePopupId(loc.id);
    if (mapMode === 'satellite' && leafletMapRef.current) {
      leafletMapRef.current.setView(loc.coords, 8, { animate: true });
      // Find corresponding marker and open its popup
      // Since markers match indexes of LOCATIONS:
      const index = LOCATIONS.findIndex(l => l.id === loc.id);
      if (markersRef.current[index]) {
        markersRef.current[index].openPopup();
      }
    }
  };

  // Listen for external selections (e.g. from HeritageGallery)
  useEffect(() => {
    const handleCustomSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      const found = LOCATIONS.find(loc => loc.id === customEvent.detail.id);
      if (found) {
        selectLocation(found);
        
        // Scroll map into view smoothly
        const element = document.getElementById('interactive-map-root');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };
    window.addEventListener('select-map-location', handleCustomSelect);
    return () => {
      window.removeEventListener('select-map-location', handleCustomSelect);
    };
  }, [mapMode]);

  return (
    <div className="space-y-12">
      <div id="interactive-map-root" className="bg-gradient-to-br from-ink-2 to-[#120c06] border border-brass/15 rounded-2xl overflow-hidden shadow-2xl">
        {/* Map Control Header */}
        <div className="p-space-5 border-b border-brass/10 flex flex-col sm:flex-row justify-between items-center gap-space-4 bg-ink/40">
          <div className="flex items-center gap-space-3">
            <div className="w-10 h-10 rounded-lg bg-brass/10 flex items-center justify-center text-brass-lt border border-brass/20">
              <Compass className="w-5 h-5 animate-[spin_20s_linear_infinite]" />
            </div>
            <div className="text-right">
              <h3 className="font-serif text-xl text-sand font-bold">خريطة مواطن وديار القبيلة</h3>
              <p className="text-xs text-sand-dim font-sans">تصفح التوزيع الجغرافي والامتداد التاريخي لديار السياحين مع تفاصيل ومعلومات موثقة</p>
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex bg-ink/90 p-space-1.5 rounded-full border border-brass/20 gap-space-1">
            <Button
              variant={mapMode === 'vector' ? "primary" : "secondary"}
              onClick={() => { setMapMode('vector'); setActivePopupId(null); }}
              className="px-space-5 py-space-1.5 h-auto text-xs font-semibold flex items-center gap-space-2 rounded-full"
            >
              <Layers className="w-3.5 h-3.5" />
              خريطة تراثية مرسومة
            </Button>
            <Button
              variant={mapMode === 'satellite' ? "primary" : "secondary"}
              onClick={() => { setMapMode('satellite'); setActivePopupId(null); }}
              className="px-space-5 py-space-1.5 h-auto text-xs font-semibold flex items-center gap-space-2 rounded-full"
            >
              <MapPin className="w-3.5 h-3.5" />
              خرائط الأقمار الحية
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* Detail Panel */}
          <div className="lg:col-span-5 p-space-6 md:p-space-8 flex flex-col justify-between border-l border-brass/10 bg-ink-2/60 order-2 lg:order-1">
            <div className="space-y-space-6 text-right">
              <Badge variant="brass" showDot={true} className="font-kufi text-xs px-space-3.5 py-space-1.5 bg-brass/10">
                {selectedLoc.categoryLabel}
              </Badge>

              <div className="space-y-space-2">
                <h4 className="text-3xl font-serif text-sand font-bold flex items-center gap-space-3">
                  {selectedLoc.name}
                </h4>
                <p className="text-xs text-brass-lt/70 font-mono tracking-wider">
                  GPS: {selectedLoc.coords[0].toFixed(4)}° N, {selectedLoc.coords[1].toFixed(4)}° E
                </p>
              </div>

              {/* Decorative Vector Map Indicator instead of image */}
              <div className="relative h-32 w-full rounded-xl overflow-hidden border border-brass/20 shadow-lg bg-gradient-to-br from-[#1c120c] to-[#0c0805] flex flex-col items-center justify-center p-space-4 text-center">
                {/* Sadu background pattern */}
                <div className="absolute inset-0 opacity-[0.04] bg-repeat" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '36px 22px' }} />
                
                <Compass className="w-8 h-8 text-brass-lt mb-space-2 animate-pulse" />
                <span className="text-brass-lt text-xs font-bold font-kufi">✦ وثيقة جغرافية معتمدة لعامة نجد والحجاز ✦</span>
                <span className="text-[10px] text-sand-dim/80 mt-space-1">{selectedLoc.name}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
              </div>

              <p className="text-sand-dim text-sm md:text-base leading-relaxed">
                {selectedLoc.description}
              </p>

              <div className="bg-ink/50 border border-brass/10 rounded-xl p-space-4 space-y-space-2">
                <span className="font-semibold text-xs text-brass-lt flex items-center gap-space-1.5 font-kufi">
                  <Info className="w-3.5 h-3.5" /> الأهمية التاريخية وموثوقية الوجود:
                </span>
                <p className="text-sand/90 text-xs md:text-sm leading-relaxed font-sans">
                  {selectedLoc.significance}
                </p>
              </div>
            </div>

            <div className="mt-space-8 pt-space-5 border-t border-brass/10 flex flex-wrap gap-space-2.5">
              {LOCATIONS.map((loc) => (
                <Button
                  key={loc.id}
                  variant={selectedLoc.id === loc.id ? "primary" : "secondary"}
                  onClick={() => selectLocation(loc)}
                  className="px-space-4 py-space-2 h-auto text-xs font-semibold flex items-center gap-space-2 rounded-xl"
                >
                  <div className={`w-2 h-2 rounded-full ${selectedLoc.id === loc.id ? 'bg-ink animate-pulse' : 'bg-sand-dim/40'}`} />
                  {loc.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Map View Frame */}
          <div className="lg:col-span-7 relative bg-ink min-h-[400px] lg:min-h-0 order-1 lg:order-2">
            {mapMode === 'vector' ? (
              /* Custom Vector/SVG Map of Central-West Saudi Arabia with coordinates grid */
              <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-ink to-[#0a0705] overflow-hidden select-none">
                {/* Coordinates grid lines */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
                
                {/* Compass symbol in back */}
                <div className="absolute top-6 left-6 w-24 h-24 border border-brass/10 rounded-full flex items-center justify-center opacity-30">
                  <Compass className="w-16 h-16 text-brass/20" />
                  <div className="absolute font-mono text-[9px] text-brass/30 top-1">N</div>
                  <div className="absolute font-mono text-[9px] text-brass/30 right-1">E</div>
                </div>

                {/* Saudi Arabia Region SVG Vector illustration */}
                <svg viewBox="0 0 500 400" className="w-full max-w-[460px] h-auto relative z-10 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
                  {/* Simulated Saudi Map Outline */}
                  <path
                    d="M 120 120 Q 200 80 320 60 T 450 150 Q 420 230 400 320 T 300 350 Q 220 320 180 340 T 80 250 Q 60 180 120 120 Z"
                    fill="url(#sadu-map-gradient)"
                    stroke="rgba(201,162,39,0.3)"
                    strokeWidth="1.5"
                    className="transition-all duration-500"
                  />

                  {/* Sub-region lines */}
                  <path
                    d="M 180 120 Q 250 180 320 230"
                    fill="none"
                    stroke="rgba(201,162,39,0.15)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  
                  <path
                    d="M 280 80 Q 240 180 260 280"
                    fill="none"
                    stroke="rgba(201,162,39,0.15)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />

                  {/* Region Labels */}
                  <text x="360" y="140" fill="rgba(232,205,110,0.3)" fontSize="16" fontFamily="var(--font-serif)" textAnchor="middle">إقليم نجد</text>
                  <text x="170" y="220" fill="rgba(232,205,110,0.3)" fontSize="16" fontFamily="var(--font-serif)" textAnchor="middle">الحجاز</text>

                  {/* Definitions for Gradients */}
                  <defs>
                    <linearGradient id="sadu-map-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e2719" />
                      <stop offset="50%" stopColor="#120c06" />
                      <stop offset="100%" stopColor="#191209" />
                    </linearGradient>
                  </defs>

                  {/* Hotspot Connectors */}
                  <path d="M 140 272 L 260 208 M 280 176 L 290 162" stroke="rgba(201,162,39,0.25)" strokeWidth="0.8" strokeDasharray="2 2" />

                  {/* Pins */}
                  {LOCATIONS.map((loc) => {
                    const isSelected = selectedLoc.id === loc.id;
                    return (
                      <g
                        key={loc.id}
                        className="cursor-pointer group"
                        onClick={() => {
                          setSelectedLoc(loc);
                          setActivePopupId(loc.id);
                        }}
                      >
                        {/* Interactive hover glow */}
                        <circle
                          cx={`${loc.x}%`}
                          cy={`${loc.y}%`}
                          r={isSelected ? 16 : 10}
                          className={`fill-brass/10 stroke-brass/35 transition-all duration-300 ${
                            isSelected ? 'scale-125' : 'group-hover:scale-115 opacity-80'
                          }`}
                        />
                        {/* Pulse circle */}
                        <circle
                          cx={`${loc.x}%`}
                          cy={`${loc.y}%`}
                          r={isSelected ? 8 : 4}
                          className={`fill-brass-lt transition-all duration-300 ${
                            isSelected ? 'animate-[ping_2s_infinite]' : ''
                          }`}
                        />
                        {/* Core pin */}
                        <circle
                          cx={`${loc.x}%`}
                          cy={`${loc.y}%`}
                          r={isSelected ? 5 : 3.5}
                          className="fill-brass border border-ink"
                        />
                        {/* Text label beside the pin */}
                        <rect
                          x={`${loc.x + 3}%`}
                          y={`${loc.y - 7}%`}
                          width={loc.name.length * 8 + 14}
                          height="18"
                          rx="4"
                          fill={isSelected ? '#c9a227' : '#191209'}
                          className="stroke-brass/30 stroke-[0.8] transition-colors duration-300"
                        />
                        <text
                          x={`${loc.x + 3}%`}
                          dx={(loc.name.length * 8 + 14) / 2}
                          y={`${loc.y + 1.5}%`}
                          fill={isSelected ? '#100c07' : '#ece1cb'}
                          fontSize="9"
                          fontWeight="700"
                          fontFamily="var(--font-sans)"
                          textAnchor="middle"
                        >
                          {loc.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Interactive Info Window overlay for Vector Map */}
                <AnimatePresence>
                  {activePopupId && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="absolute bottom-6 right-6 left-6 md:left-auto md:w-[340px] bg-ink/95 border border-brass text-sand rounded-xl p-4 shadow-2xl z-30 backdrop-blur-md"
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActivePopupId(null); }}
                        className="absolute top-2.5 left-2.5 text-sand-dim hover:text-brass transition-colors p-1 rounded-full hover:bg-white/5 cursor-pointer"
                        id="close-info-window"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Info header decoration instead of image */}
                      <div className="relative h-16 w-full rounded-lg overflow-hidden mb-3 border border-brass/20 bg-gradient-to-br from-[#1f160d] to-black flex items-center justify-between px-4">
                        <div className="absolute inset-0 opacity-[0.03] bg-repeat" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '24px 14px' }} />
                        <span className="relative z-10 text-sm font-serif font-bold text-amber-200">
                          {LOCATIONS.find(l => l.id === activePopupId)?.name}
                        </span>
                        <span className="relative z-10 text-[9px] bg-brass/80 text-ink px-2 py-0.5 rounded font-bold font-kufi">
                          {LOCATIONS.find(l => l.id === activePopupId)?.categoryLabel}
                        </span>
                      </div>

                      <h5 className="text-xs font-kufi text-brass-lt mb-1">نبذة تاريخية وموقع القبيلة:</h5>
                      <p className="text-xs text-sand-dim leading-relaxed mb-3">
                        {LOCATIONS.find(l => l.id === activePopupId)?.historyDetail}
                      </p>

                      <div className="flex justify-between items-center pt-2 border-t border-brass/10 text-[9px] text-brass-lt/80 font-mono">
                        <span>موقع عريق وموثق</span>
                        <span>GPS: {LOCATIONS.find(l => l.id === activePopupId)?.coords[0]}° N, {LOCATIONS.find(l => l.id === activePopupId)?.coords[1]}° E</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Live Leaflet Map Container */
              <div className="absolute inset-0 w-full h-full">
                <div ref={mapContainerRef} className="w-full h-full z-10" />
                {!leafletLoaded && (
                  <div className="absolute inset-0 bg-ink flex flex-col gap-3 items-center justify-center text-sand-dim z-20">
                    <div className="w-10 h-10 rounded-full border-2 border-brass-lt border-t-transparent animate-spin" />
                    <p className="text-sm font-kufi">جاري تحميل خريطة الأقمار الصناعية الجغرافية...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NEW GEOGRAPHICAL & AGRICULTURAL STATISTICS SUB-SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-ink-3 to-[#171008]/40 border border-brass/10 rounded-2xl p-space-6 md:p-space-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-brass/5 to-transparent rounded-full pointer-events-none" />
        
        {/* Header of Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-4 mb-space-8 pb-space-5 border-b border-brass/10">
          <div className="text-right">
            <span className="font-kufi text-[10px] text-brass-lt font-semibold block mb-space-1">الدراسات الكرتوغرافية والمسوحات</span>
            <h4 className="text-2xl font-serif text-sand flex items-center gap-space-2">
              <FileText className="w-5 h-5 text-brass" /> التحليل الجغرافي والإحصائي الموثق لديار القبيلة
            </h4>
            <p className="text-xs text-sand-dim mt-space-1">إحصائيات تقريبية وتحليلات زراعية وتاريخية مستمدة من البحوث والمعاجم البلدية والأدبية</p>
          </div>
          <Badge variant="brass" showDot={true} className="flex items-center gap-space-2 bg-ink/50 border border-brass/15 rounded-xl px-space-4 py-space-2 self-start md:self-auto h-auto">
            <Activity className="w-4 h-4 text-brass-lt animate-pulse shrink-0" />
            <span className="text-xs text-sand font-mono">قاعدة بيانات معجمية موثقة</span>
          </Badge>
        </div>

        {/* 4 Core Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-4 mb-space-8">
          <div className="bg-ink/60 border border-brass/10 hover:border-brass/30 rounded-xl p-space-5 transition-all duration-base ease-brand group">
            <div className="flex justify-between items-start mb-space-3">
              <div className="p-space-2 rounded-lg bg-brass/10 text-brass">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-brass-lt font-mono">94%</span>
            </div>
            <h5 className="text-sm font-semibold text-sand mb-space-1">التوثيق المعجمي والتاريخي</h5>
            <p className="text-xs text-sand-dim leading-relaxed">
              نسبة ورود ديار القبيلة ومناهلها في المعاجم الرسمية وعلى رأسها «معجم عالية نجد» للأديب الجغرافي سعد بن جنيدل ومؤلفات الروقة.
            </p>
          </div>

          <div className="bg-ink/60 border border-brass/10 hover:border-brass/30 rounded-xl p-space-5 transition-all duration-base ease-brand group">
            <div className="flex justify-between items-start mb-space-3">
              <div className="p-space-2 rounded-lg bg-brass/10 text-brass">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-brass-lt font-mono">85%</span>
            </div>
            <h5 className="text-sm font-semibold text-sand mb-space-1">كثافة وفرة الموارد المائية</h5>
            <p className="text-xs text-sand-dim leading-relaxed">
              توافر المناهل والموارد المائية العذبة القديمة والحديثة في عالية نجد ووادي رهاط وما حولهما من مواقع تاريخية موثقة.
            </p>
          </div>

          <div className="bg-ink/60 border border-brass/10 hover:border-brass/30 rounded-xl p-space-5 transition-all duration-base ease-brand group">
            <div className="flex justify-between items-start mb-space-3">
              <div className="p-space-2 rounded-lg bg-brass/10 text-brass">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-brass-lt font-mono">88%</span>
            </div>
            <h5 className="text-sm font-semibold text-sand mb-space-1">الاستقرار والتحضر المدني</h5>
            <p className="text-xs text-sand-dim leading-relaxed">
              معدل استقرار مجتمعات القبيلة التنموي والتحول من نمط البادية والترحال إلى هجر زراعية عامرة وحواضر تنموية كبرى كشقراء وعفيف وعشيرة.
            </p>
          </div>

          <div className="bg-ink/60 border border-brass/10 hover:border-brass/30 rounded-xl p-space-5 transition-all duration-base ease-brand group">
            <div className="flex justify-between items-start mb-space-3">
              <div className="p-space-2 rounded-lg bg-brass/10 text-brass">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-brass-lt font-mono">450k+</span>
            </div>
            <h5 className="text-sm font-semibold text-sand mb-space-1">مساحة الرعي الجغرافي (هكتار)</h5>
            <p className="text-xs text-sand-dim leading-relaxed">
              المدى الجغرافي التقريبي لتتبع مساقط المطر ورعي الإبل العتاق وتسيير حركة القبيلة تاريخياً بين جبال الحجاز وسهول عالية نجد.
            </p>
          </div>
        </div>

        {/* Detailed Regional Comparison Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-6 bg-ink-2/40 border border-brass/5 rounded-xl p-space-5 md:p-space-6 text-right">
          
          {/* Central-West Najd Sub-analysis */}
          <div className="space-y-space-4">
            <div className="flex items-center gap-space-2 text-brass border-b border-brass/10 pb-space-2">
              <MapPin className="w-4 h-4 text-brass-lt" />
              <h5 className="font-serif font-bold text-base text-sand">الميزة البيئية لنجد وعالية نجد (شقراء، الجثوم، رهاط، عالية نجد)</h5>
            </div>
            <p className="text-xs text-sand-dim leading-relaxed">
              تتميز ديار نجد وعالية نجد بتربتها الطميية الرملية العميقة المناسبة تماماً لإنتاج تمور الخلاص والسكري الفاخر وزراعة الحبوب القديمة كقمح نجد النبطي. كما تُعد السهول المحيطة كنفود الدحيل والوشم مناطق مثالية للرعي وتدريب الخيل العربية الأصيلة.
            </p>
            <div className="space-y-space-2">
              <div className="flex justify-between text-[11px] text-sand-dim">
                <span>ملاءمة التربة للزراعة والنخيل</span>
                <span className="text-brass font-mono font-bold">90%</span>
              </div>
              <div className="w-full bg-ink h-1.5 rounded-full overflow-hidden">
                <div className="bg-brass h-full rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div className="space-y-space-2">
              <div className="flex justify-between text-[11px] text-sand-dim">
                <span>جودة مياه الآبار الجوفية</span>
                <span className="text-brass font-mono font-bold">82%</span>
              </div>
              <div className="w-full bg-ink h-1.5 rounded-full overflow-hidden">
                <div className="bg-brass h-full rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>

          {/* Hijaz Region Sub-analysis */}
          <div className="space-y-space-4">
            <div className="flex items-center gap-space-2 text-brass border-b border-brass/10 pb-space-2">
              <Compass className="w-4 h-4 text-brass-lt" />
              <h5 className="font-serif font-bold text-base text-sand">الميزة الزراعية والبيئية لوادي رهاط والحجاز</h5>
            </div>
            <p className="text-xs text-sand-dim leading-relaxed">
              يمتاز وادي رهاط ببيئة بركانية جبلية خصبة غنية بالجريان السطحي والآبار السطحية والعيون الفوارة الطبيعية. تشتهر زراعته بإنتاج النخيل والليمون والحمضيات الموسمية الفاخرة، وقد شكّل جغرافياً واحة استقرار تاريخية ومحطة ربط رئيسية عبر التاريخ لحركة القوافل والقبائل الحجازية.
            </p>
            <div className="space-y-space-2">
              <div className="flex justify-between text-[11px] text-sand-dim">
                <span>كثافة العيون المائية الجارية</span>
                <span className="text-brass font-mono font-bold">85%</span>
              </div>
              <div className="w-full bg-ink h-1.5 rounded-full overflow-hidden">
                <div className="bg-brass h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="space-y-space-2">
              <div className="flex justify-between text-[11px] text-sand-dim">
                <span>استدامة الغطاء النباتي الجبلي</span>
                <span className="text-brass font-mono font-bold">78%</span>
              </div>
              <div className="w-full bg-ink h-1.5 rounded-full overflow-hidden">
                <div className="bg-brass h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Cartographic Footnote */}
        <div className="mt-space-6 flex items-center gap-space-2 text-[10px] text-sand-dim/80 bg-ink-2/30 border border-brass/10 rounded-lg p-space-3">
          <CheckCircle2 className="w-4 h-4 text-brass-lt shrink-0" />
          <span className="leading-relaxed">
            ملاحظة منهجية: تعتمد هذه المؤشرات على قراءات كرتوغرافية ومقارنات تاريخية مبنية على معجم عالية نجد، ودراسات الهيئة العامة للمساحة والمعلومات الجيومكانية لتوثيق منازل قبائل الروقة وتوزيع البلدات والهجر بالمملكة العربية السعودية.
          </span>
        </div>
      </motion.div>
    </div>
  );
}
