export type Reliability = 'verified' | 'needs-review';

export interface LocalReferenceEntry {
  id: string;
  author: string;
  bookTitle: string;
  publisher: string;
  year: string;
  pages: string;
  reliability: Reliability;
  verificationNote?: string;
}

export const LOCAL_REFS: LocalReferenceEntry[] = [
  {
    id: 'alzulfa-qassim',
    author: 'د. محمد بن عبد الله آل زلفة',
    bookTitle:
      '«التجهيزات العسكرية والاقتصادية أثناء ضمّ منطقة القصيم لحكم الملك عبد العزيز في عام ١٣٢١–١٣٢٢هـ»',
    publisher: 'دار بلاد العرب للنشر والتوزيع، الرياض',
    year: '٢٠١٤م',
    pages: 'ص ٧٥–٧٦',
    reliability: 'verified',
  },
  {
    id: 'oppenheim-bedouins',
    author: 'ماكس فون أوبنهايم',
    bookTitle: '«البدو» (شمال ووسط الجزيرة العربية والعراق الجنوبي)',
    publisher: 'ترجمة محمود كبيبو، تحقيق ماجد شبر، دار الورّاق، لندن',
    year: '١٩٣٩م',
    pages: 'المجلد الثالث',
    reliability: 'needs-review',
  },
  {
    id: 'otaibah-haila',
    author: 'موقع «عتيبة الهيلا»',
    bookTitle: 'منتدى ومصادر قبيلة عتيبة لتوثيق النسب والفروع والمعارك',
    publisher: 'متاح على الإنترنت',
    year: 'مستمر',
    pages: '—',
    reliability: 'needs-review',
  },
];
