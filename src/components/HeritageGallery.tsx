import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, MapPin, Compass, Globe, Type } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';

interface GalleryItem {
  id: number;
  locationId?: string; // Links directly to the InteractiveMap location id
  title: string;
  category: 'settlements' | 'wells' | 'regions';
  categoryLabel: string;
  imgUrl: string;
  satelliteUrl: string; // Real satellite/map layout image
  coords?: string; // Coordinates to display on card
  description: string;
  story: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 2,
    locationId: 'jathum',
    title: 'هجرة الجثوم (عالية نجد)',
    category: 'settlements',
    categoryLabel: 'الهجر والبلدات القديمة',
    imgUrl: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80',
    satelliteUrl: 'https://images.unsplash.com/photo-1547989453-11e67ffb3885?auto=format&fit=crop&w=1200&q=80',
    coords: '24.5822° N, 44.6053° E',
    description: 'أولى هجر السياحين في نجد، وتتميز بوقوعها في حضن جبل الجثوم الأسود العظيم الشامخ على يمينها.',
    story: 'تأسست هجرة الجثوم التاريخية في عالية نجد على يد الشيخ فرج بن مسيلم السيحاني، لتكون أولى ديار واستقرار قبيلة السياحين في نجد. تظهر معالم الهجرة الفريدة؛ حيث تحتضن الهجرة جبل الجثوم الأسود العظيم الشامخ على الجهة اليمنى، وتتوزع بيوتها الطينية والحديثة البسيطة على رمال نجد الذهبية، ويقطعها طريق إسفلتي ممتد يعبر بالزائرين إلى معقل الأصالة والكرامة التاريخية للقبيلة. وقد ورد ذكرها في المصادر المعجمية والموسوعية المعتمدة كـ«معجم عالية نجد» لسعد الجنيدل كمعقل رئيسي وهجرة عامرة، وما زالت الجثوم تحتفظ برمزيتها التراثية العميقة كمنطلق للاستقرار والتحضر المعاصر.'
  },
  {
    id: 4,
    locationId: 'rahat',
    title: 'وادي رهاط الأثري بالحجاز',
    category: 'regions',
    categoryLabel: 'الأقاليم والأراضي التاريخية',
    imgUrl: 'https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?auto=format&fit=crop&w=1200&q=80',
    satelliteUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // Volcanic canyon aerial rugged mountains
    coords: '22.0125° N, 39.8114° E',
    description: 'الموطن الحجازي القديم شمال شرق مكة المكرمة الذي يمثل جذور القبيلة الحجازية.',
    story: 'يقع وادي رهاط العتيق في منطقة الحجاز، وهو من المناهل والبلدات القديمة جداً التي سكنتها فروع قبيلة السياحين قبل امتدادها الواسع صوب هضاب نجد. يمثل رهاط حلقة الوصل التاريخية والاجتماعية التي تربط فروع السياحين الحجازية بنجد، ويسجل الجذور الأولى للقبيلة مع فروع روقة الحجاز وبيئتهم الجبلية والزراعية العتيقة.'
  },
  {
    id: 5,
    locationId: 'aliyat-najd',
    title: 'عالية نجد (مواطن ورعي القبيلة)',
    category: 'regions',
    categoryLabel: 'الأقاليم والأراضي التاريخية',
    imgUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
    satelliteUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', // Plateau aerial view
    coords: 'المنطقة الوسطى، عالية نجد',
    description: 'المدى الرعوي الشاسع الذي شهد وقائع القبيلة التاريخية ونزل بيوت الشعر لفرسانها.',
    story: 'تمثل عالية نجد المسرح الجغرافي الأوسع لغالبية قبيلة السياحين وفروع الروقة من عتيبة. هذه السهول والمراعي الشاسعة شهدت معارك تاريخية وبها تركزت حركة الروقة ومضارب خيامهم ومراعي إبلهم، وهي البيئة التي استلهم منها شعراء القبيلة قصائدهم العتيقة، ووثق فيها المستشرق ماكس فون أوبنهايم جداول القبيلة وقياس نزل البادية.'
  }
];

