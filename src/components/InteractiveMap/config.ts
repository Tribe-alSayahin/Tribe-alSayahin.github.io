export const SAYAHIN_VILLAGES = ['الهمجة', 'العزيزية', 'الهواوية'];

export interface LocationInfo {
  id: string;
  name: string;
  coords: [number, number];
  x: number;
  y: number;
  description: string;
  significance: string;
  imgUrl: string;
  historyDetail: string;
  category: 'settlement' | 'well' | 'region';
  categoryLabel: string;
}

export interface LeafletMapInstance {
  remove(): void;
  setView(coords: [number, number], zoom: number, options?: { animate?: boolean }): void;
}

interface LeafletTileLayer {
  addTo(map: LeafletMapInstance): void;
}

export interface LeafletMarkerInstance {
  addTo(map: LeafletMapInstance): LeafletMarkerInstance;
  bindPopup(content: HTMLElement, options?: { closeButton?: boolean; className?: string }): LeafletMarkerInstance;
  bindTooltip(content: string, options?: {
    direction?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto';
    className?: string;
  }): LeafletMarkerInstance;
  on(event: 'click', handler: () => void): LeafletMarkerInstance;
  openPopup(): void;
}

interface LeafletAPI {
  map(container: HTMLElement, options: {
    center: [number, number];
    zoom: number;
    zoomControl?: boolean;
    attributionControl?: boolean;
  }): LeafletMapInstance;
  tileLayer(url: string, options: { maxZoom: number }): LeafletTileLayer;
  divIcon(options: {
    className?: string;
    html: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
  }): unknown;
  marker(coords: [number, number], options: { icon: unknown }): LeafletMarkerInstance;
  DomUtil: { create(tagName: string, className?: string): HTMLDivElement };
}

declare global {
  interface Window {
    L?: LeafletAPI;
  }
}

export const LOCATIONS: LocationInfo[] = [
  {
    id: 'jathum',
    name: 'الجثوم',
    coords: [24.5822, 44.6053],
    x: 52,
    y: 52,
    description: 'من منازل ومواطن السياحين الشهيرة في نجد، وهي مقر هجرة الجثوم التي نزلها واستوطنها ذوي مسيلم من قبيلة السياحين.',
    significance: 'ارتبطت بقبيلة السياحين تاريخياً كأحد المراكز البدوية والهجر التي أسسها رجالات القبيلة ومصنفة في معجم عالية نجد.',
    imgUrl: 'https://images.unsplash.com/photo-1507565842045-896160d2580d?auto=format&fit=crop&w=600&q=80',
    historyDetail: 'تعتبر هجرة الجثوم في عالية نجد أول هجرة رسمية تم تأسيسها لقبيلة السياحين في نجد، وأسسها الشيخ فرج بن مسيلم السيحاني، لتكون معقلاً رئيساً ومقراً لاستقرار أبناء القبيلة في البادية وبداية تحضرهم وتشييد منازلهم ومزارعهم ومواردهم المائية.',
    category: 'settlement',
    categoryLabel: 'الهجر والديار',
  },
  {
    id: 'rahat',
    name: 'رهاط',
    coords: [22.0125, 39.8114],
    x: 28,
    y: 68,
    description: 'بلدة وادي رهاط العريقة في الحجاز، تقع شمال شرق مكة المكرمة، وهي من المناهل والمواطن القديمة لفرع من قبيلة السياحين.',
    significance: 'موطن حجازي قديم يربط فروع القبيلة بقراباتهم من روقة الحجاز ويسجل امتداد القبيلة التاريخي والاجتماعي بين نجد والحجاز.',
    imgUrl: 'https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?auto=format&fit=crop&w=600&q=80',
    historyDetail: 'يقع وادي رهاط العتيق شمال شرق مكة المكرمة ويمثل الجذور الحجازية والمناهل التاريخية القديمة التي قطنتها فروع القبيلة (سياحين الحجاز) وتوالت عليها الأجيال قبل امتدادهم الواسع ونزوح العديد من فرسانهم صوب هضاب عالية نجد رعياً واستقراراً.',
    category: 'region',
    categoryLabel: 'الأقاليم والأودية',
  },
  {
    id: 'aliyat-najd',
    name: 'عالية نجد',
    coords: [24.7333, 44.25],
    x: 47,
    y: 55,
    description: 'المجال الجغرافي الأوسع لمواطن القبيلة ومرابعها التاريخية الممتدة بين الهجر والحواضر في قلب نجد.',
    significance: 'يمثل الامتداد الرعوي والحضاري الذي ارتبطت به حركة القبيلة التاريخية واستقرارها بين المراعي والهجر.',
    imgUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80',
    historyDetail: 'تُعد عالية نجد الإطار المكاني الجامع لديار قبيلة السياحين، وفيها تداخلت منازل الاستقرار مع مراعي البادية عبر أجيال متعاقبة، فغدت شاهداً على التحول التاريخي من الترحال إلى الاستقرار والتنمية في قلب الجزيرة.',
    category: 'region',
    categoryLabel: 'الأقاليم والأودية',
  },
];
