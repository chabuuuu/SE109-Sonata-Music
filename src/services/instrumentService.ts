import axios from 'axios';
import { Song } from './recommendService';

export interface Instrument {
  id: number;
  name: string;
  picture?: string;
  musics: Song[];
}

export interface InstrumentSpotlight {
  instrument: Instrument;
}

export interface InstrumentSpotlightResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: InstrumentSpotlight[];
  errors: null | any;
}

export const getInstrumentSpotlight = async (topN: number = 5): Promise<InstrumentSpotlight[]> => {
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.sonata.io.vn/api/v1/recommender/instrument-spotlight?topN=${topN}`,
      headers: {
        'Accept': 'application/json'
      }
    };

    const response = await axios(config);
    const data: InstrumentSpotlightResponse = response.data;
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhạc cụ tiêu biểu:', error);
    return [];
  }
}; 