// Utility để phân loại nghệ sĩ theo thời kỳ âm nhạc
// Cải thiện: Tính tuổi sống trong từng thời kỳ để xác định thời kỳ chính

export interface Period {
  id: number;
  name: string;
  picture: string;
}

export interface Artist {
  id: number;
  name: string;
  dateOfBirth: string;
  dateOfDeath?: string | null;
  periods?: Period[];
  // ... other fields
}

export type MusicalEra = 
  | "Medieval" 
  | "Renaissance" 
  | "Baroque" 
  | "Classical" 
  | "Romantic" 
  | "Modern" 
  | "Contemporary";

// Mapping các thời kỳ âm nhạc với khoảng năm
export const ERA_RANGES: Record<MusicalEra, [number, number]> = {
  Medieval: [500, 1400],
  Renaissance: [1400, 1600],
  Baroque: [1600, 1750],
  Classical: [1750, 1820],
  Romantic: [1820, 1900],
  Modern: [1900, 1945],
  Contemporary: [1945, 2024],
};

// Mapping tên tiếng Việt
export const ERA_VIETNAMESE_NAMES: Record<MusicalEra, string> = {
  Medieval: "Thời kỳ Trung cổ",
  Renaissance: "Thời kỳ Phục hưng",
  Baroque: "Thời kỳ Baroque", 
  Classical: "Thời kỳ Cổ điển",
  Romantic: "Thời kỳ Lãng mạn",
  Modern: "Thời kỳ Hiện đại",
  Contemporary: "Thời kỳ Đương đại",
};

// Cấu hình để xác định nghệ sĩ thuộc nhiều thời kỳ
const MULTI_ERA_THRESHOLD = 0.3; // 30% - nếu chênh lệch tuổi < 30% thì thuộc cả hai thời kỳ
const PRODUCTIVE_AGE_START = 10; // Tuổi bắt đầu sáng tác (nghệ sĩ cổ điển bắt đầu sớm)
const PRODUCTIVE_AGE_END = 75;   // Tuổi kết thúc sáng tác chính
const MIN_PRODUCTIVE_YEARS = 3;  // Tối thiểu 3 năm để được tính vào thời kỳ

/**
 * Lấy năm từ chuỗi ngày tháng
 */
export const getYear = (dateString: string | null): number | null => {
  if (!dateString) return null;
  const year = new Date(dateString).getFullYear();
  return isNaN(year) ? null : year;
};

/**
 * Tính số năm sống của nghệ sĩ trong một thời kỳ cụ thể
 */
export const getYearsLivedInEra = (
  birthYear: number,
  deathYear: number | null,
  eraStart: number,
  eraEnd: number
): number => {
  const currentYear = new Date().getFullYear();
  const actualDeathYear = deathYear || currentYear;
  
  // Xác định khoảng thời gian sống của nghệ sĩ
  const lifeStart = Math.max(birthYear, eraStart);
  const lifeEnd = Math.min(actualDeathYear, eraEnd);
  
  // Nếu không có overlap thì return 0
  if (lifeStart > lifeEnd) return 0;
  
  return lifeEnd - lifeStart + 1;
};

/**
 * Tính số năm "productive" (sáng tác) của nghệ sĩ trong một thời kỳ
 * Cải thiện: Bắt đầu sớm hơn cho nghệ sĩ cổ điển
 */
export const getProductiveYearsInEra = (
  birthYear: number,
  deathYear: number | null,
  eraStart: number,
  eraEnd: number
): number => {
  const currentYear = new Date().getFullYear();
  const actualDeathYear = deathYear || currentYear;
  
  // Tính khoảng tuổi productive - bắt đầu sớm hơn cho nghệ sĩ cổ điển
  const productiveStart = birthYear + PRODUCTIVE_AGE_START;
  const productiveEnd = Math.min(birthYear + PRODUCTIVE_AGE_END, actualDeathYear);
  
  // Overlap với thời kỳ
  const overlapStart = Math.max(productiveStart, eraStart);
  const overlapEnd = Math.min(productiveEnd, eraEnd);
  
  // Nếu không có overlap thì return 0
  if (overlapStart > overlapEnd) return 0;
  
  return overlapEnd - overlapStart + 1;
};

