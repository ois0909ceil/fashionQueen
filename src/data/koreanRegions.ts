export type CityId =
  | 'seoul'
  | 'suwon'
  | 'incheon'
  | 'daejeon'
  | 'daegu'
  | 'gwangju'
  | 'busan'
  | 'jeju';

export interface SubRegion {
  id: string;
  name: string;
  lat: number;
  lon: number;
  parentGu?: string;
}

export interface SeoulGu {
  id: string;
  name: string;
  lat: number;
  lon: number;
  dongs: { name: string; lat: number; lon: number }[];
}

export interface CityInfo {
  id: CityId;
  name: string;
  subUnitLabel: string;
  subRegions?: SubRegion[];
}

export const SEOUL_GUS: SeoulGu[] = [
  {
    id: 'gangnam',
    name: '강남구',
    lat: 37.5172,
    lon: 127.0473,
    dongs: [
      { name: '역삼동', lat: 37.5007, lon: 127.0365 },
      { name: '삼성동', lat: 37.5144, lon: 127.0626 },
      { name: '대치동', lat: 37.4946, lon: 127.0637 },
      { name: '논현동', lat: 37.5138, lon: 127.0285 },
      { name: '청담동', lat: 37.5241, lon: 127.0493 },
      { name: '압구정동', lat: 37.5271, lon: 127.0285 },
      { name: '도곡동', lat: 37.4882, lon: 127.0468 },
      { name: '개포동', lat: 37.4822, lon: 127.0663 },
      { name: '신사동', lat: 37.5241, lon: 127.0227 },
      { name: '수서동', lat: 37.4873, lon: 127.1011 },
    ],
  },
  {
    id: 'gangdong',
    name: '강동구',
    lat: 37.5301,
    lon: 127.1238,
    dongs: [
      { name: '천호동', lat: 37.5387, lon: 127.1239 },
      { name: '성내동', lat: 37.5279, lon: 127.1294 },
      { name: '길동', lat: 37.5396, lon: 127.1453 },
      { name: '둔촌동', lat: 37.5276, lon: 127.1451 },
      { name: '명일동', lat: 37.5513, lon: 127.1441 },
      { name: '암사동', lat: 37.5518, lon: 127.1277 },
      { name: '고덕동', lat: 37.5567, lon: 127.1553 },
      { name: '상일동', lat: 37.5511, lon: 127.1711 },
    ],
  },
  {
    id: 'gangbuk',
    name: '강북구',
    lat: 37.6396,
    lon: 127.0257,
    dongs: [
      { name: '미아동', lat: 37.6264, lon: 127.0261 },
      { name: '수유동', lat: 37.6391, lon: 127.0195 },
      { name: '번동', lat: 37.6345, lon: 127.0389 },
      { name: '우이동', lat: 37.6612, lon: 127.0112 },
    ],
  },
  {
    id: 'gangseo',
    name: '강서구',
    lat: 37.5509,
    lon: 126.8495,
    dongs: [
      { name: '화곡동', lat: 37.5416, lon: 126.8404 },
      { name: '마곡동', lat: 37.5668, lon: 126.8271 },
      { name: '발산동', lat: 37.5585, lon: 126.8378 },
      { name: '등촌동', lat: 37.5569, lon: 126.8576 },
      { name: '염창동', lat: 37.5499, lon: 126.8726 },
      { name: '방화동', lat: 37.5752, lon: 126.8141 },
      { name: '가양동', lat: 37.5613, lon: 126.8544 },
    ],
  },
  {
    id: 'gwanak',
    name: '관악구',
    lat: 37.4784,
    lon: 126.9516,
    dongs: [
      { name: '신림동', lat: 37.4842, lon: 126.9296 },
      { name: '봉천동', lat: 37.4823, lon: 126.9522 },
      { name: '남현동', lat: 37.4754, lon: 126.9794 },
    ],
  },
  {
    id: 'gwangjin',
    name: '광진구',
    lat: 37.5385,
    lon: 127.0823,
    dongs: [
      { name: '자양동', lat: 37.5335, lon: 127.0749 },
      { name: '구의동', lat: 37.5417, lon: 127.0909 },
      { name: '화양동', lat: 37.5427, lon: 127.0715 },
      { name: '군자동', lat: 37.5547, lon: 127.0752 },
      { name: '중곡동', lat: 37.5621, lon: 127.0847 },
      { name: '광장동', lat: 37.5476, lon: 127.1038 },
    ],
  },
  {
    id: 'guro',
    name: '구로구',
    lat: 37.4954,
    lon: 126.8874,
    dongs: [
      { name: '구로동', lat: 37.4954, lon: 126.8874 },
      { name: '신도림동', lat: 37.5088, lon: 126.8913 },
      { name: '고척동', lat: 37.5015, lon: 126.8602 },
      { name: '개봉동', lat: 37.4932, lon: 126.8548 },
      { name: '오류동', lat: 37.4944, lon: 126.8453 },
      { name: '가리봉동', lat: 37.4828, lon: 126.8879 },
    ],
  },
  {
    id: 'geumcheon',
    name: '금천구',
    lat: 37.4569,
    lon: 126.8955,
    dongs: [
      { name: '가산동', lat: 37.4785, lon: 126.8842 },
      { name: '독산동', lat: 37.4666, lon: 126.8967 },
      { name: '시흥동', lat: 37.4488, lon: 126.9052 },
    ],
  },
  {
    id: 'nowon',
    name: '노원구',
    lat: 37.6542,
    lon: 127.0568,
    dongs: [
      { name: '상계동', lat: 37.6606, lon: 127.0649 },
      { name: '중계동', lat: 37.6488, lon: 127.0706 },
      { name: '하계동', lat: 37.6382, lon: 127.0702 },
      { name: '공릉동', lat: 37.6256, lon: 127.0729 },
      { name: '월계동', lat: 37.6249, lon: 127.0583 },
    ],
  },
  {
    id: 'dobong',
    name: '도봉구',
    lat: 37.6688,
    lon: 127.0471,
    dongs: [
      { name: '창동', lat: 37.6531, lon: 127.0477 },
      { name: '쌍문동', lat: 37.6525, lon: 127.0322 },
      { name: '방학동', lat: 37.6664, lon: 127.0384 },
      { name: '도봉동', lat: 37.6793, lon: 127.0442 },
    ],
  },
  {
    id: 'dongdaemun',
    name: '동대문구',
    lat: 37.5744,
    lon: 127.0395,
    dongs: [
      { name: '청량리동', lat: 37.5804, lon: 127.0484 },
      { name: '회기동', lat: 37.5908, lon: 127.0558 },
      { name: '이문동', lat: 37.5993, lon: 127.0619 },
      { name: '장안동', lat: 37.5718, lon: 127.0695 },
      { name: '답십리동', lat: 37.5687, lon: 127.0537 },
      { name: '제기동', lat: 37.5784, lon: 127.0355 },
      { name: '용두동', lat: 37.5742, lon: 127.0378 },
    ],
  },
  {
    id: 'dongjak',
    name: '동작구',
    lat: 37.5124,
    lon: 126.9393,
    dongs: [
      { name: '노량진동', lat: 37.5131, lon: 126.9421 },
      { name: '상도동', lat: 37.5031, lon: 126.9462 },
      { name: '사당동', lat: 37.4827, lon: 126.9762 },
      { name: '흑석동', lat: 37.5078, lon: 126.9617 },
      { name: '대방동', lat: 37.5082, lon: 126.9248 },
      { name: '신대방동', lat: 37.4937, lon: 126.9154 },
    ],
  },
  {
    id: 'mapo',
    name: '마포구',
    lat: 37.5663,
    lon: 126.9016,
    dongs: [
      { name: '서교동', lat: 37.5554, lon: 126.9212 },
      { name: '합정동', lat: 37.5495, lon: 126.9138 },
      { name: '망원동', lat: 37.5561, lon: 126.9062 },
      { name: '연남동', lat: 37.5646, lon: 126.9249 },
      { name: '공덕동', lat: 37.5446, lon: 126.9516 },
      { name: '상암동', lat: 37.5778, lon: 126.8891 },
      { name: '아현동', lat: 37.5542, lon: 126.9562 },
    ],
  },
  {
    id: 'seodaemun',
    name: '서대문구',
    lat: 37.5791,
    lon: 126.9368,
    dongs: [
      { name: '신촌동', lat: 37.5586, lon: 126.9368 },
      { name: '연희동', lat: 37.5681, lon: 126.9301 },
      { name: '홍제동', lat: 37.5892, lon: 126.9442 },
      { name: '북아현동', lat: 37.5621, lon: 126.9562 },
      { name: '남가좌동', lat: 37.5754, lon: 126.9218 },
    ],
  },
  {
    id: 'seocho',
    name: '서초구',
    lat: 37.4837,
    lon: 127.0324,
    dongs: [
      { name: '서초동', lat: 37.4882, lon: 127.0176 },
      { name: '반포동', lat: 37.5042, lon: 127.0049 },
      { name: '방배동', lat: 37.4819, lon: 126.9964 },
      { name: '잠원동', lat: 37.5152, lon: 127.0131 },
      { name: '양재동', lat: 37.4765, lon: 127.0389 },
      { name: '내곡동', lat: 37.4567, lon: 127.0581 },
    ],
  },
  {
    id: 'seongdong',
    name: '성동구',
    lat: 37.5633,
    lon: 127.0371,
    dongs: [
      { name: '성수동', lat: 37.5446, lon: 127.0558 },
      { name: '왕십리동', lat: 37.5624, lon: 127.0342 },
      { name: '행당동', lat: 37.5579, lon: 127.0321 },
      { name: '금호동', lat: 37.5503, lon: 127.0221 },
      { name: '옥수동', lat: 37.5419, lon: 127.0179 },
      { name: '마장동', lat: 37.5665, lon: 127.0442 },
    ],
  },
  {
    id: 'seongbuk',
    name: '성북구',
    lat: 37.5894,
    lon: 127.0167,
    dongs: [
      { name: '길음동', lat: 37.6061, lon: 127.0231 },
      { name: '돈암동', lat: 37.5959, lon: 127.0156 },
      { name: '안암동', lat: 37.5861, lon: 127.0294 },
      { name: '성북동', lat: 37.5924, lon: 127.0028 },
      { name: '정릉동', lat: 37.6069, lon: 127.0085 },
      { name: '장위동', lat: 37.6143, lon: 127.0493 },
    ],
  },
  {
    id: 'songpa',
    name: '송파구',
    lat: 37.5145,
    lon: 127.1066,
    dongs: [
      { name: '잠실동', lat: 37.5112, lon: 127.0861 },
      { name: '신천동', lat: 37.5159, lon: 127.1021 },
      { name: '방이동', lat: 37.5131, lon: 127.1181 },
      { name: '석촌동', lat: 37.5037, lon: 127.1051 },
      { name: '가락동', lat: 37.4959, lon: 127.1194 },
      { name: '문정동', lat: 37.4857, lon: 127.1225 },
      { name: '위례동', lat: 37.4765, lon: 127.1424 },
      { name: '풍납동', lat: 37.5327, lon: 127.1193 },
    ],
  },
  {
    id: 'yangcheon',
    name: '양천구',
    lat: 37.517,
    lon: 126.8664,
    dongs: [
      { name: '목동', lat: 37.5295, lon: 126.8749 },
      { name: '신정동', lat: 37.5179, lon: 126.8548 },
      { name: '신월동', lat: 37.5236, lon: 126.8358 },
    ],
  },
  {
    id: 'yeongdeungpo',
    name: '영등포구',
    lat: 37.5264,
    lon: 126.8962,
    dongs: [
      { name: '여의도동', lat: 37.5245, lon: 126.9242 },
      { name: '영등포동', lat: 37.5178, lon: 126.9068 },
      { name: '당산동', lat: 37.5303, lon: 126.9022 },
      { name: '문래동', lat: 37.5179, lon: 126.8947 },
      { name: '신길동', lat: 37.5067, lon: 126.9141 },
      { name: '대림동', lat: 37.4933, lon: 126.8975 },
    ],
  },
  {
    id: 'yongsan',
    name: '용산구',
    lat: 37.5326,
    lon: 126.9905,
    dongs: [
      { name: '이태원동', lat: 37.5345, lon: 126.9946 },
      { name: '한남동', lat: 37.5347, lon: 127.0029 },
      { name: '이촌동', lat: 37.5218, lon: 126.9736 },
      { name: '청파동', lat: 37.5453, lon: 126.9681 },
      { name: '용문동', lat: 37.5378, lon: 126.9617 },
      { name: '해방촌(용산2가동)', lat: 37.5423, lon: 126.9862 },
    ],
  },
  {
    id: 'eunpyeong',
    name: '은평구',
    lat: 37.6027,
    lon: 126.9291,
    dongs: [
      { name: '연신내(갈현동)', lat: 37.6188, lon: 126.9177 },
      { name: '불광동', lat: 37.6119, lon: 126.9296 },
      { name: '응암동', lat: 37.5958, lon: 126.9178 },
      { name: '녹번동', lat: 37.6021, lon: 126.9355 },
      { name: '진관동', lat: 37.6377, lon: 126.9225 },
      { name: '대조동', lat: 37.6122, lon: 126.9234 },
    ],
  },
  {
    id: 'jongno',
    name: '종로구',
    lat: 37.573,
    lon: 126.9794,
    dongs: [
      { name: '혜화동', lat: 37.5844, lon: 127.0005 },
      { name: '삼청동', lat: 37.5847, lon: 126.9818 },
      { name: '사직동', lat: 37.5761, lon: 126.9689 },
      { name: '종로1·2·3·4가동', lat: 37.5709, lon: 126.9896 },
      { name: '부암동', lat: 37.5947, lon: 126.9652 },
      { name: '평창동', lat: 37.6095, lon: 126.9687 },
      { name: '창신동', lat: 37.5758, lon: 127.0135 },
    ],
  },
  {
    id: 'jung',
    name: '중구',
    lat: 37.5641,
    lon: 126.9979,
    dongs: [
      { name: '명동', lat: 37.5633, lon: 126.9845 },
      { name: '을지로동', lat: 37.5663, lon: 126.9912 },
      { name: '신당동', lat: 37.5624, lon: 127.0174 },
      { name: '회현동', lat: 37.5583, lon: 126.9776 },
      { name: '청구동', lat: 37.5589, lon: 127.0138 },
      { name: '황학동', lat: 37.5681, lon: 127.0209 },
    ],
  },
  {
    id: 'jungnang',
    name: '중랑구',
    lat: 37.6066,
    lon: 127.0927,
    dongs: [
      { name: '면목동', lat: 37.5886, lon: 127.0875 },
      { name: '상봉동', lat: 37.5964, lon: 127.0853 },
      { name: '중화동', lat: 37.6026, lon: 127.0793 },
      { name: '묵동', lat: 37.6119, lon: 127.0778 },
      { name: '신내동', lat: 37.6085, lon: 127.1017 },
      { name: '망우동', lat: 37.5994, lon: 127.1011 },
    ],
  },
];

