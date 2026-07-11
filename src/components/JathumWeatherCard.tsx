import { CloudSun, Droplets, Thermometer, ThermometerSun, Wind } from 'lucide-react';

import { useJathumWeather } from '../hooks/useJathumWeather';

const numberFormatter = new Intl.NumberFormat('ar-SA', {
  maximumFractionDigits: 1,
});

const dateTimeFormatter = new Intl.DateTimeFormat('ar-SA', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const weatherCodeLabel = (weatherCode: number, isDay: boolean) => {
  switch (weatherCode) {
    case 0:
      return isDay ? 'سماء صافية' : 'سماء صافية ليلاً';
    case 1:
    case 2:
      return 'غيوم خفيفة';
    case 3:
      return 'غائم';
    case 45:
    case 48:
      return 'ضباب';
    case 51:
    case 53:
    case 55:
      return 'رذاذ';
    case 56:
    case 57:
      return 'رذاذ متجمّد';
    case 61:
    case 63:
    case 65:
      return 'مطر';
    case 66:
    case 67:
      return 'مطر متجمّد';
    case 71:
    case 73:
    case 75:
      return 'ثلوج';
    case 77:
      return 'حبّات ثلج';
    case 80:
    case 81:
    case 82:
      return 'زخات مطر';
    case 85:
    case 86:
      return 'زخات ثلج';
    case 95:
      return 'عاصفة رعدية';
    case 96:
    case 99:
      return 'عاصفة رعدية مع بَرَد';
    default:
      return 'حالة جوية متغيرة';
  }
};

const formatValue = (value: number, unit: string) => `${numberFormatter.format(value)} ${unit}`;

export default function JathumWeatherCard() {
  const { weather, isLoading, error } = useJathumWeather();

  return (
    <div
      className="mt-8 rounded-2xl border border-brass/15 bg-ink/90 p-5 md:p-6"
      aria-live="polite"
      aria-busy={isLoading}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-right">
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-brass/20 bg-brass/10 px-3 py-1 font-kufi text-[11px] text-brass-lt">
            <CloudSun className="h-3.5 w-3.5" />
            الطقس الحالي في الجثوم
          </span>
          <h5 className="font-serif text-xl font-bold text-sand">رصد مباشر لهواء الهجرة اليوم</h5>
          <p className="mt-1 text-xs leading-relaxed text-sand-dim">
            قراءة حيّة لحرارة الجثوم ورطوبتها والرياح المحيطة بها من خدمة مناخية مفتوحة.
          </p>
        </div>

        {weather ? (
          <div className="rounded-xl border border-brass/10 bg-ink-2/70 px-4 py-3 text-right">
            <div className="font-kufi text-[11px] text-brass-lt">{weatherCodeLabel(weather.weatherCode, weather.isDay)}</div>
            <div className="mt-1 text-xs text-sand-dim">
              آخر تحديث: {dateTimeFormatter.format(new Date(weather.observedAt))}
            </div>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-brass/10 bg-ink-2/60 p-4 animate-pulse"
            >
              <div className="mb-3 h-4 w-20 rounded bg-brass/10" />
              <div className="h-7 w-24 rounded bg-brass/15" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-5 rounded-xl border border-brass/15 bg-ink-2/60 p-4 text-right">
          <p className="font-kufi text-sm text-brass-lt">{error}</p>
          <p className="mt-1 text-xs leading-relaxed text-sand-dim">
            سيظهر الرصد المباشر تلقائياً عند استجابة خدمة المناخ، بينما تبقى معلومات الجثوم التاريخية متاحة كالمعتاد.
          </p>
        </div>
      ) : weather ? (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-brass/10 bg-ink-2/60 p-4 text-right">
            <div className="mb-2 flex items-center gap-2 text-brass-lt">
              <Thermometer className="h-4 w-4" />
              <span className="font-kufi text-[11px]">درجة الحرارة</span>
            </div>
            <div className="font-serif text-2xl font-bold text-sand">
              {formatValue(weather.temperature, '°م')}
            </div>
          </div>

          <div className="rounded-xl border border-brass/10 bg-ink-2/60 p-4 text-right">
            <div className="mb-2 flex items-center gap-2 text-brass-lt">
              <ThermometerSun className="h-4 w-4" />
              <span className="font-kufi text-[11px]">المحسوسة</span>
            </div>
            <div className="font-serif text-2xl font-bold text-sand">
              {formatValue(weather.apparentTemperature, '°م')}
            </div>
          </div>

          <div className="rounded-xl border border-brass/10 bg-ink-2/60 p-4 text-right">
            <div className="mb-2 flex items-center gap-2 text-brass-lt">
              <Droplets className="h-4 w-4" />
              <span className="font-kufi text-[11px]">الرطوبة</span>
            </div>
            <div className="font-serif text-2xl font-bold text-sand">
              {formatValue(weather.humidity, '٪')}
            </div>
          </div>

          <div className="rounded-xl border border-brass/10 bg-ink-2/60 p-4 text-right">
            <div className="mb-2 flex items-center gap-2 text-brass-lt">
              <Wind className="h-4 w-4" />
              <span className="font-kufi text-[11px]">سرعة الرياح</span>
            </div>
            <div className="font-serif text-2xl font-bold text-sand">
              {formatValue(weather.windSpeed, 'كم/س')}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