/**
 * Tính mature productive years - những năm nghệ sĩ đã trưởng thành (25+)
 */
export const getMatureProductiveYearsInEra = (
  birthYear: number,
  deathYear: number | null,
  eraStart: number,
  eraEnd: number
): number => {
  const currentYear = new Date().getFullYear();
  const actualDeathYear = deathYear || currentYear;
  
  // Mature productive years từ 25 tuổi
  const matureStart = birthYear + 25;
  const matureEnd = Math.min(birthYear + PRODUCTIVE_AGE_END, actualDeathYear);
  
  // Overlap với thời kỳ
  const overlapStart = Math.max(matureStart, eraStart);
  const overlapEnd = Math.min(matureEnd, eraEnd);
  
  // Nếu không có overlap thì return 0
  if (overlapStart > overlapEnd) return 0;
  
  return overlapEnd - overlapStart + 1;
};

/**
 * Phân tích nghệ sĩ thuộc thời kỳ nào dựa trên tuổi sống và productive years
 */
export const analyzeArtistEras = (artist: Artist): {
  mainEra: MusicalEra | null;
  allEras: MusicalEra[];
  eraAnalysis: Record<MusicalEra, {
    yearsLived: number;
    productiveYears: number;
    matureYears: number;
    percentage: number;
    score: number; // Điểm tổng hợp
  }>;
} => {
  const birthYear = getYear(artist.dateOfBirth);
  const deathYear = getYear(artist.dateOfDeath || null);
  
  if (!birthYear) {
    return {
      mainEra: null,
      allEras: [],
      eraAnalysis: {} as any
    };
  }

  const analysis: Record<MusicalEra, {
    yearsLived: number;
    productiveYears: number;
    matureYears: number;
    percentage: number;
    score: number;
  }> = {} as any;

  let totalProductiveYears = 0;
  let maxScore = 0;
  let mainEra: MusicalEra | null = null;

  // Tính toán cho từng thời kỳ
  for (const [era, [startYear, endYear]] of Object.entries(ERA_RANGES) as [MusicalEra, [number, number]][]) {
    const yearsLived = getYearsLivedInEra(birthYear, deathYear, startYear, endYear);
    const productiveYears = getProductiveYearsInEra(birthYear, deathYear, startYear, endYear);
    const matureYears = getMatureProductiveYearsInEra(birthYear, deathYear, startYear, endYear);
    
    // Tính điểm tổng hợp: ưu tiên mature years, sau đó đến productive years
    const score = matureYears * 2 + productiveYears;
    
    analysis[era] = {
      yearsLived,
      productiveYears,
      matureYears,
      percentage: 0, // Sẽ tính sau
      score
    };

    totalProductiveYears += productiveYears;
    
    if (score > maxScore) {
      maxScore = score;
      mainEra = era;
    }
  }

  // Tính phần trăm cho từng thời kỳ
  for (const era of Object.keys(analysis) as MusicalEra[]) {
    if (totalProductiveYears > 0) {
      analysis[era].percentage = analysis[era].productiveYears / totalProductiveYears;
    }
  }

  // Xác định các thời kỳ mà nghệ sĩ thuộc về
  const allEras: MusicalEra[] = [];
  const mainEraScore = mainEra ? analysis[mainEra].score : 0;

  for (const era of Object.keys(analysis) as MusicalEra[]) {
    const eraData = analysis[era];
    
    // Thuộc thời kỳ nếu:
    // 1. Có ít nhất MIN_PRODUCTIVE_YEARS năm productive
    // 2. Và (là thời kỳ chính HOẶC có điểm số >= threshold so với thời kỳ chính)
    if (eraData.productiveYears >= MIN_PRODUCTIVE_YEARS) {
      if (era === mainEra || (mainEraScore > 0 && eraData.score >= mainEraScore * MULTI_ERA_THRESHOLD)) {
        allEras.push(era);
      }
    }
  }

  return {
    mainEra,
    allEras,
    eraAnalysis: analysis
  };
};

