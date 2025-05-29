import axios from 'axios';
import { getAuthHeaders } from './authService';

// Interface cho response từ API favorite
export interface FavoriteResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: any;
  errors: any;
}

// Interface cho item trong favorite list
export interface FavoriteMusic {
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
  id: number;
  listenerId: string;
  musicId: number;
  music: {
    createAt: string;
    updateAt: string;
    id: number;
    name: string;
    coverPhoto: string;
    genres: Array<{
      id: number;
      name: string;
    }>;
    instruments: Array<{
      id: number;
      name: string;
    }>;
    categories: Array<{
      id: string;
      name: string;
    }>;
    artists: Array<{
      id: number;
      name: string;
      genres: Array<{
        createAt: string;
        updateAt: string;
        deleteAt: string | null;
        id: number;
        name: string;
        description: string;
        picture: string;
      }>;
    }>;
  };
}

// Interface cho favorite list response
export interface FavoriteListResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    items: FavoriteMusic[];
  };
  errors: any;
}

// Cache để lưu trạng thái favorite music (với timestamp để invalidate)
interface FavoriteCacheEntry {
  value: boolean;
  timestamp: number;
}

const favoriteStatusCache = new Map<number, FavoriteCacheEntry>();
const FAVORITE_CACHE_DURATION = 2000; // Giảm xuống 2 seconds để sync nhanh hơn

// Global event system để đồng bộ UI
class FavoriteEventSystem {
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  emit(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in favorite event listener:', error);
        }
      });
    }
  }

  // Clear all listeners (for cleanup)
  clear() {
    this.listeners.clear();
  }

  // Force refresh tất cả favorite buttons
  forceRefreshAll() {
    this.emit('forceRefreshAll', { timestamp: Date.now() });
  }
}

// Global instance
export const favoriteEvents = new FavoriteEventSystem();

/**
 * Clear cache cho favorite music
 */
export function clearFavoriteStatusCache(musicId?: number) {
  if (musicId) {
    favoriteStatusCache.delete(musicId);
    // Emit event để notify UI components
    favoriteEvents.emit('favoriteStatusChanged', { 
      type: 'music', 
      id: musicId, 
      action: 'cache_cleared' 
    });
  } else {
    favoriteStatusCache.clear();
    favoriteEvents.emit('allFavoritesCleared', { type: 'music' });
  }
}

/**
 * Thêm nhạc vào danh sách yêu thích
 * @param musicId ID của bài nhạc cần thêm
 * @returns Promise với kết quả API
 */
export async function addToFavorite(musicId: number): Promise<FavoriteResponse> {
  try {
    const url = 'https://api.sonata.io.vn/api/v1/favorite-list/add';
    
    const requestData = {
      musicId: musicId
    };
    
    console.log('❤️ Add to Favorite Request:', {
      url,
      data: requestData
    });
    
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      timeout: 8000
    });
    
    console.log('❤️ Add to Favorite Response:', response.data);
    
    // Clear cache sau khi thêm thành công
    if (response.data && response.data.success) {
      clearFavoriteStatusCache(musicId);
      // Emit event để notify tất cả UI components
      favoriteEvents.emit('favoriteStatusChanged', {
        type: 'music',
        id: musicId,
        action: 'added',
        newStatus: true
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❤️ Lỗi khi thêm vào favorite:', error);
    
    // Clear cache trong trường hợp lỗi để force refresh
    clearFavoriteStatusCache(musicId);
    
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      
      if (status === 401) {
        throw new Error('Vui lòng đăng nhập để thêm vào yêu thích');
      }
      if (status === 400) {
        // Kiểm tra nếu đã favorite rồi thì trả về success
        const errorMessage = responseData?.message || '';
        if (errorMessage.includes('already') || 
            errorMessage.includes('đã có') || 
            errorMessage.includes('đã thích') ||
            errorMessage.includes('existed')) {
          return {
            status: 'success',
            code: 200,
            success: true,
            message: 'Đã có trong danh sách yêu thích',
            data: null,
            errors: null
          };
        }
        throw new Error(errorMessage || 'Dữ liệu không hợp lệ');
      }
      if (status === 404) {
        throw new Error('Không tìm thấy bài nhạc');
      }
      if (status >= 500) {
        throw new Error('Lỗi server, vui lòng thử lại sau');
      }
      
      // Lỗi khác
      const errorMessage = responseData?.message || 'Không thể thêm vào danh sách yêu thích';
      throw new Error(errorMessage);
    }
    
    // Lỗi network hoặc timeout
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Yêu cầu quá thời gian, vui lòng thử lại');
      }
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Lỗi kết nối mạng');
      }
    }
    
    throw new Error('Không thể thêm vào danh sách yêu thích');
  }
}

