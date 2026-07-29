export type Reliability = 'verified' | 'needs-review';

export interface LocalReferenceEntry {
  id: string;
  author: string;
  bookTitle: string;
  publicationDetails: string;
  edition: string;
  year: string;
  pages: string;
  reliability: Reliability;
  verificationNote?: string;
  url?: string;
}

export const LOCAL_REFS: LocalReferenceEntry[] = [
  {
    id: 'alzulfa-qassim',
    author: 'د. محمد بن عبد الله آل زلفة',
    bookTitle:
      '«التجهيزات العسكرية والاقتصادية أثناء ضمّ منطقة القصيم لحكم الملك عبد العزيز في عام ١٣٢١–١٣٢٢هـ»',
    publicationDetails: 'دار بلاد العرب للنشر والتوزيع، الرياض',
    edition: 'الطبعة الأولى',
    year: '٢٠١٤م',
    pages: 'ص ٧٥–٧٦',
    reliability: 'verified',
  },
  {
    id: 'oppenheim-bedouins',
    author: 'ماكس فون أوبنهايم',
    bookTitle: '«البدو» (شمال ووسط الجزيرة العربية والعراق الجنوبي)',
    publicationDetails: 'ترجمة محمود كبيبو، تحقيق ماجد شبر، دار الورّاق، لندن',
    edition: 'الطبعة العربية',
    year: '٢٠٠٤م',
    pages: 'ج٣، ص ١٤٠–١٤٥',
    reliability: 'verified',
  },
  {
    id: 'hamad-aljaser-tribes',
    author: 'حمد بن محمد الجاسر',
    bookTitle: '«معجم قبائل المملكة العربية السعودية»',
    publicationDetails: 'النادي الأدبي، الرياض',
    edition: 'الطبعة الأولى',
    year: '١٤٠١هـ–١٩٨١م',
    pages: 'ص ٣٧٧',
    reliability: 'verified',
  },
  {
    id: 'otaibah-al-haila-book',
    author: 'مثيب محمد العتيبي',
    bookTitle: '«قبيلة عتيبة الهيلا من هوازن»',
    publicationDetails: 'الكويت؛ حقوق الطبع محفوظة للمؤلف',
    edition: 'الطبعة السادسة',
    year: '٢٠١٧م',
    pages: 'ط٦، ص ٧٩',
    reliability: 'verified',
  },
  {
    id: 'al-haila-forum-siyahin-branches',
    author: 'منتدى الهيلا',
    bookTitle: '«فروع السياحين»',
    publicationDetails: 'منتدى الهيلا — منتدى قبيلة عتيبة، الموضوع 22375',
    edition: 'نسخة مؤرشفة في أرشيف الإنترنت بتاريخ ٢٦ فبراير ٢٠١١م',
    year: '٥ أبريل ٢٠٠٦م',
    pages: 'المشاركة الأولى والردود التصحيحية اللاحقة',
    reliability: 'needs-review',
    verificationNote:
      'المصدر نفسه رواية منتدى تحتاج إلى مراجعة مستقلة. وسم «موثق» في شجرة النسب يعبّر عن اعتماد مالك الموقع للاسم في القائمة، ولا يحوّل المنتدى إلى مرجع علمي محكّم.',
    url: 'https://web.archive.org/web/20110226020728/http://www.otaibah.net/m/archive/index.php/t-22375.html',
  },
];
