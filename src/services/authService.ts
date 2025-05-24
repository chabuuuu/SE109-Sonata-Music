import { LISTENER_TOKEN } from '@/constant/listenerToken';
import axios from 'axios';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  id: number;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  fullname: string;
  gender: 'MALE' | 'FEMALE';
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface ActivateEmailResponse {
  success: boolean;
  message: string;
}

/**
 * Đăng ký tài khoản mới
 * @param data Thông tin đăng ký (email, username, password, fullname, gender)
 * @returns Thông báo xác nhận đã gửi OTP
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await axios.post(
      'https://api.sonata.io.vn/api/v1/listener/register',
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 8000 // 8 giây timeout
      }
    );

    if (response.data && response.data.success) {
      return {
        success: true,
        message: response.data.message || 'The OTP has been sent to your email'
      };
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Lỗi từ server (4xx, 5xx)
        const errorMessage = error.response.data?.message || error.response.statusText;
        throw new Error(errorMessage);
      } else if (error.request) {
        // Không nhận được response
        throw new Error('Cannot connect to server');
      }
    }
    // Lỗi khác
    throw new Error(error.message || 'An error occurred during registration');
  }
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
      localStorage.setItem(LISTENER_TOKEN, accessToken);
      localStorage.setItem('userId', id.toString());
      
      console.log('Login successful, token saved:', accessToken);
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
  localStorage.removeItem(LISTENER_TOKEN);
  localStorage.removeItem('userId');
  // Có thể thêm redirect về trang đăng nhập ở đây nếu cần
}

/**
 * Kiểm tra xem người dùng đã đăng nhập chưa
 * @returns true nếu đã đăng nhập, false nếu chưa
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(LISTENER_TOKEN);
  console.log('Checking auth, token:', token);
  return !!token;
}

/**
 * Lấy token đăng nhập từ localStorage
 * @returns Access token hoặc null nếu chưa đăng nhập
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(LISTENER_TOKEN);
  console.log('Retrieved token:', token);
  return token;
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

/**
 * Kích hoạt tài khoản bằng OTP gửi qua email
 * @param otp Mã OTP người dùng nhận được
 * @param email Email đã đăng ký
 * @returns Thông báo kích hoạt thành công
 */
export async function activateEmail(otp: string, email: string): Promise<ActivateEmailResponse> {
  try {
    const response = await axios.get(
      `https://api.sonata.io.vn/api/v1/listener/activate/email?otp=${otp}&email=${encodeURIComponent(email)}`,
      {
        timeout: 8000 // 8 giây timeout
      }
    );

    if (response.data && response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Account activated successfully, you can login now'
      };
    } else {
      throw new Error(response.data.message || 'Activation failed');
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Lỗi từ server (4xx, 5xx)
        const errorMessage = error.response.data?.message || error.response.statusText;
        throw new Error(errorMessage);
      } else if (error.request) {
        // Không nhận được response
        throw new Error('Cannot connect to server');
      }
    }
    // Lỗi khác
    throw new Error(error.message || 'An error occurred during account activation');
  }
} 