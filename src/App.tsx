import React, { useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Check } from 'lucide-react';
import { BrandMark, StyleId, StyleIllustration } from './components/StyleIllustrations';
import WeatherScreen from './components/WeatherScreen';
import RecommendationScreen, {
  type OutfitRecommendation,
} from './components/RecommendationScreen';
import type { WeatherData } from './utils/weather';
import { getApiUrl } from './utils/api';

type AgeGroup = '20대' | '30대' | '40대' | '50대' | '60대' | '70대 이상';
type Gender = '여성' | '남성' | '선택 안 함';

interface ClothingStyleOption {
  id: StyleId;
  name: string;
  description: string;
}

const AGE_GROUPS: AgeGroup[] = ['20대', '30대', '40대', '50대', '60대', '70대 이상'];

const GENDERS: Gender[] = ['여성', '남성', '선택 안 함'];

const CLOTHING_STYLES: ClothingStyleOption[] = [
  {
    id: 'casual',
    name: '편안한 캐주얼',
    description: '동네 산책·장보기, 편하고 무난하게',
  },
  {
    id: 'neat',
    name: '단정한 외출복',
    description: '모임·병원·관공서, 깔끔하게',
  },
  {
    id: 'active',
    name: '활동적인 운동복',
    description: '걷기·등산·운동, 가볍고 따뜻하게',
  },
  {
    id: 'classic',
    name: '차분한 클래식',
    description: '격식 있는 자리, 고급스럽게',
  },
];

