import axios from 'axios';

export interface Song {
  id: number;
  name: string;
  description: string;
  approved: boolean;
  approvedById: string;
  approvedAt: string;
  lyric: string;
  nationality: string | null;
  coverPhoto: string;
  resourceLink: string;
  uploadedById: string;
  listenCount: number;
  favoriteCount: number;
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
}

export interface RecommendResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: Song[];
  errors: null | any;
}

export const getRecommendedSongs = async (topN: number = 5): Promise<Song[]> => {
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.sonata.io.vn/api/v1/recommender/songs?topN=${topN}`,
      headers: {
        'Accept': 'application/json'
      }
    };

    const response = await axios(config);
    const data: RecommendResponse = response.data;
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài hát đề xuất:', error);
    return [];
  }
}; 