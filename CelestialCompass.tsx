import React, { useState, useEffect, useRef } from 'react';
import { Compass, Moon, Sun, Wind, Volume2, VolumeX, Sparkles, Star, Award, BookOpen, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface CelestialStar {
  id: string;
  name: string;
  englishName: string;
  degree: number; // Position on the 360-deg astrolabe
  type: 'rain' | 'navigation' | 'season';
  typeLabel: string;
  poeticQuote: string;
  meteorology: string; // Dynamic natural effect
  description: string;
  siyahinConnection: string; // How this star connects to their life/travels in Najd
}

const STAR_DATABASE: CelestialStar[] = [
  {
    id: 'suhail',
    name: 'نجم سهيل اليماني',
    englishName: 'Canopus',
    degree: 180,
    type: 'season',
    typeLabel: 'مبشر انقضاء الحر وبداية النماء',
    poeticQuote: '«إذا طلع سهيل.. طاب الليل، وامتنع القيل، ولامس الماء برد العليل»',
    meteorology: 'انخفاض درجات الحرارة وهبوب الرياح الرطبة الجنوبية وتراجع سموم الصيف.',
    description: 'درة السماء الجنوبية وأشهر نجوم العرب للاستدلال على نهاية القيظ. يمثل ظهوره في أواخر أغسطس بداية الفرج المائي والربيعي للبدو ومواشيهم في نجد.',
    siyahinConnection: 'ترتبط عودة قطعان إبل السياحين من مناهل المياه العميقة لقلب رعي النفود بظهور هذا النجم المبارك في الأفق الجنوبي للقصيم ونجد.'
  },
  {
    id: 'thurayya',
    name: 'عنقود الثريا الفلكي',
    englishName: 'Pleiades',
    degree: 45,
    type: 'rain',
    typeLabel: 'دليل أمطار الوسم ونشوء السحاب',
    poeticQuote: '«نزلنا بثريا الود في كل منهلٍ.. نقود العاديات بصبحها والمكارمِ»',
    meteorology: 'بداية مطر "الوسم" النافع الذي ينبت الكمأ (الفقع) والأعشاب النادرة والمراعي الخضراء.',
    description: 'عنقود نجمي ساحر ذو مكانة رفيعة في علم الفلك البدوي. يستدل به البدو على فصول السنة وغزارة الأمطار وحركة السحب الرعدية.',
    siyahinConnection: 'تبدأ هجرات ومخيمات السياحين الربيعية التقليدية وتتبع مساقط المطر حول وديان شقراء ورهاط مع اقتران الثريا بالهلال.'
  },
  {
    id: 'aljady',
    name: 'نجم الجدي القطبي',
    englishName: 'Polaris',
    degree: 0,
    type: 'navigation',
    typeLabel: 'بوصلة الشمال الثابتة وملاحة السرى',
    poeticQuote: '«والجدي باللّيل العتيم منارةٍ.. يهدي الركائب في الفيافي الخالية»',
    meteorology: 'الاستقرار المناخي الكامل والثبات الجغرافي لاتجاه الشمال الجغرافي الصارم.',
    description: 'النجم القطبي الثابت الذي لا يبرح مكانه في السماء. هو المنارة الأزلية لفرسان الصحراء، يرسم لهم خط السير بأمان تام في حلكة الظلام والوهاد الخالية.',
    siyahinConnection: 'اعتمد فرسان وركبان السياحين على الجدي للاستدلال الليلي في مساراتهم الحربية وحماية إبلهم وتأمين القوافل عبر ممرات نجد الغربية.'
  },
  {
    id: 'almerzem',
    name: 'ذراع المرزم (الشعرى اليمانية)',
    englishName: 'Sirius',
    degree: 235,
    type: 'season',
    typeLabel: 'ذروة الصيف وجني الثمار',
    poeticQuote: '«إذا طلع المرزم فاملأ المحزم.. واستبق من الماء ما يلزم»',
    meteorology: 'اشتداد القيظ مؤقتاً وبداية نضج التمور الفاخرة في واحات الوشم والقصيم ونجد.',
    description: 'أشد نجوم السماء لمعاناً وتوهجاً على الإطلاق. يعبر ظهوره عن منعطف الصيف الحار، وهو الوقت الذي كان البدو يلتفون فيه حول الآبار المضمونة للارتواء.',
    siyahinConnection: 'فترة تجمّع العوائل واستقرار فرسان السياحين في هجرتهم العريقة (الجثوم) حول الآبار والمناهل العميقة بانتظار تبدل الفصول.'
  },
  {
    id: 'almizan',
    name: 'نجوم الميزان (حزام الجبار)',
    englishName: 'Orion\'s Belt',
    degree: 110,
    type: 'navigation',
    typeLabel: 'دليل منتصف الليل وبوابة الشتاء',
    poeticQuote: '«وميزان السما بالليل يصحو مائلاً.. يعلمنا بثلث الليل والصبح مقبل»',
    meteorology: 'تحول اتجاه الرياح إلى شمالية غربية باردة ومنعشة، إيذاناً باقتراب دخول فصل الشتاء.',
    description: 'ثلاثة نجوم مصطفة بإعجاز هندسي رائع تتوسط كوكبة الجبار البهية. يعتمد عليها أهل البادية لحساب ساعات الليل وتوزيع فترات الحراسة وسقاية الخيل.',
    siyahinConnection: 'استعان بها حراس الإبل والرعيان من السياحين في تنظيم نوبات الحراسة الليلية وإشعال نيران مجالس الشيوخ الفخمة لاستقبال الوفود.'
  }
];

export default function CelestialCompassComponent() {
  const [activeStarId, setActiveStarId] = useState<string>('aljady');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isWindPlaying, setIsWindPlaying] = useState<boolean>(false);
  const [windVolume, setWindVolume] = useState<number>(0.12);
  const [activeSeason, setActiveSeason] = useState<'spring' | 'summer' | 'winter'>('spring');

  // Audio Context References for Synthesizing desert wind
  const audioCtxRef = useRef<AudioContext | null>(null);
  const windGainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Active star object
  const activeStar = STAR_DATABASE.find(s => s.id === activeStarId) || STAR_DATABASE[2];

  // Rotate the compass to target star degree when selected
  const handleSelectStar = (star: CelestialStar) => {
    setActiveStarId(star.id);
    // Smoothly rotate the compass to align the star's degree with the pointer (top/0 deg)
    // To align a star of angle D to the top, we rotate the compass by -D degrees
    setRotationAngle(-star.degree);
  };

  // Modern Web Audio API Synth: Immersive Desert Night Wind Synthesizer
  const toggleWindSound = () => {
    if (isWindPlaying) {
      stopWind();
    } else {
      startWind();
    }
  };

  const startWind = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Gain for wind
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(windVolume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      windGainNodeRef.current = masterGain;

      // Synthesize Pink Noise for natural wind gusts
      const bufferSize = ctx.sampleRate * 4; // 4 seconds of unique noise
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filtering approximation
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // normalise
        b6 = white * 0.115926;
      }

      const windSource = ctx.createBufferSource();
      windSource.buffer = noiseBuffer;
      windSource.loop = true;

      // Resonant Lowpass Filter for whistling wind gust dynamics
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.Q.setValueAtTime(5.0, ctx.currentTime); // resonance peaks the whistle

      windSource.connect(filter);
      filter.connect(masterGain);
      filterNodeRef.current = filter;

      windSource.start();
      setIsWindPlaying(true);

      // Low Frequency Modulation (LFO) for natural wind whistling fluctuations
      const animateWindFilter = () => {
        if (!audioCtxRef.current || !filterNodeRef.current) return;
        const time = ctx.currentTime;
        // Modulate frequency to simulate random natural whistling gusts
        const baseFreq = 220;
        const gustAmplitude = 260;
        const lfoSpeed1 = Math.sin(time * 0.35) * Math.cos(time * 0.12);
        const lfoSpeed2 = Math.cos(time * 0.77) * 0.3;
        const frequency = baseFreq + (lfoSpeed1 + lfoSpeed2 + 1) * gustAmplitude;

        filterNodeRef.current.frequency.setValueAtTime(Math.max(80, frequency), time);
        animationFrameRef.current = requestAnimationFrame(animateWindFilter);
      };

      animateWindFilter();
    } catch (err) {
      console.warn('Astrolabe audio initialization blocked or unsupported:', err);
    }
  };

  const stopWind = () => {
    setIsWindPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  // Handle seasonal changes to rotate compass to predefined scenic angles
  useEffect(() => {
    if (activeSeason === 'spring') {
      handleSelectStar(STAR_DATABASE[1]); // Thurayya
    } else if (activeSeason === 'summer') {
      handleSelectStar(STAR_DATABASE[3]); // Al-Merzem
    } else {
      handleSelectStar(STAR_DATABASE[2]); // Al-Jady
    }
  }, [activeSeason]);

  // Sync volume level live
  useEffect(() => {
    if (windGainNodeRef.current && audioCtxRef.current) {
      windGainNodeRef.current.gain.setValueAtTime(windVolume, audioCtxRef.current.currentTime);
    }
  }, [windVolume]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  return (
    <Card hoverGlow={false} className="bg-gradient-to-br from-[#0c0906] via-[#150f0a] to-[#080604] border border-brass/25 rounded-3xl p-space-6 md:p-space-10 shadow-2xl relative overflow-hidden" id="astrolabe-falk">
      {/* Absolute Decorative Grid Elements */}
      <div className="absolute inset-0 bg-repeat opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '60px 40px' }} />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brass/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brass/5 rounded-full blur-3xl pointer-events-none" />

      {/* Traditional Sadu Band Top/Bottom decoration */}
      <div className="absolute top-0 inset-x-0 h-1 bg-repeat opacity-40" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '40px 4px' }} />
      <div className="absolute bottom-0 inset-x-0 h-1 bg-repeat opacity-40" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '40px 4px' }} />

      {/* Header Panel */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-brass/10 pb-space-6 mb-space-10 gap-space-6 relative z-10 text-right">
        <div className="space-y-space-2">
          <div className="mb-space-2 flex justify-start">
            <Badge variant="brass" showDot={true}>
              <Compass className="w-3.5 h-3.5 animate-spin mr-space-1" style={{ animationDuration: '10s' }} />
              البوصلة الكونية وعلم الرسوخ والاهتداء
            </Badge>
          </div>
          <h3 className="text-2xl md:text-4xl font-serif text-sand font-bold tracking-wide">
            المُرشد الفلكي البدوي ودرب الركائب النجدية
          </h3>
          <p className="text-xs md:text-sm text-sand-dim leading-relaxed max-w-3xl">
            تأمل براعة الأجداد في قراءة صفحة السماء ليلاً للملاحة والترحال in ديار نجد والنفود الحرة. حرك أو اختر النجوم الكونية الموثّقة على أسطرلاب القبيلة لعرض سياقها المناخي والوجداني وارتباطها بقوافل <strong className="text-brass-lt">السياحين</strong>.
          </p>
        </div>

        {/* Night Wind Ambient Sound Controller */}
        <div className="flex flex-col items-end gap-space-2 shrink-0 self-stretch lg:self-auto bg-ink-2/30 border border-brass/15 p-space-4 rounded-2xl group relative overflow-hidden">
          {isWindPlaying && (
            <div className="absolute inset-0 bg-blue-900/10 pointer-events-none animate-pulse" />
          )}
          <div className="flex items-center gap-space-3 relative z-10">
            <span className="font-kufi text-[11px] text-sand-dim">نسيم ليل الصحراء (هبوب رياح اصطناعي):</span>
            <button
              onClick={toggleWindSound}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-base ease-brand border cursor-pointer ${
                isWindPlaying
                  ? 'bg-gradient-to-br from-blue-900 to-indigo-950 text-brass-lt border-brass shadow-[0_0_15px_rgba(30,58,138,0.5)]'
                  : 'bg-ink border-brass/25 text-sand-dim hover:text-brass-lt'
              }`}
              title={isWindPlaying ? 'إيقاف صوت الرياح' : 'تشغيل صوت الرياح'}
            >
              {isWindPlaying ? <Wind className="w-5 h-5 animate-pulse text-brass" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-space-2.5 w-full mt-space-2 relative z-10">
            <span className="text-[9px] font-mono opacity-60 text-sand-dim">شدة الهبوب:</span>
            <input
              type="range"
              min="0.02"
              max="0.3"
              step="0.01"
              value={windVolume}
              onChange={(e) => setWindVolume(parseFloat(e.target.value))}
              disabled={!isWindPlaying}
              className="w-24 h-1 bg-brass/20 rounded-lg appearance-none cursor-pointer accent-brass disabled:opacity-40"
            />
          </div>
        </div>
      </div>

      {/* Main Astrolabe layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-8 items-center relative z-10">
        
        {/* Left column: Quick Star Cards & Seasons selectors */}
        <div className="lg:col-span-4 order-2 lg:order-1 space-y-space-6 text-right">
          {/* Season filter */}
          <div className="bg-ink-2/50 border border-brass/15 p-space-4 rounded-2xl space-y-space-3">
            <span className="font-kufi text-xs text-brass-lt font-bold block mb-space-1">تحديد طالع الفصول في نجد:</span>
            <div className="grid grid-cols-3 gap-space-2">
              {[
                { id: 'spring', label: 'الربيع (الوسم)' },
                { id: 'summer', label: 'القيظ (الحر)' },
                { id: 'winter', label: 'المربعانية (البرد)' }
              ].map((season) => (
                <button
                  key={season.id}
                  onClick={() => setActiveSeason(season.id as any)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-kufi font-semibold transition-all duration-base ease-brand border cursor-pointer ${
                    activeSeason === season.id
                      ? 'bg-brass text-ink border-brass font-bold'
                      : 'bg-ink/60 border-brass/10 text-sand-dim hover:text-sand hover:border-brass/20'
                  }`}
                >
                  {season.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick star selector menu list */}
          <div className="space-y-space-2.5">
            <span className="font-kufi text-xs text-brass-lt font-bold block mr-space-1">دليل المنازل الفلكية:</span>
            {STAR_DATABASE.map((star) => {
              const isSelected = activeStarId === star.id;
              return (
                <Card
                  key={star.id}
                  hoverGlow={isSelected}
                  onClick={() => handleSelectStar(star)}
                  className={`w-full text-right p-space-3.5 rounded-xl border transition-all duration-base ease-brand flex items-center justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-brass/10 border-brass text-brass-lt shadow-md'
                      : 'bg-ink-2/40 border-brass/10 text-sand-dim hover:text-sand hover:bg-ink-2/80'
                  }`}
                >
                  <div className="flex items-center gap-space-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border text-[10px] font-mono font-bold transition-transform duration-base ease-brand ${
                      isSelected ? 'bg-brass text-ink border-brass scale-105' : 'bg-ink border-brass/15 text-brass-lt group-hover:scale-105'
                    }`}>
                      ★
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-semibold flex items-center gap-space-1.5 text-sand">
                        {star.name}
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brass animate-ping" />}
                      </h4>
                      <span className="text-[10px] text-sand-dim/60 font-serif block mt-space-0.5">{star.typeLabel}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-brass/75 group-hover:text-brass-lt">{star.degree}°</span>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Center column: Interactive Graphic Astrolabe Dial */}
        <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-center justify-center py-space-6">
          <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-brass/45 bg-[#090604] shadow-[0_0_50px_rgba(201,162,39,0.08)] flex items-center justify-center">
            
            {/* outer degree markers ring */}
            <div className="absolute inset-2 rounded-full border border-brass/20 pointer-events-none border-dashed animate-[spin_200s_linear_infinite]" />
            <div className="absolute inset-6 rounded-full border border-brass/10 pointer-events-none" />
            
            {/* Compass Directions Markers */}
            <span className="absolute top-2 font-mono text-[10px] font-bold text-brass-lt/80 tracking-wider">شمال (N)</span>
            <span className="absolute bottom-2 font-mono text-[10px] font-bold text-brass-lt/80 tracking-wider">جنوب (S)</span>
            <span className="absolute right-2 font-mono text-[10px] font-bold text-brass-lt/80 tracking-wider">شرق (E)</span>
            <span className="absolute left-2 font-mono text-[10px] font-bold text-brass-lt/80 tracking-wider">غرب (W)</span>

            {/* Rotatable astrolabe sky center plate */}
            <div
              className="absolute inset-10 rounded-full transition-transform duration-1000 ease-out cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0c0906] to-[#040302]"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              {/* Star chart constellations simulation */}
              <div className="absolute inset-0 bg-[radial-gradient(1.5px_1.5px_at_20px_30px,white,transparent),radial-gradient(2px_2px_at_120px_60px,rgba(255,255,255,0.8),transparent),radial-gradient(1px_1px_at_80px_160px,white,transparent),radial-gradient(1.5px_1.5px_at_220px_120px,rgba(255,255,255,0.7),transparent)] opacity-40" />

              {/* Central Sadu Symbol */}
              <div className="w-14 h-14 border border-brass/20 rounded-full flex items-center justify-center opacity-25">
                <div className="w-8 h-8 rotate-45 border border-brass/40" />
              </div>

              {/* Database stars plotted dynamically */}
              {STAR_DATABASE.map((star) => {
                // Trigonometry to place stars radially
                // 0 deg is at top, so angle needs to be adjusted by -90 deg for math cos/sin
                const rad = (star.degree - 90) * (Math.PI / 180);
                const radius = 76; // distance from center
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;

                const isActive = activeStarId === star.id;

                return (
                  <button
                    key={star.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectStar(star);
                    }}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    className="absolute w-6 h-6 flex items-center justify-center transition-all duration-base cursor-pointer group"
                    title={star.name}
                  >
                    {/* Glowing outer halo */}
                    <div className={`absolute rounded-full transition-all duration-500 ${
                      isActive 
                        ? 'w-7 h-7 bg-brass/35 animate-ping' 
                        : 'w-4 h-4 bg-brass/5 group-hover:bg-brass/25'
                    }`} />
                    
                    <Star className={`w-3.5 h-3.5 relative z-10 transition-colors duration-300 ${
                      isActive ? 'text-brass-lt stroke-[2.5] scale-110' : 'text-brass-lt/40 group-hover:text-brass-lt'
                    }`} />

                    {/* Miniature star label always aligned upright */}
                    <span 
                      style={{ transform: `rotate(${-rotationAngle}deg)` }}
                      className={`absolute top-5 text-[8px] font-serif whitespace-nowrap bg-ink/95 border px-1 py-0.5 rounded shadow-lg transition-opacity duration-300 pointer-events-none ${
                        isActive ? 'opacity-100 border-brass text-brass-lt font-bold' : 'opacity-0 group-hover:opacity-100 border-brass/10 text-sand-dim'
                      }`}
                    >
                      {star.name.split(' ')[1] || star.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Absolute golden pointer bezel index at top */}
            <div className="absolute top-0 -translate-y-2 flex flex-col items-center pointer-events-none z-10">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-brass" />
              <div className="w-1.5 h-1.5 bg-brass rounded-full shadow-[0_0_10px_rgba(201,162,39,0.8)] mt-0.5" />
            </div>

            {/* Central Dial Reset Button */}
            <button
              onClick={() => {
                setRotationAngle(0);
                setActiveStarId('aljady');
              }}
              className="absolute w-9 h-9 bg-ink border border-brass/30 rounded-full flex items-center justify-center text-brass-lt hover:text-sand hover:border-brass transition-all cursor-pointer shadow-lg z-25"
              title="إعادة ضبط الشمال الفلكي"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] font-kufi text-sand-dim/50 mt-space-4 text-center">
            * انقر على النجوم الذهبية مباشرة على القرص الفلكي لتدوير الأسطرلاب الملاحي.
          </p>
        </div>

        {/* Right column: Star Wisdom detail description card */}
        <div className="lg:col-span-4 order-3 space-y-space-6 text-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStar.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <Card
                hoverGlow={true}
                className="bg-gradient-to-b from-[#1b120a] to-[#0e0a05] border border-brass/35 rounded-2xl p-space-6 space-y-space-5 shadow-xl relative"
              >
                {/* Wax Seal / Stamp effect overlay */}
                <div className="absolute bottom-4 left-4 pointer-events-none opacity-[0.03] select-none text-brass">
                  <Compass className="w-24 h-24 stroke-[1]" />
                </div>

                {/* Card Header metadata */}
                <div className="flex justify-between items-center border-b border-brass/10 pb-space-3">
                  <Badge variant="brass">
                    طالع: {activeStar.typeLabel}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-brass">{activeStar.englishName}</span>
                </div>

                {/* Title & Description */}
                <div className="space-y-space-1">
                  <h4 className="text-xl font-serif text-sand font-bold">{activeStar.name}</h4>
                  <p className="text-xs text-sand-dim leading-relaxed">{activeStar.description}</p>
                </div>

                {/* Traditional Saying / Poetic Proverb */}
                <div className="bg-ink/80 border-r-4 border-brass p-space-4 rounded-xl shadow-inner">
                  <span className="text-[9px] text-brass-lt/70 font-kufi block mb-space-1">المأثور والقصيد النبطي العتيق:</span>
                  <p className="font-serif text-sm font-bold text-sand leading-relaxed italic">
                    {activeStar.poeticQuote}
                  </p>
                </div>

                {/* Meteorology Effect */}
                <div className="space-y-space-1">
                  <span className="text-[10px] text-brass-lt font-kufi font-bold block">التأثير البيئي والمناخي في نجد:</span>
                  <p className="text-xs text-sand-dim leading-relaxed font-serif font-semibold">{activeStar.meteorology}</p>
                </div>

                {/* Connection to Siyahin Clan */}
                <div className="border-t border-brass/10 pt-space-4 space-y-space-1.5">
                  <span className="text-[10px] text-brass-lt font-kufi font-bold block">الأهمية والارتباط بعوائل ومراعي السياحين:</span>
                  <p className="text-xs text-sand-dim leading-relaxed font-sans bg-ink-2/30 p-space-3 rounded-lg border border-brass/5">
                    {activeStar.siyahinConnection}
                  </p>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </Card>
  );
}
