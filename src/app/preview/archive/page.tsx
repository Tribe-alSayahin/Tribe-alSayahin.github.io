/*
 * Hallmark · macrostructure: Index-First · tone: أرشيفي-واثق · anchor hue: emerald/cool
 * nav: N12 Banner + Retract · footer: Ft3-variant (2-col)
 * enrichment: Tier B hand-built SVG (tribal seal)
 * pre-emit critique: P5 H4 E5 S5 R5 V5
 */

import type { Metadata } from 'next';
import PreviewArchiveClient from './PreviewArchiveClient';

export const metadata: Metadata = {
  title: 'معاينة ٣ — بوابة الأرشيف',
  robots: { index: false, follow: false },
};

export default function PreviewArchivePage() {
  return <PreviewArchiveClient />;
}
