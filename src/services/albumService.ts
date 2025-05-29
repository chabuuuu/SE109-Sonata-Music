import axios from 'axios';

// Định nghĩa Music interface trực tiếp trong file này vì musicService.ts đã bị xóa
export interface Music {
  id: number;
  name: string;
  description: string;
  coverPhoto: string;
  lyric?: string;
  audioFile?: string;
}

export interface Album {
  id: number | string;
  name: string;
  description: string;
  coverPhoto: string;
  releaseDate: string;
  albumType?: string;
  viewCount?: number;
  likeCount?: number;
  createAt?: string;
  updateAt?: string;
  deleteAt?: string | null;
  musics?: Music[];
}

/**
 * Lấy danh sách album phổ biến từ API
 * @param topN Số lượng album cần lấy
 * @returns Danh sách album
 */
export async function getPopularAlbums(topN: number = 5): Promise<Album[]> {
  try {
    // URL đúng theo API thực tế
    const url = `https://api.sonata.io.vn/api/v1/recommender/popular-albums`;
    
    // Tham số đúng là topN thay vì limit
    const params = {
      topN: topN
    };
    
    // Gửi request với timeout
    const response = await axios.get(url, { 
      params,
      timeout: 8000 // Timeout sau 8 giây
    });
    
    // Kiểm tra response theo cấu trúc API thực tế
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data.map((album: any) => ({
        id: album.id || 0,
        name: album.name || 'Unknown Album',
        description: album.description || '',
        coverPhoto: album.coverPhoto || '/default-album.jpg',
        releaseDate: album.releaseDate || new Date().toISOString(),
        albumType: album.albumType,
        viewCount: album.viewCount,
        likeCount: album.likeCount,
        createAt: album.createAt,
        updateAt: album.updateAt,
        deleteAt: album.deleteAt,
        musics: album.musics || []
      }));
    } else {
      console.warn('API trả về dữ liệu không như mong đợi:', response.data);
      return [];
    }
  } catch (error) {
    // Xử lý lỗi chi tiết
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('Timeout khi kết nối đến API albums:', error.message);
      } else if (error.response) {
        // Lỗi server trả về (status code không phải 2xx)
        console.error('Lỗi API albums:', error.response.status, error.response.data);
      } else if (error.request) {
        // Không nhận được response
        console.error('Không nhận được response từ API albums:', error.message);
      }
    } else {
      console.error('Lỗi không xác định khi lấy album phổ biến:', error);
    }
    return [];
  }
}

/**
 * Interface cho response từ API search albums
 */
export interface AlbumSearchResponse {
  total: number;
  items: Album[];
}

/**
 * Tìm kiếm album theo từ khóa - Updated theo API documentation
 * @param searchTerm Từ khóa tìm kiếm
 * @param rpp Số kết quả trên trang (records per page)
 * @param page Trang hiện tại
 * @returns Kết quả tìm kiếm album
 */
export async function searchAlbums(
  searchTerm: string, 
  rpp: number = 10, 
  page: number = 1
): Promise<AlbumSearchResponse> {
  try {
    // Chuẩn hóa search term - trim và đảm bảo có ít nhất 1 ký tự
    const normalizedSearchTerm = searchTerm.trim();
    
    if (!normalizedSearchTerm) {
      return { total: 0, items: [] };
    }

    const url = `https://api.sonata.io.vn/api/v1/album/search?rpp=${rpp}&page=${page}`;
    
    // Request data theo đúng API documentation
    const requestData = {
      filters: [
        {
          operator: "like",
          key: "name",
          value: normalizedSearchTerm
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
    
    console.log('📀 Album Search Request:', {
      url,
      searchTerm: normalizedSearchTerm,
      page,
      rpp
    });
    
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 8000
    });
    
    console.log(`📀 API Response: Found ${response.data?.data?.total || 0} albums for "${normalizedSearchTerm}"`);
    
    // Parse response theo API documentation format
    if (response.data && response.data.success && response.data.data) {
      const { total, items } = response.data.data;
      
      const mappedItems = (items || []).map((album: any) => ({
        id: album.id || 0,
        name: album.name || 'Unknown Album',
        description: album.description || '',
        coverPhoto: album.coverPhoto || '/default-album.jpg',
        releaseDate: album.releaseDate || new Date().toISOString(),
        albumType: album.albumType,
        viewCount: album.viewCount,
        likeCount: album.likeCount,
        createAt: album.createAt,
        updateAt: album.updateAt,
        deleteAt: album.deleteAt,
        musics: album.musics || []
      }));
      
      return {
        total: total || 0,
        items: mappedItems
      };
    } else {
      console.warn('📀 API search albums trả về dữ liệu không như mong đợi:', response.data);
      return { total: 0, items: [] };
    }
  } catch (error) {
    console.error('❌ Lỗi khi tìm kiếm albums:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('⏰ Timeout khi tìm kiếm albums');
      } else if (error.response) {
        console.error('🚫 Lỗi API search albums:', {
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        console.error('📡 Không nhận được response từ API search albums');
      }
    } else {
      console.error('💥 Lỗi không xác định khi tìm kiếm albums:', error);
    }
    return { total: 0, items: [] };
  }
}

/**
 * Lấy thông tin chi tiết album theo ID
 * @param id ID của album
 * @returns Thông tin chi tiết album
 */
export async function getAlbumById(id: string | number): Promise<Album | null> {
  try {
    const url = `https://api.sonata.io.vn/api/v1/album/${id}`;
    
    console.log('📀 Getting album by ID:', { id, url });
    
    const response = await axios.get(url, {
      timeout: 8000
    });
    
    console.log('📀 Album Detail Response:', response.data);
    
    if (response.data && response.data.success && response.data.data) {
      const album = response.data.data;
      
      return {
        id: album.id || 0,
        name: album.name || 'Unknown Album',
        description: album.description || '',
        coverPhoto: album.coverPhoto || '/default-album.jpg',
        releaseDate: album.releaseDate || new Date().toISOString(),
        albumType: album.albumType,
        viewCount: album.viewCount,
        likeCount: album.likeCount,
        createAt: album.createAt,
        updateAt: album.updateAt,
        deleteAt: album.deleteAt,
        musics: (album.musics || []).map((music: any) => ({
          id: music.id || 0,
          name: music.name || 'Unknown Track',
          description: music.description || '',
          coverPhoto: music.coverPhoto || album.coverPhoto || '/default-music.jpg',
          lyric: music.lyric,
          audioFile: music.audioFile
        }))
      };
    } else {
      console.warn('📀 API album detail trả về dữ liệu không như mong đợi:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy thông tin album:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('⏰ Timeout khi lấy album:', error.message);
      } else if (error.response) {
        console.error('🚫 Lỗi API album detail:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url
        });
      } else if (error.request) {
        console.error('📡 Không nhận được response từ API album detail:', error.message);
      }
    } else {
      console.error('💥 Lỗi không xác định khi lấy album:', error);
    }
    return null;
  }
}