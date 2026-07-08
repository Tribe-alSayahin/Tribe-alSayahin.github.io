import React, { useState } from 'react';
import { Quote, Volume2, VolumeX, Compass, Award } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { POEMS_DATA, SIYAHIN_BRANCHES_DATA, GLOSSARY_TERMS } from './PoetryCouncil.data';
import { useCampfireSound } from './PoetryCouncil.hooks';
import { PoemCard } from './subcomponents/PoemCard';
import { BedouinDictionary } from './subcomponents/BedouinDictionary';
import { BranchPoetCard } from './subcomponents/BranchPoetCard';
import { PoemModal } from './subcomponents/PoemModal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export default function PoetryCouncil() {
  const [activePoemId, setActivePoemId] = useState<string>('ancients');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [activeBranchId, setActiveBranchId] = useState<string>('farahin');
  const [modalPoemId, setModalPoemId] = useState<string | null>(null);
  const [modalFontSize, setModalFontSize] = useState<'normal' | 'large' | 'huge'>('normal');

  const {
    isAmbientPlaying,
    ambientIntensity,
    setAmbientIntensity,
    toggleAmbientSound
  } = useCampfireSound();

  // Find active objects
  const activePoem = POEMS_DATA.find(p => p.id === activePoemId) || POEMS_DATA[0];
  const activeBranch = SIYAHIN_BRANCHES_DATA.find(b => b.id === activeBranchId) || SIYAHIN_BRANCHES_DATA[0];

  // Helper to split text by terms for highlight clicking
  const renderHighlightedHalf = (half: string) => {
    let elements: React.ReactNode[] = [];
    let currentText = half;

    // Search terms sorted by length to prevent partial replacements
    const terms = Object.keys(GLOSSARY_TERMS).sort((a, b) => b.length - a.length);
    let matched = true;

    while (matched) {
      matched = false;
      let earliestIndex = -1;
      let matchedTerm = '';

      for (const term of terms) {
        const index = currentText.indexOf(term);
        if (index !== -1 && (earliestIndex === -1 || index < earliestIndex)) {
          earliestIndex = index;
          matchedTerm = term;
          matched = true;
        }
      }

      if (matched && earliestIndex !== -1) {
        // Add text before match
        if (earliestIndex > 0) {
          elements.push(
            <span key={elements.length + '-txt'}>
              {currentText.slice(0, earliestIndex)}
            </span>
          );
        }

        // Add clickable term
        const isSelected = selectedWord === matchedTerm;
        elements.push(
          <button
            key={elements.length + '-term'}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedWord(matchedTerm);
            }}
            className={`inline-block mx-0.5 px-1.5 py-0.5 rounded text-xs md:text-sm font-bold border font-serif transition-all cursor-pointer ${
              isSelected
                ? 'bg-brass text-ink border-brass shadow-[0_0_10px_rgba(201,162,39,0.4)] scale-105'
                : 'bg-brass/5 border-brass/15 text-brass-lt hover:border-brass hover:bg-brass/15'
            }`}
          >
            {matchedTerm}
          </button>
        );

        currentText = currentText.slice(earliestIndex + matchedTerm.length);
      }
    }

    if (currentText.length > 0) {
      elements.push(<span key={elements.length + '-txt-end'}>{currentText}</span>);
    }

    return elements;
  };

  return (
    <div className="bg-gradient-to-br from-[#120c06] via-[#1a1107] to-ink border border-brass/20 rounded-3xl p-space-6 md:p-space-10 shadow-2xl relative overflow-hidden" id="diwan-poet">
      {/* Visual background aesthetics */}
      <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,89,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-brass/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-radial from-brass/5 to-transparent blur-3xl pointer-events-none" />

      {/* Decorative Sadu Border at Top and Bottom */}
      <div className="absolute top-0 inset-x-0 h-1 bg-repeat opacity-40" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '40px 4px' }} />
      <div className="absolute bottom-0 inset-x-0 h-1 bg-repeat opacity-40" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '40px 4px' }} />

      {/* Section Header */}
      <div className="text-right space-y-space-3 mb-space-10 border-b border-brass/10 pb-space-6 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-space-6 relative z-10">
        <div className="space-y-space-2">
          <Badge variant="brass" showDot={true} className="font-kufi text-xs px-space-3 py-space-1 bg-brass/10">
            الأدب والقصيد النبطي العتيق
          </Badge>
          <h3 className="text-2xl md:text-4xl font-serif text-sand font-bold tracking-wide">
            مجلس الشِّعْر النَّبطي والديوان التفاعلي
          </h3>
          <p className="text-xs md:text-sm text-sand-dim leading-relaxed max-w-3xl">
            تصفح ديواناً مختاراً من عيون قصائد الفخر النبطي والحكمة والمواعظ المرتبطة بإرث قبيلة <strong className="text-brass-lt">السياحين</strong> ومنازلهم وديارهم النجدية. اضغط على الكلمات المظلّلة لتفسيرها بالقاموس البدوي الموثّق.
          </p>
        </div>

        {/* Campfire Synthesizer Controller with live visual simulation */}
        <div className="flex flex-col items-end gap-space-2 shrink-0 self-stretch lg:self-auto bg-ink/40 border border-brass/15 p-space-4 rounded-2xl relative overflow-hidden group">
          {/* Campfire glow overlay */}
          {isAmbientPlaying && (
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/10 to-transparent pointer-events-none animate-pulse" />
          )}

          <div className="flex items-center gap-space-3">
            <span className="font-kufi text-[11px] text-sand-dim">شبّة نار البادية والمجلس (صوت مجسم):</span>
            <button
              onClick={toggleAmbientSound}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border cursor-pointer relative z-10 ${
                isAmbientPlaying
                  ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-[#0c0905] border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)] animate-[pulse_1.5s_infinite]'
                  : 'bg-ink border-brass/25 text-brass-lt hover:border-brass/50'
              }`}
              title={isAmbientPlaying ? 'إيقاف صوت شبة النار' : 'تشغيل صوت شبة النار'}
            >
              {isAmbientPlaying ? <Volume2 className="w-5 h-5 animate-bounce" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-space-2.5 w-full mt-space-2 relative z-10">
            <span className="text-[9px] font-mono opacity-60 text-sand-dim">قوة الصوت:</span>
            <input
              type="range"
              min="0.02"
              max="0.4"
              step="0.01"
              value={ambientIntensity}
              onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
              disabled={!isAmbientPlaying}
              className="w-24 h-1 bg-brass/20 rounded-lg appearance-none cursor-pointer accent-brass disabled:opacity-40"
            />
          </div>

          {/* Miniature flame visualizer */}
          {isAmbientPlaying && (
            <div className="flex justify-center gap-space-1.5 items-end h-5 mt-space-1.5 w-full">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-orange-600 to-amber-400 rounded-full"
                  style={{
                    height: `${20 + Math.random() * 80}%`,
                    animation: `float ${0.6 + i * 0.1}s ease-in-out infinite alternate`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Diwan Topics/Poems Grid Cards */}
      <p className="text-right text-xs font-kufi text-brass-lt/70 pr-space-1 mb-space-3 relative z-10">اختر موضوعاً أو قصيدة من الديوان التفاعلي للتصفح:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-6 mb-space-10 relative z-10" id="diwan-cards-grid">
        {POEMS_DATA.map((poem) => (
          <PoemCard
            key={poem.id}
            poem={poem}
            isSelected={activePoemId === poem.id}
            onSelect={() => {
              setActivePoemId(poem.id);
              setSelectedWord(null);
            }}
            onOpenModal={() => {
              setActivePoemId(poem.id);
              setSelectedWord(null);
              setModalPoemId(poem.id);
            }}
          />
        ))}
      </div>

      {/* Interactive Board layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-8 items-start relative z-10">
        
        {/* Left: Vintage Parchment Board for Selected Poetry */}
        <div className="lg:col-span-7 space-y-space-6">
          <div className="bg-gradient-to-b from-[#f9f5ec] via-[#f3eace] to-[#e7daaf] border-4 border-[#bca982] rounded-3xl p-space-6 md:p-space-8 text-amber-950 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Old page watermarks */}
            <div className="absolute inset-0 bg-repeat opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '60px 40px' }} />
            
            <div className="absolute top-space-4 left-space-4 text-center">
              <Quote className="w-12 h-12 text-amber-900/5 rotate-180 transform -scale-x-100" />
            </div>

            {/* Poem Metadata */}
            <div className="text-right border-b border-amber-950/20 pb-space-4 mb-space-6">
              <span className="font-kufi text-[10px] text-amber-900/60 bg-amber-950/5 border border-amber-950/10 px-3 py-1 rounded">
                المجلس الأدبي • {activePoem.categoryLabel}
              </span>
              <h4 className="text-xl md:text-2xl font-serif font-extrabold text-amber-900 mt-3 leading-tight">
                {activePoem.title}
              </h4>
              <p className="text-[10px] font-serif text-amber-800/80 leading-none mt-1">الراوي: {activePoem.author}</p>
            </div>

            {/* Poem Verses Visual Layout */}
            <div className="space-y-space-6 text-center font-serif py-space-2">
              {activePoem.verses.map((verse, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-space-4 items-center justify-center leading-relaxed">
                  {/* First half (الصدر) */}
                  <div className="md:col-span-5 text-right font-serif text-sm md:text-base font-bold text-amber-950 tracking-wide">
                    {renderHighlightedHalf(verse.firstHalf)}
                  </div>
                  
                  {/* Decorative separator */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-800 rotate-45 border border-[#ab9971]" />
                    <span className="w-8 h-[1px] bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />
                    <span className="w-2.5 h-2.5 rounded-full bg-red-800 rotate-45 border border-[#ab9971]" />
                  </div>

                  {/* Second half (العجز) */}
                  <div className="md:col-span-5 text-left md:text-right font-serif text-sm md:text-base font-bold text-amber-950 tracking-wide pr-0 md:pr-4">
                    {renderHighlightedHalf(verse.secondHalf)}
                  </div>
                </div>
              ))}
            </div>

            {/* Footnote Context */}
            <div className="border-t border-amber-950/15 pt-space-4 mt-space-6 text-right">
              <span className="font-kufi text-[10px] text-amber-900/60 block">سياق القصيدة التراثية:</span>
              <p className="font-serif text-xs leading-relaxed text-amber-950/80 font-semibold italic mt-1">
                {activePoem.context}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Interactive Bedouin Dictionary Cards */}
        <BedouinDictionary
          selectedWord={selectedWord}
          glossaryTerms={GLOSSARY_TERMS}
          onClearSelection={() => setSelectedWord(null)}
        />

      </div>

      {/* NEW SECTION: Siyahin Branches & Poets Encyclopedia */}
      <div className="mt-space-14 pt-space-10 border-t border-brass/15 space-y-space-8 relative z-10" id="siyahin-branches-encyclopedia">
        {/* Header */}
        <div className="text-right space-y-space-2">
          <Badge variant="brass" showDot={true} className="font-kufi text-xs px-space-3 py-space-1 bg-brass/10">
            <Compass className="w-3.5 h-3.5 inline mr-space-1" />
            مستند الأنساب وشعراء الفروع
          </Badge>
          <h3 className="text-xl md:text-3xl font-serif text-sand font-bold tracking-wide">
            موسوعة شعراء قبيلة السياحين (حسب الفروع والفخوذ)
          </h3>
          <p className="text-xs md:text-sm text-sand-dim leading-relaxed max-w-4xl">
            تاريخ شفهي معزز بالتوثيق؛ استكشف الفروع والفخوذ الرئيسية لقبيلة <strong className="text-brass-lt">السياحين</strong> من الروقة من عتيبة الهيلا، وتعرف على شعراء كل فرع عبر الأجيال مع نماذج خالدة من قصائدهم الجزلة.
          </p>
        </div>

        {/* Branch Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-space-2 border-b border-brass/10 pb-space-6">
          {SIYAHIN_BRANCHES_DATA.map((branch) => {
            const isSelected = activeBranchId === branch.id;
            return (
              <Button
                key={branch.id}
                variant={isSelected ? "primary" : "secondary"}
                onClick={() => setActiveBranchId(branch.id)}
                className="px-space-4 py-space-2.5 h-auto font-kufi font-bold text-xs md:text-sm"
              >
                {branch.name} ({branch.poets.length} {branch.poets.length === 1 ? 'شاهد' : 'شواهد'})
              </Button>
            );
          })}
        </div>

        {/* Selected Branch Details */}
        <div className="bg-ink-2/60 border border-brass/10 p-space-6 rounded-3xl text-right space-y-space-4">
          <div className="space-y-space-1">
            <span className="text-[10px] text-brass-lt font-kufi">تعريف بالفرع والفخذ:</span>
            <h4 className="text-lg md:text-xl font-serif font-bold text-sand">{activeBranch.name}</h4>
          </div>
          <p className="text-xs md:text-sm text-sand-dim leading-relaxed font-sans max-w-3xl">
            {activeBranch.description}
          </p>
        </div>

        {/* Branch Poets Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-6 items-stretch">
          <AnimatePresence mode="popLayout">
            {activeBranch.poets.map((poet, index) => (
              <BranchPoetCard
                key={poet.name}
                poet={poet}
                index={index}
                activeBranchName={activeBranch.name}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Full Poem / Topic Popup Modal */}
      <PoemModal
        modalPoemId={modalPoemId}
        poems={POEMS_DATA}
        modalFontSize={modalFontSize}
        setModalFontSize={setModalFontSize}
        onClose={() => setModalPoemId(null)}
        renderHighlightedHalf={renderHighlightedHalf}
        selectedWord={selectedWord}
        setSelectedWord={setSelectedWord}
        glossaryTerms={GLOSSARY_TERMS}
      />

    </div>
  );
}