export const CITIES: CityInfo[] = [
  {
    id: 'seoul',
    name: '서울',
    subUnitLabel: '동 선택',
  },
  {
    id: 'suwon',
    name: '수원',
    subUnitLabel: '구 선택',
    subRegions: [
      { id: 'suwon-jangan', name: '장안구', lat: 37.3039, lon: 127.0104 },
      { id: 'suwon-gwonseon', name: '권선구', lat: 37.2576, lon: 126.9718 },
      { id: 'suwon-paldal', name: '팔달구', lat: 37.2825, lon: 127.0201 },
      { id: 'suwon-yeongtong', name: '영통구', lat: 37.2596, lon: 127.0465 },
    ],
  },
  {
    id: 'incheon',
    name: '인천',
    subUnitLabel: '군·구 선택',
    subRegions: [
      { id: 'incheon-jung', name: '중구', lat: 37.4737, lon: 126.6217 },
      { id: 'incheon-dong', name: '동구', lat: 37.4739, lon: 126.6431 },
      { id: 'incheon-michuhol', name: '미추홀구', lat: 37.4636, lon: 126.6503 },
      { id: 'incheon-yeonsu', name: '연수구', lat: 37.4102, lon: 126.6783 },
      { id: 'incheon-namdong', name: '남동구', lat: 37.4472, lon: 126.7313 },
      { id: 'incheon-bupyeong', name: '부평구', lat: 37.5071, lon: 126.7219 },
      { id: 'incheon-gyeyang', name: '계양구', lat: 37.5374, lon: 126.7378 },
      { id: 'incheon-seo', name: '서구', lat: 37.5455, lon: 126.676 },
      { id: 'incheon-ganghwa', name: '강화군', lat: 37.7465, lon: 126.4881 },
      { id: 'incheon-ongjin', name: '옹진군', lat: 37.4465, lon: 126.6368 },
    ],
  },
  {
    id: 'daejeon',
    name: '대전',
    subUnitLabel: '구 선택',
    subRegions: [
      { id: 'daejeon-dong', name: '동구', lat: 36.3121, lon: 127.4548 },
      { id: 'daejeon-jung', name: '중구', lat: 36.3257, lon: 127.4212 },
      { id: 'daejeon-seo', name: '서구', lat: 36.3554, lon: 127.3836 },
      { id: 'daejeon-yuseong', name: '유성구', lat: 36.3623, lon: 127.3561 },
      { id: 'daejeon-daedeok', name: '대덕구', lat: 36.3466, lon: 127.4153 },
    ],
  },
  {
    id: 'daegu',
    name: '대구',
    subUnitLabel: '군·구 선택',
    subRegions: [
      { id: 'daegu-jung', name: '중구', lat: 35.8693, lon: 128.6061 },
      { id: 'daegu-dong', name: '동구', lat: 35.8866, lon: 128.6356 },
      { id: 'daegu-seo', name: '서구', lat: 35.8719, lon: 128.5591 },
      { id: 'daegu-nam', name: '남구', lat: 35.8461, lon: 128.5976 },
      { id: 'daegu-buk', name: '북구', lat: 35.8858, lon: 128.5829 },
      { id: 'daegu-suseong', name: '수성구', lat: 35.8581, lon: 128.6307 },
      { id: 'daegu-dalseo', name: '달서구', lat: 35.8299, lon: 128.5327 },
      { id: 'daegu-dalseong', name: '달성군', lat: 35.7746, lon: 128.4314 },
      { id: 'daegu-gunwi', name: '군위군', lat: 36.2427, lon: 128.5728 },
    ],
  },
  {
    id: 'gwangju',
    name: '광주',
    subUnitLabel: '구 선택',
    subRegions: [
      { id: 'gwangju-dong', name: '동구', lat: 35.1461, lon: 126.9231 },
      { id: 'gwangju-seo', name: '서구', lat: 35.152, lon: 126.8902 },
      { id: 'gwangju-nam', name: '남구', lat: 35.133, lon: 126.9025 },
      { id: 'gwangju-buk', name: '북구', lat: 35.1743, lon: 126.9121 },
      { id: 'gwangju-gwangsan', name: '광산구', lat: 35.1396, lon: 126.7936 },
    ],
  },
  {
    id: 'busan',
    name: '부산',
    subUnitLabel: '군·구 선택',
    subRegions: [
      { id: 'busan-jung', name: '중구', lat: 35.1062, lon: 129.0323 },
      { id: 'busan-seo', name: '서구', lat: 35.0979, lon: 129.0242 },
      { id: 'busan-dong', name: '동구', lat: 35.1294, lon: 129.0454 },
      { id: 'busan-yeongdo', name: '영도구', lat: 35.0912, lon: 129.0679 },
      { id: 'busan-busanjin', name: '부산진구', lat: 35.1631, lon: 129.0532 },
      { id: 'busan-dongnae', name: '동래구', lat: 35.2049, lon: 129.0837 },
      { id: 'busan-nam', name: '남구', lat: 35.1365, lon: 129.0843 },
      { id: 'busan-buk', name: '북구', lat: 35.1972, lon: 128.9903 },
      { id: 'busan-haeundae', name: '해운대구', lat: 35.1631, lon: 129.1636 },
      { id: 'busan-saha', name: '사하구', lat: 35.1045, lon: 128.9748 },
      { id: 'busan-geumjeong', name: '금정구', lat: 35.2429, lon: 129.0921 },
      { id: 'busan-gangseo', name: '강서구', lat: 35.2122, lon: 128.9806 },
      { id: 'busan-yeonje', name: '연제구', lat: 35.1765, lon: 129.0799 },
      { id: 'busan-suyeong', name: '수영구', lat: 35.1456, lon: 129.1131 },
      { id: 'busan-sasang', name: '사상구', lat: 35.1526, lon: 128.9912 },
      { id: 'busan-gijang', name: '기장군', lat: 35.2446, lon: 129.2223 },
    ],
  },
  {
    id: 'jeju',
    name: '제주',
    subUnitLabel: '시 선택',
    subRegions: [
      { id: 'jeju-si', name: '제주시', lat: 33.4996, lon: 126.5312 },
      { id: 'seogwipo-si', name: '서귀포시', lat: 33.2541, lon: 126.5601 },
    ],
  },
];

