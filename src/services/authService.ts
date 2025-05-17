import axios from 'axios';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  id: number;
}

/**
 * Đăng nhập vào hệ thống
 * @param credentials Thông tin đăng nhập (username/email và password)
 * @returns Thông tin người dùng bao gồm accessToken và id
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await axios.post(
      'https://api.sonata.io.vn/api/v1/listener/login',
      credentials,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 8000 // 8 giây timeout
      }
    );

    if (response.data && response.data.success) {
      // Lưu token vào localStorage
      const { accessToken, id } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userId', id.toString());
      
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Đăng nhập thất bại');
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Lỗi từ server (4xx, 5xx)
        const errorMessage = error.response.data?.message || error.response.statusText;
        throw new Error(errorMessage);
      } else if (error.request) {
        // Không nhận được response
        throw new Error('Không thể kết nối đến server');
      }
    }
    // Lỗi khác
    throw new Error(error.message || 'Đã xảy ra lỗi khi đăng nhập');
  }
}

/**
 * Đăng xuất khỏi hệ thống
 */
export function logout(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userId');
  // Có thể thêm redirect về trang đăng nhập ở đây nếu cần
}

/**
 * Kiểm tra xem người dùng đã đăng nhập chưa
 * @returns true nếu đã đăng nhập, false nếu chưa
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
}

/**
 * Lấy token đăng nhập từ localStorage
 * @returns Access token hoặc null nếu chưa đăng nhập
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

/**
 * Lấy ID người dùng từ localStorage
 * @returns User ID hoặc null nếu chưa đăng nhập
 */
export function getUserId(): number | null {
  if (typeof window === 'undefined') return null;
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId) : null;
}

/**
 * Thêm token vào header của request
 * @returns Header object với Authorization Bearer token
 */
export function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
} 