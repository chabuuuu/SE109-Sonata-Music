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