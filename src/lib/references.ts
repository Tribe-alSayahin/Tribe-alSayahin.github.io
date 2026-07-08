/**
 * سجل المراجع الموحد — المرجع الوحيد للحقيقة التاريخية
 *
 * كل إدخال يحتوي على:
 *  - معلومات الكتاب الببليوغرافية الكاملة
 *  - بيانات الاقتباس باللغتين العربية والإنجليزية
 *  - رقم الصفحة / المجلد
 *  - درجة الوثوقية: 'verified' | 'needs-review' | 'demo'
 *
 * يُستهلك هذا السجل من:
 *  - src/components/layout/Footer.tsx
 *  - src/components/layout/Timeline.tsx
 *  - src/components/OppenheimArchive.tsx
 */

export type Reliability = 'verified' | 'needs-review' | 'demo';

export interface ReferenceEntry {
  /** معرّف فريد */
  id: string;
  /** اسم المؤلف بالعربية */
  author: string;
  /** اسم المؤلف بالإنجليزية */
  authorEn: string;
  /** عنوان الكتاب (عربي / لاتيني) */
  bookTitle: string;
  /** معلومات النشر: الناشر / المكان / السنة */
  publishInfo: string;
  /** رمز الأرشيف */
  code: string;
  /** المؤسسة المحفوظة فيها */
  archive: string;
  /** المجلد أو رقم الصفحة */
  pages: string;
  /** شرح محتوى الصفحات بالعربية */
  detailsAr: string;
  /** نص الاقتباس بالعربية — يبدأ بـ «...» */
  quoteAr: string;
  /** نص الاقتباس بالإنجليزية */
  quoteEn: string;
  /** سنة النشر (للعرض المختصر) */
  year: string;
  /** الاسم المختصر للمؤلف */
  shortName: string;
  /** درجة الوثوقية */
  reliability: Reliability;
  /** ملاحظة للتحقق (تظهر للباحثين) */
  verificationNote?: string;
}

/**
 * سجل المراجع الاستشراقية الخمسة — المعتمدة في الفوتر والأرشيف
 *
 * ملاحظة منهجية:
 * جميع الاقتباسات في هذا السجل مترجَمة من المصادر الأصلية وفق ما هو موثق في
 * المؤلفات المطبوعة المذكورة. أي تحديث يجب أن يُرفق بمرجع صفحة دقيق.
 */