export default function App() {
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleId | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [screen, setScreen] = useState<'profile' | 'weather' | 'recommendation'>('profile');

  const [weatherSnapshot, setWeatherSnapshot] = useState<{
    locationLabel: string;
    weather: WeatherData;
  } | null>(null);
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  const ageSectionRef = useRef<HTMLElement | null>(null);
  const genderSectionRef = useRef<HTMLElement | null>(null);
  const styleSectionRef = useRef<HTMLElement | null>(null);

  const getMissingInfo = () => {
    if (!ageGroup) {
      return {
        field: 'age' as const,
        message: '연령대를 골라 주세요',
        ref: ageSectionRef,
      };
    }
    if (!gender) {
      return {
        field: 'gender' as const,
        message: '성별을 골라 주세요',
        ref: genderSectionRef,
      };
    }
    if (!selectedStyle) {
      return {
        field: 'style' as const,
        message: '선호하는 옷 스타일을 골라 주세요',
        ref: styleSectionRef,
      };
    }
    return null;
  };

  const missingInfo = getMissingInfo();
  const isComplete = missingInfo === null;

  const selectedStyleOption =
    CLOTHING_STYLES.find((s) => s.id === selectedStyle) ?? null;

  const requestRecommendation = async (
    locationLabel: string,
    weather: WeatherData
  ) => {
    if (!ageGroup || !gender || !selectedStyleOption || recommendLoading) return;

    setWeatherSnapshot({ locationLabel, weather });
    setScreen('recommendation');
    setRecommendLoading(true);
    setRecommendError(null);
    setRecommendation(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const response = await fetch(getApiUrl('/api/recommend-outfit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ageGroup,
          gender,
          styleName: selectedStyleOption.name,
          styleDescription: selectedStyleOption.description,
          currentTemp: weather.currentTemp,
          apparentTemp: weather.apparentTemp,
          conditionLabel: weather.conditionLabel,
          minTemp: weather.minTemp,
          maxTemp: weather.maxTemp,
          precipitationProbability: weather.precipitationProbability,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        recommendation?: OutfitRecommendation;
        error?: string;
      };

      if (!response.ok || !data.recommendation) {
        setRecommendError(
          data.error || '지금은 추천할 수 없어요. 잠시 후 다시 눌러 주세요'
        );
        return;
      }

      setRecommendation(data.recommendation);
    } catch {
      setRecommendError('네트워크 연결을 확인한 뒤 다시 눌러 주세요.');
    } finally {
      setRecommendLoading(false);
    }
  };

  const handleNextClick = () => {
    if (missingInfo) {
      setAttemptedSubmit(true);
      missingInfo.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setAttemptedSubmit(false);
    setScreen('weather');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (screen === 'weather') {
    return (
      <WeatherScreen
        onBack={() => {
          setScreen('profile');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRecommend={(locationLabel, weather) => {
          void requestRecommendation(locationLabel, weather);
        }}
      />
    );
  }

  if (screen === 'recommendation' && weatherSnapshot && selectedStyleOption) {
    return (
      <RecommendationScreen
        styleId={selectedStyleOption.id}
        styleName={selectedStyleOption.name}
        locationLabel={weatherSnapshot.locationLabel}
        weather={weatherSnapshot.weather}
        recommendation={recommendation}
        isLoading={recommendLoading}
        errorMessage={recommendError}
        onRetry={() => {
          void requestRecommendation(
            weatherSnapshot.locationLabel,
            weatherSnapshot.weather
          );
        }}
        onGoHome={() => {
          setScreen('profile');
          setWeatherSnapshot(null);
          setRecommendation(null);
          setRecommendError(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

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
            나에 대해
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-5 pt-7 pb-10 sm:pt-10 sm:pb-14">
        {/* Intro Heading */}
        <section className="mb-9 sm:mb-11">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
            나에 대해
          </h1>
          <p className="mt-2.5 text-lg sm:text-xl text-slate-600 leading-relaxed">
            편안하고 알맞은 옷차림을 찾기 위해 먼저 아래 내용을 골라 주세요.
          </p>
        </section>

        <div className="space-y-10 sm:space-y-12">
          {/* 1. 연령대 */}
          <section
            ref={ageSectionRef}
            aria-labelledby="heading-age"
            className={`rounded-3xl p-5 sm:p-7 bg-white border transition-colors duration-150 ${
              attemptedSubmit && !ageGroup
                ? 'border-2 border-amber-400 shadow-sm'
                : 'border-sky-100 shadow-xs'
            }`}
          >
            <div className="mb-4 sm:mb-5">
              <h2 id="heading-age" className="text-2xl font-bold text-slate-900">
                01. 연령대
              </h2>
              <p className="mt-1 text-base sm:text-lg text-slate-600">
                해당하는 연령대를 하나 골라 주세요
              </p>
            </div>

            <div
              role="radiogroup"
              aria-labelledby="heading-age"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
            >
              {AGE_GROUPS.map((age) => {
                const isSelected = ageGroup === age;
                return (
                  <button
                    key={age}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setAgeGroup(age)}
                    className={`min-h-[58px] px-3 py-3 rounded-2xl text-lg sm:text-xl font-bold whitespace-nowrap transition-all duration-150 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
                      isSelected
                        ? 'bg-sky-600 text-white border-2 border-sky-600 shadow-md shadow-sky-600/20'
                        : 'bg-sky-50/60 text-slate-800 border-2 border-sky-200/80 hover:border-sky-400 hover:bg-sky-50'
                    }`}
                  >
                    {age}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. 성별 */}
          <section
            ref={genderSectionRef}
            aria-labelledby="heading-gender"
            className={`rounded-3xl p-5 sm:p-7 bg-white border transition-colors duration-150 ${
              attemptedSubmit && !gender
                ? 'border-2 border-amber-400 shadow-sm'
                : 'border-sky-100 shadow-xs'
            }`}
          >
            <div className="mb-4 sm:mb-5">
              <h2 id="heading-gender" className="text-2xl font-bold text-slate-900">
                02. 성별
              </h2>
              <p className="mt-1 text-base sm:text-lg text-slate-600">
                하나만 골라 주세요
              </p>
            </div>

            <div
              role="radiogroup"
              aria-labelledby="heading-gender"
              className="grid grid-cols-3 gap-2.5 sm:gap-3"
            >
              {GENDERS.map((item) => {
                const isSelected = gender === item;
                return (
                  <button
                    key={item}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setGender(item)}
                    className={`min-h-[58px] px-2 sm:px-4 py-3 rounded-2xl text-[17px] sm:text-xl font-bold whitespace-nowrap transition-all duration-150 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
                      isSelected
                        ? 'bg-sky-600 text-white border-2 border-sky-600 shadow-md shadow-sky-600/20'
                        : 'bg-sky-50/60 text-slate-800 border-2 border-sky-200/80 hover:border-sky-400 hover:bg-sky-50'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. 선호하는 옷 스타일 */}
          <section
            ref={styleSectionRef}
            aria-labelledby="heading-style"
            className={`rounded-3xl p-5 sm:p-7 bg-white border transition-colors duration-150 ${
              attemptedSubmit && !selectedStyle
                ? 'border-2 border-amber-400 shadow-sm'
                : 'border-sky-100 shadow-xs'
            }`}
          >
            <div className="mb-4 sm:mb-5">
              <h2 id="heading-style" className="text-2xl font-bold text-slate-900">
                03. 선호하는 옷 스타일
              </h2>
              <p className="mt-1 text-base sm:text-lg text-slate-600">
                가장 마음에 드는 스타일 카드를 하나만 골라 주세요
              </p>
            </div>

            <div
              role="radiogroup"
              aria-labelledby="heading-style"
              className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4"
            >
              {CLOTHING_STYLES.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <label
                    key={style.id}
                    className={`relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-150 select-none focus-within:ring-4 focus-within:ring-sky-300 ${
                      isSelected
                        ? 'border-[3px] border-sky-600 bg-sky-50/85 shadow-md shadow-sky-600/10'
                        : 'border-2 border-sky-100 bg-white hover:border-sky-300 hover:bg-sky-50/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="clothing-style"
                      value={style.id}
                      checked={isSelected}
                      onChange={() => setSelectedStyle(style.id)}
                      className="sr-only"
                    />

                    {/* Custom SVG Illustration */}
                    <div className="shrink-0">
                      <StyleIllustration styleId={style.id} selected={isSelected} />
                    </div>

                    {/* Title & One-line Description */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xl font-bold text-slate-900 leading-snug">
                        {style.name}
                      </div>
                      <p className="mt-1 text-[15px] sm:text-base text-slate-600 leading-snug">
                        {style.description}
                      </p>
                    </div>

                    {/* Radio Button Indicator */}
                    <div
                      aria-hidden="true"
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-150 ${
                        isSelected
                          ? 'border-sky-600 bg-sky-600'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        {/* Bottom Action Section */}
        <div className="mt-10 sm:mt-12 pt-2">
          {/* Missing selection guidance message */}
          <div aria-live="polite" className="min-h-[36px] mb-3 flex items-center justify-center">
            {missingInfo ? (
              <p
                className={`flex items-center justify-center gap-2 text-base sm:text-lg font-bold ${
                  attemptedSubmit ? 'text-amber-700' : 'text-sky-800'
                }`}
              >
                <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>{missingInfo.message}</span>
              </p>
            ) : (
              <p className="flex items-center justify-center gap-2 text-base sm:text-lg font-bold text-sky-700">
                <Check className="w-5 h-5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                <span>모두 골랐어요! 아래 &lsquo;다음&rsquo; 버튼을 눌러 주세요</span>
              </p>
            )}
          </div>

          <button
            type="button"
            aria-disabled={!isComplete}
            onClick={handleNextClick}
            className={`w-full min-h-[60px] rounded-2xl text-xl font-bold flex items-center justify-center gap-2.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
              isComplete
                ? 'bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white shadow-lg shadow-sky-600/25 cursor-pointer'
                : 'bg-sky-200/80 text-sky-700/75 border-2 border-sky-200 cursor-not-allowed'
            }`}
          >
            <span>다음</span>
            <ArrowRight className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </main>
    </div>
  );
}
