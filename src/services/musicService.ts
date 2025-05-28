import axios from 'axios';

// Simplified interfaces cho các related objects
export interface SimpleAlbum {
  id: string;
  name: string;
}

export interface SimpleGenre {
  id: number;
  name: string;
  description: string;
  picture: string;
}

export interface SimpleArtist {
  id: number;
  name: string;
  description: string;
  picture: string;
}

export interface SimpleCategory {
  id: string;
  name: string;
  picture: string;
}

// Interface cho Music object
export interface Music {
  id: number;
  name: string;
  approved: boolean;
  coverPhoto: string;
  resourceLink: string;
  listenCount: number;
  favoriteCount: number;
  createAt: string;
  updateAt: string;
  albums: SimpleAlbum[];
  genres: SimpleGenre[];
  artists: SimpleArtist[];
  composers: SimpleArtist[];
  categories: SimpleCategory[];
}

// Interface cho response từ API search musics
export interface MusicSearchResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    items: Music[];
  };
  errors: unknown;
}

// Interface cho raw music data từ API
interface RawMusicData {
  id?: number;
  name?: string;
  approved?: boolean;
  coverPhoto?: string;
  resourceLink?: string;
  listenCount?: number;
  favoriteCount?: number;
  createAt?: string;
  updateAt?: string;
  albums?: SimpleAlbum[];
  genres?: SimpleGenre[];
  artists?: SimpleArtist[];
  composers?: SimpleArtist[];
  categories?: SimpleCategory[];
}

/**
 * Tìm kiếm musics theo từ khóa - Theo API documentation
 * @param searchTerm Từ khóa tìm kiếm
 * @param rpp Số kết quả trên trang (records per page)
 * @param page Trang hiện tại
 * @returns Kết quả tìm kiếm musics
 */
export async function searchMusics(
  searchTerm: string, 
  rpp: number = 10, 
  page: number = 1
): Promise<MusicSearchResponse> {
  try {
    const url = `https://api.sonata.io.vn/api/v1/music/search?rpp=${rpp}&page=${page}`;
    
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
          key: "listenCount",
          type: "DESC"
        },
        {
          key: "favoriteCount",
          type: "DESC"
        },
        {
          key: "name",
          type: "ASC"
        }
      ]
    };
    
    console.log('🎼 Music Search Request:', {
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
    
    console.log('🎼 Music Search Response:', response.data);
    
    // Parse response theo API documentation format
    if (response.data && response.data.success && response.data.data) {
      const { total, items } = response.data.data;
      
      const mappedItems = (items || []).map((music: RawMusicData) => ({
        id: music.id || 0,
        name: music.name || 'Unknown Music',
        approved: music.approved || false,
        coverPhoto: music.coverPhoto || '/default-music.jpg',
        resourceLink: music.resourceLink || '',
        listenCount: music.listenCount || 0,
        favoriteCount: music.favoriteCount || 0,
        createAt: music.createAt || '',
        updateAt: music.updateAt || '',
        albums: music.albums || [],
        genres: music.genres || [],
        artists: music.artists || [],
        composers: music.composers || [],
        categories: music.categories || []
      }));
      
      console.log('🎼 Mapped Musics:', mappedItems);
      
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
      console.warn('🎼 API search musics trả về dữ liệu không như mong đợi:', response.data);
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
    console.error('❌ Lỗi khi tìm kiếm musics:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('⏰ Timeout khi tìm kiếm musics:', error.message);
      } else if (error.response) {
        console.error('🚫 Lỗi API search musics:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url
        });
      } else if (error.request) {
        console.error('📡 Không nhận được response từ API search musics:', error.message);
      }
    } else {
      console.error('💥 Lỗi không xác định khi tìm kiếm musics:', error);
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
 * Tìm kiếm musics theo category ID - Theo API documentation
 * @param categoryId ID của category cần tìm
 * @param rpp Số kết quả trên trang (records per page)
 * @param page Trang hiện tại
 * @returns Kết quả tìm kiếm musics theo category
 */
export async function searchMusicsByCategory(
  categoryId: string | number, 
  rpp: number = 10, 
  page: number = 1
): Promise<MusicSearchResponse> {
  try {
    const url = `https://api.sonata.io.vn/api/v1/music/search?rpp=${rpp}&page=${page}`;
    
    // Request data theo đúng API documentation để filter theo category ID
    const requestData = {
      filters: [
        {
          operator: "equal",
          key: "categories.id",
          value: parseInt(categoryId.toString())
        }
        // Không filter theo approved để lấy tất cả nhạc như category API
      ],
      sorts: [
        {
          key: "listenCount",
          type: "DESC"
        },
        {
          key: "favoriteCount", 
          type: "DESC"
        },
        {
          key: "name",
          type: "ASC"
        }
      ]
    };
    
    console.log('🎼 Music Search by Category Request:', {
      url,
      data: requestData,
      categoryId
    });
    
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 8000
    });
    
    console.log('🎼 Music Search by Category Response:', response.data);
    
    // Parse response theo API documentation format
    if (response.data && response.data.success && response.data.data) {
      const { total, items } = response.data.data;
      
      const mappedItems = (items || []).map((music: RawMusicData) => ({
        id: music.id || 0,
        name: music.name || 'Unknown Music',
        approved: music.approved || false,
        coverPhoto: music.coverPhoto || '/default-music.jpg',
        resourceLink: music.resourceLink || '',
        listenCount: music.listenCount || 0,
        favoriteCount: music.favoriteCount || 0,
        createAt: music.createAt || '',
        updateAt: music.updateAt || '',
        albums: music.albums || [],
        genres: music.genres || [],
        artists: music.artists || [],
        composers: music.composers || [],
        categories: music.categories || []
      }));
      
      console.log('🎼 Mapped Musics by Category:', mappedItems);
      console.log(`📊 Category ${categoryId}: Total ${total} musics found`);
      
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
      console.warn('🎼 API search musics by category trả về dữ liệu không như mong đợi:', response.data);
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
    console.error('❌ Lỗi khi tìm kiếm musics by category:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('⏰ Timeout khi tìm kiếm musics by category:', error.message);
      } else if (error.response) {
        console.error('🚫 Lỗi API search musics by category:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url
        });
      } else if (error.request) {
        console.error('📡 Không nhận được response từ API search musics by category:', error.message);
      }
    } else {
      console.error('💥 Lỗi không xác định khi tìm kiếm musics by category:', error);
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
 * Lấy tổng số bài hát trong category - không phân trang
 * @param categoryId ID của category cần đếm
 * @returns Tổng số bài hát trong category
 */
export async function getTotalMusicsByCategory(categoryId: string | number): Promise<number> {
  try {
    const response = await searchMusicsByCategory(categoryId, 1, 1); // Chỉ lấy 1 item để đếm total
    return response.data.total;
  } catch (error) {
    console.error('❌ Lỗi khi đếm musics trong category:', error);
    return 0;
  }
} 