/**
 * Lấy năm sinh từ chuỗi dateOfBirth (giữ lại cho backward compatibility)
 */
export const getBirthYear = (dateOfBirth: string | null): number => {
  const year = getYear(dateOfBirth);
  return year || new Date().getFullYear();
};

/**
 * Phân loại nghệ sĩ theo thời kỳ dựa trên năm sinh (legacy function)
 */
export const getEraByBirthYear = (dateOfBirth: string | null): MusicalEra | null => {
  const birthYear = getBirthYear(dateOfBirth);
  
  for (const [era, [startYear, endYear]] of Object.entries(ERA_RANGES) as [MusicalEra, [number, number]][]) {
    if (birthYear >= startYear && birthYear <= endYear) {
      return era;
    }
  }
  
  return null;
};

/**
 * Lấy thời kỳ chính của nghệ sĩ
 * Ưu tiên: API periods -> phân tích tuổi -> fallback năm sinh
 */
export const getArtistMainEra = (artist: Artist): string | null => {
  // 1. Ưu tiên dữ liệu từ API nếu có
  if (artist.periods && artist.periods.length > 0) {
    return artist.periods[0].name; // Lấy thời kỳ đầu tiên
  }
  
  // 2. Phân tích dựa trên tuổi sống
  const analysis = analyzeArtistEras(artist);
  if (analysis.mainEra) {
    return ERA_VIETNAMESE_NAMES[analysis.mainEra];
  }
  
  // 3. Fallback: phân loại theo năm sinh
  const eraByBirth = getEraByBirthYear(artist.dateOfBirth);
  if (eraByBirth) {
    return ERA_VIETNAMESE_NAMES[eraByBirth];
  }
  
  return null;
};

/**
 * Lấy tất cả thời kỳ của nghệ sĩ
 */
export const getArtistAllEras = (artist: Artist): string[] => {
  const eras: string[] = [];
  
  // 1. Thêm thời kỳ từ API
  if (artist.periods && artist.periods.length > 0) {
    eras.push(...artist.periods.map(p => p.name));
    return eras; // Nếu có API data thì chỉ dùng API data
  }
  
  // 2. Phân tích dựa trên tuổi sống
  const analysis = analyzeArtistEras(artist);
  if (analysis.allEras.length > 0) {
    eras.push(...analysis.allEras.map(era => ERA_VIETNAMESE_NAMES[era]));
    return eras;
  }
  
  // 3. Fallback: phân loại theo năm sinh
  const eraByBirth = getEraByBirthYear(artist.dateOfBirth);
  if (eraByBirth) {
    eras.push(ERA_VIETNAMESE_NAMES[eraByBirth]);
  }
  
  return eras;
};

/**
 * Lấy thông tin chi tiết về thời kỳ của nghệ sĩ
 */
export const getArtistEraDetails = (artist: Artist): {
  mainEra: string | null;
  allEras: string[];
  analysis: {
    era: string;
    yearsLived: number;
    productiveYears: number;
    matureYears: number;
    percentage: number;
    score: number;
  }[];
} => {
  // Nếu có API data thì ưu tiên
  if (artist.periods && artist.periods.length > 0) {
    return {
      mainEra: artist.periods[0].name,
      allEras: artist.periods.map(p => p.name),
      analysis: artist.periods.map(p => ({
        era: p.name,
        yearsLived: 0,
        productiveYears: 0,
        matureYears: 0,
        percentage: 1 / (artist.periods?.length || 1),
        score: 0
      }))
    };
  }

  // Phân tích dựa trên tuổi
  const analysis = analyzeArtistEras(artist);
  
  return {
    mainEra: analysis.mainEra ? ERA_VIETNAMESE_NAMES[analysis.mainEra] : null,
    allEras: analysis.allEras.map(era => ERA_VIETNAMESE_NAMES[era]),
    analysis: Object.entries(analysis.eraAnalysis)
      .filter(([_, data]) => data.productiveYears > 0)
      .map(([era, data]) => ({
        era: ERA_VIETNAMESE_NAMES[era as MusicalEra],
        yearsLived: data.yearsLived,
        productiveYears: data.productiveYears,
        matureYears: data.matureYears,
        percentage: data.percentage,
        score: data.score
      }))
      .sort((a, b) => b.score - a.score)
  };
};