export default function HeritageGallery() {
  const [filter, setFilter] = useState<'all' | 'settlements' | 'wells' | 'regions'>('all');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [modalFontSize, setModalFontSize] = useState<'normal' | 'large' | 'huge'>('normal');

  const filteredItems = filter === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === filter);

  const openLightbox = (id: number) => {
    const index = GALLERY_ITEMS.findIndex(item => item.id === id);
    if (index !== -1) {
      setActiveItemIndex(index);
    }
  };

  const closeLightbox = () => {
    setActiveItemIndex(null);
  };

  const handlePrev = () => {
    if (activeItemIndex !== null) {
      const newIndex = activeItemIndex === 0 ? GALLERY_ITEMS.length - 1 : activeItemIndex - 1;
      setActiveItemIndex(newIndex);
    }
  };

  const handleNext = () => {
    if (activeItemIndex !== null) {
      const newIndex = activeItemIndex === GALLERY_ITEMS.length - 1 ? 0 : activeItemIndex + 1;
      setActiveItemIndex(newIndex);
    }
  };

  const handleLocateOnMap = (e: React.MouseEvent, locationId: string) => {
    e.stopPropagation(); // Prevent opening lightbox
    const event = new CustomEvent('select-map-location', { detail: { id: locationId } });
    window.dispatchEvent(event);
  };

  const currentItem = activeItemIndex !== null ? GALLERY_ITEMS[activeItemIndex] : null;

  return (
    <div className="space-y-space-10 text-right" dir="rtl">
      {/* Informative Header / Card */}
      <Card hoverGlow={false} className="bg-ink-2/30 border border-brass/10 rounded-2xl p-space-5 flex flex-col md:flex-row items-center justify-between gap-space-4">
        <div className="flex items-center gap-space-3">
          <div className="w-10 h-10 rounded-xl bg-brass/10 border border-brass/20 flex items-center justify-center text-brass-lt">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-serif text-lg text-sand font-bold">تصفح الديار المدمج مع الخرائط</h4>
            <p className="text-xs text-sand-dim font-sans">تتكامل عناصر المعرض أدناه مباشرة مع خريطة الديار التفاعلية لتحديد المواقع وتصفحها بنظام الأقمار الصناعية.</p>
          </div>
        </div>
        <div className="text-xs text-brass-lt font-mono bg-brass/5 px-space-3 py-space-1.5 rounded-lg border border-brass/15">
          مستند إلى معجم عالية نجد التاريخي
        </div>
      </Card>

      {/* Gallery Tabs / Filters */}
      <div className="flex flex-wrap justify-center gap-space-2.5 max-w-2xl mx-auto">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          كل الديار والمواطن
        </Button>
        <Button
          variant={filter === 'settlements' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('settlements')}
        >
          الحواضر والبلدات
        </Button>
        <Button
          variant={filter === 'wells' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('wells')}
        >
          المناهل وموارد المياه
        </Button>
        <Button
          variant={filter === 'regions' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('regions')}
        >
          الأقاليم التاريخية
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            onClick={() => openLightbox(item.id)}
            className="group relative h-[310px] p-0 rounded-2xl overflow-hidden border border-brass/15 cursor-pointer bg-ink-2 shadow-glow-sm hover:shadow-glow-md hover:border-brass hover:-translate-y-1.5 transition-all duration-base text-right"
          >
            {/* Beautiful, authentic vector placeholder instead of images */}
            <div className="w-full h-full bg-gradient-to-br from-[#1f160d] via-[#110d07] to-ink flex flex-col items-center justify-center p-space-6 text-center relative overflow-hidden group-hover:from-[#2a1d0f] transition-all duration-base">
              {/* Decorative radial compass background pattern */}
              <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none scale-150">
                <Compass className="w-full h-full text-brass" />
              </div>
              <div className="absolute inset-4 border border-brass/10 rounded-xl pointer-events-none group-hover:border-brass/30 transition-colors duration-base" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brass/10 border border-brass/25 flex items-center justify-center text-brass-lt mb-space-4 group-hover:scale-110 transition-transform duration-base shadow-[0_0_15px_rgba(201,151,62,0.15)]">
                  <Compass className="w-6 h-6 text-brass-lt animate-pulse" />
                </div>
                <Badge variant="brass" showDot={true} className="mb-space-1">
                  {item.categoryLabel}
                </Badge>
                <h4 className="text-base font-serif font-bold text-sand mt-space-2 group-hover:text-brass-lt transition-colors">
                  {item.title}
                </h4>
                {item.coords && (
                  <span className="text-[10px] text-sand-dim/70 font-mono mt-space-2">
                    {item.coords}
                  </span>
                )}
              </div>
            </div>

            {/* Coordinates Overlay Badge */}
            {item.coords && (
              <div className="absolute top-4 right-4 bg-ink/80 backdrop-blur-md border border-brass/20 text-brass-lt font-mono text-[10px] px-space-2.5 py-space-1 rounded-lg z-10 flex items-center gap-space-1">
                <Compass className="w-3.5 h-3.5 text-brass" />
                {item.coords}
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent opacity-90 group-hover:via-ink/20 transition-all duration-base" />

            {/* Card Content */}
            <div className="absolute inset-x-0 bottom-0 p-space-5 flex flex-col justify-end text-right space-y-space-2">
              <Badge variant="brass" showDot={false} className="self-start">
                {item.categoryLabel}
              </Badge>
              <h4 className="text-lg md:text-xl font-serif text-sand font-bold tracking-wide group-hover:text-brass-lt transition-colors">
                {item.title}
              </h4>
              <p className="text-sand-dim text-xs leading-relaxed opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-[80px] transition-all duration-base overflow-hidden">
                {item.description}
              </p>

              <div className="flex items-center justify-between pt-space-1 border-t border-brass/5 mt-space-1">
                {item.locationId ? (
                  <button
                    onClick={(e) => handleLocateOnMap(e, item.locationId)}
                    className="text-[10px] bg-brass/10 hover:bg-brass/25 border border-brass/35 text-brass-lt font-semibold px-space-2.5 py-space-1 rounded-lg flex items-center gap-space-1 cursor-pointer transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-brass" />
                    تحديد على الخريطة
                  </button>
                ) : (
                  <span className="text-[9px] text-sand-dim/60 font-mono">موقع إقليمي عام</span>
                )}
                <span className="text-[10px] text-brass-lt/70 font-semibold group-hover:underline underline-offset-4 flex items-center gap-space-1.5">
                  قصة الموروث
                  <ChevronLeft className="w-3 h-3 group-hover:translate-x-[-3px] transition-transform" />
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      <Modal
        isOpen={activeItemIndex !== null}
        onClose={closeLightbox}
        size="xl"
      >
        {currentItem && (
          <div className="grid grid-cols-1 md:grid-cols-12 -m-space-6 h-full text-right" dir="rtl">
            {/* Left Column: Cartography Vector Block */}
            <div className="md:col-span-7 relative h-[250px] md:h-[480px] bg-[#0c0804] overflow-hidden flex flex-col items-center justify-center p-space-6 md:p-space-10 border-b md:border-b-0 md:border-l border-brass/10">
              {/* Large ambient glowing pattern */}
              <div className="absolute w-[300px] h-[300px] bg-brass/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="absolute inset-4 border border-brass/15 rounded-xl pointer-events-none" />
              <div className="absolute inset-5 border border-brass/5 rounded-lg pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-brass/10 border border-brass/35 flex items-center justify-center text-brass-lt mb-space-6 shadow-glow-sm">
                  <Globe className="w-8 h-8 text-brass-lt" />
                </div>
                
                <span className="font-kufi text-[10px] text-brass-lt/90 font-bold uppercase mb-space-2">
                  ✦ التوثيق الجغرافي للديار ✦
                </span>
                
                <h3 className="text-2xl md:text-3xl font-serif font-extrabold text-sand mt-space-2 mb-space-3">
                  {currentItem.title}
                </h3>
                
                {currentItem.coords && (
                  <div className="inline-flex items-center gap-space-2 bg-brass/10 border border-brass/25 px-space-4 py-space-1.5 rounded-full text-brass-lt font-mono text-xs shadow-inner">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>GPS: {currentItem.coords}</span>
                  </div>
                )}
                
                <p className="text-xs text-sand-dim/80 font-sans mt-space-4 max-w-[320px] leading-relaxed">
                  تم تثبيت الموقع والحدود الجغرافية رسمياً ليكون مرجعاً موثقاً ثابتاً لقبيلة السياحين في المخطوطات والخرائط التاريخية.
                </p>
              </div>
              
              {/* Image Navigation inside picture area */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-space-2 rounded-full bg-ink/75 text-sand hover:text-brass-lt border border-brass/10 hover:border-brass/40 transition-all cursor-pointer"
                aria-label="الصورة السابقة"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-space-2 rounded-full bg-ink/75 text-sand hover:text-brass-lt border border-brass/10 hover:border-brass/40 transition-all cursor-pointer"
                aria-label="الصورة التالية"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Right Column: Narrative Text */}
            <div className="md:col-span-5 p-space-6 md:p-space-8 flex flex-col justify-between text-right space-y-space-6 bg-ink-2">
              <div className="space-y-space-4">
                <Badge variant="brass" showDot={true}>
                  <Sparkles className="w-3.5 h-3.5 text-brass" />
                  {currentItem.categoryLabel}
                </Badge>
                <h3 className="text-2xl md:text-3xl font-serif text-sand font-bold">
                  {currentItem.title}
                </h3>
                <div className="w-12 h-1 bg-gradient-to-l from-brass to-transparent rounded" />

                {/* Font Size Selector Control Bar */}
                <div className="flex flex-col gap-space-2 bg-brass/5 border border-brass/10 rounded-xl p-space-3">
                  <span className="font-kufi text-[10px] text-brass-lt font-bold flex items-center gap-space-1">
                    <Type className="w-3.5 h-3.5 text-brass" />
                    أداة تعديل حجم الخط (لكبار السن والقرّاء):
                  </span>
                  <div className="flex items-center gap-space-1 bg-ink/50 p-space-1 rounded-lg border border-brass/10">
                    <button
                      onClick={() => setModalFontSize('normal')}
                      className={`flex-1 py-space-1 rounded text-[10px] font-bold font-sans transition-all cursor-pointer text-center ${
                        modalFontSize === 'normal'
                          ? 'bg-brass text-ink shadow-sm font-black'
                          : 'text-sand-dim hover:text-sand hover:bg-brass/5'
                      }`}
                    >
                      افتراضي
                    </button>
                    <button
                      onClick={() => setModalFontSize('large')}
                      className={`flex-1 py-space-1 rounded text-[10px] font-bold font-sans transition-all cursor-pointer text-center ${
                        modalFontSize === 'large'
                          ? 'bg-brass text-ink shadow-sm font-black'
                          : 'text-sand-dim hover:text-sand hover:bg-brass/5'
                      }`}
                    >
                      كبير (أ+)
                    </button>
                    <button
                      onClick={() => setModalFontSize('huge')}
                      className={`flex-1 py-space-1 rounded text-[10px] font-bold font-sans transition-all cursor-pointer text-center ${
                        modalFontSize === 'huge'
                          ? 'bg-brass text-ink shadow-sm font-black'
                          : 'text-sand-dim hover:text-sand hover:bg-brass/5'
                      }`}
                    >
                      كبير جداً (أ++)
                    </button>
                  </div>
                </div>
                
                {currentItem.coords && (
                  <div className="bg-brass/5 border border-brass/10 rounded-lg p-space-3 text-xs text-sand-dim font-sans flex items-center gap-space-2">
                    <Compass className="w-4 h-4 text-brass" />
                    <span>موقع مرخص ومثبت جغرافياً في عالية نجد بالرمز: {currentItem.coords}</span>
                  </div>
                )}

                <p className={`text-sand-dim leading-relaxed max-h-[180px] overflow-y-auto pr-space-1 transition-all ${
                  modalFontSize === 'normal' ? 'text-xs md:text-sm' :
                  modalFontSize === 'large' ? 'text-sm md:text-base' : 'text-base md:text-lg'
                }`}>
                  {currentItem.story}
                </p>
              </div>

              <div className="space-y-space-4 pt-space-4 border-t border-brass/10">
                {currentItem.locationId && (
                  <Button
                    onClick={(e) => {
                      handleLocateOnMap(e, currentItem.locationId);
                      closeLightbox();
                    }}
                    className="w-full"
                  >
                    <MapPin className="w-4 h-4" />
                    عرض على الخريطة المباشرة والتحليلات الجغرافية
                  </Button>
                )}

                <div className="flex items-center justify-between text-xs text-sand-dim">
                  <span>الديار {activeItemIndex + 1} من {GALLERY_ITEMS.length}</span>
                  <div className="flex gap-space-2">
                    <button
                      onClick={handlePrev}
                      className="p-space-1.5 rounded-lg border border-brass/10 hover:border-brass text-sand hover:text-brass-lt transition-colors cursor-pointer text-xs"
                    >
                      السابق
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-space-1.5 rounded-lg border border-brass/10 hover:border-brass text-sand hover:text-brass-lt transition-colors cursor-pointer text-xs"
                    >
                      التالي
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
