import { useEffect, useState } from 'react';

const JATHUM_COORDS = {
  latitude: 24.5822,
  longitude: 44.6053,
} as const;

const WEATHER_REFRESH_INTERVAL_MS = 15 * 60 * 1000;
const WEATHER_API_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${JATHUM_COORDS.latitude}&longitude=${JATHUM_COORDS.longitude}` +
  '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day&timezone=auto';

interface OpenMeteoWeatherResponse {
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
}

export interface JathumWeatherData {
  observedAt: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
}

interface JathumWeatherState {
  weather: JathumWeatherData | null;
  isLoading: boolean;
  error: string | null;
}

export function useJathumWeather(): JathumWeatherState {
  const [weather, setWeather] = useState<JathumWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async (signal: AbortSignal) => {
      try {
        const response = await fetch(WEATHER_API_URL, { signal });

        if (!response.ok) {
          throw new Error('تعذر الوصول إلى خدمة الطقس الحالية.');
        }

        const data = (await response.json()) as OpenMeteoWeatherResponse;

        if (!data.current) {
          throw new Error('بيانات الطقس الحالية غير مكتملة.');
        }

        if (!isMounted) return;

        setWeather({
          observedAt: data.current.time,
          temperature: data.current.temperature_2m,
          apparentTemperature: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day === 1,
        });
        setError(null);
      } catch (caughtError) {
        if ((caughtError as Error).name === 'AbortError' || !isMounted) {
          return;
        }

        setError('تعذر جلب الطقس المباشر للجثوم حالياً.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    let activeController = new AbortController();
    void fetchWeather(activeController.signal);

    const intervalId = window.setInterval(() => {
      activeController.abort();
      activeController = new AbortController();
      void fetchWeather(activeController.signal);
    }, WEATHER_REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      activeController.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  return { weather, isLoading, error };
}
