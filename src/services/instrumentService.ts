import axios from 'axios';
import { Song } from './recommendService';

export interface Instrument {
  id: number;
  name: string;
  description: string;
  picture: string;
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
  musics?: Song[];
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

// Interface cho response từ API search instruments
export interface InstrumentSearchResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    items: Instrument[];
  };
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

/**
 * Tìm kiếm instruments theo từ khóa - Theo API documentation
 * @param searchTerm Từ khóa tìm kiếm
 * @param rpp Số kết quả trên trang (records per page)
 * @param page Trang hiện tại
 * @returns Kết quả tìm kiếm instruments
 */
export async function searchInstruments(
  searchTerm: string, 
  rpp: number = 10, 
  page: number = 1
): Promise<InstrumentSearchResponse> {
  try {
    const url = `https://api.sonata.io.vn/api/v1/instrument/search?rpp=${rpp}&page=${page}`;
    
    // Request data theo đúng API documentation
    const requestData = {
      filters: [
        {
          operator: "like",
          key: "name",
          value: searchTerm
        }
      ],
      sorts: [
        {
          key: "name",
          type: "ASC"
        },
        {
          key: "id",
          type: "DESC"
        }
      ]
    };
    
    console.log('🎹 Instrument Search Request:', {
      url,
      data: requestData,
      searchTerm
    });
    
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 8000
    });
    
    console.log('🎹 Instrument Search Response:', response.data);
    
    // Parse response theo API documentation format
    if (response.data && response.data.success && response.data.data) {
      const { total, items } = response.data.data;
      
      const mappedItems = (items || []).map((instrument: any) => ({
        id: instrument.id || 0,
        name: instrument.name || 'Unknown Instrument',
        description: instrument.description || '',
        picture: instrument.picture || '/default-instrument.jpg',
        createAt: instrument.createAt,
        updateAt: instrument.updateAt,
        deleteAt: instrument.deleteAt
      }));
      
      console.log('🎹 Mapped Instruments:', mappedItems);
      
      return {
        status: response.data.status,
        code: response.data.code,
        success: response.data.success,
        message: response.data.message,
        data: {
          total: total || 0,
          items: mappedItems
        },
        errors: response.data.errors
      };
    } else {
      console.warn('🎹 API search instruments trả về dữ liệu không như mong đợi:', response.data);
      return {
        status: "ERROR",
        code: 404,
        success: false,
        message: "No data found",
        data: { total: 0, items: [] },
        errors: null
      };
    }
  } catch (error) {
    console.error('❌ Lỗi khi tìm kiếm instruments:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('⏰ Timeout khi tìm kiếm instruments:', error.message);
      } else if (error.response) {
        console.error('🚫 Lỗi API search instruments:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url
        });
      } else if (error.request) {
        console.error('📡 Không nhận được response từ API search instruments:', error.message);
      }
    } else {
      console.error('💥 Lỗi không xác định khi tìm kiếm instruments:', error);
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
} 