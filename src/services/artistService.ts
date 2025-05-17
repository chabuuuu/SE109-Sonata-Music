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