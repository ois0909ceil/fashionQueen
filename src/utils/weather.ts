import { getApiUrl } from './api';

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

export function mapWeatherCodeToKorean(code: number): { label: string; emoji: string } {
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

export async function fetchOpenMeteoWeather(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<WeatherData> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  });

  const response = await fetch(`${getApiUrl('/api/weather')}?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error('날씨 정보를 불러오지 못했어요.');
  }

  const data = (await response.json()) as { weather?: WeatherData };

  if (!data?.weather || typeof data.weather.currentTemp !== 'number') {
    throw new Error('날씨 정보 형식이 올바르지 않아요.');
  }

  return data.weather;
}