/**
 * Lấy danh sách nhạc yêu thích của user
 * @param rpp Số kết quả trên trang (records per page)
 * @param page Trang hiện tại
 * @returns Promise với danh sách favorite music
 */
export async function getFavoriteList(
  rpp: number = 10, 
  page: number = 1
): Promise<FavoriteListResponse> {
  try {
    const url = `https://api.sonata.io.vn/api/v1/favorite-list/me?rpp=${rpp}&page=${page}`;
    
    const requestData = {
      sorts: [
        {
          key: "createAt",
          type: "DESC"
        }
      ]
    };
    
    console.log('❤️ Get Favorite List Request:', {
      url,
      data: requestData
    });
    
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      timeout: 8000
    });
    
    console.log('❤️ Get Favorite List Response:', response.data);
    
    if (response.data && response.data.success) {
      return response.data;
    } else {
      throw new Error('API trả về dữ liệu không hợp lệ');
    }
  } catch (error) {
    console.error('❤️ Lỗi khi lấy danh sách favorite:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Vui lòng đăng nhập để xem danh sách yêu thích');
      }
    }
    
    throw new Error('Không thể tải danh sách yêu thích');
  }
}

/**
 * Xóa nhạc khỏi danh sách yêu thích
 * @param musicId ID của bài nhạc cần xóa
 * @returns Promise với kết quả API
 */
export async function removeFromFavorite(musicId: number): Promise<FavoriteResponse> {
  try {
    const url = 'https://api.sonata.io.vn/api/v1/favorite-list/remove';
    
    const requestData = {
      musicId: musicId
    };
    
    console.log('❤️ Remove from Favorite Request:', {
      url,
      data: requestData
    });
    
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      timeout: 8000
    });
    
    console.log('❤️ Remove from Favorite Response:', response.data);
    
    // Clear cache sau khi xóa thành công
    if (response.data && response.data.success) {
      clearFavoriteStatusCache(musicId);
      // Emit event để notify tất cả UI components
      favoriteEvents.emit('favoriteStatusChanged', {
        type: 'music',
        id: musicId,
        action: 'removed',
        newStatus: false
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❤️ Lỗi khi xóa khỏi favorite:', error);
    
    // Clear cache trong trường hợp lỗi để force refresh
    clearFavoriteStatusCache(musicId);
    
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      
      if (status === 401) {
        throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      }
      if (status === 404) {
        // Nếu không tìm thấy (có thể đã xóa rồi) thì coi như thành công
        return {
          status: 'success',
          code: 200,
          success: true,
          message: 'Đã xóa khỏi danh sách yêu thích',
          data: null,
          errors: null
        };
      }
      if (status >= 500) {
        throw new Error('Lỗi server, vui lòng thử lại sau');
      }
      
      // Lỗi khác
      const errorMessage = responseData?.message || 'Không thể xóa khỏi danh sách yêu thích';
      throw new Error(errorMessage);
    }
    
    // Lỗi network hoặc timeout
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Yêu cầu quá thời gian, vui lòng thử lại');
      }
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Lỗi kết nối mạng');
      }
    }
    
    throw new Error('Không thể xóa khỏi danh sách yêu thích');
  }
}

/**
 * Kiểm tra xem một bài nhạc có trong favorite list không (với cache và pagination đầy đủ)
 * @param musicId ID của bài nhạc cần kiểm tra
 * @returns Promise<boolean> true nếu có trong favorite
 */
export async function checkIsFavorite(musicId: number): Promise<boolean> {
  try {
    // Kiểm tra cache trước
    const cached = favoriteStatusCache.get(musicId);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < FAVORITE_CACHE_DURATION) {
      console.log(`❤️ Cache hit for music ${musicId}:`, cached.value);
      return cached.value;
    }

    console.log(`❤️ Checking favorite status for music ${musicId}...`);
    
    let found = false;
    let page = 1;
    const pageSize = 100;
    
    // Lặp qua tất cả các trang để tìm bài nhạc
    while (true) {
      const favoriteList = await getFavoriteList(pageSize, page);
      
      // Kiểm tra trong trang hiện tại
      const foundInCurrentPage = favoriteList.data.items.some(item => item.musicId === musicId);
      
      if (foundInCurrentPage) {
        found = true;
        break;
      }
      
      // Nếu số items trả về < pageSize, nghĩa là đã hết dữ liệu
      if (favoriteList.data.items.length < pageSize) {
        break;
      }
      
      // Tăng page để kiểm tra tiếp
      page++;
      
      // Giới hạn số page để tránh vòng lặp vô hạn
      if (page > 50) { // Tối đa 5000 items (50 pages x 100 items)
        console.warn('❤️ Reached maximum pages limit while checking favorite status');
        break;
      }
    }
    
    // Lưu vào cache
    favoriteStatusCache.set(musicId, {
      value: found,
      timestamp: now
    });
    
    console.log(`❤️ Favorite status for music ${musicId}:`, found);
    return found;
    
  } catch (error) {
    console.error('❤️ Lỗi khi kiểm tra favorite status:', error);
    // Trong trường hợp lỗi, không cache và trả về false
    return false;
  }
}

