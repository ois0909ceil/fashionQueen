import type { IncomingMessage, ServerResponse } from 'node:http';

export interface WeatherData {
  currentTemp: number;
  apparentTemp: number;
  weatherCode: number;
  conditionLabel: string;
  conditionEmoji: string;
  minTemp: number;
  maxTemp: number;
  precipitationProbability: number;
}

type ApiRequest = IncomingMessage & {
  query?: Record<string, unknown>;
};

const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

function getSingleParam(value: unknown): string | null {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0];
  }
  return null;
}

function parseOriginUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === 'MY_APP_URL') return null;
  try {
    return new URL(trimmed).origin;
  } catch {
    return null;
  }
}

function applyCorsHeaders(
  req: IncomingMessage,
  res: ServerResponse,
  allowedMethods: string
): void {
  const originHeader = req.headers.origin;
  const origin = Array.isArray(originHeader) ? originHeader[0] : originHeader;

  if (origin) {
    const rawHost = req.headers['x-forwarded-host'] ?? req.headers.host;
    const requestHost = (Array.isArray(rawHost) ? rawHost[0] : rawHost)
      ?.split(',')[0]
      ?.trim();

    const allowedOrigins = new Set<string>();
    const appOrigin = parseOriginUrl(process.env.APP_URL);
    if (appOrigin) allowedOrigins.add(appOrigin);

    const vercelUrl = process.env.VERCEL_URL?.trim();
    if (vercelUrl) {
      const vercelOrigin = parseOriginUrl(
        vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`
      );
      if (vercelOrigin) allowedOrigins.add(vercelOrigin);
    }

    const extraOrigins = process.env.ALLOWED_ORIGIN?.split(',') ?? [];
    for (const item of extraOrigins) {
      const parsed = parseOriginUrl(item);
      if (parsed) allowedOrigins.add(parsed);
    }

    try {
      const originUrl = new URL(origin);
      const isAllowed =
        (requestHost !== undefined && originUrl.host === requestHost) ||
        originUrl.hostname === 'localhost' ||
        originUrl.hostname === '127.0.0.1' ||
        originUrl.hostname.endsWith('.vercel.app') ||
        originUrl.hostname.endsWith('.run.app') ||
        allowedOrigins.has(originUrl.origin);

      if (isAllowed) {
        res.setHeader('Access-Control-Allow-Origin', originUrl.origin);
      }
    } catch {
      // Ignore malformed Origin headers
    }
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', allowedMethods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function mapWeatherCodeToKorean(code: number): { label: string; emoji: string } {
  switch (code) {
    case 0:
      return { label: '맑음', emoji: '☀️' };
    case 1:
      return { label: '구름 조금', emoji: '🌤️' };
    case 2:
      return { label: '구름 많음', emoji: '⛅' };
    case 3:
      return { label: '흐림', emoji: '☁️' };
    case 45:
    case 48:
      return { label: '안개', emoji: '🌫️' };
    case 51:
    case 53:
    case 55:
      return { label: '이슬비', emoji: '🌦️' };
    case 56:
    case 57:
      return { label: '진눈깨비', emoji: '🌨️' };
    case 61:
    case 63:
    case 65:
      return { label: '비', emoji: '🌧️' };
    case 66:
    case 67:
      return { label: '찬 비', emoji: '🌧️' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { label: '눈', emoji: '❄️' };
    case 80:
    case 81:
    case 82:
      return { label: '소나기', emoji: '🌦️' };
    case 85:
    case 86:
      return { label: '눈보라', emoji: '🌨️' };
    case 95:
    case 96:
    case 99:
      return { label: '천둥번개', emoji: '⛈️' };
    default:
      return { label: '흐림', emoji: '☁️' };
  }
}

export default async function handler(
  req: ApiRequest,
  res: ServerResponse
): Promise<void> {
  applyCorsHeaders(req, res, 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: '허용되지 않은 요청 방식이에요.' });
    return;
  }

  const requestUrl = new URL(req.url ?? '/', 'http://localhost');
  const rawLat = requestUrl.searchParams.get('lat') ?? getSingleParam(req.query?.lat);
  const rawLon = requestUrl.searchParams.get('lon') ?? getSingleParam(req.query?.lon);

  if (
    rawLat === null ||
    rawLon === null ||
    rawLat.trim() === '' ||
    rawLon.trim() === ''
  ) {
    sendJson(res, 400, { error: '위도와 경도 값이 필요해요.' });
    return;
  }

  const lat = Number(rawLat);
  const lon = Number(rawLon);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    sendJson(res, 400, { error: '올바른 위도와 경도 범위가 아니에요.' });
    return;
  }

  const params = new URLSearchParams({
    latitude: lat.toFixed(6),
    longitude: lon.toFixed(6),
    current: 'temperature_2m,apparent_temperature,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'Asia/Seoul',
    forecast_days: '1',
  });

  try {
    const upstreamResponse = await fetch(
      `${OPEN_METEO_FORECAST_URL}?${params.toString()}`,
      {
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!upstreamResponse.ok) {
      sendJson(res, 502, { error: '날씨 정보를 불러오지 못했어요.' });
      return;
    }

    const data = (await upstreamResponse.json()) as {
      current?: {
        temperature_2m?: unknown;
        apparent_temperature?: unknown;
        weather_code?: unknown;
      };
      daily?: {
        temperature_2m_min?: unknown[];
        temperature_2m_max?: unknown[];
        precipitation_probability_max?: unknown[];
      };
    };

    const currentTempRaw = Number(data?.current?.temperature_2m);
    const apparentTempRaw = Number(data?.current?.apparent_temperature);
    if (
      !data?.current ||
      !data?.daily ||
      !Number.isFinite(currentTempRaw) ||
      !Number.isFinite(apparentTempRaw)
    ) {
      sendJson(res, 502, { error: '날씨 정보 형식이 올바르지 않아요.' });
      return;
    }

    const weatherCodeRaw = Number(data.current.weather_code ?? 0);
    const weatherCode = Number.isFinite(weatherCodeRaw) ? weatherCodeRaw : 0;
    const { label, emoji } = mapWeatherCodeToKorean(weatherCode);

    const rawMin = Number(data.daily.temperature_2m_min?.[0]);
    const rawMax = Number(data.daily.temperature_2m_max?.[0]);
    const rawPrecip = Number(data.daily.precipitation_probability_max?.[0]);

    const weather: WeatherData = {
      currentTemp: Math.round(currentTempRaw),
      apparentTemp: Math.round(apparentTempRaw),
      weatherCode,
      conditionLabel: label,
      conditionEmoji: emoji,
      minTemp: Math.round(Number.isFinite(rawMin) ? rawMin : currentTempRaw),
      maxTemp: Math.round(Number.isFinite(rawMax) ? rawMax : currentTempRaw),
      precipitationProbability: Math.round(
        Number.isFinite(rawPrecip) ? Math.min(100, Math.max(0, rawPrecip)) : 0
      ),
    };

    sendJson(res, 200, { weather });
  } catch (err) {
    console.error('Weather proxy error:', err);
    sendJson(res, 502, { error: '날씨 정보를 불러오지 못했어요.' });
  }
}
