import type { WeatherData } from '@/services/types';

export type { WeatherData } from '@/services/types';

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

type LocationQuery = string | { lat: number; lon: number };

interface WeatherCacheEntry {
  timestamp: number;
  data: WeatherData;
}

const weatherCache = new Map<string, WeatherCacheEntry>();

function getFunctionUrl(): string {
  const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '');
  return `${supabaseUrl}/functions/v1/weather`;
}

function getAuthHeaders(): Record<string, string> {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${anonKey}`,
    apikey: anonKey,
  };
}

function cacheKey(query: LocationQuery) {
  return typeof query === 'string' ? `q:${query.toLowerCase()}` : `coords:${query.lat.toFixed(5)},${query.lon.toFixed(5)}`;
}

export async function fetchWeather(location: LocationQuery): Promise<WeatherData> {
  const key = cacheKey(location);
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const url = getFunctionUrl();
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ location }),
    });
  } catch {
    throw new Error('Unable to connect to the weather service. Check your internet connection and try again.');
  }

  let data: WeatherData | { error?: string } | null = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    const msg = (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string')
      ? data.error
      : `Weather request failed (${res.status}). Please try again.`;
    if (res.status === 503) {
      throw new Error('Weather service is not configured. Ask an admin to set the OpenWeather API key.');
    }
    throw new Error(msg);
  }

  if (!data || typeof data !== 'object' || !('location' in data) || !('today' in data)) {
    throw new Error('Weather service returned an unexpected response.');
  }

  const weatherData = data as WeatherData;
  weatherCache.set(key, { timestamp: Date.now(), data: weatherData });
  return weatherData;
}
