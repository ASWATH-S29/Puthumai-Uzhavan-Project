import type { WeatherData } from '@/services/types';

export type { WeatherData } from '@/services/types';

const OPENWEATHER_BASE = 'https://api.openweathermap.org/data/2.5';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

type LocationQuery = string | { lat: number; lon: number };

interface WeatherCacheEntry {
  timestamp: number;
  data: WeatherData;
}

interface ForecastEntry {
  dt: number;
  pop?: number;
  main: { temp: number; humidity: number };
  weather?: { description?: string; icon?: string; main?: string }[];
  wind?: { speed?: number };
}

const weatherCache = new Map<string, WeatherCacheEntry>();

function getApiKey() {
  const key = (import.meta.env.VITE_OPENWEATHER_API_KEY ?? '').trim();
  if (!key) {
    throw new Error('Weather service is not configured. Set VITE_OPENWEATHER_API_KEY in your environment.');
  }
  return key;
}

function cacheKey(query: LocationQuery) {
  return typeof query === 'string' ? `q:${query.toLowerCase()}` : `coords:${query.lat.toFixed(5)},${query.lon.toFixed(5)}`;
}

function getWindDirection(deg: number) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(deg / 22.5) % 16];
}

function formatDay(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });
}

function formatTime(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

function mapIcon(iconCode: string | undefined, main: string | undefined) {
  if (!iconCode) {
    if (!main) return 'sun';
    const normalized = main.toLowerCase();
    if (normalized.includes('rain') || normalized.includes('thunder')) return 'rain';
    if (normalized.includes('cloud')) return 'cloud';
    return 'sun';
  }

  const prefix = iconCode.slice(0, 2);
  switch (prefix) {
    case '01':
      return 'sun';
    case '02':
    case '03':
      return 'partly';
    case '04':
      return 'cloud';
    case '09':
    case '10':
    case '11':
      return 'rain';
    case '13':
    case '50':
      return 'cloud';
    default:
      return 'sun';
  }
}

async function fetchOpenWeather(url: string) {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    // Network-level failure (offline, DNS failure, CORS, etc.)
    // The URL is never logged here because it contains the API key.
    throw new Error('Unable to connect to the weather service. Check your internet connection and try again.');
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Weather service authentication is unavailable. Please check the OpenWeather API key.');
    }
    if (res.status === 404) {
      throw new Error('Location not found. Try a different city name.');
    }
    if (res.status === 429) {
      throw new Error('Weather service request limit reached. Please try again later.');
    }
    // Status code only — never include the URL or response body; both can contain the key.
    throw new Error(`Weather request failed with status ${res.status}. Please try again.`);
  }
  return res.json();
}

async function fetchLocationData(query: LocationQuery) {
  const apiKey = getApiKey();
  const base = `${OPENWEATHER_BASE}/weather?units=metric&appid=${apiKey}`;
  const url =
    typeof query === 'string'
      ? `${base}&q=${encodeURIComponent(query)}`
      : `${base}&lat=${query.lat}&lon=${query.lon}`;

  return fetchOpenWeather(url);
}

async function fetchForecastData(lat: number, lon: number) {
  const apiKey = getApiKey();
  // Uses OpenWeather's 5-day / 3-hour forecast endpoint instead of
  // /onecall, which requires One Call API access.
  const url = `${OPENWEATHER_BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  return fetchOpenWeather(url);
}

export async function fetchWeather(location: LocationQuery): Promise<WeatherData> {
  const key = cacheKey(location);
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const locationData = await fetchLocationData(location);
  const forecastData = await fetchForecastData(locationData.coord.lat, locationData.coord.lon);

  const entries = Array.isArray(forecastData.list) ? forecastData.list : [];
  const first = entries[0];
  if (!first) {
    throw new Error('Weather forecast data is unavailable for this location.');
  }

  const grouped = new Map<string, ForecastEntry[]>();
  for (const item of entries) {
    const dayKey = new Date(item.dt * 1000).toISOString().slice(0, 10);
    const list = grouped.get(dayKey) ?? [];
    list.push(item);
    grouped.set(dayKey, list);
  }

  const daily = Array.from(grouped.values()).slice(0, 5);

  const weatherData: WeatherData = {
    location: `${locationData.name}${locationData.sys?.country ? `, ${locationData.sys.country}` : ''}`,
    today: {
      temp: Math.round(locationData.main.temp),
      feelsLike: Math.round(locationData.main.feels_like),
      humidity: locationData.main.humidity,
      wind: Math.round((locationData.wind?.speed ?? 0) * 3.6),
      rainfall: locationData.rain?.['1h'] ?? 0,
      condition: locationData.weather?.[0]?.description ?? 'Clear',
      icon: mapIcon(locationData.weather?.[0]?.icon, locationData.weather?.[0]?.main),
      rainProbability: Math.round((first.pop ?? 0) * 100),
      pressure: locationData.main.pressure,
      visibility: locationData.visibility,
      windDirection: getWindDirection(locationData.wind?.deg ?? 0),
      sunrise: locationData.sys?.sunrise ? formatTime(locationData.sys.sunrise) : undefined,
      sunset: locationData.sys?.sunset ? formatTime(locationData.sys.sunset) : '',
    },
    forecast: daily.map((items: ForecastEntry[]) => {
      const representative = items.reduce((best, item) => {
        const bestHour = Math.abs(new Date(best.dt * 1000).getUTCHours() - 12);
        const itemHour = Math.abs(new Date(item.dt * 1000).getUTCHours() - 12);
        return itemHour < bestHour ? item : best;
      }, items[0]);
      const temps = items.map((item) => item.main.temp);
      const humidity = Math.round(items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length);
      const wind = Math.round((items.reduce((sum, item) => sum + (item.wind?.speed ?? 0), 0) / items.length) * 3.6);
      const pop = Math.round(Math.max(...items.map((item) => item.pop ?? 0)) * 100);

      return {
        day: formatDay(representative.dt),
        tempHi: Math.round(Math.max(...temps)),
        tempLo: Math.round(Math.min(...temps)),
        condition: representative.weather?.[0]?.description ?? 'Clear',
        icon: mapIcon(representative.weather?.[0]?.icon, representative.weather?.[0]?.main),
        humidity,
        wind,
        rainProbability: pop,
      };
    }),
  };

  weatherCache.set(key, { timestamp: Date.now(), data: weatherData });
  return weatherData;
}
