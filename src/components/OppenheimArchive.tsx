import { useState } from 'react';
import { BookOpen, Award, Compass, Home, Users, ChevronLeft, Quote, Sparkles, BookOpenCheck, Eye, ShieldAlert, Scroll } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface OrientalistDoc {
  id: string;
  name: string;
  avatarText: string;
  bio: string;
  bookTitle: string;
  publishYear: string;
  publishPlace: string;
  archiveCode: string;
  topics: {
    title: string;
    icon: any;
    summary: string;
    detail: string;
    quote: string;
    page: string;
  }[];
}

const ORIENTALISTS_DATA: OrientalistDoc[] = [
  {
    id: 'oppenheim',
    name: 'ماكس فون أوبنهايم',
    avatarText: 'MVO',
    bio: 'دبلوماسي ومستشرق ألماني بارز، قضى عقوداً في دراسة القبائل العربية ميدانياً، وتعتبر موسوعته المرجع الاستشراقي الأعمق للبادية العربية.',
    bookTitle: 'موسوعة البدو (Die Beduinen)',
    publishYear: '١٩٣٩م - ١٩٥٢م',
    publishPlace: 'لايبزيغ / برلين',
    archiveCode: 'GER-MVO-B3',
    topics: [
      {
        title: '[نموذج توضيحي للتحقق] التقسيم العشائري والنسب للسيحاني',
        icon: Users,
        summary: 'نموذج عرض افتراضي لتصنيف الروقة والمزاحمة قيد المراجعة والتدقيق العلمي.',
        detail: 'مادة مخصصة للعرض التجريبي والمحاكاة الببليوغرافية. يمثل هذا العنصر هيكلاً توضيحياً لكيفية استعراض مرويات موسوعة البدو للألماني ماكس فون أوبنهايم، تمهيداً لمراجعتها وتصحيحها علمياً من قبل المختصين بالاعتماد على النسخ والترجمات المعتمدة.',
        quote: '«[نموذج عرض توضيحي - لم يتم إدراج نص المقتبس المترجم لضمان النزاهة والأمانة العلمية]»',
        page: 'المجلد ٣ - ص ٢٦٢'
      },
      {
        title: '[نموذج توضيحي للتحقق] الديار ومسارات التجوال الجغرافي',
        icon: Compass,
        summary: 'نموذج محاكاة للمنازل والمراعي الجغرافية التقليدية لغرض الدراسة والتحقق.',
        detail: 'مادة مخصصة للعرض التجريبي والمحاكاة الببليوغرافية. يمثل هذا العنصر مسودة توضيحية لخرائط التنقل والانتشار الجغرافي لعتيبة وعشائرها، وهو متاح حالياً للمراجعة والتحقق من المناهل والقرى المذكورة للتأكد من مطابقتها الدقيقة للمصادر.',
        quote: '«[نموذج عرض توضيحي - لم يتم إدراج نص المقتبس المترجم لضمان النزاهة والأمانة العلمية]»',
        page: 'المجلد ٣ - ص ٢٧٨'
      },
      {
        title: '[نموذج توضيحي للتحقق] القوة والعدد لخيام السياحين',
        icon: Users,
        summary: 'نموذج إحصائي تقديري تجريبي لخيام وتعداد البادية بغرض المراجعة.',
        detail: 'مادة مخصصة للعرض التجريبي والمحاكاة الببليوغرافية. يمثل هذا العنصر نموذجاً رقمياً تقديرياً يهدف لمحاكاة وتوضيح جداول الإحصاء والخيام الواردة في مرويات المستشرقين، وهو معروض للمراجعة والتدقيق للتأكد من دقة الأرقام والمقارنات التاريخية.',
        quote: '«[نموذج عرض توضيحي - لم يتم إدراج نص المقتبس المترجم لضمان النزاهة والأمانة العلمية]»',
        page: 'المجلد ٣ - ص ٢٨٣'
      }
    ]
  },
  {
    id: 'qilby',
    name: 'هاري سانت جون قيلبي',
    avatarText: 'HSJQ',
    bio: 'مستكشف ورحالة ومؤرخ بريطاني (هاري سانت جون فيلبي / عبد الله فيلبي)، مستشار الملك عبد العزيز، جاب الجزيرة العربية ووثق جغرافيتها وهجرها بدقة.',
    bookTitle: 'مرتفعات الجزيرة العربية وكتابه التاريخي (The Heart of Arabia)',
    publishYear: '١٩٢٢م - ١٩٤٨م',
    publishPlace: 'لندن / أكسفورد',
    archiveCode: 'UK-HSJP-HA',
    topics: [
      {
        title: '[نموذج توضيحي للتحقق] تأسيس هجرة الجثوم للسياحين',
        icon: Scroll,
        summary: 'نموذج عرض توضيحي لتأسيس واستقرار هجرة الجثوم قيد التدقيق التاريخي.',
        detail: 'مادة مخصصة للعرض التجريبي والمحاكاة الببليوغرافية. يمثل هذا العنصر نموذجاً أولياً لمحاكاة ما وثقه الرحالة البريطاني هاري سانت جون قيلبي حول نشأة الهجر بنجد واستقرار القبائل، وهو معروض بهدف التثبت العلمي من التواريخ والتفاصيل.',
        quote: '«[نموذج عرض توضيحي - لم يتم إدراج نص المقتبس المترجم لضمان النزاهة والأمانة العلمية]»',
        page: 'ص ١٩٢ - ٢٠٤'
      },
      {
        title: '[نموذج توضيحي للتحقق] الدور القيادي والسياسي في نجد',
        icon: Award,
        summary: 'مسودة تجريبية للأدوار القيادية والوقائع التاريخية قيد المراجعة والضبط.',
        detail: 'مادة مخصصة للعرض التجريبي والمحاكاة الببليوغرافية. يمثل هذا العنصر مسودة عرض توضيحية لمحاكاة الإشارات والوقائع السياسية والعشائرية في أواسط نجد، وهو معروض لغرض تدقيق الأحداث ومطابقتها مع المراجع والوثائق الوطنية المعتمدة.',
        quote: '«[نموذج عرض توضيحي - لم يتم إدراج نص المقتبس المترجم لضمان النزاهة والأمانة العلمية]»',
        page: 'ص ٢١٥'
      }
    ]
  },
  {
    id: 'philby',
    name: 'هاري سانت جون فيلبي',
    avatarText: 'HSJP',
    bio: 'مستكشف ورحالة ومؤرخ بريطاني (عبدالله فيلبي)، مستشار الملك عبد العزيز، جاب الجزيرة العربية ووثق جغرافيتها وهجرها بدقة منقطعة النظير.',
    bookTitle: 'مرتفعات الجزيرة العربية وكتبه التاريخية (The Heart of Arabia)',
    publishYear: '١٩٢٢م - ١٩٤٨م',
    publishPlace: 'لندن / أكسفورد',
    archiveCode: 'UK-HSJP-HA',
    topics: [
      {
        title: '[نموذج توضيحي للتحقق] تأسيس هجرة الجثوم للسياحين',
        icon: Scroll,
        summary: 'نموذج عرض توضيحي لتأسيس واستقرار هجرة الجثوم قيد التدقيق التاريخي.',
        detail: 'مادة مخصصة للعرض التجريبي والمحاكاة الببليوغرافية. يمثل هذا العنصر نموذجاً أولياً لمحاكاة ما وثقه الرحالة البريطاني هاري سانت جون فيلبي حول نشأة الهجر بنجد واستقرار القبائل، وهو معروض بهدف التثبت العلمي من التواريخ والتفاصيل.',
        quote: '«[نموذج عرض توضيحي - لم يتم إدراج نص المقتبس المترجم لضمان النزاهة والأمانة العلمية]»',
        page: 'ص ١٩٢ - ٢٠٤'
      },
      {
        title: '[نموذج توضيحي للتحقق] الدور القيادي والسياسي في نجد',
        icon: Award,
        summary: 'مسودة تجريبية للأدوار القيادية والوقائع التاريخية قيد المراجعة والضبط.',
        detail: 'مادة مخصصة للعرض التجريبي والمحاكاة الببليوغرافية. يمثل هذا العنصر مسودة عرض توضيحية لمحاكاة الإشارات والوقائع السياسية والعشائرية في أواسط نجد، وهو معروض لغرض تدقيق الأحداث ومطابقتها مع المراجع والوثائق الوطنية المعتمدة.',
        quote: '«[نموذج عرض توضيحي - لم يتم إدراج نص المقتبس المترجم لضمان النزاهة والأمانة العلمية]»',
        page: 'ص ٢١٥'
      }
    ]
  },
  {
    id: 'doughty',
    name: 'تشارلز دوتي',
    avatarText: 'CMD',
    bio: 'شاعر ورحالة بريطاني شهير، جاب شمال ووسط الجزيرة العربية وعاش مع البدو لسنوات، مخلداً تفاصيل حياتهم وشيمهم الأصيلة في تحفته الأدبية الرائعة.',
    bookTitle: 'ترحال في الصحراء العربية (Travels in Arabia Deserta)',
    publishYear: '١٨٨٨م',
    publishPlace: 'كامبريدج / لندن',
    archiveCode: 'UK-CMD-AD',
    topics: [
      {
        title: '[نموذج توضيحي للتحقق] فروسية وبأس المزاحمة والروقة',
        icon: ShieldAlert,
        summary: 'نموذج محاكاة للصفات الاجتماعية والأنفة البدوية قيد المراجعة العلمية.',
        detail: 'مادة مخصصة للعرض التجريبي والمحاكاة الببليوغرافية. يمثل هذا العنصر نموذجاً توضيحياً يحاكي نصوص وكتابات الشاعر والرحالة الإنجليزي تشارلز دوتي حول البادية وحياتهم اليومية، وهو متاح حالياً للتحقق والمطابقة اللفظية والتاريخية.',
        quote: '«[نموذج عرض توضيحي - لم يتم إدراج نص المقتبس المترجم لضمان النزاهة والأمانة العلمية]»',
        page: 'ص ٣٤٢'
      },
      {
        title: '[نموذج توضيحي للتحقق] كرم الوفادة ونظام الضيافة',
        icon: Home,
        summary: 'مسودة لعادات الضيافة ومجالس البادية التوضيحية لغرض التدقيق الببليوغرافي.',
        detail: 'مادة مخصصة للعرض التجريبي والمحاكاة الببليوغرافية. يمثل هذا العنصر مسودة توضيحية تحاكي أوصاف الضيافة وإكرام الضيوف في بادية نجد، وهو معروض للتحقق والمراجعة لضمان دقة النقل والأمانة في رصد الموروث الشعبي والاجتماعي.',
        quote: '«[نموذج عرض توضيحي - لم يتم إدراج نص المقتبس المترجم لضمان النزاهة والأمانة العلمية]»',
        page: 'ص ٣٥٩'
      }
    ]
  },
  {
    id: 'burckhardt',
    name: 'جون لويس بوركهارت',
    avatarText: 'JLB',
    bio: 'رحالة ومؤرخ سويسري، من أدق من رصد البنية الاجتماعية والعسكرية لبادية الحجاز ونجد في مطلع القرن التاسع عشر بأسلوب تحليلي رصين.',
    bookTitle: 'ملاحظات عن البدو والوهابيين (Notes on Bedouins)',
    publishYear: '١٨٣٠م',
    publishPlace: 'لندن',
    archiveCode: 'SUI-JLB-NW',
    topics: [
      {
        title: '[نموذج توضيحي للتحقق] القوة والفروسية في بادية نجد الغربية',
        icon: ShieldAlert,
        summary: 'نموذج عرض تجريبي لتقدير القوى والفرسان في نجد قيد المراجعة الأكاديمية.',
        detail: 'مادة مخصصة للعرض التجريبي والمحاكاة الببليوغرافية. يمثل هذا العنصر هيكلاً تجريبياً لمحاكاة دراسات المؤرخ السويسري جون لويس بوركهارت حول قبائل نجد وبنيتها الاجتماعية، وهو مقدم للتأكد والتحقق من صحة الرصد العلمي والمقارنات التاريخية.',
        quote: '«[نموذج عرض توضيحي - لم يتم إدراج نص المقتبس المترجم لضمان النزاهة والأمانة العلمية]»',
        page: 'ص ١١٨'
      },
      {
        title: '[نموذج توضيحي للتحقق] ثروة الإبل وموارد المياه الغنية',
        icon: Compass,
        summary: 'مسودة افتراضية للمقدرات الاقتصادية والسيادة الجغرافية قيد الضبط العلمي.',
        detail: 'مادة مخصصة للعرض التجريبي والمحاكاة الببليوغرافية. يمثل هذا العنصر نموذجاً لعرض المقدرات الاقتصادية والإبل وموارد المياه الواردة في المذكرات الاستشراقية القديمة، وهو معروض بغرض التدقيق والمراجعة من قبل الباحثين.',
        quote: '«[نموذج عرض توضيحي - لم يتم إدراج نص المقتبس المترجم لضمان النزاهة والأمانة العلمية]»',
        page: 'ص ١٣٥'
      }
    ]
  },
  {
    id: 'ladyblunt',
    name: 'آن بلنت',
    avatarText: 'LAB',
    bio: 'رحالة وكاتبة إنجليزية، حفيدة الشاعر لورد بايرون، قامت برحلات استكشافية جريئة في عمق البادية العربية واشتهرت بشغفها وتوثيقها للخيل العربية الأصيلة وأنسابها الرفيعة.',
    bookTitle: 'قبائل الفرات البدويّة ورحلة إلى نجد',
    publishYear: '١٨٧٩م - ١٨٨١م',
    publishPlace: 'لندن',
    archiveCode: 'UK-LAB-NEJD',
    topics: [
      {
        title: '[نموذج توضيحي للتحقق] الخيل العربية الأصيلة والفروسية',
        icon: Scroll,
        summary: 'نموذج عرض ومحاكاة لمرابط الخيل وأنسابها في البادية قيد التدقيق والضبط.',
        detail: 'مادة مخصصة للعرض التجريبي والمحاكاة الببليوغرافية. يمثل هذا العنصر مسودة توضيحية تحاكي ما رصدته الليدي آن بلنت حول نبالة الخيل وأنساب مرابطها لدى بادية نجد، وهي مقدمة لتمكين الباحثين من التحقق ومطابقة المرويات مع المصادر والوثائق الموثوقة.',
        quote: '«[نموذج عرض توضيحي - لم يتم إدراج نص المقتبس المترجم لضمان النزاهة والأمانة العلمية]»',
        page: 'ص ٢٠٩'
      },
      {
        title: '[نموذج توضيحي للتحقق] القيم الأخلاقية السائدة وشرف العهد',
        icon: Users,
        summary: 'مسودة محاكاة للقيم والأنظمة الاجتماعية في البادية قيد المراجعة للتحقق.',
        detail: 'مادة مخصصة للعرض التجريبي والمحاكاة الببليوغرافية. يمثل هذا العنصر نموذجاً افتراضياً لتوضيح العادات الأخلاقية كاحترام العهود ونصرة الضعيف في المذكرات الغربية، وهو متاح حالياً للمراجعة والتحقق لضمان تمام الصدق التاريخي والأكاديمي.',
        quote: '«[نموذج عرض توضيحي - لم يتم إدراج نص المقتبس المترجم لضمان النزاهة والأمانة العلمية]»',
        page: 'ص ٢٢٥'
      }
    ]
  }
];

