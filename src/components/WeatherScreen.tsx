import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  LocateFixed,
  MapPin,
  RefreshCw,
  Search,
} from 'lucide-react';
import { BrandMark } from './StyleIllustrations';
import {
  ALL_SEOUL_DONGS,
  CITIES,
  CityId,
  SEOUL_GUS,
  findNearestRegionLabel,
} from '../data/koreanRegions';
import { WeatherData, fetchOpenMeteoWeather } from '../utils/weather';

interface WeatherScreenProps {
  onBack: () => void;
  onRecommend: (locationLabel: string, weather: WeatherData) => void;
}

interface SelectedLocation {
  label: string;
  lat: number;
  lon: number;
  source: 'gps' | 'manual';
}

export default function WeatherScreen({ onBack, onRecommend }: WeatherScreenProps) {
  const [geoState, setGeoState] = useState<'idle' | 'locating' | 'success' | 'failed'>('idle');
  const [selectedCityId, setSelectedCityId] = useState<CityId | null>(null);
  const [selectedSeoulGuId, setSelectedSeoulGuId] = useState<string | null>(null);
  const [seoulSearch, setSeoulSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const manualOverrideRef = useRef(false);

  const loadWeatherForCoords = async (loc: SelectedLocation) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setSelectedLocation(loc);
    setWeatherLoading(true);
    setWeatherError(null);

    try {
      const data = await fetchOpenMeteoWeather(loc.lat, loc.lon, controller.signal);
      if (!controller.signal.aborted) {
        setWeather(data);
        setWeatherLoading(false);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      if (!controller.signal.aborted) {
        setWeather(null);
        setWeatherLoading(false);
        setWeatherError('날씨 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      }
    }
  };

  const requestCurrentLocation = () => {
    manualOverrideRef.current = false;

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoState('failed');
      return;
    }

    setGeoState('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (manualOverrideRef.current) return;
        const { latitude, longitude } = position.coords;
        const nearestLabel = findNearestRegionLabel(latitude, longitude);
        setGeoState('success');
        void loadWeatherForCoords({
          label: nearestLabel,
          lat: latitude,
          lon: longitude,
          source: 'gps',
        });
      },
      () => {
        if (manualOverrideRef.current) return;
        setGeoState('failed');
      },
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    requestCurrentLocation();
    return () => {
      abortControllerRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCity = useMemo(
    () => CITIES.find((c) => c.id === selectedCityId) ?? null,
    [selectedCityId]
  );

  const selectedSeoulGu = useMemo(
    () => SEOUL_GUS.find((g) => g.id === selectedSeoulGuId) ?? null,
    [selectedSeoulGuId]
  );

  const filteredSeoulDongs = useMemo(() => {
    const query = seoulSearch.trim();
    if (!query) return [];
    return ALL_SEOUL_DONGS.filter(
      (item) => item.dongName.includes(query) || item.guName.includes(query)
    ).slice(0, 24);
  }, [seoulSearch]);

  const handleCitySelect = (cityId: CityId) => {
    manualOverrideRef.current = true;
    setSelectedCityId(cityId);
    setSelectedSeoulGuId(null);
    setSeoulSearch('');
  };

  const handleDistrictSelect = (label: string, lat: number, lon: number) => {
    manualOverrideRef.current = true;
    void loadWeatherForCoords({
      label,
      lat,
      lon,
      source: 'manual',
    });
  };

  const handleRecommendClick = () => {
    if (!weather || weatherLoading || !selectedLocation) return;
    onRecommend(selectedLocation.label, weather);
  };

  const locationPromptText =
    geoState === 'failed'
      ? '위치를 찾지 못했어요. 지역을 골라 주세요'
      : '지역을 골라 주세요';

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
            오늘 날씨
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-5 pt-7 pb-10 sm:pt-10 sm:pb-14">
        {/* Intro Heading */}
        <section className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
            오늘 날씨
          </h1>
          <p className="mt-2.5 text-lg sm:text-xl text-slate-600 leading-relaxed">
            지금 계신 곳이나 외출할 지역의 오늘 날씨를 확인해 볼게요.
          </p>
        </section>

        <div className="space-y-8 sm:space-y-10">
          {/* Weather Display Card */}
          {(weatherLoading || weather || weatherError) && (
            <section
              aria-live="polite"
              className="rounded-3xl p-6 sm:p-8 bg-white border-2 border-sky-300 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 text-sky-800 font-bold text-lg sm:text-xl">
                  <MapPin className="w-5 h-5 shrink-0 text-sky-600" aria-hidden="true" />
                  <span>{selectedLocation?.label ?? '선택한 지역'}</span>
                </div>
                {selectedLocation && !weatherLoading && (
                  <button
                    type="button"
                    onClick={() => void loadWeatherForCoords(selectedLocation)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-sm sm:text-base font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                    <span>새로고침</span>
                  </button>
                )}
              </div>

              {weatherLoading ? (
                <div className="py-6 flex items-center gap-3 text-xl sm:text-2xl font-bold text-sky-700">
                  <RefreshCw className="w-6 h-6 animate-spin shrink-0" aria-hidden="true" />
                  <span>날씨를 확인하는 중…</span>
                </div>
              ) : weatherError ? (
                <div className="py-3 space-y-4">
                  <p className="flex items-center gap-2 text-lg font-bold text-amber-700">
                    <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span>{weatherError}</span>
                  </p>
                  {selectedLocation && (
                    <button
                      type="button"
                      onClick={() => void loadWeatherForCoords(selectedLocation)}
                      className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-base sm:text-lg font-bold cursor-pointer transition-colors"
                    >
                      다시 확인하기
                    </button>
                  )}
                </div>
              ) : weather ? (
                <div className="space-y-3 bg-sky-50/80 border border-sky-200 rounded-2xl p-5 sm:p-6">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug tabular-nums">
                    {weather.conditionEmoji} 지금 {weather.currentTemp}℃ (체감{' '}
                    {weather.apparentTemp}℃) · {weather.conditionLabel}
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-slate-700 leading-snug tabular-nums">
                    오늘 최저 {weather.minTemp}℃ · 최고 {weather.maxTemp}℃ · 비 올 확률{' '}
                    {weather.precipitationProbability}%
                  </p>
                </div>
              ) : null}
            </section>
          )}

          {/* Location Selection Card */}
          <section
            aria-labelledby="heading-location"
            className="rounded-3xl p-5 sm:p-7 bg-white border border-sky-100 shadow-xs"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <h2 id="heading-location" className="text-2xl font-bold text-slate-900">
                  위치 선택
                </h2>
                <p
                  className={`mt-1.5 flex items-center gap-2 text-base sm:text-lg font-bold ${
                    geoState === 'failed' ? 'text-amber-700' : 'text-sky-800'
                  }`}
                >
                  {geoState === 'failed' && (
                    <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                  )}
                  <span>
                    {geoState === 'locating'
                      ? '현재 위치를 확인하는 중… (직접 지역을 골라도 돼요)'
                      : locationPromptText}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={requestCurrentLocation}
                disabled={geoState === 'locating'}
                className="min-h-[46px] px-4 py-2 rounded-2xl border-2 border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 text-base font-bold inline-flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
              >
                <LocateFixed className="w-5 h-5" aria-hidden="true" />
                <span>내 위치로 찾기</span>
              </button>
            </div>

            {/* 8 Cities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CITIES.map((city) => {
                const isSelected = selectedCityId === city.id;
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleCitySelect(city.id)}
                    aria-pressed={isSelected}
                    className={`min-h-[58px] px-4 py-3 rounded-2xl text-lg sm:text-xl font-bold whitespace-nowrap transition-all duration-150 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
                      isSelected
                        ? 'bg-sky-600 text-white border-2 border-sky-600 shadow-md shadow-sky-600/20'
                        : 'bg-sky-50/60 text-slate-800 border-2 border-sky-200/80 hover:border-sky-400 hover:bg-sky-50'
                    }`}
                  >
                    {city.name}
                  </button>
                );
              })}
            </div>

            {/* Sub-region Selection */}
            {selectedCity && (
              <div className="mt-7 pt-6 border-t border-sky-100">
                {selectedCity.id === 'seoul' ? (
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h3 className="text-xl font-bold text-slate-900">
                        서울 동 단위 선택
                      </h3>
                      <div className="relative w-full sm:w-72">
                        <Search
                          className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          type="text"
                          value={seoulSearch}
                          onChange={(e) => setSeoulSearch(e.target.value)}
                          placeholder="동 이름 검색 (예: 역삼동, 서교동)"
                          aria-label="서울 동 이름 검색"
                          className="w-full min-h-[48px] pl-11 pr-4 py-2.5 rounded-2xl border-2 border-sky-200 bg-sky-50/40 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    {seoulSearch.trim() ? (
                      <div>
                        <p className="mb-3 text-base font-medium text-slate-600">
                          검색된 동을 누르면 바로 날씨를 확인해요
                        </p>
                        {filteredSeoulDongs.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                            {filteredSeoulDongs.map((dong) => {
                              const fullLabel = `서울 ${dong.guName} ${dong.dongName}`;
                              const isSelected = selectedLocation?.label === fullLabel;
                              return (
                                <button
                                  key={dong.id}
                                  type="button"
                                  onClick={() =>
                                    handleDistrictSelect(fullLabel, dong.lat, dong.lon)
                                  }
                                  className={`min-h-[54px] px-4 py-2.5 rounded-2xl text-base sm:text-lg font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                    isSelected
                                      ? 'bg-sky-600 text-white border-2 border-sky-600 shadow-sm'
                                      : 'bg-white text-slate-800 border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50/50'
                                  }`}
                                >
                                  <span>{dong.dongName}</span>
                                  <span
                                    className={`text-sm font-medium ${
                                      isSelected ? 'text-sky-100' : 'text-slate-500'
                                    }`}
                                  >
                                    {dong.guName}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-base text-slate-500 py-3">
                            일치하는 동 이름이 없어요. 아래 구 목록에서 먼저 골라 보세요.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <p className="mb-3 text-base font-medium text-slate-600">
                            먼저 구를 고른 뒤 동을 선택해 주세요
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                            {SEOUL_GUS.map((gu) => {
                              const isGuSelected = selectedSeoulGuId === gu.id;
                              return (
                                <button
                                  key={gu.id}
                                  type="button"
                                  onClick={() => setSelectedSeoulGuId(gu.id)}
                                  className={`min-h-[50px] px-2.5 py-2 rounded-xl text-base sm:text-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                                    isGuSelected
                                      ? 'bg-sky-700 text-white border-2 border-sky-700 shadow-sm'
                                      : 'bg-sky-50/60 text-slate-800 border border-sky-200 hover:border-sky-400'
                                  }`}
                                >
                                  {gu.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {selectedSeoulGu && (
                          <div className="pt-4 border-t border-sky-100">
                            <h4 className="mb-3 text-lg font-bold text-slate-900">
                              {selectedSeoulGu.name} 동 선택
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                              {selectedSeoulGu.dongs.map((dong) => {
                                const fullLabel = `서울 ${selectedSeoulGu.name} ${dong.name}`;
                                const isDongSelected = selectedLocation?.label === fullLabel;
                                return (
                                  <button
                                    key={dong.name}
                                    type="button"
                                    onClick={() =>
                                      handleDistrictSelect(fullLabel, dong.lat, dong.lon)
                                    }
                                    className={`min-h-[54px] px-3 py-2.5 rounded-2xl text-base sm:text-lg font-bold transition-all cursor-pointer ${
                                      isDongSelected
                                        ? 'bg-sky-600 text-white border-2 border-sky-600 shadow-md shadow-sky-600/20'
                                        : 'bg-white text-slate-800 border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50/50'
                                    }`}
                                  >
                                    {dong.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {selectedCity.name} {selectedCity.subUnitLabel}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {selectedCity.subRegions?.map((sub) => {
                        const fullLabel = `${selectedCity.name} ${sub.name}`;
                        const isSelected = selectedLocation?.label === fullLabel;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() =>
                              handleDistrictSelect(fullLabel, sub.lat, sub.lon)
                            }
                            className={`min-h-[54px] px-3 py-2.5 rounded-2xl text-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-sky-600 text-white border-2 border-sky-600 shadow-md shadow-sky-600/20'
                                : 'bg-white text-slate-800 border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50/50'
                            }`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Bottom Action Buttons */}
        <div className="mt-10 sm:mt-12 pt-2 space-y-3">
          {!weather && !weatherLoading && (
            <p className="text-center text-base sm:text-lg font-bold text-sky-800">
              먼저 지역을 골라 오늘 날씨를 확인해 주세요
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={onBack}
              className="min-h-[60px] px-6 rounded-2xl border-2 border-sky-200 bg-white hover:bg-sky-50 text-slate-800 text-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
            >
              <ArrowLeft className="w-6 h-6" aria-hidden="true" />
              <span>이전</span>
            </button>

            <button
              type="button"
              aria-disabled={!weather || weatherLoading}
              onClick={handleRecommendClick}
              className={`sm:col-span-2 min-h-[60px] px-6 rounded-2xl text-xl font-bold flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
                weather && !weatherLoading
                  ? 'bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white shadow-lg shadow-sky-600/25 cursor-pointer'
                  : 'bg-sky-200/80 text-sky-700/75 border-2 border-sky-200 cursor-not-allowed'
              }`}
            >
              <span>🤖 옷차림 추천받기</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
