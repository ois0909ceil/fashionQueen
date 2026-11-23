import type { IncomingMessage, ServerResponse } from 'node:http';
import { GoogleGenAI, Type } from '@google/genai';

interface RecommendOutfitRequestBody {
  ageGroup?: unknown;
  gender?: unknown;
  styleName?: unknown;
  styleDescription?: unknown;
  currentTemp?: unknown;
  apparentTemp?: unknown;
  conditionLabel?: unknown;
  minTemp?: unknown;
  maxTemp?: unknown;
  precipitationProbability?: unknown;
}

export interface OutfitRecommendation {
  outer: string;
  top: string;
  bottom: string;
  shoes: string;
  accessory: string;
  reason: string;
}

type ApiRequest = IncomingMessage & {
  body?: unknown;
};

const MAX_BODY_BYTES = 16 * 1024;
const PRIMARY_MODEL = 'gemini-3.1-flash-lite';
const FALLBACK_MODEL = 'gemini-2.5-flash';

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

async function readJsonBody(req: ApiRequest): Promise<unknown> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      return req.body.trim() ? JSON.parse(req.body) : {};
    }
    if (Buffer.isBuffer(req.body)) {
      const text = req.body.toString('utf8').trim();
      return text ? JSON.parse(text) : {};
    }
    return req.body;
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
    totalBytes += buffer.length;
    if (totalBytes > MAX_BODY_BYTES) {
      throw new Error('PAYLOAD_TOO_LARGE');
    }
    chunks.push(buffer);
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw ? JSON.parse(raw) : {};
}

function readValidString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

function readValidNumber(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  if (value < min || value > max) return null;
  return value;
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }

  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getModelCandidates(): string[] {
  const customModel = process.env.GEMINI_MODEL?.trim();
  const candidates = [customModel, PRIMARY_MODEL, FALLBACK_MODEL].filter(
    (m): m is string => Boolean(m)
  );
  return Array.from(new Set(candidates));
}

function extractHttpStatus(err: unknown): number | null {
  if (!err || typeof err !== 'object') return null;
  const record = err as Record<string, unknown>;
  if (typeof record.status === 'number') return record.status;
  if (typeof record.statusCode === 'number') return record.statusCode;
  if (typeof record.code === 'number') return record.code;
  if (typeof record.message === 'string') {
    if (record.message.includes('404') || record.message.includes('NOT_FOUND')) {
      return 404;
    }
    if (record.message.includes('403') || record.message.includes('PERMISSION_DENIED')) {
      return 403;
    }
    if (record.message.includes('429') || record.message.includes('RESOURCE_EXHAUSTED')) {
      return 429;
    }
    if (record.message.includes('API_KEY_INVALID')) {
      return 400;
    }
  }
  return null;
}

function stripJsonCodeFence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : trimmed;
}

