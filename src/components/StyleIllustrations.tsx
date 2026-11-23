import React from 'react';

export type StyleId = 'casual' | 'neat' | 'active' | 'classic';

interface StyleIllustrationProps {
  styleId: StyleId;
  selected?: boolean;
}

export function BrandMark() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="36" height="36" rx="10" fill="#0284C7" />
      <path
        d="M18 9.5C16.6193 9.5 15.5 10.6193 15.5 12C15.5 13.0355 16.1295 13.9241 17.0268 14.3037C17.6192 14.5544 18 15.1342 18 15.7775V16.5L8.7 22.3125C7.87 22.8312 8.2375 24.1 9.2166 24.1H26.7834C27.7625 24.1 28.13 22.8312 27.3 22.3125L18 16.5"
        stroke="#FFFFFF"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="25.5" cy="11" r="2.2" fill="#BAE6FD" />
    </svg>
  );
}

export function StyleIllustration({ styleId, selected = false }: StyleIllustrationProps) {
  switch (styleId) {
    case 'casual':
      // 편안한 캐주얼: 맨투맨 티셔츠 + 편안한 바지
      return (
        <svg
          width="68"
          height="68"
          viewBox="0 0 68 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            width="68"
            height="68"
            rx="16"
            fill={selected ? '#E0F2FE' : '#F0F9FF'}
          />
          {/* T-shirt / sweatshirt body */}
          <path
            d="M23 16L14 22L18 30L23 27V44H45V27L50 30L54 22L45 16C43 19.5 39 21 34 21C29 21 25 19.5 23 16Z"
            fill="#38BDF8"
            stroke="#0369A1"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Collar rib */}
          <path
            d="M26 16.5C28 19.5 31 20.8 34 20.8C37 20.8 40 19.5 42 16.5"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Pocket / cozy detail */}
          <path
            d="M28 32H40V38C40 39.1046 39.1046 40 38 40H30C28.8954 40 28 39.1046 28 38V32Z"
            fill="#BAE6FD"
            stroke="#0369A1"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Casual hem */}
          <rect
            x="23"
            y="44"
            width="22"
            height="4"
            rx="1.5"
            fill="#0284C7"
            stroke="#0369A1"
            strokeWidth="1.8"
          />
          {/* Small pants cuff hint */}
          <path
            d="M25 48V55H32V50H36V55H43V48"
            fill="#E0F2FE"
            stroke="#0369A1"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'neat':
      // 단정한 외출복: 카라 셔츠 + 단정한 가디건/재킷
      return (
        <svg
          width="68"
          height="68"
          viewBox="0 0 68 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            width="68"
            height="68"
            rx="16"
            fill={selected ? '#E0F2FE' : '#F0F9FF'}
          />
          {/* Inner crisp white shirt */}
          <path
            d="M26 15H42V50H26V15Z"
            fill="#FFFFFF"
            stroke="#0369A1"
            strokeWidth="2"
          />
          {/* Outer neat cardigan */}
          <path
            d="M25 16L15 21L17 44H22L23 30V51H33V27L25 16Z"
            fill="#7DD3FC"
            stroke="#0369A1"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M43 16L53 21L51 44H46L45 30V51H35V27L43 16Z"
            fill="#7DD3FC"
            stroke="#0369A1"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Shirt collar */}
          <path
            d="M26 15L34 23L42 15"
            fill="#E0F2FE"
            stroke="#0369A1"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Neat buttons */}
          <circle cx="34" cy="31" r="1.6" fill="#0369A1" />
          <circle cx="34" cy="38" r="1.6" fill="#0369A1" />
          <circle cx="34" cy="45" r="1.6" fill="#0369A1" />
        </svg>
      );

    case 'active':
      // 활동적인 운동복: 지퍼 바람막이 재킷
      return (
        <svg
          width="68"
          height="68"
          viewBox="0 0 68 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            width="68"
            height="68"
            rx="16"
            fill={selected ? '#E0F2FE' : '#F0F9FF'}
          />
          {/* Stand collar */}
          <path
            d="M27 14H41L43 19H25L27 14Z"
            fill="#0284C7"
            stroke="#0C4A6E"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Windbreaker body & sleeves */}
          <path
            d="M25 19L13 28L17 37L23 33V52H45V33L51 37L55 28L43 19H25Z"
            fill="#0EA5E9"
            stroke="#0C4A6E"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Sporty chest chevron stripe */}
          <path
            d="M23 31L34 37L45 31"
            stroke="#E0F2FE"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center zipper line */}
          <line
            x1="34"
            y1="19"
            x2="34"
            y2="52"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Zipper pull */}
          <rect x="32.5" y="22" width="3" height="5" rx="1" fill="#BAE6FD" />
        </svg>
      );

    case 'classic':
      // 차분한 클래식: 테일러드 코트 / 재킷
      return (
        <svg
          width="68"
          height="68"
          viewBox="0 0 68 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            width="68"
            height="68"
            rx="16"
            fill={selected ? '#E0F2FE' : '#F0F9FF'}
          />
          {/* Coat silhouette */}
          <path
            d="M24 15L15 21L16 45H22V54H46V45H52L53 21L44 15H24Z"
            fill="#1E3A5F"
            stroke="#0F172A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Tailored notched lapels */}
          <path
            d="M24 15L34 31L44 15"
            fill="#F8FAFC"
            stroke="#0F172A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M24 15L28 28L23 30L20 20"
            fill="#38BDF8"
            stroke="#0F172A"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M44 15L40 28L45 30L48 20"
            fill="#38BDF8"
            stroke="#0F172A"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Coat belt */}
          <rect
            x="22"
            y="36"
            width="24"
            height="4"
            rx="1.5"
            fill="#7DD3FC"
            stroke="#0F172A"
            strokeWidth="1.8"
          />
          {/* Buckle */}
          <rect
            x="31.5"
            y="35"
            width="5"
            height="6"
            rx="1"
            fill="#F8FAFC"
            stroke="#0F172A"
            strokeWidth="1.6"
          />
        </svg>
      );
  }
}
