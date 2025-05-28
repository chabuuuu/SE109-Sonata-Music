import axios from 'axios';
import { Category, CategoryResponse } from '@/interfaces/category';

// Interface cho response từ API search categories
export interface CategorySearchResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    items: Category[];
  };
  errors: null | any;
}

// Interface cho raw category data từ API
interface RawCategoryData {
  id?: string;
  name?: string;
  picture?: string;
  description?: string;
  viewCount?: number;
  totalMusics?: number;
}

/**
 * Lấy danh sách categories từ API
 * @returns Danh sách categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const url = 'https://api.sonata.io.vn/api/v1/category';
    
    // Gửi request với timeout
    const response = await axios.get<CategoryResponse>(url, {
      timeout: 8000 // Timeout sau 8 giây
    });
    
    // Kiểm tra response theo cấu trúc API thực tế
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data.map((category: RawCategoryData) => ({
        id: category.id || '',
        name: category.name || 'Unknown Category',
        picture: category.picture || '/default-category.jpg',
        description: category.description || null,
        viewCount: category.viewCount || 0,
        totalMusics: category.totalMusics || 0
      }));
    } else {
      console.warn('API trả về dữ liệu không như mong đợi:', response.data);
      return [];
    }
  } catch (error) {
    // Xử lý lỗi chi tiết
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('Timeout khi kết nối đến API categories:', error.message);
      } else if (error.response) {
        // Lỗi server trả về (status code không phải 2xx)
        console.error('Lỗi API categories:', error.response.status, error.response.data);
      } else if (error.request) {
        // Không nhận được response
        console.error('Không nhận được response từ API categories:', error.message);
      }
    } else {
      console.error('Lỗi không xác định khi lấy categories:', error);
    }
    return [];
  }
}

/**
 * Tìm kiếm categories theo từ khóa - Theo API documentation
 * @param searchTerm Từ khóa tìm kiếm
 * @param rpp Số kết quả trên trang (records per page)
 * @param page Trang hiện tại
 * @returns Kết quả tìm kiếm categories
 */
export async function searchCategories(
  searchTerm: string, 
  rpp: number = 10, 
  page: number = 1
): Promise<CategorySearchResponse> {
  try {
    const url = `https://api.sonata.io.vn/api/v1/category/search?rpp=${rpp}&page=${page}`;
    
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
          key: "viewCount",
          type: "DESC"
        },
        {
          key: "name",
          type: "ASC"
        }
      ]
    };
    
    console.log('🏷️ Category Search Request:', {
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
    
    console.log('🏷️ Category Search Response:', response.data);
    
    // Parse response theo API documentation format
    if (response.data && response.data.success && response.data.data) {
      const { total, items } = response.data.data;
      
      const mappedItems = (items || []).map((category: any) => ({
        id: category.id || '',
        name: category.name || 'Unknown Category',
        picture: category.picture || '/default-category.jpg',
        description: category.description,
        viewCount: category.viewCount || 0,
        totalMusics: category.totalMusics || 0
      }));
      
      console.log('🏷️ Mapped Categories:', mappedItems);
      
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
      console.warn('🏷️ API search categories trả về dữ liệu không như mong đợi:', response.data);
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
    console.error('❌ Lỗi khi tìm kiếm categories:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('⏰ Timeout khi tìm kiếm categories:', error.message);
      } else if (error.response) {
        console.error('🚫 Lỗi API search categories:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url
        });
      } else if (error.request) {
        console.error('📡 Không nhận được response từ API search categories:', error.message);
      }
    } else {
      console.error('💥 Lỗi không xác định khi tìm kiếm categories:', error);
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