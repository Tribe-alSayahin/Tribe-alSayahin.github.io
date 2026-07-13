/*
 * Hallmark · macrostructure: Long Document · tone: أثري-وثائقي · anchor hue: brass/warm
 * nav: N6 Newspaper Masthead · footer: Ft4 Dense Typographic
 * enrichment: Tier B hand-built SVG (Najd map lines)
 * pre-emit critique: P5 H5 E5 S4 R4 V5
 */

import type { Metadata } from 'next';
import PreviewCodexClient from './PreviewCodexClient';

export const metadata: Metadata = {
  title: 'معاينة ١ — ديوان المخطوطة',
  robots: { index: false, follow: false },
};

export default function PreviewCodexPage() {
  return <PreviewCodexClient />;
}
