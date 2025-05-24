import axios from 'axios';
import { Song } from './recommendService';

export interface Period {
  id: number;
  name: string;
  picture?: string;
  musics: Song[];
}

export interface EraStyle {
  period: Period;
}

export interface EraStyleResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: EraStyle[];
  errors: null | any;
}

export const getErasAndStyles = async (topN: number = 5): Promise<EraStyle[]> => {
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.sonata.io.vn/api/v1/recommender/eras-and-styles?topN=${topN}`,
      headers: {
        'Accept': 'application/json'
      }
    };

    const response = await axios(config);
    const data: EraStyleResponse = response.data;
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thời kỳ và phong cách âm nhạc:', error);
    return [];
  }
}; 