// ==================== FOLLOW ARTIST FUNCTIONS ====================

// Interface cho followed artist item
export interface FollowedArtist {
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
  artistId: number;
  listenerId: string;
  id: number;
  artist: {
    createAt: string;
    updateAt: string;
    deleteAt: string | null;
    id: number;
    name: string;
    description: string;
    picture: string;
    awardsAndHonors: string;
    nationality: string;
    teachingAndAcademicContributions: string;
    significantPerformences: string;
    roles: string[];
    dateOfBirth: string;
    dateOfDeath: string | null;
    viewCount: number;
    followers: number;
    genres: Array<{
      createAt: string;
      updateAt: string;
      deleteAt: string | null;
      id: number;
      name: string;
      description: string;
      picture: string;
    }>;
  };
}

// Interface cho followed artist list response
export interface FollowedArtistListResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    items: FollowedArtist[];
  };
  errors: any;
}

// Cache để lưu trạng thái follow artist (với timestamp để invalidate)
interface CacheEntry {
  value: boolean;
  timestamp: number;
}

const followStatusCache = new Map<number, CacheEntry>();
const CACHE_DURATION = 1000; // Giảm xuống 1 second để sync nhanh hơn

/**
 * Clear cache cho một artist ID cụ thể
 */
export function clearFollowStatusCache(artistId?: number) {
  if (artistId) {
    followStatusCache.delete(artistId);
    console.log(`🧹 Cleared follow cache for artist ${artistId}`);
    // Emit event để notify UI components
    favoriteEvents.emit('favoriteStatusChanged', { 
      type: 'artist', 
      id: artistId, 
      action: 'cache_cleared' 
    });
  } else {
    followStatusCache.clear();
    console.log(`🧹 Cleared all follow cache`);
    favoriteEvents.emit('allFavoritesCleared', { type: 'artist' });
  }
}

/**
 * Follow một nghệ sĩ
 * @param artistId ID của nghệ sĩ cần follow
 * @returns Promise với kết quả API
 */
export async function followArtist(artistId: number): Promise<FavoriteResponse> {
  try {
    // Clear cache ngay lập tức để force fresh check
    clearFollowStatusCache(artistId);
    
    const url = 'https://api.sonata.io.vn/api/v1/follow-artist/follow';
    
    const requestData = {
      artistId: artistId
    };
    
    console.log('👤 Follow Artist Request:', {
      url,
      data: requestData
    });
    
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      timeout: 8000
    });
    
    console.log('👤 Follow Artist Response:', response.data);
    
    // Clear cache cho artist này sau khi follow thành công
    if (response.data && response.data.success) {
      clearFollowStatusCache(artistId);
      // Emit event để notify tất cả UI components
      favoriteEvents.emit('favoriteStatusChanged', {
        type: 'artist',
        id: artistId,
        action: 'followed',
        newStatus: true
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('👤 Lỗi khi follow nghệ sĩ:', error);
    
    // Clear cache trong trường hợp lỗi để force refresh
    clearFollowStatusCache(artistId);
    
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      
      if (status === 401) {
        throw new Error('Vui lòng đăng nhập để follow nghệ sĩ');
      }
      if (status === 400) {
        // Kiểm tra nếu đã follow rồi thì trả về success
        const errorMessage = responseData?.message || '';
        if (errorMessage.includes('already') || 
            errorMessage.includes('đã follow') || 
            errorMessage.includes('đã theo dõi') ||
            errorMessage.includes('duplicate') ||
            errorMessage.includes('exists')) {
          
          console.log('👤 Artist already followed, treating as success');
          
          // Update cache với trạng thái đã follow
          followStatusCache.set(artistId, {
            value: true,
            timestamp: Date.now()
          });
          
          // Emit event để notify UI
          favoriteEvents.emit('favoriteStatusChanged', {
            type: 'artist',
            id: artistId,
            action: 'followed',
            newStatus: true
          });
          
          return {
            status: 'success',
            code: 200,
            success: true,
            message: 'Đã follow nghệ sĩ này rồi',
            data: null,
            errors: null
          };
        }
        throw new Error(errorMessage || 'Dữ liệu không hợp lệ');
      }
      if (status === 404) {
        throw new Error('Không tìm thấy nghệ sĩ');
      }
      if (status >= 500) {
        throw new Error('Lỗi server, vui lòng thử lại sau');
      }
      
      // Lỗi khác
      const errorMessage = responseData?.message || 'Không thể follow nghệ sĩ';
      throw new Error(errorMessage);
    }
    
    // Lỗi network hoặc timeout
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Kết nối quá chậm, vui lòng thử lại');
      }
      if (error.message.includes('Network Error')) {
        throw new Error('Lỗi kết nối mạng');
      }
    }
    
    throw new Error('Không thể follow nghệ sĩ');
  }
}

