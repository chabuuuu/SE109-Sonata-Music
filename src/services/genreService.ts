import axios from 'axios';

// Interface cho Genre object
export interface Genre {
  id: number;
  name: string;
  description: string;
  picture: string;
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
}

// Interface cho response từ API search genres
export interface GenreSearchResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    items: Genre[];
  };
  errors: null | any;
}

/**
 * Tìm kiếm genres theo từ khóa - Theo API documentation
 * @param searchTerm Từ khóa tìm kiếm
 * @param rpp Số kết quả trên trang (records per page)
 * @param page Trang hiện tại
 * @returns Kết quả tìm kiếm genres
 */
export async function searchGenres(
  searchTerm: string, 
  rpp: number = 10, 
  page: number = 1
): Promise<GenreSearchResponse> {
  try {
    const url = `https://api.sonata.io.vn/api/v1/genre/search?rpp=${rpp}&page=${page}`;
    
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
    
    console.log('🎵 Genre Search Request:', {
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
    
    console.log('🎵 Genre Search Response:', response.data);
    
    // Parse response theo API documentation format
    if (response.data && response.data.success && response.data.data) {
      const { total, items } = response.data.data;
      
      const mappedItems = (items || []).map((genre: any) => ({
        id: genre.id || 0,
        name: genre.name || 'Unknown Genre',
        description: genre.description || '',
        picture: genre.picture || '/default-genre.jpg',
        createAt: genre.createAt,
        updateAt: genre.updateAt,
        deleteAt: genre.deleteAt
      }));
      
      console.log('🎵 Mapped Genres:', mappedItems);
      
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
      console.warn('🎵 API search genres trả về dữ liệu không như mong đợi:', response.data);
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
    console.error('❌ Lỗi khi tìm kiếm genres:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('⏰ Timeout khi tìm kiếm genres:', error.message);
      } else if (error.response) {
        console.error('🚫 Lỗi API search genres:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url
        });
      } else if (error.request) {
        console.error('📡 Không nhận được response từ API search genres:', error.message);
      }
    } else {
      console.error('💥 Lỗi không xác định khi tìm kiếm genres:', error);
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