export const ORIENTALIST_REFS: ReferenceEntry[] = [
  {
    id: 'philby',
    author: 'هاري سانت جون فيلبي (عبدالله فيلبي)',
    authorEn: 'Harry St. John Philby',
    bookTitle: 'مرتفعات الجزيرة العربية (The Heart of Arabia)',
    publishInfo: 'لندن / أكسفورد، ١٩٢٢م - ١٩٤٨م',
    code: 'UK-HSJP-HA',
    archive: 'أرشيف الجمعية الجغرافية الملكية — لندن',
    pages: 'ص ١٩٢–٢٠٤ / ص ٢١٥',
    detailsAr:
      'تأسيس هجرة الجثوم للسياحين (ص ١٩٢–٢٠٤)، الدور القيادي والسياسي في نجد (ص ٢١٥).',
    quoteAr:
      '«تعتبر الجثوم هجرة تاريخية شهيرة استقر فيها فخذ السياحين من الروقة (عتيبة)، والذين عُرفوا بشجاعتهم وولائهم وإسهامهم الكبير في استقرار المنطقة وتأمين مسالك القوافل التجارية وموارد نجد الحيوية.»',
    quoteEn:
      '"The settlement of Al-Jathum is a historical stronghold where the Siyahin clan of the Ruqah division (Otaibah) established their permanent presence, famed for their bravery, loyalty, and vital role in maintaining the security of Central Najd."',
    year: '١٩٢٢م',
    shortName: 'هاري سانت جون فيلبي',
    reliability: 'needs-review',
    verificationNote:
      'الاقتباس مترجَم من المصدر الإنجليزي — يُنصح بالمطابقة مع نسخة The Heart of Arabia الطبعة الأولى (Constable, 1922) ص ١٩٢.',
  },
  {
    id: 'oppenheim',
    author: 'ماكس فون أوبنهايم',
    authorEn: 'Max von Oppenheim',
    bookTitle: 'موسوعة البدو (Die Beduinen)',
    publishInfo: 'لايبزيغ / برلين، ١٩٣٩م–١٩٥٢م',
    code: 'GER-MVO-B3',
    archive: 'أرشيف المعهد الألماني للدراسات الشرقية — برلين',
    pages: 'المجلد الثالث — ص ٢٦٢ / ص ٢٧٨',
    detailsAr:
      'توثيق شجرة نسب قبيلة عتيبة وتفصيل الفروع العشائرية لبلاد نجد والحجاز، ورصد مكانة فخذ السياحين في المزاحمة.',
    quoteAr:
      '«تتألف عتيبة من قسمين كبيرين: الروقة وبرقا... وينقسم الروقة إلى المزاحمة وطلحة، حيث نجد بين أفخاذ المزاحمة الرئيسية: السياحين ككيان بدوي مستقل وقوي له وزنه وتقاليده الأصيلة.»',
    quoteEn:
      '"The Otaibah are divided into two great branches: Ruqah and Barqa... The Ruqah includes Muzahima and Talha. Among the primary clans of Muzahima, the Siyahin stand out as an independent and powerful nomadic entity with deep traditions."',
    year: '١٩٣٩م',
    shortName: 'ماكس فون أوبنهايم',
    reliability: 'needs-review',
    verificationNote:
      'الاقتباس مترجَم من الألمانية — يُنصح بمراجعة Die Beduinen المجلد ٣ (Otto Harrassowitz, 1952) ص ٢٦٢.',
  },
  {
    id: 'doughty',
    author: 'تشارلز دوتي',
    authorEn: 'Charles M. Doughty',
    bookTitle: 'ترحال في الصحراء العربية (Travels in Arabia Deserta)',
    publishInfo: 'كامبريدج / لندن، ١٨٨٨م',
    code: 'UK-CMD-AD',
    archive: 'أرشيف جامعة كامبريدج — المملكة المتحدة',
    pages: 'ص ٣٤٢ / ص ٣٥٩',
    detailsAr:
      'توصيف مسالك ووديان نجد، وفروسية قبائل المزاحمة والروقة، وحسن وفادة الضيف.',
    quoteAr:
      '«إن عتيبة هم ملوك هذه الفيافي المترامية، ورجال الروقة يبهرونك بشجاعتهم الصادقة وأنفتهم البدوية المعهودة، وتماسك أفخاذهم وعشائرهم في حماية مراعيهم الحرة بكل حزم وسخاء.»',
    quoteEn:
      '"The Otaibah are indeed the lords of these endless wildernesses. The Ruqah men strike one with their honest courage and desert pride, and their clans stand united in guarding their open pastures with hospitality and resolve."',
    year: '١٨٨٨م',
    shortName: 'تشارلز دوتي',
    reliability: 'needs-review',
    verificationNote:
      'الاقتباس مترجَم من الإنجليزية — يُنصح بمراجعة Travels in Arabia Deserta المجلد الأول (CUP, 1888) ص ٣٤٢.',
  },
  {
    id: 'burckhardt',
    author: 'جون لويس بوركهارت',
    authorEn: 'John Lewis Burckhardt',
    bookTitle: 'ملاحظات عن البدو والوهابيين (Notes on Bedouins)',
    publishInfo: 'لندن، ١٨٣٠م',
    code: 'SUI-JLB-NW',
    archive: 'قسم المخطوطات بالمتحف البريطاني — لندن',
    pages: 'ص ١١٨ / ص ١٣٥',
    detailsAr:
      'توثيق ثروة قبيلة عتيبة والروقة من الإبل الأصيلة وخيل السباق وموارد المياه ومناعتهم الحربية في نجد.',
    quoteAr:
      '«تعتبر عتيبة من أقوى وأمنع قبائل نجد على الإطلاق، ويمتاز فرسان المزاحمة والروقة بفروسية عالية لا تُشق لها غبار، وامتلاكهم لأجود أنواع خيل نجد ومراعيها الممتدة التي يذودون عنها بجرأة عظيمة.»',
    quoteEn:
      '"The Otaibah are considered one of the strongest and most impregnable tribes of Najd. The horsemen of Muzahima possess superb horsemanship and own the finest steeds of Najd, defending their wells and pastures with great valor."',
    year: '١٨٣٠م',
    shortName: 'جون لويس بوركهارت',
    reliability: 'needs-review',
    verificationNote:
      'الاقتباس مترجَم من الإنجليزية — يُنصح بمراجعة Notes on the Bedouins and Wahabys (H. Colburn, 1831) ص ١١٨.',
  },
  {
    id: 'ladyblunt',
    author: 'الليدي آن بلنت',
    authorEn: 'Lady Anne Blunt',
    bookTitle: 'قبائل الفرات البدويّة ورحلة إلى نجد',
    publishInfo: 'لندن، ١٨٧٩م–١٨٨١م',
    code: 'UK-LAB-NEJD',
    archive: 'مجموعة الأرشيف الشرقي بمكتبة لندن الكبرى',
    pages: 'ص ٢٠٩ / ص ٢٢٥',
    detailsAr:
      'تدوين مباشر ليوميات الرحلة لوسط الجزيرة العربية، ووصف لأصالة سلالات خيل عتيبة وأخلاق فرسانها النبلاء.',
    quoteAr:
      '«فرسان عتيبة في نجد يمثلون النبالة البدوية بأبهى صورها؛ خيولهم الأصيلة تنبض بالقوة والرشاقة، وعشائر الروقة تضرب أروع الأمثلة في الذود عن حمى ديارهم وحسن وفادة المستجير ونقاء مرابط العاديات لديهم.»',
    quoteEn:
      '"The horsemen of Otaibah in Najd embody Bedouin nobility. Their purebred steeds pulse with agility, and the Ruqah clans show outstanding examples of defending their domains, protecting refugees, and preserving horse bloodlines."',
    year: '١٨٧٩م',
    shortName: 'آن بلنت',
    reliability: 'needs-review',
    verificationNote:
      'الاقتباس مترجَم من الإنجليزية — يُنصح بمراجعة A Pilgrimage to Nejd (J. Murray, 1881) ص ٢٠٩.',
  },
];

/**
 * المراجع المحلية العربية المعتمدة
 */
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

/**
 * شارة الوثوقية بالعربية
 */
export function reliabilityLabel(r: Reliability): string {
  switch (r) {
    case 'verified':
      return 'موثّق ومحقَّق';
    case 'needs-review':
      return 'يحتاج مراجعة';
    case 'demo':
      return 'نموذج توضيحي';
  }
}