/**
 * Lấy danh sách nghệ sĩ đã follow
 * @param rpp Số kết quả trên trang (records per page)
 * @param page Trang hiện tại
 * @returns Promise với danh sách followed artists
 */
export async function getMyFollowedArtists(
  rpp: number = 10, 
  page: number = 1
): Promise<FollowedArtistListResponse> {
  try {
    const url = `https://api.sonata.io.vn/api/v1/follow-artist/me?rpp=${rpp}&page=${page}`;
    
    const requestData = {
      sorts: [
        {
          key: "createAt",
          type: "DESC"
        }
      ]
    };
    
    console.log('👤 Get My Followed Artists Request:', {
      url,
      data: requestData
    });
    
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      timeout: 8000
    });
    
    console.log('👤 Get My Followed Artists Response:', response.data);
    
    if (response.data && response.data.success) {
      return response.data;
    } else {
      throw new Error('API trả về dữ liệu không hợp lệ');
    }
  } catch (error) {
    console.error('👤 Lỗi khi lấy danh sách nghệ sĩ đã follow:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Vui lòng đăng nhập để xem danh sách nghệ sĩ yêu thích');
      }
    }
    
    throw new Error('Không thể tải danh sách nghệ sĩ yêu thích');
  }
}

/**
 * Unfollow một nghệ sĩ
 * @param artistId ID của nghệ sĩ cần unfollow
 * @returns Promise với kết quả API
 */
export async function unfollowArtist(artistId: number): Promise<FavoriteResponse> {
  try {
    const url = 'https://api.sonata.io.vn/api/v1/follow-artist/unfollow';
    
    const requestData = {
      artistId: artistId
    };
    
    console.log('👤 Unfollow Artist Request:', {
      url,
      data: requestData
    });
    
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      timeout: 8000
    });
    
    console.log('👤 Unfollow Artist Response:', response.data);
    
    // Clear cache cho artist này sau khi unfollow thành công
    if (response.data && response.data.success) {
      clearFollowStatusCache(artistId);
      // Emit event để notify tất cả UI components
      favoriteEvents.emit('favoriteStatusChanged', {
        type: 'artist',
        id: artistId,
        action: 'unfollowed',
        newStatus: false
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('👤 Lỗi khi unfollow nghệ sĩ:', error);
    
    // Clear cache trong trường hợp lỗi để force refresh
    clearFollowStatusCache(artistId);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      }
      if (error.response?.status === 404) {
        throw new Error('Chưa follow nghệ sĩ này');
      }
    }
    
    throw new Error('Không thể unfollow nghệ sĩ');
  }
}

/**
 * Kiểm tra xem artist có đang được follow hay không
 * @param artistId ID của artist cần kiểm tra
 * @returns Promise với kết quả boolean
 */
export async function checkIsFollowingArtist(artistId: number): Promise<boolean> {
  try {
    // Kiểm tra cache trước
    const cached = followStatusCache.get(artistId);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log(`👤 Cache hit for artist ${artistId}:`, cached.value);
      return cached.value;
    }

    console.log(`👤 Checking follow status for artist ${artistId}...`);
    
    // Gọi API để lấy danh sách followed artists với limit cao hơn
    const followedArtists = await getMyFollowedArtists(500, 1); // Tăng limit để check đầy đủ
    
    if (followedArtists && followedArtists.data && followedArtists.data.items) {
      const isFollowing = followedArtists.data.items.some(item => item.artistId === artistId);
      
      // Cache kết quả
      followStatusCache.set(artistId, {
        value: isFollowing,
        timestamp: now
      });
      
      console.log(`👤 Follow status for artist ${artistId}:`, isFollowing);
      return isFollowing;
    }
    
    // Cache negative result
    followStatusCache.set(artistId, {
      value: false,
      timestamp: now
    });
    
    console.log(`👤 No follow data found for artist ${artistId}, returning false`);
    return false;
  } catch (error) {
    console.error('❤️ Lỗi khi kiểm tra follow artist:', error);
    
    // Xóa cache nếu có lỗi để force refresh lần sau
    followStatusCache.delete(artistId);
    
    // Trong trường hợp lỗi, trả về false và không cache
    return false;
  }
}

