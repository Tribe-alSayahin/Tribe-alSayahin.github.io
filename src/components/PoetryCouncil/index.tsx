'use client';

import { BookOpen } from 'lucide-react';
import { Badge } from '../ui/Badge';

const baajPoemLines = [
  'يا عيد وصّيتك على شيخة الذود؟',
  'كسبي من الأجناب نقوة حلالي!',
  'شعيتها والقوم في نومها رقود؟',
  'ملحًا أسوق الروح فيها ما بالي!',
  'وردتها عدًا على الجد ما رود؟',
  'وشربت من زبيدة شرابًا زلالي!',
  'ومن الجثوم اليا الطرودي لها حدود!',
  'وغرب اليا صدعان زين المفالي!',
  'ومن المظيح للمحامه لها نود؟',
  'ولها على صفو الغبيوي مدالي!',
  'واليا وردت سهوات ما يشرب الرود!',
  'وحنا جنبها محتمين التوالي!',
  'حتى تصدر منه والعالم شهود؟',
  'وتاخذ لها على القطين جتوالي!',
  'وضيعتها يا عيد يا راعي القود؟',
  'هذا وأنا محرصك يا هملالي!'
];

export default function PoetryCouncil() {
  return (
    <div className="bg-ink-2/50 border border-brass/20 rounded-3xl p-space-6 md:p-space-10 shadow-xl" id="diwan-poet">
      <div className="max-w-3xl mx-auto space-y-space-6">
        <div className="text-center space-y-space-4">
          <Badge variant="brass" showDot={true} className="font-kufi text-xs px-space-3 py-space-1 bg-brass/10">
            رواية شفوية موثقة
          </Badge>
          <div className="mx-auto w-16 h-16 rounded-2xl border border-brass/25 bg-brass/10 flex items-center justify-center text-brass-lt">
            <BookOpen className="w-8 h-8" aria-hidden="true" />
          </div>
          <h3 className="text-2xl md:text-3xl font-serif text-sand font-bold">قصيدة الشيخ بعاج بن علوش بن فرج بن مسيلم</h3>
          <p className="text-sm text-sand-dim leading-loose">
            من محفوظات الديار عن رحلة الكسب من الأجناب، وما تبعها من وصية الشيخ بعاج لابنه عيد على
            شيخة الذود.
          </p>
        </div>

        <article className="rounded-2xl border border-brass/20 bg-ink/70 p-space-5 md:p-space-7">
          <p className="font-kufi text-xs text-brass-lt mb-space-4">مقام القصيدة: سهوات عفيف والجثوم</p>
          <div className="space-y-space-2 text-sand leading-loose text-base md:text-lg font-serif">
            {baajPoemLines.map((line) => (
              <p key={line} className="text-center">
                {line}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
