/**
 * قرى وهجر قبيلة السياحين — أسماء فقط دون إحداثيات.
 * تُعرض كقائمة تحت خريطة الديار في قسم «الديار ومنازل الاستقرار».
 */

export interface VillageInfo {
  id: string;
  name: string;
}

// الهمجة: مركز تابع لمحافظة أبانات بالقصيم، أسسها الشيخ صنيتان بن مرزوق بن تنباك عام 1375هـ
//   (موثقة — ويكيبيديا: https://ar.wikipedia.org/wiki/الهمجة)
// العزيزية والهواوية: confidence: 'probable' — برواية مالك المستودع، 2026-07-07
export const SAYAHIN_VILLAGES: VillageInfo[] = [
  { id: 'hamjah', name: 'الهمجة' },
  { id: 'aziziyah', name: 'العزيزية' },
  { id: 'hawawiyah', name: 'الهواوية' },
];