// ===== ALBUM FAVORITE FUNCTIONS =====

// Interface cho album trong favorite list
export interface FavoriteAlbum {
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
  albumId: string;
  listenerId: string;
  id: number;
  album: {
    createAt: string;
    updateAt: string;
    deleteAt: string | null;
    id: string;
    name: string;
    coverPhoto: string;
    releaseDate: string;
    albumType: string;
    description: string;
    viewCount: number;
    likeCount: number;
  };
}

// Interface cho album favorite list response  
export interface FavoriteAlbumListResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    items: FavoriteAlbum[];
  };
  errors: any;
}

/**
 * Thêm album vào danh sách yêu thích
 * @param albumId ID của album cần thêm
 * @returns Promise với kết quả API
 */
export async function likeAlbum(albumId: number): Promise<FavoriteResponse> {
  try {
    const url = 'https://api.sonata.io.vn/api/v1/album-like/like';
    
    const requestData = {
      albumId: albumId
    };
    
    console.log('💿 Like Album Request:', {
      url,
      data: requestData
    });
    
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      timeout: 8000
    });
    
    console.log('💿 Like Album Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('💿 Lỗi khi like album:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Vui lòng đăng nhập để thích album');
      }
      if (error.response?.status === 400) {
        throw new Error('Album đã có trong danh sách yêu thích');
      }
    }
    
    throw new Error('Không thể thích album');
  }
}

/**
 * Lấy danh sách album yêu thích của user
 * @param rpp Số kết quả trên trang (records per page)
 * @param page Trang hiện tại
 * @returns Promise với danh sách favorite album
 */
export async function getMyLikedAlbums(
  rpp: number = 10, 
  page: number = 1
): Promise<FavoriteAlbumListResponse> {
  try {
    const url = `https://api.sonata.io.vn/api/v1/album-like/me?rpp=${rpp}&page=${page}`;
    
    const requestData = {
      sorts: [
        {
          key: "createAt",
          type: "DESC"
        }
      ]
    };
    
    console.log('💿 Get Liked Albums Request:', {
      url,
      data: requestData
    });
    
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      timeout: 8000
    });
    
    console.log('💿 Get Liked Albums Response:', response.data);
    
    if (response.data && response.data.success) {
      return response.data;
    } else {
      throw new Error('API trả về dữ liệu không hợp lệ');
    }
  } catch (error) {
    console.error('💿 Lỗi khi lấy danh sách album yêu thích:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Vui lòng đăng nhập để xem danh sách album yêu thích');
      }
    }
    
    throw new Error('Không thể tải danh sách album yêu thích');
  }
}

/**
 * Bỏ thích album khỏi danh sách yêu thích
 * @param albumId ID của album cần bỏ thích
 * @returns Promise với kết quả API
 */
export async function unlikeAlbum(albumId: number): Promise<FavoriteResponse> {
  try {
    const url = 'https://api.sonata.io.vn/api/v1/album-like/unlike';
    
    const requestData = {
      albumId: albumId
    };
    
    console.log('💿 Unlike Album Request:', {
      url,
      data: requestData
    });
    
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      timeout: 8000
    });
    
    console.log('💿 Unlike Album Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('💿 Lỗi khi unlike album:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Vui lòng đăng nhập để bỏ thích album');
      }
      if (error.response?.status === 404) {
        throw new Error('Album không có trong danh sách yêu thích');
      }
    }
    
    throw new Error('Không thể bỏ thích album');
  }
}

/**
 * Kiểm tra xem album có đang được thích hay không
 * @param albumId ID của album cần kiểm tra
 * @returns Promise với kết quả boolean
 */
export async function checkIsLikedAlbum(albumId: number): Promise<boolean> {
  try {
    const likedAlbums = await getMyLikedAlbums(100, 1); // Lấy nhiều để check
    
    if (likedAlbums && likedAlbums.data && likedAlbums.data.items) {
      return likedAlbums.data.items.some(item => parseInt(item.albumId) === albumId);
    }
    
    return false;
  } catch (error) {
    console.error('💿 Lỗi khi kiểm tra album like:', error);
    return false;
  }
} 