/**
 * Filter nghệ sĩ theo thời kỳ
 */
export const filterArtistsByEra = (
  artists: Artist[], 
  selectedEra: string | MusicalEra
): Artist[] => {
  if (selectedEra === "All Periods" || selectedEra === "Tất cả") {
    return artists;
  }
  
  return artists.filter(artist => {
    // 1. Kiểm tra trong API periods
    if (artist.periods && artist.periods.length > 0) {
      const hasMatchingPeriod = artist.periods.some(period => 
        period.name === selectedEra || 
        period.name.toLowerCase().includes(selectedEra.toLowerCase())
      );
      if (hasMatchingPeriod) return true;
    }
    
    // 2. Kiểm tra trong allEras (phân tích tuổi)
    const allEras = getArtistAllEras(artist);
    if (allEras.includes(selectedEra)) {
      return true;
    }
    
    // 3. Kiểm tra theo era key
    if (selectedEra in ERA_RANGES) {
      const analysis = analyzeArtistEras(artist);
      return analysis.allEras.includes(selectedEra as MusicalEra);
    }
    
    return false;
  });
};

/**
 * Lấy danh sách các thời kỳ có sẵn từ danh sách nghệ sĩ
 */
export const getAvailableEras = (artists: Artist[]): string[] => {
  const erasSet = new Set<string>();
  
  artists.forEach(artist => {
    const allEras = getArtistAllEras(artist);
    allEras.forEach(era => erasSet.add(era));
  });
  
  return Array.from(erasSet).sort();
};

/**
 * Thống kê số lượng nghệ sĩ theo thời kỳ
 */
export const getArtistCountByEra = (artists: Artist[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  artists.forEach(artist => {
    const allEras = getArtistAllEras(artist);
    allEras.forEach(era => {
      counts[era] = (counts[era] || 0) + 1;
    });
  });
  
  return counts;
};

/**
 * Ví dụ sử dụng và test cases
 */
export const getArtistEraExamples = () => {
  const testCases: (Artist & { expectedMain?: string; expectedEras?: string[] })[] = [
    {
      id: 1,
      name: "Mozart",
      dateOfBirth: "1756-01-27",
      dateOfDeath: "1791-12-05",
      expectedMain: "Classical", // Sinh cuối Baroque nhưng sáng tác chủ yếu Classical
    },
    {
      id: 2,
      name: "Beethoven", 
      dateOfBirth: "1770-12-17",
      dateOfDeath: "1827-03-26",
      expectedEras: ["Classical", "Romantic"], // Sống qua cả hai thời kỳ
    },
    {
      id: 3,
      name: "Bach",
      dateOfBirth: "1685-03-31", 
      dateOfDeath: "1750-07-28",
      expectedMain: "Baroque", // Toàn bộ cuộc đời trong Baroque
    },
    {
      id: 4,
      name: "Clara Schumann",
      dateOfBirth: "1819-09-13",
      dateOfDeath: "1896-05-20", 
      expectedMain: "Romantic", // Sinh cuối Classical nhưng sáng tác chủ yếu Romantic
    }
  ];
  
  return testCases.map(testCase => {
    const analysis = analyzeArtistEras(testCase);
    return {
      ...testCase,
      analysis: {
        mainEra: analysis.mainEra,
        allEras: analysis.allEras,
        details: analysis.eraAnalysis
      }
    };
  });
}; 