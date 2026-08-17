const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const OPENWEATHER_BASE = 'https://api.openweathermap.org/data/2.5';

interface ForecastEntry {
  dt: number;
  pop?: number;
  main: { temp: number; humidity: number };
  weather?: { description?: string; icon?: string; main?: string }[];
  wind?: { speed?: number };
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
    case '01': return 'sun';
    case '02':
    case '03': return 'partly';
    case '04': return 'cloud';
    case '09':
    case '10':
    case '11': return 'rain';
    case '13':
    case '50': return 'cloud';
    default: return 'sun';
  }
}

async function fetchOpenWeather(url: string) {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new Error('Unable to connect to the weather service. Check your internet connection and try again.');
  }
  if (!res.ok) {
    if (res.status === 401) throw new Error('Weather service authentication is unavailable. Please check the OpenWeather API key.');
    if (res.status === 404) throw new Error('Location not found. Try a different city name.');
    if (res.status === 429) throw new Error('Weather service request limit reached. Please try again later.');
    throw new Error(`Weather request failed with status ${res.status}. Please try again.`);
  }
  return res.json();
}

interface RequestBody {
  location: string | { lat: number; lon: number };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Weather service is not configured. Set the OPENWEATHER_API_KEY secret.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const body = (await req.json()) as RequestBody;
    const query = body.location;
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Location is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const base = `${OPENWEATHER_BASE}/weather?units=metric&appid=${apiKey}`;
    const locationUrl = typeof query === 'string'
      ? `${base}&q=${encodeURIComponent(query)}`
      : `${base}&lat=${query.lat}&lon=${query.lon}`;

    const locationData = await fetchOpenWeather(locationUrl);
    const forecastUrl = `${OPENWEATHER_BASE}/forecast?lat=${locationData.coord.lat}&lon=${locationData.coord.lon}&units=metric&appid=${apiKey}`;
    const forecastData = await fetchOpenWeather(forecastUrl);

    const entries: ForecastEntry[] = Array.isArray(forecastData.list) ? forecastData.list : [];
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

    const weatherData = {
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

    return new Response(
      JSON.stringify(weatherData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown weather error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
