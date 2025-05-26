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
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.sonata.io.vn/api/v1/recommender/top-artist-today?topN=${topN}`,
      headers: {
        'Accept': 'application/json'
      }
    };

    const response = await axios(config);
    const data: TopArtistsResponse = response.data;
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nghệ sĩ hàng đầu:', error);
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
    console.log('Searching artists with term:', searchTerm);
    
    // Test API trước để đảm bảo endpoint hoạt động
    if (process.env.NODE_ENV === 'development') {
      await testSearchArtists();
    }
    
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
            value: searchTerm
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

    console.log('API Request config:', JSON.stringify(config, null, 2));

    const response = await axios(config);
    const data: ArtistSearchResponse = response.data;
    
    console.log('API Response:', JSON.stringify(data, null, 2));
    
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
    } catch (error: any) {    console.error('Lỗi khi tìm kiếm nghệ sĩ:', error);    if (error.response) {      console.error('Error response data:', error.response.data);      console.error('Error response status:', error.response.status);    }    return {      status: "ERROR",      code: 500,      success: false,      message: "Search failed",      data: { total: 0, items: [] },      errors: error    };  }
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