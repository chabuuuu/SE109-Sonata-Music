import axios from 'axios';

export interface Genre {
  id: number;
  name: string;
  description: string;
  picture: string;
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
}

export interface Orchestra {
  id: string;
  name: string;
  picture: string;
}

export interface Period {
  id: number;
  name: string;
  picture: string;
}

export interface Instrument {
  id: number;
  name: string;
  picture: string;
}

export interface Artist {
  id: number;
  name: string;
  description: string;
  picture: string;
  awardsAndHonors: string;
  nationality: string;
  teachingAndAcademicContributions: string;
  significantPerformences: string;
  roles: string[];
  dateOfBirth: string;
  dateOfDeath: string | null;
  viewCount: number;
  followers: number;
  genres: Genre[];
  orchestras: Orchestra[];
  periods: Period[];
  instruments: Instrument[];
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
}

export interface TopArtistsResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: Artist[];
  errors: null | any;
}

export interface ArtistSearchResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    items: Artist[];
  };
  errors: null | any;
}

export const getTopArtists = async (topN: number = 5): Promise<Artist[]> => {
  try {
    console.log(`🎭 Fetching top ${topN} artists from API...`);
    
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.sonata.io.vn/api/v1/recommender/top-artist-today?topN=${topN}`,
      headers: {
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    };

    const response = await axios(config);
    console.log(`🎭 API Response status: ${response.status}`);
    
    const data: TopArtistsResponse = response.data;
    
    if (data.success && data.data && Array.isArray(data.data)) {
      console.log(`🎭 Successfully fetched ${data.data.length} top artists`);
      
      // Validate and clean data
      const validArtists = data.data.filter(artist => 
        artist && 
        artist.id && 
        artist.name && 
        typeof artist.id === 'number' && 
        typeof artist.name === 'string'
      );
      
      if (validArtists.length > 0) {
        console.log(`🎭 Returning ${validArtists.length} valid artists`);
        return validArtists;
      } else {
        console.warn('🎭 No valid artists found in API response');
        return [];
      }
    } else {
      console.warn('🎭 API response indicates failure or no data:', {
        success: data.success,
        hasData: !!data.data,
        dataType: typeof data.data
      });
      return [];
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('🎭 Top artists API request timeout');
      } else if (error.response) {
        console.error(`🎭 Top artists API error ${error.response.status}:`, error.response.data);
      } else if (error.request) {
        console.error('🎭 Top artists API no response received:', error.message);
      } else {
        console.error('🎭 Top artists API request setup error:', error.message);
      }
    } else {
      console.error('🎭 Unexpected error fetching top artists:', error);
    }
    
    // Return empty array instead of throwing to allow graceful fallback
    return [];
  }
};

// Test với API có sẵn artist ID = 1 như example để xem API có hoạt động không
export const testSearchArtists = async (): Promise<void> => {
  try {
    console.log('Testing API with known artist ID=1');
    
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.sonata.io.vn/api/v1/artist/search?page=1&rpp=10',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        filters: [
          {
            operator: "equal",
            key: "id",
            value: 1
          }
        ],
        sorts: [
          {
            key: "id",
            type: "DESC"
          }
        ]
      }
    };

    const response = await axios(config);
    console.log('Test API Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Test API Error:', error);
  }
};

export const searchArtists = async (searchTerm: string, rpp: number = 10, page: number = 1): Promise<ArtistSearchResponse> => {
  try {
    // Chuẩn hóa search term - trim và đảm bảo có ít nhất 1 ký tự
    const normalizedSearchTerm = searchTerm.trim();
    
    if (!normalizedSearchTerm) {
      return {
        status: "OK",
        code: 200,
        success: true,
        message: "Empty search term",
        data: { total: 0, items: [] },
        errors: null
      };
    }

    console.log('Searching artists with term:', normalizedSearchTerm);
    
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.sonata.io.vn/api/v1/artist/search?page=${page}&rpp=${rpp}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        filters: [
          {
            operator: "like",
            key: "name",
            value: normalizedSearchTerm
          }
        ],
        sorts: [
          {
            key: "viewCount",
            type: "DESC"
          },
          {
            key: "followers", 
            type: "DESC"
          },
          {
            key: "name",
            type: "ASC"
          }
        ]
      }
    };

    console.log('API Request config for search:', {
      url: config.url,
      searchTerm: normalizedSearchTerm,
      page,
      rpp
    });

    const response = await axios(config);
    const data: ArtistSearchResponse = response.data;
    
    console.log(`API Response: Found ${data.data?.total || 0} artists for "${normalizedSearchTerm}"`);
    
    if (data.success) {
      return data;
    }
    
    return {
      status: "OK",
      code: 200,
      success: true,
      message: "No artists found",
      data: { total: 0, items: [] },
      errors: null
    };
  } catch (error: any) {
    console.error('Lỗi khi tìm kiếm nghệ sĩ:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    return {
      status: "ERROR",
      code: 500,
      success: false,
      message: "Search failed",
      data: { total: 0, items: [] },
      errors: error
    };
  }
};

// Simple function để test API search artists với exact example từ user
export const testArtistSearchAPI = async () => {
  try {
    const data = {
      "filters": [
        {
          "operator": "equal",
          "key": "id", 
          "value": 1
        }
      ],
      "sorts": [
        {
          "key": "id",
          "type": "DESC"
        }
      ]
    };

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.sonata.io.vn/api/v1/artist/search?page=1&rpp=10',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    console.log('Testing with exact API example from user...');
    const response = await axios(config);
    console.log('API Test Result:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error('API Test Error:', error.response?.data || error.message);
    return null;
  }
};

// Function để lấy tất cả nghệ sĩ với phân trang
export const getAllArtists = async (page: number = 1, rpp: number = 20): Promise<ArtistSearchResponse> => {
  try {
    console.log(`Getting all artists - page: ${page}, rpp: ${rpp}`);
    
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.sonata.io.vn/api/v1/artist/search?page=${page}&rpp=${rpp}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        filters: [], // Không có filter để lấy tất cả
        sorts: [
          {
            key: "viewCount",
            type: "DESC"
          },
          {
            key: "followers", 
            type: "DESC"
          },
          {
            key: "name",
            type: "ASC"
          }
        ]
      }
    };

    console.log('Get all artists API config:', JSON.stringify(config, null, 2));

    const response = await axios(config);
    const data: ArtistSearchResponse = response.data;
    
    console.log('Get all artists API response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      return data;
    }
    
    return {
      status: "OK",
      code: 200,
      success: true,
      message: "No artists found",
      data: { total: 0, items: [] },
      errors: null
    };
  } catch (error: any) {
    console.error('Lỗi khi lấy danh sách tất cả nghệ sĩ:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    return {
      status: "ERROR",
      code: 500,
      success: false,
      message: "Failed to get artists",
      data: { total: 0, items: [] },
      errors: error
    };
  }
};

// Function để lọc nghệ sĩ theo instrument
export const getArtistsByInstrument = async (
  instrumentName: string, 
  page: number = 1, 
  rpp: number = 20
): Promise<ArtistSearchResponse> => {
  try {
    console.log(`Getting artists by instrument: ${instrumentName}`);
    
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.sonata.io.vn/api/v1/artist/search?page=${page}&rpp=${rpp}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        filters: [
          {
            operator: "like",
            key: "instruments.name",
            value: instrumentName
          }
        ],
        sorts: [
          {
            key: "viewCount",
            type: "DESC"
          },
          {
            key: "followers", 
            type: "DESC"
          },
          {
            key: "name",
            type: "ASC"
          }
        ]
      }
    };

    const response = await axios(config);
    const data: ArtistSearchResponse = response.data;
    
    if (data.success) {
      return data;
    }
    
    return {
      status: "OK",
      code: 200,
      success: true,
      message: "No artists found for this instrument",
      data: { total: 0, items: [] },
      errors: null
    };
  } catch (error: any) {
    console.error('Lỗi khi lấy nghệ sĩ theo instrument:', error);
    return {
      status: "ERROR",
      code: 500,
      success: false,
      message: "Failed to get artists by instrument",
      data: { total: 0, items: [] },
      errors: error
    };
  }
};

// Function để lấy thông tin chi tiết một nghệ sĩ theo ID
export const getArtistById = async (id: number): Promise<Artist | null> => {
  try {
    console.log(`Getting artist details for ID: ${id}`);
    
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.sonata.io.vn/api/v1/artist/${id}`,
      headers: {
        'Accept': 'application/json'
      }
    };

    const response = await axios(config);
    console.log('Artist detail API response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error: any) {
    console.error('Lỗi khi lấy thông tin chi tiết nghệ sĩ:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    return null;
  }
};

export const getArtistsForHome = async (topN: number = 5): Promise<Artist[]> => {
  try {
    console.log(`🎭 Fetching artists for home page (${topN} items)...`);
    
    // Thử lấy top artists trước
    const topArtists = await getTopArtists(topN);
    
    if (topArtists && topArtists.length > 0) {
      console.log(`🎭 Successfully got ${topArtists.length} top artists from recommender API`);
      return topArtists;
    }
    
    // Nếu không có top artists, fallback sang getAllArtists
    console.log('🎭 Top artists empty, falling back to getAllArtists...');
    const allArtistsResponse = await getAllArtists(1, topN);
    
    if (allArtistsResponse.success && allArtistsResponse.data.items) {
      console.log(`🎭 Successfully got ${allArtistsResponse.data.items.length} artists from search API`);
      return allArtistsResponse.data.items;
    }
    
    console.warn('🎭 Both APIs failed to return artists');
    return [];
    
  } catch (error) {
    console.error('🎭 Error in getArtistsForHome:', error);
    
    // Last fallback - try getAllArtists directly
    try {
      console.log('🎭 Attempting final fallback to getAllArtists...');
      const fallbackResponse = await getAllArtists(1, topN);
      
      if (fallbackResponse.success && fallbackResponse.data.items) {
        console.log(`🎭 Final fallback successful: ${fallbackResponse.data.items.length} artists`);
        return fallbackResponse.data.items;
      }
    } catch (fallbackError) {
      console.error('🎭 Final fallback also failed:', fallbackError);
    }
    
    return [];
  }
}; 