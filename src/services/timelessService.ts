import axios from 'axios';
import { Song } from './recommendService';

export interface TimelessResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: Song[];
  errors: null | any;
}

export const getTimelessPieces = async (topN: number = 5): Promise<Song[]> => {
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.sonata.io.vn/api/v1/recommender/timeless-pieces?topN=${topN}`,
      headers: {
        'Accept': 'application/json'
      }
    };

    const response = await axios(config);
    const data: TimelessResponse = response.data;
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài hát bất hủ:', error);
    return [];
  }
}; 