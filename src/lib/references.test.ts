import { describe, expect, it } from 'vitest';

import { LOCAL_REFS } from './references';

describe('LOCAL_REFS', () => {
  it('يعرض مراجع النسب التي طوبقت مع الطبعات والصفحات المحددة فقط', () => {
    expect(LOCAL_REFS).toEqual([
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
        author: 'يوسف السيحاني',
        bookTitle: '«فروع السياحين»',
        publicationDetails: 'منتدى الهيلا — منتدى قبيلة عتيبة، الموضوع 22375',
        edition: 'نسخة مؤرشفة في أرشيف الإنترنت بتاريخ ٢٦ فبراير ٢٠١١م',
        year: '٥ أبريل ٢٠٠٦م',
        pages: 'المشاركة الأولى والردود التصحيحية اللاحقة',
        reliability: 'needs-review',
        verificationNote:
          'كاتب المشاركة صرّح بأن التقسيم تقريبي، وورد في الردود اعتراض على بعض تفاصيله؛ يُعرض بوصفه رواية منتدى لا توثيقًا قطعيًا.',
        url: 'https://web.archive.org/web/20110226020728/http://www.otaibah.net/m/archive/index.php/t-22375.html',
      },
    ]);
  });
});