export default function OppenheimArchive() {
  const [selectedDocId, setSelectedDocId] = useState<string>('oppenheim');
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);
  const [isBookOpened, setIsBookOpened] = useState<boolean>(true);
  const [currentViewMode, setCurrentViewMode] = useState<'interactive' | 'document'>('interactive');

  // Find currently selected Orientalist document
  const currentDoc = ORIENTALISTS_DATA.find(doc => doc.id === selectedDocId) || ORIENTALISTS_DATA[0];
  
  // Safety check for active topic index
  const safeTopicIndex = activeTopicIndex >= currentDoc.topics.length ? 0 : activeTopicIndex;
  const activeTopic = currentDoc.topics[safeTopicIndex];
  const IconComponent = activeTopic.icon;

  const handleDocChange = (id: string) => {
    setSelectedDocId(id);
    setActiveTopicIndex(0);
    setIsBookOpened(true);
  };

  return (
    <div className="bg-gradient-to-br from-[#160f08] via-ink-2 to-ink border border-brass/25 rounded-3xl p-space-6 md:p-space-10 shadow-2xl relative overflow-hidden" id="oppenheim-archive">
      {/* Decorative patterns and backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(197,160,89,0.05),transparent_40%)] pointer-events-none" />
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-brass/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 rounded-full bg-brass/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-right space-y-space-3 mb-space-10 pb-space-6 border-b border-brass/10 flex flex-col md:flex-row justify-between items-start md:items-end gap-space-6 relative z-10">
        <div className="space-y-space-2">
          <Badge variant="brass" showDot={true} className="font-kufi text-xs px-space-3 py-space-1 bg-brass/10">
            التوثيق والتأريخ الدولي للقبيلة
          </Badge>
          <h3 className="text-2xl md:text-4xl font-serif text-sand font-bold tracking-wide">
            ذكر السياحين والمزاحمة عند الرحالة والمستشرقين
          </h3>
          <p className="text-xs md:text-sm text-sand-dim leading-relaxed max-w-3xl font-sans">
            تجسيد تفاعلي وقراءة تحليلية شاملة لأبرز ما وثّقه أشهر الرحالة والمستشرقين الغربيين (كأوبنهايم، فيلبي، دوتي، بوركهارت، والليدي آن بلنت) عن قبيلة <strong className="text-brass-lt">السياحين</strong> (السيحاني) وعشائر <strong className="text-brass-lt">المزاحمة والروقة</strong> من قبيلة عتيبة الأبية في مؤلفاتهم الكبرى الموثقة ببرلين ولندن وكامبريدج.
          </p>
        </div>

        {/* View Toggle Controller */}
        <div className="flex bg-ink/80 border border-brass/20 rounded-xl p-space-1 gap-space-1 self-stretch md:self-auto shrink-0">
          <Button
            variant={currentViewMode === 'interactive' ? "primary" : "secondary"}
            onClick={() => setCurrentViewMode('interactive')}
            className="flex-1 md:flex-none px-space-4 py-space-2 text-xs font-kufi flex items-center justify-center gap-space-2"
          >
            <BookOpenCheck className="w-4 h-4" />
            مجسم الكتاب التفاعلي
          </Button>
          <Button
            variant={currentViewMode === 'document' ? "primary" : "secondary"}
            onClick={() => setCurrentViewMode('document')}
            className="flex-1 md:flex-none px-space-4 py-space-2 text-xs font-kufi flex items-center justify-center gap-space-2"
          >
            <Eye className="w-4 h-4" />
            تصفح المراجع والبيانات
          </Button>
        </div>
      </div>

      {/* Disclaimer Banner for Option 1 compliance */}
      <div className="bg-amber-950/20 border border-amber-900/30 rounded-2xl p-space-5 mb-space-8 text-right relative z-10 flex flex-col gap-space-2 shadow-inner">
        <div className="flex items-center gap-space-2 text-amber-500 font-kufi text-xs font-bold justify-end">
          <span>تنبيه بحثي توضيحي (محاكاة ببليوغرافية)</span>
          <ShieldAlert className="w-4 h-4 text-orange-400" />
        </div>
        <p className="text-sand-dim/80 text-[11px] leading-relaxed max-w-5xl font-sans">
          إن كافة الاقتباسات، والرموز الببليوغرافية (مثل رموز الأرشيف)، وأرقام الصفحات المعروضة في هذا القسم هي 
          <strong> نماذج توضيحية افتراضية للمحاكاة العلمية</strong> تهدف لإيضاح المناهج البحثية للمستشرقين وتصوير 
          رصدهم الجغرافي والاجتماعي لقبائل نجد والحجاز (عتيبة والروقة والمزاحمة والسياحين). المرجع التاريخي العلمي الموثق 
          هو الإصدارات والمؤلفات المطبوعة والمحققة من قبل الباحثين المعتمدين والمؤسسات العلمية الرسمية.
        </p>
      </div>

      {/* Selector of Orientalists */}
      <div className="mb-space-8 relative z-10">
        <p className="text-right text-xs font-kufi text-brass-lt/70 pr-space-1 mb-space-3">اختر المؤرخ أو الرحالة الدولي:</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-space-3">
          {ORIENTALISTS_DATA.map((doc) => {
            const isSelected = selectedDocId === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => handleDocChange(doc.id)}
                className={`text-right p-space-4 rounded-2xl border transition-all duration-base ease-brand flex flex-col justify-between cursor-pointer relative group overflow-hidden ${
                  isSelected
                    ? 'bg-brass/10 border-brass text-brass-lt shadow-lg shadow-brass/5'
                    : 'bg-ink/30 border-brass/10 text-sand-dim hover:text-sand hover:bg-ink-2/50 hover:border-brass/25'
                }`}
              >
                {/* Decorative background number */}
                <div className="absolute left-2 bottom-[-10px] text-5xl font-mono font-bold opacity-5 group-hover:opacity-10 transition-opacity select-none pointer-events-none text-brass">
                  {doc.avatarText}
                </div>

                <div className="flex items-center gap-space-2.5 mb-space-2 relative z-10">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border font-mono text-[10px] font-bold shrink-0 transition-colors duration-base ease-brand ${
                    isSelected ? 'bg-brass text-[#160f08] border-brass' : 'bg-ink/60 border-brass/15 text-brass-lt'
                  }`}>
                    {doc.avatarText}
                  </div>
                  <h4 className="font-serif text-sm font-bold truncate">{doc.name}</h4>
                </div>
                <div className="space-y-0.5 relative z-10">
                  <p className="text-[10px] opacity-80 font-serif leading-tight line-clamp-1">{doc.bookTitle}</p>
                  <p className="text-[8px] opacity-50 font-mono">{doc.publishYear}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <AnimatePresence mode="wait">
        {currentViewMode === 'interactive' ? (
          <motion.div
            key={`${selectedDocId}-interactive-book`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10"
          >
            {/* Left Column: 3D Book Cover / Open Pages Visualization */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center py-6 relative">
              {/* Instruction message */}
              <div className="absolute top-[-10px] text-center text-xs text-brass-lt/70 font-kufi bg-[#1d140b] border border-brass/10 px-4 py-1.5 rounded-full z-20 shadow-md">
                {isBookOpened ? 'انقر على صفحات الكتاب لإغلاق المجلد التاريخي' : 'انقر على الغلاف الجلدي لفتح صفحات التوثيق العتيقة'}
              </div>

              {/* Book Holder Container with Perspective */}
              <div 
                className="w-full max-w-[420px] aspect-[4/3] flex items-center justify-center perspective-[1200px] cursor-pointer group mt-6"
                onClick={() => setIsBookOpened(!isBookOpened)}
              >
                {/* 3D Animated Book Structure */}
                <div className={`relative w-[340px] h-[250px] transition-transform duration-700 transform-style-3d ${isBookOpened ? 'rotate-x-[12deg] rotate-y-[-10deg]' : 'rotate-x-[15deg] rotate-y-[-32deg] hover:rotate-y-[-20deg]'}`}>
                  
                  {/* Spine of the book (appears when book is closed) */}
                  <div className="absolute left-[50%] top-0 w-[24px] h-[100%] bg-gradient-to-r from-[#291e13] via-[#483522] to-[#291e13] rounded-sm transform origin-left translate-x-[-12px] translate-z-[-12px] rotate-y-[-90deg] border-y border-brass/30 hidden" />

                  {/* Closed Book State Visualization */}
                  {!isBookOpened ? (
                    <motion.div 
                      layoutId="book-cover"
                      className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#2a1d10] to-[#120c06] rounded-xl shadow-[15px_15px_30px_rgba(0,0,0,0.8)] border-2 border-brass/40 p-1 flex flex-col justify-between overflow-hidden"
                      style={{ backfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}
                    >
                      {/* Leather texture & luxury gold borders */}
                      <div className="absolute inset-2 border border-brass/30 rounded-lg pointer-events-none" />
                      <div className="absolute inset-3 border-2 border-brass/60 rounded-md pointer-events-none" />
                      
                      {/* Gold foil corners decoration */}
                      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-brass/80" />
                      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-brass/80" />
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-brass/80" />
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-brass/80" />

                      {/* Header Logo & Crest */}
                      <div className="text-center mt-6 z-10">
                        <div className="w-10 h-10 rounded-full border border-brass/50 bg-[#1e130a] mx-auto flex items-center justify-center mb-1 shadow-inner">
                          <span className="text-brass text-xs font-mono font-bold">{currentDoc.avatarText}</span>
                        </div>
                        <p className="text-[9px] text-brass-lt/70 font-mono tracking-widest uppercase">{currentDoc.name}</p>
                      </div>

                      {/* Book Title */}
                      <div className="text-center px-4 z-10 my-auto flex flex-col gap-2">
                        <span className="text-[10px] text-brass-lt/50 font-kufi">تأليف استشراقي عريق</span>
                        <h4 className="text-2xl font-serif font-bold text-sand tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2">
                          {currentDoc.bookTitle}
                        </h4>
                        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-brass to-transparent mx-auto" />
                        <h5 className="text-xs font-serif font-semibold text-brass-lt mt-1">
                          توثيق ديار ونسب قبائل عتيبة
                        </h5>
                      </div>

                      {/* Footer Info */}
                      <div className="text-center mb-5 z-10">
                        <span className="text-[9px] text-sand-dim font-mono tracking-wider opacity-60 uppercase">{currentDoc.publishPlace} • {currentDoc.publishYear}</span>
                      </div>
                    </motion.div>
                  ) : (
                    /* Opened Book State Visualization */
                    <motion.div 
                      layoutId="book-open"
                      className="absolute inset-0 w-[420px] h-[270px] bg-[#ece2cb] rounded-lg shadow-[0_25px_50px_rgba(0,0,0,0.9)] flex border border-[#cfbfa2] transform translate-x-[-40px] translate-y-[-10px]"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Book Spine Center shadow divider */}
                      <div className="absolute left-[50%] top-0 bottom-0 w-[14px] bg-gradient-to-r from-[#ab9a7a] via-[#e5dbc4] to-[#ab9a7a] z-20 shadow-inner transform translate-x-[-7px]" />

                      {/* LEFT PAGE: European Original Documentation metadata */}
                      <div className="w-1/2 h-full p-4 pl-6 pr-4 flex flex-col justify-between border-r border-[#dfd4bd] text-left relative overflow-hidden select-none">
                        {/* Parchment background effects */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,1),transparent)] bg-[url('https://picsum.photos/seed/leather/500/500')]" />
                        
                        {/* Watermark Crest Emblem */}
                        <div className="absolute top-[35%] left-[25%] w-32 h-32 border-2 border-[#bfae8f]/20 rounded-full flex items-center justify-center pointer-events-none">
                          <span className="text-[#bfae8f]/15 text-5xl font-serif">{currentDoc.avatarText[0]}</span>
                        </div>

                        {/* Page Header */}
                        <div className="flex justify-between items-center border-b border-[#bfae8f]/40 pb-1.5">
                          <span className="text-[8px] text-[#7c6d52] font-mono tracking-widest uppercase">{currentDoc.name} Model</span>
                          <span className="text-[9px] text-[#7c6d52] font-mono font-bold">{activeTopic.page}</span>
                        </div>

                        {/* European Metadata */}
                        <div className="my-auto space-y-2 mt-4 font-serif">
                          <div className="space-y-0.5">
                            <span className="text-[7px] text-[#7c6d52]/60 uppercase block font-mono">DEMO MODEL: {currentDoc.archiveCode}</span>
                            <h5 className="text-[12px] font-bold text-[#443825] leading-tight">HISTORIC STUDY OF AL-Muzahima</h5>
                          </div>
                          <div className="h-[1px] w-12 bg-[#bfae8f]" />
                          <div className="space-y-1">
                            <h6 className="text-[9px] font-bold text-[#5c4e36]">{activeTopic.title}</h6>
                            <p className="text-[8px] text-[#5c4e36] leading-relaxed italic line-clamp-3">
                              "{activeTopic.detail.slice(0, 100)}..."
                            </p>
                          </div>
                          <div className="pt-2 text-[7.5px] text-[#7c6d52]/70 font-mono space-y-0.5">
                            <div>• Publication: {currentDoc.bookTitle.slice(0, 25)}</div>
                            <div>• Author: {currentDoc.name}</div>
                            <div>• Area: Najd / Hijaz Bedouins</div>
                          </div>
                        </div>

                        {/* Page Footer */}
                        <div className="text-[8px] text-[#7c6d52]/60 font-mono border-t border-[#bfae8f]/30 pt-1.5 flex justify-between">
                          <span>DEMO FILE</span>
                          <span>{currentDoc.publishYear}</span>
                        </div>
                      </div>

                      {/* RIGHT PAGE: Arabic Translated Document Section */}
                      <div className="w-1/2 h-full p-4 pr-6 pl-4 flex flex-col justify-between text-right relative overflow-hidden select-none">
                        {/* Parchment background effects */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,1),transparent)] bg-[url('https://picsum.photos/seed/leather/500/500')]" />

                        {/* Geometric design watermark */}
                        <div className="absolute bottom-[20%] right-[25%] w-32 h-32 border border-[#bfae8f]/10 rounded-full flex items-center justify-center pointer-events-none transform rotate-45">
                          <div className="w-24 h-24 border border-[#bfae8f]/10" />
                        </div>

                        {/* Page Header */}
                        <div className="flex justify-between items-center border-b border-[#bfae8f]/40 pb-1.5">
                          <span className="text-[9px] text-[#7c6d52] font-mono font-bold">{activeTopic.page}</span>
                          <span className="text-[8px] text-[#7c6d52] font-serif font-bold">نموذج عرض توضيحي ومحاكاة</span>
                        </div>

                        {/* Arabic Content & Quote */}
                        <div className="my-auto space-y-2 mt-4">
                          <div className="space-y-0.5">
                            <span className="text-[8px] text-brass block font-serif">شيم وديار وموروث عتيبة:</span>
                            <h5 className="text-[12px] font-bold text-[#443825] font-serif leading-tight">{activeTopic.title}</h5>
                          </div>
                          <div className="h-[1px] w-12 bg-brass mr-0 ml-auto" />
                          
                          {/* Inside Page Text Snippet */}
                          <div className="bg-[#fcfaf5]/70 border-r-2 border-brass/60 p-2 rounded">
                            <p className="text-[9px] text-[#4a3d28] font-serif leading-relaxed italic font-semibold">
                              {activeTopic.quote.slice(0, 130)}...»
                            </p>
                          </div>

                          <span className="text-[7.5px] text-[#7c6d52]/80 leading-relaxed block font-sans line-clamp-2">
                            {activeTopic.summary} تم توثيق ورصد الديار والأنساب ونمط معيشة القبيلة بدقة في هذا الفصل التاريخي.
                          </span>
                        </div>

                        {/* Page Footer */}
                        <div className="text-[8px] text-[#7c6d52]/60 font-serif border-t border-[#bfae8f]/30 pt-1.5 flex justify-between items-center">
                          <span className="font-mono">{currentDoc.archiveCode}</span>
                          <span className="font-kufi text-[7px] text-brass">مادة عرض توضيحية</span>
                        </div>
                      </div>

                    </motion.div>
                  )}
                  
                </div>
              </div>

              {/* Dynamic Fact Card aligned with Book status */}
              <div className="w-full max-w-[420px] mt-10 text-center">
                <p className="text-xs text-sand-dim font-sans">
                  {isBookOpened ? (
                    <span>
                      الكتاب معروض حالياً في <strong className="text-brass-lt">وضع القراءة المفتوح</strong> لـ <strong className="text-sand">{currentDoc.name}</strong>. انقر على الكتاب لإغلاقه ورؤية غلافه الجلدي.
                    </span>
                  ) : (
                    <span>
                      انقر على مجسم الغلاف الخارجي <strong className="text-brass-lt">لفتح الكتاب والاطلاع</strong> على المادة العلمية التوضيحية ومقارنتها باللغتين العربية والإنكليزية/الألمانية.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Right Column: Tabbed controls and Details */}
            <div className="lg:col-span-6 space-y-space-6">
              {/* Fact Selection Tabs for current Orientalist */}
              <div className="space-y-space-2.5">
                <p className="text-right text-xs font-kufi text-brass-lt/70 pr-space-1">أبرز الفصول والمواضيع التي وثّقها عن القبيلة:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-3">
                  {currentDoc.topics.map((topic, index) => {
                    const TopicIcon = topic.icon;
                    const isSelected = activeTopicIndex === index;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveTopicIndex(index);
                          setIsBookOpened(true); // Auto open when selecting a topic
                        }}
                        className={`text-right p-space-3.5 rounded-xl border transition-all duration-base ease-brand flex items-center gap-space-3 cursor-pointer group ${
                          isSelected
                            ? 'bg-brass/10 border-brass text-brass-lt shadow-md'
                            : 'bg-ink/30 border-brass/10 text-sand-dim hover:text-sand hover:bg-ink-2/50 hover:border-brass/25'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-base ease-brand shrink-0 ${
                          isSelected ? 'bg-brass/25 border-brass/40 text-brass-lt' : 'bg-ink/60 border-brass/10 text-sand-dim group-hover:text-brass-lt'
                        }`}>
                          <TopicIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-xs font-bold truncate">{topic.title}</h4>
                          <span className="text-[9px] text-brass-lt/50 font-mono">{topic.page}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detail Content Panel */}
              <div className="bg-ink/50 border border-brass/15 rounded-2xl p-space-6 space-y-space-4 text-right">
                <div className="flex items-center justify-between border-b border-brass/10 pb-space-3">
                  <div className="flex items-center gap-space-2">
                    <IconComponent className="w-5 h-5 text-brass-lt" />
                    <h4 className="text-lg font-serif text-sand font-bold">{activeTopic.title}</h4>
                  </div>
                  <Badge variant="muted" className="text-[10px] text-sand-dim bg-ink-2/80 px-space-2.5 py-space-1 border border-brass/10 rounded-md">
                    المجلد ٣ • {activeTopic.page}
                  </Badge>
                </div>

                <p className="text-sand-dim text-xs md:text-sm leading-relaxed font-sans">
                  {activeTopic.detail}
                </p>

                {/* Blockquote with Quote Icon */}
                <div className="bg-[#120c06] border-r-3 border-brass rounded-r p-space-4 relative overflow-hidden">
                  <Quote className="absolute top-1 left-2 w-8 h-8 text-brass/5 transform -scale-x-100 pointer-events-none" />
                  <p className="text-sand/90 text-xs italic leading-relaxed font-serif">
                    {activeTopic.quote}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Classical Document & Register list view */
          <motion.div
            key="document-register"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-space-6 text-right relative z-10"
          >
            <div className="bg-ink/30 border border-brass/15 rounded-2xl p-space-6">
              <h4 className="text-lg font-serif text-sand font-bold mb-space-4 flex items-center gap-space-2 justify-end">
                <span>سجل المراجع والرحالة الموثقين للقبيلة وفروعها</span>
                <Sparkles className="w-4 h-4 text-brass" />
              </h4>
              <div className="overflow-x-auto font-sans">
                <table className="w-full text-sm text-sand-dim text-right border-collapse">
                  <thead>
                    <tr className="border-b border-brass/20 text-brass-lt font-kufi text-xs">
                      <th className="pb-space-3 pl-space-4">الرحالة / المستشرق</th>
                      <th className="pb-space-3 px-space-4">اسم المصدر والتأليف الشهير</th>
                      <th className="pb-space-3 px-space-4">تاريخ ومكان النشر</th>
                      <th className="pb-space-3 px-space-4">أبرز المحاور والتوثيقات</th>
                      <th className="pb-space-3 pr-space-4 text-left font-mono">Archive Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brass/10">
                    {ORIENTALISTS_DATA.map((doc) => (
                      <tr key={doc.id} className="hover:bg-brass/5 transition-colors duration-base ease-brand">
                        <td className="py-space-4 pl-space-4 font-serif font-bold text-sand text-base">{doc.name}</td>
                        <td className="py-space-4 px-space-4 font-serif text-sm italic">{doc.bookTitle}</td>
                        <td className="py-space-4 px-space-4 font-serif text-xs">{doc.publishPlace} ({doc.publishYear})</td>
                        <td className="py-space-4 px-space-4 text-xs">
                          <div className="flex flex-wrap gap-space-1.5 justify-end">
                            {doc.topics.map((t, idx) => (
                              <Badge key={idx} variant="brass" className="px-space-2 py-space-0.5 rounded text-[10px]">
                                {t.title} ({t.page})
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-space-4 pr-space-4 text-left font-mono text-xs text-brass-lt/60">{doc.archiveCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quote of authenticity */}
            <div className="bg-[#120c06] border border-brass/20 rounded-2xl p-space-6 text-center max-w-3xl mx-auto space-y-space-3">
              <Sparkles className="w-6 h-6 text-brass mx-auto animate-pulse" />
              <p className="text-sand font-serif text-sm md:text-base leading-relaxed">
                "إن كتابات هؤلاء المستشرقين والرحالة الغربيين، بما حملته من دقة في العمل الميداني والتقصي للأنساب وتعداد السكان وتضاريس الرعي وموارد المياه، تشكل أرشيفاً علمياً ثميناً يُثبِّت تاريخ ونسب ومكانة قبائل عتيبة وفروعها العريقة كالمزاحمة والروقة والسياحين في الذاكرة الدولية."
              </p>
              <div className="text-xs text-brass-lt font-mono">
                — INTERNATIONAL HERITAGE RESEARCH ARCHIVES
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
