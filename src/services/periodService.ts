import axios from 'axios';

export interface Period {
  id: number;
  name: string;
  description: string;
  picture: string;
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
}

// Interface cho response từ API search periods
export interface PeriodSearchResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    items: Period[];
  };
  errors: null | any;
}

/**
 * Tìm kiếm periods - Theo API documentation 
 * @param rpp Số kết quả trên trang (records per page)
 * @param page Trang hiện tại
 * @returns Kết quả tìm kiếm periods
 */
export async function searchPeriods(
  rpp: number = 10, 
  page: number = 1
): Promise<PeriodSearchResponse> {
  try {
    const url = `https://api.sonata.io.vn/api/v1/period/search?rpp=${rpp}&page=${page}`;
    
    console.log('📅 Period Search Request:', {
      url,
      rpp,
      page
    });
    
    const response = await axios.post(url, {}, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 8000
    });
    
    console.log('📅 Period Search Response:', response.data);
    
    // Parse response theo API documentation format
    if (response.data && response.data.success && response.data.data) {
      const { total, items } = response.data.data;
      
      const mappedItems = (items || []).map((period: any) => ({
        id: period.id || 0,
        name: period.name || 'Unknown Period',
        description: period.description || '',
        picture: period.picture || '/default-period.jpg',
        createAt: period.createAt,
        updateAt: period.updateAt,
        deleteAt: period.deleteAt
      }));
      
      console.log('📅 Mapped Periods:', mappedItems);
      
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
      console.warn('📅 API search periods trả về dữ liệu không như mong đợi:', response.data);
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
    console.error('❌ Lỗi khi tìm kiếm periods:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('⏰ Timeout khi tìm kiếm periods:', error.message);
      } else if (error.response) {
        console.error('🚫 Lỗi API search periods:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url
        });
      } else if (error.request) {
        console.error('📡 Không nhận được response từ API search periods:', error.message);
      }
    } else {
      console.error('💥 Lỗi không xác định khi tìm kiếm periods:', error);
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

/**
 * Tìm kiếm periods theo từ khóa (filter client-side)
 * Vì API có thể không hỗ trợ keyword search, ta sẽ lấy tất cả rồi filter
 * @param searchTerm Từ khóa tìm kiếm
 * @param rpp Số kết quả trên trang
 * @param page Trang hiện tại
 * @returns Kết quả tìm kiếm periods đã filter
 */
export async function searchPeriodsByKeyword(
  searchTerm: string,
  rpp: number = 10, 
  page: number = 1
): Promise<PeriodSearchResponse> {
  try {
    // Lấy nhiều results hơn để filter
    const allPeriods = await searchPeriods(50, 1);
    
    if (allPeriods.success && allPeriods.data.items) {
      // Filter theo từ khóa
      const filteredItems = allPeriods.data.items.filter(period => 
        period.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        period.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Pagination cho filtered results
      const startIndex = (page - 1) * rpp;
      const endIndex = startIndex + rpp;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);
      
      console.log(`📅 Filtered Periods: ${filteredItems.length} total, showing ${paginatedItems.length}`);
      
      return {
        status: "OK",
        code: 200,
        success: true,
        message: "Searched successfully",
        data: {
          total: filteredItems.length,
          items: paginatedItems
        },
        errors: null
      };
    }
    
    return allPeriods;
  } catch (error) {
    console.error('❌ Lỗi khi tìm kiếm periods by keyword:', error);
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

/**
 * Lấy thông tin chi tiết period theo ID
 * @param id ID của period
 * @returns Thông tin chi tiết period
 */
export async function getPeriodById(id: string | number): Promise<Period | null> {
  try {
    const url = `https://api.sonata.io.vn/api/v1/period/${id}`;
    
    console.log('📅 Getting period by ID:', { id, url });
    
    const response = await axios.get(url, {
      timeout: 8000
    });
    
    console.log('📅 Period Detail Response:', response.data);
    
    if (response.data && response.data.success && response.data.data) {
      const period = response.data.data;
      
      return {
        id: period.id || 0,
        name: period.name || 'Unknown Period',
        description: period.description || '',
        picture: period.picture || '/default-period.jpg',
        createAt: period.createAt,
        updateAt: period.updateAt,
        deleteAt: period.deleteAt
      };
    } else {
      console.warn('📅 API period detail trả về dữ liệu không như mong đợi:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy thông tin period:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('⏰ Timeout khi lấy period:', error.message);
      } else if (error.response) {
        console.error('🚫 Lỗi API period detail:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url
        });
      } else if (error.request) {
        console.error('📡 Không nhận được response từ API period detail:', error.message);
      }
    } else {
      console.error('💥 Lỗi không xác định khi lấy period:', error);
    }
    return null;
  }
}

/**
 * Lấy danh sách nhạc theo period ID  
 * @param periodId ID của period
 * @param rpp Số kết quả trên trang (records per page)
 * @param page Trang hiện tại
 * @returns Danh sách nhạc của period
 */
export async function getMusicsByPeriodId(
  periodId: string | number,
  rpp: number = 20,
  page: number = 1
): Promise<{ total: number; items: any[] }> {
  try {
    const url = `https://api.sonata.io.vn/api/v1/music/search?rpp=${rpp}&page=${page}`;
    
    const requestData = {
      filters: [
        {
          operator: "=", 
          key: "periodId",
          value: periodId.toString()
        }
      ],
      sorts: [
        {
          key: "name",
          type: "ASC"
        }
      ]
    };
    
    console.log('📅 Getting musics by period ID:', { periodId, url, requestData });
    
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 8000
    });
    
    console.log('📅 Musics by Period Response:', response.data);
    
    if (response.data && response.data.success && response.data.data) {
      const { total, items } = response.data.data;
      
      const mappedItems = (items || []).map((music: any) => ({
        id: music.id || 0,
        name: music.name || 'Unknown Music',
        description: music.description || '',
        coverPhoto: music.coverPhoto || '/default-music.jpg',
        lyric: music.lyric,
        audioFile: music.audioFile,
        viewCount: music.viewCount,
        likeCount: music.likeCount,
        artists: music.artists || [],
        albums: music.albums || []
      }));
      
      return {
        total: total || 0,
        items: mappedItems
      };
    } else {
      console.warn('📅 API musics by period trả về dữ liệu không như mong đợi:', response.data);
      return { total: 0, items: [] };
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy nhạc theo period:', error);
    return { total: 0, items: [] };
  }
} 