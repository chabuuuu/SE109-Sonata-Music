import axios from 'axios';

export interface Orchestra {
  id: string;
  name: string;
  description: string;
  picture: string;
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
}

// Interface cho response từ API search orchestras
export interface OrchestraSearchResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    items: Orchestra[];
  };
  errors: null | any;
}

/**
 * Tìm kiếm orchestras - Theo API documentation 
 * @param rpp Số kết quả trên trang (records per page)
 * @param page Trang hiện tại
 * @returns Kết quả tìm kiếm orchestras
 */
export async function searchOrchestras(
  rpp: number = 10, 
  page: number = 1
): Promise<OrchestraSearchResponse> {
  try {
    const url = `https://api.sonata.io.vn/api/v1/orchestra/search?rpp=${rpp}&page=${page}`;
    
    console.log('🎼 Orchestra Search Request:', {
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
    
    console.log('🎼 Orchestra Search Response:', response.data);
    
    // Parse response theo API documentation format
    if (response.data && response.data.success && response.data.data) {
      const { total, items } = response.data.data;
      
      const mappedItems = (items || []).map((orchestra: any) => ({
        id: orchestra.id || '0',
        name: orchestra.name || 'Unknown Orchestra',
        description: orchestra.description || '',
        picture: orchestra.picture || '/default-orchestra.jpg',
        createAt: orchestra.createAt,
        updateAt: orchestra.updateAt,
        deleteAt: orchestra.deleteAt
      }));
      
      console.log('🎼 Mapped Orchestras:', mappedItems);
      
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
      console.warn('🎼 API search orchestras trả về dữ liệu không như mong đợi:', response.data);
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
    console.error('❌ Lỗi khi tìm kiếm orchestras:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('⏰ Timeout khi tìm kiếm orchestras:', error.message);
      } else if (error.response) {
        console.error('🚫 Lỗi API search orchestras:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url
        });
      } else if (error.request) {
        console.error('📡 Không nhận được response từ API search orchestras:', error.message);
      }
    } else {
      console.error('💥 Lỗi không xác định khi tìm kiếm orchestras:', error);
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
 * Tìm kiếm orchestras theo từ khóa (filter client-side)
 * Vì API không có search by keyword, ta sẽ lấy tất cả rồi filter
 * @param searchTerm Từ khóa tìm kiếm
 * @param rpp Số kết quả trên trang
 * @param page Trang hiện tại
 * @returns Kết quả tìm kiếm orchestras đã filter
 */
export async function searchOrchestrasByKeyword(
  searchTerm: string,
  rpp: number = 10, 
  page: number = 1
): Promise<OrchestraSearchResponse> {
  try {
    // Lấy nhiều results hơn để filter
    const allOrchestras = await searchOrchestras(50, 1);
    
    if (allOrchestras.success && allOrchestras.data.items) {
      // Filter theo từ khóa
      const filteredItems = allOrchestras.data.items.filter(orchestra => 
        orchestra.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orchestra.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Pagination cho filtered results
      const startIndex = (page - 1) * rpp;
      const endIndex = startIndex + rpp;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);
      
      console.log(`🎼 Filtered Orchestras: ${filteredItems.length} total, showing ${paginatedItems.length}`);
      
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
    
    return allOrchestras;
  } catch (error) {
    console.error('❌ Lỗi khi tìm kiếm orchestras by keyword:', error);
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