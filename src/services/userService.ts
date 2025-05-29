import { getAuthHeaders } from "@/services/authService";
import axios from "axios";

// Interface cho thông tin user profile từ API
export interface UserProfile {
  id: string;
  username: string;
  fullname: string;
  gender: "MALE" | "FEMALE";
  email: string;
  createAt: string;
  updateAt: string;
  favoriteLists: any[];
  points?: number;
  premiumExpiredAt?: string;
}

// Interface cho response từ API
export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

/**
 * Lấy thông tin profile của user hiện tại
 * @returns Thông tin profile đầy đủ của user
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const response = await axios.get<UserProfileResponse>(
      "https://api.sonata.io.vn/api/v1/listener/me",
      {
        headers: getAuthHeaders(),
        timeout: 8000, // 8 giây timeout
      }
    );

    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Không thể lấy thông tin profile");
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Lỗi từ server (4xx, 5xx)
        const errorMessage =
          error.response.data?.message || error.response.statusText;
        throw new Error(errorMessage);
      } else if (error.request) {
        // Không nhận được response
        throw new Error("Không thể kết nối đến server");
      }
    }
    // Lỗi khác
    throw new Error(error.message || "Đã xảy ra lỗi khi lấy thông tin profile");
  }
}

/**
 * Cập nhật thông tin profile của user
 * @param updateData Dữ liệu cần cập nhật
 * @returns Thông tin profile đã cập nhật
 */
export async function updateUserProfile(updateData: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const response = await axios.put<UserProfileResponse>(
      "https://api.sonata.io.vn/api/v1/listener/profile",
      updateData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        timeout: 8000, // 8 giây timeout
      }
    );

    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Không thể cập nhật profile");
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Lỗi từ server (4xx, 5xx)
        const errorMessage =
          error.response.data?.message || error.response.statusText;
        throw new Error(errorMessage);
      } else if (error.request) {
        // Không nhận được response
        throw new Error("Không thể kết nối đến server");
      }
    }
    // Lỗi khác
    throw new Error(error.message || "Đã xảy ra lỗi khi cập nhật profile");
  }
} 