export default async function handler(
  req: ApiRequest,
  res: ServerResponse
): Promise<void> {
  applyCorsHeaders(req, res, 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: '허용되지 않은 요청 방식이에요.' });
    return;
  }

  let rawBody: unknown;
  try {
    rawBody = await readJsonBody(req);
  } catch (err) {
    if (err instanceof Error && err.message === 'PAYLOAD_TOO_LARGE') {
      sendJson(res, 413, { error: '요청 크기가 너무 커요.' });
      return;
    }
    sendJson(res, 400, { error: '요청 형식이 올바르지 않아요.' });
    return;
  }

  if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
    sendJson(res, 400, { error: '추천에 필요한 정보가 부족해요.' });
    return;
  }

  const body = rawBody as RecommendOutfitRequestBody;
  const ageGroup = readValidString(body.ageGroup, 30);
  const gender = readValidString(body.gender, 30);
  const styleName = readValidString(body.styleName, 60);
  const styleDescription =
    typeof body.styleDescription === 'string'
      ? body.styleDescription.trim().slice(0, 150)
      : '';
  const conditionLabel = readValidString(body.conditionLabel, 50);

  const currentTemp = readValidNumber(body.currentTemp, -100, 100);
  const apparentTemp = readValidNumber(body.apparentTemp, -100, 100);
  const minTemp = readValidNumber(body.minTemp, -100, 100);
  const maxTemp = readValidNumber(body.maxTemp, -100, 100);
  const precipitationProbability = readValidNumber(
    body.precipitationProbability,
    0,
    100
  );

  if (
    !ageGroup ||
    !gender ||
    !styleName ||
    !conditionLabel ||
    currentTemp === null ||
    apparentTemp === null ||
    minTemp === null ||
    maxTemp === null ||
    precipitationProbability === null
  ) {
    sendJson(res, 400, { error: '추천에 필요한 정보가 부족하거나 올바르지 않아요.' });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    sendJson(res, 500, {
      error: '서버에 GEMINI_API_KEY 환경 변수가 설정되지 않았어요.',
    });
    return;
  }

  const tempDiff = maxTemp - minTemp;
  const prompt = [
    '아래 사용자 정보와 오늘 날씨를 보고, 딱 1가지 옷차림을 추천해 주세요.',
    '',
    '[사용자 정보]',
    `- 연령대: ${ageGroup}`,
    `- 성별: ${gender}`,
    `- 고른 옷 스타일: ${styleName}${styleDescription ? ` (${styleDescription})` : ''}`,
    '',
    '[오늘 날씨]',
    `- 지금 기온: ${currentTemp}℃`,
    `- 체감온도: ${apparentTemp}℃`,
    `- 날씨 상태: ${conditionLabel}`,
    `- 오늘 최저 기온: ${minTemp}℃`,
    `- 오늘 최고 기온: ${maxTemp}℃ (일교차 ${tempDiff}℃)`,
    `- 강수 확률: ${precipitationProbability}%`,
    '',
    '[추천 규칙]',
    '1. 사용자가 고른 스타일에 맞는 옷차림을 정확히 1가지로 정해 겉옷, 상의, 하의, 신발, 소품을 모두 추천해 주세요.',
    '2. 오늘 기온과 날씨에 꼭 맞게 골라 주세요. 강수 확률이 높거나 비/눈 소식이 있으면 소품이나 신발에 우산 또는 방수 신발을 꼭 넣어 주세요.',
    '3. 아침저녁과 낮의 기온 차이(일교차)가 크면 벗고 입기 좋은 껴입기를 추천해 주세요.',
    '4. 연령대와 성별에 잘 어울리면서도 누구나 쉽게 구할 수 있는 평범하고 실용적인 옷으로 골라 주세요. 특정 브랜드 이름은 절대 넣지 마세요.',
    '5. 추천 이유(reason)는 오늘 날씨를 근거로 한 문장으로만 써 주세요.',
    '6. 모든 문장은 친절한 존댓말과 쉬운 한국어로 써 주세요.',
    '7. 반드시 지정된 JSON 형식으로만 답해 주세요.',
  ].join('\n');

  const modelCandidates = getModelCandidates();
  let lastError: unknown = null;

  for (const modelName of modelCandidates) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction:
            '당신은 한국인의 일상과 날씨에 맞춰 실용적이고 단정한 옷차림을 안내하는 친절한 코디 도우미입니다. 반드시 쉬운 한국어 존댓말로 답하고 특정 브랜드명은 쓰지 마세요.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              outer: {
                type: Type.STRING,
                description:
                  '겉옷 추천 한 줄 (예: 가벼운 베이지 면 재킷 — 필요 없으면 가벼운 카디건 등 실용적 표현)',
              },
              top: {
                type: Type.STRING,
                description: '상의 추천 한 줄',
              },
              bottom: {
                type: Type.STRING,
                description: '하의 추천 한 줄',
              },
              shoes: {
                type: Type.STRING,
                description: '신발 추천 한 줄',
              },
              accessory: {
                type: Type.STRING,
                description: '소품 추천 한 줄 (비 올 확률이 높으면 우산 포함)',
              },
              reason: {
                type: Type.STRING,
                description: '오늘 날씨를 근거로 한 추천 이유 한 문장 (존댓말)',
              },
            },
            required: ['outer', 'top', 'bottom', 'shoes', 'accessory', 'reason'],
          },
        },
      });

      const rawText = stripJsonCodeFence(response.text ?? '');
      if (!rawText) {
        sendJson(res, 502, { error: '추천 응답이 비어 있어요.' });
        return;
      }

      const parsed = JSON.parse(rawText) as Partial<OutfitRecommendation>;
      if (
        typeof parsed.outer !== 'string' ||
        !parsed.outer.trim() ||
        typeof parsed.top !== 'string' ||
        !parsed.top.trim() ||
        typeof parsed.bottom !== 'string' ||
        !parsed.bottom.trim() ||
        typeof parsed.shoes !== 'string' ||
        !parsed.shoes.trim() ||
        typeof parsed.accessory !== 'string' ||
        !parsed.accessory.trim() ||
        typeof parsed.reason !== 'string' ||
        !parsed.reason.trim()
      ) {
        sendJson(res, 502, { error: '추천 정보 형식이 올바르지 않아요.' });
        return;
      }

      sendJson(res, 200, {
        recommendation: {
          outer: parsed.outer.trim(),
          top: parsed.top.trim(),
          bottom: parsed.bottom.trim(),
          shoes: parsed.shoes.trim(),
          accessory: parsed.accessory.trim(),
          reason: parsed.reason.trim(),
        },
      });
      return;
    } catch (err) {
      lastError = err;
      const status = extractHttpStatus(err);
      console.error(`Gemini recommendation error (model=${modelName}):`, err);

      // Retry with fallback model only if the model is unavailable/not found
      if (status === 404 || status === 400) {
        continue;
      }
      break;
    }
  }

  const finalStatus = extractHttpStatus(lastError);
  if (finalStatus === 400 || finalStatus === 403) {
    sendJson(res, 502, {
      error: 'Gemini API 키가 올바르지 않거나 권한이 없어요. 환경 변수를 확인해 주세요.',
    });
    return;
  }
  if (finalStatus === 429) {
    sendJson(res, 429, {
      error: '요청이 많아 잠시 기다려야 해요. 잠시 후 다시 눌러 주세요.',
    });
    return;
  }
  if (finalStatus === 404) {
    sendJson(res, 502, {
      error: 'AI 모델을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
    });
    return;
  }

  sendJson(res, 502, { error: '지금은 추천할 수 없어요. 잠시 후 다시 눌러 주세요.' });
}
