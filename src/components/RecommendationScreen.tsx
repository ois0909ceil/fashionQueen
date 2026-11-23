import React from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { BrandMark, StyleId, StyleIllustration } from './StyleIllustrations';
import type { WeatherData } from '../utils/weather';

export interface OutfitRecommendation {
  outer: string;
  top: string;
  bottom: string;
  shoes: string;
  accessory: string;
  reason: string;
}

interface RecommendationScreenProps {
  styleId: StyleId;
  styleName: string;
  locationLabel: string;
  weather: WeatherData;
  recommendation: OutfitRecommendation | null;
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onGoHome: () => void;
}

export default function RecommendationScreen({
  styleId,
  styleName,
  locationLabel,
  weather,
  recommendation,
  isLoading,
  errorMessage,
  onRetry,
  onGoHome,
}: RecommendationScreenProps) {
  const items = recommendation
    ? [
        { emoji: '🧥', label: '겉옷', value: recommendation.outer },
        { emoji: '👕', label: '상의', value: recommendation.top },
        { emoji: '👖', label: '하의', value: recommendation.bottom },
        { emoji: '👟', label: '신발', value: recommendation.shoes },
        { emoji: '👜', label: '소품', value: recommendation.accessory },
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 w-full border-b border-sky-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <BrandMark />
            <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
              옷 차림
            </span>
          </div>
          <span className="text-base font-medium text-sky-700 whitespace-nowrap shrink-0">
            오늘의 옷차림
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-5 pt-7 pb-10 sm:pt-10 sm:pb-14 flex flex-col justify-between gap-8">
        <div>
          {/* Screen Title */}
          <section className="mb-5 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              오늘의 옷차림
            </h1>
          </section>

          {/* One-line Weather Summary */}
          <div className="mb-7 rounded-2xl bg-sky-100/80 border border-sky-200 px-4 sm:px-5 py-3.5 text-base sm:text-lg font-bold text-slate-800 leading-snug tabular-nums">
            <span>
              {weather.conditionEmoji} {locationLabel} · 지금 {weather.currentTemp}℃ (체감{' '}
              {weather.apparentTemp}℃) · {weather.conditionLabel} · 최저 {weather.minTemp}℃ / 최고{' '}
              {weather.maxTemp}℃ · 비 올 확률 {weather.precipitationProbability}%
            </span>
          </div>

          {/* Recommendation Card */}
          <section
            aria-live="polite"
            className="rounded-3xl p-6 sm:p-8 bg-white border-2 border-sky-200 shadow-sm"
          >
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
                <RefreshCw
                  className="w-10 h-10 text-sky-600 animate-spin"
                  aria-hidden="true"
                />
                <p className="text-xl sm:text-2xl font-bold text-sky-800">
                  AI가 옷을 고르는 중이에요…
                </p>
              </div>
            ) : errorMessage || !recommendation ? (
              <div className="py-10 flex flex-col items-center justify-center text-center gap-3">
                <AlertCircle className="w-10 h-10 text-amber-600" aria-hidden="true" />
                <p className="text-xl sm:text-2xl font-bold text-slate-900 text-balance">
                  {errorMessage ?? '지금은 추천할 수 없어요. 잠시 후 다시 눌러 주세요'}
                </p>
              </div>
            ) : (
              <div>
                {/* Card Header: Chosen Style Illustration & Name */}
                <div className="flex items-center gap-4 pb-6 border-b border-sky-100">
                  <div className="shrink-0">
                    <StyleIllustration styleId={styleId} selected />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-sky-700">
                      선택한 스타일
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
                      {styleName}
                    </h2>
                  </div>
                </div>

                {/* Outfit Items */}
                <ul className="divide-y divide-sky-100 my-2">
                  {items.map((item) => (
                    <li
                      key={item.label}
                      className="py-4 sm:py-5 flex items-start gap-3.5 sm:gap-4"
                    >
                      <span
                        className="text-2xl sm:text-3xl leading-none shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        {item.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm sm:text-base font-bold text-sky-800">
                          {item.label}
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 leading-snug">
                          {item.value}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Reason */}
                <div className="mt-4 pt-5 border-t border-sky-100">
                  <div className="rounded-2xl bg-sky-50/90 border border-sky-200 p-4 sm:p-5">
                    <div className="text-base sm:text-lg font-bold text-sky-900 mb-1.5">
                      💡 추천 이유
                    </div>
                    <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">
                      {recommendation.reason}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Bottom Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onRetry}
            className={`min-h-[60px] px-6 rounded-2xl text-xl font-bold flex items-center justify-center gap-2.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
              isLoading
                ? 'bg-sky-200/80 text-sky-700/70 border-2 border-sky-200 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white shadow-lg shadow-sky-600/25 cursor-pointer'
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>다시 추천받기</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onGoHome}
            className={`min-h-[60px] px-6 rounded-2xl border-2 text-xl font-bold flex items-center justify-center gap-2.5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
              isLoading
                ? 'border-sky-100 bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'border-sky-200 bg-white hover:bg-sky-50 text-slate-800 cursor-pointer'
            }`}
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            <span>처음으로</span>
          </button>
        </div>
      </main>
    </div>
  );
}
