import { TreeNode } from './LineageTree.types';

export const LINEAGE_DATA: TreeNode[] = [
  { 
    id: 'siyahin', 
    name: 'قبيلة السياحين', 
    parent_id: null, 
    level: 0, 
    source: 'تصنيفات الروقة، معجم قبائل العرب، ويكيبيديا دبي', 
    reliability: 1, 
    note: 'الجد الجامع هو سيحان بن ناصر بن مزحم من المزاحمة من الروقة من عتيبة.' 
  },
  
  // Level 1: الفراحين
  { 
    id: 'farahin', 
    name: 'الفراحين (الفرامين)', 
    parent_id: 'siyahin', 
    level: 1, 
    source: 'شبكة عتيبة الهيلا، معجم عالية نجد لابن جنيدل', 
    reliability: 1, 
    note: 'من الفروع الأساسية المتفق عليها تاريخياً.' 
  },
  { 
    id: 'jabr', 
    name: 'ذوي جبر', 
    parent_id: 'farahin', 
    level: 2, 
    source: 'روايات ديوان السياحين الشفهية الموثقة', 
    reliability: 1, 
    note: 'عائلة عريقة تنتمي للفراحين.' 
  },
  { 
    id: 'seif', 
    name: 'ذوي سيف', 
    parent_id: 'farahin', 
    level: 2, 
    source: 'روايات ديوان السياحين الشفهية الموثقة', 
    reliability: 1, 
    note: 'عائلة عريقة تنتمي للفراحين.' 
  },
  { 
    id: 'barakah', 
    name: 'ذوي بركة', 
    parent_id: 'farahin', 
    level: 2, 
    source: 'روايات ديوان السياحين الشفهية الموثقة', 
    reliability: 1, 
    note: 'عائلة عريقة تنتمي للفراحين.' 
  },

  // Level 1: الخوخان
  { 
    id: 'khookhan', 
    name: 'الخوخان (الخوفان)', 
    parent_id: 'siyahin', 
    level: 1, 
    source: 'شبكة عتيبة الهيلا، ديوان البادية العربية', 
    reliability: 1, 
    note: 'من الفروع الكبرى المستقرة بديار نجد.' 
  },
  { 
    id: 'maqandah', 
    name: 'المقاندة (المقابلة)', 
    parent_id: 'khookhan', 
    level: 2, 
    source: 'شجرة قبيلة عتيبة الرسمية، البدو لأوبنهايم', 
    reliability: 1, 
    note: 'بطن عريق من فخذ الخوخان.' 
  },
  { 
    id: 'balaeen', 
    name: 'البلاعين', 
    parent_id: 'khookhan', 
    level: 2, 
    source: 'شجرة قبيلة عتيبة الرسمية، رواة الروقة', 
    reliability: 1, 
    note: 'بطن عريق من فخذ الخوخان.' 
  },
  { 
    id: 'mutlaq', 
    name: 'ذوي مطلق', 
    parent_id: 'khookhan', 
    level: 2, 
    source: 'أشعار وروايات فخذ الخوخان', 
    reliability: 1, 
    note: 'أبناء مطلق من فخذ الخوخان.' 
  },

  // Level 1: الزمايمة (ذوي زميم)
  { 
    id: 'zamayemah', 
    name: 'الزمايمة (الزمامة)', 
    parent_id: 'siyahin', 
    level: 1, 
    source: 'موسوعة البدو لأوبنهايم (ج3، ص262)، كتب الرحالة فيلبي', 
    reliability: 2, 
    note: 'فخذ عريق يضم بيت المشيخة التاريخي (آل مسيلم) وأصحاب هجرة الجثوم.' 
  },
  { 
    id: 'moslem', 
    name: 'ذوي مسلم', 
    parent_id: 'zamayemah', 
    level: 2, 
    source: 'أوبنهايم (البدو ج3)، شجرة عتيبة النبطية', 
    reliability: 2, 
    note: 'من فروع الزمايمة ذوي زميم.' 
  },
  { 
    id: 'mosailem', 
    name: 'ذوي مسيلم (بيت المشيخة)', 
    parent_id: 'zamayemah', 
    level: 2, 
    source: 'أوبنهايم، عالية نجد لسعد بن جنيدل، وثائق تأسيس هجرة الجثوم', 
    reliability: 1, 
    note: 'بيت إمارة وشيوخ شمل قبيلة السياحين، ومؤسسو هجرة الجثوم بنجد.' 
  },
  { 
    id: 'faraj_mosailem', 
    name: 'الشيخ فرج بن مسيلم', 
    parent_id: 'mosailem', 
    level: 3, 
    source: 'موسوعة البدو لأوبنهايم (ج3، ص262)، عالية نجد ج1 ص354', 
    reliability: 1, 
    note: 'الشيخ التاريخي البارز ومؤسس هجرة الجثوم ومقارع الخصوم.' 
  },
  { 
    id: 'aloush', 
    name: 'علوش بن فرج بن مسيلم', 
    parent_id: 'faraj_mosailem', 
    level: 4, 
    source: 'أوبنهايم (البدو ج3، ص262)', 
    reliability: 2, 
    note: 'ابن الشيخ فرج بن مسيلم التاريخي الموثق في كتابات المستشرقين.' 
  },
  { 
    id: 'fadghoush', 
    name: 'فدغوش بن فرج بن مسيلم', 
    parent_id: 'faraj_mosailem', 
    level: 4, 
    source: 'أوبنهايم (البدو ج3، ص262)', 
    reliability: 2, 
    note: 'ابن الشيخ فرج بن مسيلم التاريخي الموثق في جداول أوبنهايم.' 
  },
  { 
    id: 'daifallah', 
    name: 'ضيف الله بن فرج بن مسيلم', 
    parent_id: 'faraj_mosailem', 
    level: 4, 
    source: 'أوبنهايم (البدو ج3، ص262)', 
    reliability: 2, 
    note: 'ابن الشيخ فرج بن مسيلم المذكور في المصادر الألمانية.' 
  },
  { 
    id: 'oqab', 
    name: 'الشيخ عقاب بن فرج بن مسيلم', 
    parent_id: 'faraj_mosailem', 
    level: 4, 
    source: 'عالية نجد لابن جنيدل ص354، الجريدة الرسمية أم القرى', 
    reliability: 1, 
    note: 'مؤسس ورئيس مركز الجثوم الحالي مكملاً لمسيرة والده ورسول السلام.' 
  },
  { 
    id: 'aweishiz', 
    name: 'ذوي عويشز', 
    parent_id: 'zamayemah', 
    level: 2, 
    source: 'شجرة الأنساب المعتمدة لدى ديوان عتيبة والهيلا', 
    reliability: 2, 
    note: 'من فروع الزمايمة.' 
  },

  // Level 1: المزانكة
  { 
    id: 'mazankah', 
    name: 'المزانكة (القرانكة)', 
    parent_id: 'siyahin', 
    level: 1, 
    source: 'شبكة عتيبة الهيلا، معجم قبائل الحجاز والوشم', 
    reliability: 1, 
    note: 'من فخوذ السياحين العريقة المشتهرة بالنبوغ الأدبي والقصيد الجزل.' 
  },
  { 
    id: 'hamad_poet', 
    name: 'ذوي حمد (الحواما)', 
    parent_id: 'mazankah', 
    level: 2, 
    source: 'أشعار وديوان عائلة ابن مايقه السيحاني', 
    reliability: 2, 
    note: 'ينتمي إليهم بيت القصيد البليغ عائلة "ابن مايقه" المشهورة بالجزالة.' 
  },
  { 
    id: 'hamid', 
    name: 'ذوي حميد', 
    parent_id: 'mazankah', 
    level: 2, 
    source: 'روايات ومجالس السياحين بنجد والحجاز', 
    reliability: 1, 
    note: 'فرع من المزانكة.' 
  },
  { 
    id: 'kureizi', 
    name: 'ذوي كريزي', 
    parent_id: 'mazankah', 
    level: 2, 
    source: 'روايات ديوان عتيبة المعتمدة شفهياً', 
    reliability: 2, 
    note: 'ويُدعون أيضاً ذوي كريني.' 
  },
  { 
    id: 'feed', 
    name: 'ذوي فيد', 
    parent_id: 'mazankah', 
    level: 2, 
    source: 'روايات الرواة ومجالس الروقة', 
    reliability: 2, 
    note: 'فرع من المزانكة.' 
  },
  { 
    id: 'fayed', 
    name: 'ذوي فايد', 
    parent_id: 'mazankah', 
    level: 2, 
    source: 'روايات الرواة ومجالس الروقة', 
    reliability: 2, 
    note: 'فرع من المزانكة.' 
  },

  // Level 1: ذوي علي
  { 
    id: 'ali_branch', 
    name: 'ذوي علي', 
    parent_id: 'siyahin', 
    level: 1, 
    source: 'شبكة عتيبة الهيلا، كتاب معجم قبائل نجد والمحمل', 
    reliability: 1, 
    note: 'من الفخوذ الرئيسية المشتهرة بالكرم ونقاء المجالس وحماية الجار.' 
  },
  { 
    id: 'kabashin', 
    name: 'الكباشين', 
    parent_id: 'ali_branch', 
    level: 2, 
    source: 'روايات شيوخ ذوي علي الموثقة شفهياً', 
    reliability: 1, 
    note: 'فرع من ذوي علي.' 
  },
  { 
    id: 'arawin', 
    name: 'العراوين', 
    parent_id: 'ali_branch', 
    level: 2, 
    source: 'روايات شيوخ ذوي علي الموثقة شفهياً', 
    reliability: 1, 
    note: 'فرع من ذوي علي.' 
  },
  { 
    id: 'hawawiah', 
    name: 'الهواوية', 
    parent_id: 'ali_branch', 
    level: 2, 
    source: 'أشعار الفارس حميد بن عياد وروايات الروقة', 
    reliability: 1, 
    note: 'فرع من ذوي علي.' 
  },
  { 
    id: 'jabreis', 
    name: 'ذوي جبرين', 
    parent_id: 'ali_branch', 
    level: 2, 
    source: 'روايات ومجالس ذوي علي', 
    reliability: 1, 
    note: 'فرع من ذوي علي.' 
  },

  // Level 1: المشاوطة
  { 
    id: 'mushawitah', 
    name: 'المشاوطة (الشواطة)', 
    parent_id: 'siyahin', 
    level: 1, 
    source: 'روايات قبائل عتيبة، قصائد الفارس فراج بن ريفة', 
    reliability: 1, 
    note: 'فخذ عريق عُرف بالشجاعة والإقدام.' 
  },
  { 
    id: 'sawadeen', 
    name: 'السوادين', 
    parent_id: 'mushawitah', 
    level: 2, 
    source: 'قصائد ديوان فراج بن ريفة السوادين', 
    reliability: 1, 
    note: 'بطن عريق من المشاوطة.' 
  },
  { 
    id: 'zawarit', 
    name: 'الزواريط', 
    parent_id: 'mushawitah', 
    level: 2, 
    source: 'روايات مجالس الروقة والمشاوطة', 
    reliability: 1, 
    note: 'بطن عريق من المشاوطة.' 
  },
  { 
    id: 'rawazin', 
    name: 'الروازين', 
    parent_id: 'mushawitah', 
    level: 2, 
    source: 'روايات مجالس الروقة والمشاوطة', 
    reliability: 1, 
    note: 'بطن عريق من المشاوطة.' 
  },

  // Level 1: ذوي خيّر
  { 
    id: 'khair_branch', 
    name: 'ذوي خيّر', 
    parent_id: 'siyahin', 
    level: 1, 
    source: 'أشعار آل هاجد، رواة السياحين المعاصرين', 
    reliability: 1, 
    note: 'فخذ معروف بالشهامة ومنه آل هاجد الكرام.' 
  },
  { 
    id: 'haajed', 
    name: 'آل هاجد', 
    parent_id: 'khair_branch', 
    level: 2, 
    source: 'رواية صنهات بن هاجد السيحاني الموثقة شفهياً وكتابياً', 
    reliability: 1, 
    note: 'أسرة عريقة من فخذ ذوي خيّر.' 
  },

  // Level 1: ذوي جهيم
  { 
    id: 'juhaim_branch', 
    name: 'ذوي جهيم', 
    parent_id: 'siyahin', 
    level: 1, 
    source: 'شجرة عتيبة النبطية، ديوان جهم بن جهيم', 
    reliability: 1, 
    note: 'فخذ معروف بالبسالة وحسن الجوار وله مآثر بالبادية.' 
  },

  // Level 1: الدلابسة
  { 
    id: 'dalabsah_branch', 
    name: 'الدلابسة (اللابية)', 
    parent_id: 'siyahin', 
    level: 1, 
    source: 'قصائد ديوان مخلد بن دلباس، روايات عتيبة الهيلا', 
    reliability: 1, 
    note: 'فخذ الدلابسة الكرام ولهم إسهامات عظيمة في موروث وديار السياحين.' 
  }
];