export interface FlattenedSeoulDong {
  id: string;
  guName: string;
  dongName: string;
  lat: number;
  lon: number;
}

export const ALL_SEOUL_DONGS: FlattenedSeoulDong[] = SEOUL_GUS.flatMap((gu) =>
  gu.dongs.map((dong) => ({
    id: `seoul-${gu.id}-${dong.name}`,
    guName: gu.name,
    dongName: dong.name,
    lat: dong.lat,
    lon: dong.lon,
  }))
);

function distanceSq(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = lat1 - lat2;
  const dLon = lon1 - lon2;
  return dLat * dLat + dLon * dLon;
}

export function findNearestRegionLabel(lat: number, lon: number): string {
  let bestLabel = '현재 위치';
  let bestDist = Infinity;

  for (const dong of ALL_SEOUL_DONGS) {
    const d = distanceSq(lat, lon, dong.lat, dong.lon);
    if (d < bestDist) {
      bestDist = d;
      bestLabel = `서울 ${dong.guName} ${dong.dongName}`;
    }
  }

  for (const city of CITIES) {
    if (!city.subRegions) continue;
    for (const sub of city.subRegions) {
      const d = distanceSq(lat, lon, sub.lat, sub.lon);
      if (d < bestDist) {
        bestDist = d;
        bestLabel = `${city.name} ${sub.name}`;
      }
    }
  }

  // Only attach Korean region name if within ~0.35 degrees (~35km)
  if (bestDist < 0.12) {
    return `${bestLabel} 부근`;
  }
  return '내 현재 위치';
}
