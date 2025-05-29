"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  Settings,
  Edit3,
  Save,
  X,
  Crown,
  Award,
  Music,
  Heart,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/navbar";
import SearchBar from "@/components/SearchBar";
import { getUserProfile, updateUserProfile, UserProfile } from "@/services/userService";
import { isAuthenticated } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string>("");
  const [editForm, setEditForm] = useState({
    fullname: "",
    gender: "MALE" as "MALE" | "FEMALE",
  });
  
  const router = useRouter();

  // Kiểm tra authentication và load user profile
  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      // Kiểm tra đăng nhập
      if (!isAuthenticated()) {
        router.push("/user-login");
        return;
      }

      try {
        setIsLoading(true);
        const profile = await getUserProfile();
        setUserProfile(profile);
        setEditForm({
          fullname: profile.fullname,
          gender: profile.gender,
        });
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin profile");
        console.error("Error loading profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadProfile();
  }, [router]);

  // Xử lý cập nhật profile
  const handleUpdateProfile = async () => {
    if (!userProfile) return;

    try {
      setIsUpdating(true);
      const updatedProfile = await updateUserProfile({
        fullname: editForm.fullname,
        gender: editForm.gender,
      });
      
      setUserProfile(updatedProfile);
      setIsEditing(false);
      setError("");
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật profile");
      console.error("Error updating profile:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    if (userProfile) {
      setEditForm({
        fullname: userProfile.fullname,
        gender: userProfile.gender,
      });
    }
    setIsEditing(false);
    setError("");
  };

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Không xác định";
    }
  };

  // Kiểm tra premium còn hiệu lực
  const isPremiumActive = () => {
    if (!userProfile?.premiumExpiredAt) return false;
    return new Date(userProfile.premiumExpiredAt) > new Date();
  };

  // Hiển thị loading
  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <SearchBar />
          <main className="flex-1 overflow-y-auto">
            <div className="min-h-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
                <p className="text-amber-700 font-medium">Đang tải thông tin profile...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <SearchBar />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Profile Header Card */}
              <div className="bg-white backdrop-blur-sm rounded-3xl border border-amber-200 shadow-2xl overflow-hidden mb-8">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 p-8 text-center relative">
                  {isPremiumActive() && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-yellow-400/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-200" />
                        <span className="text-xs font-medium text-yellow-200">Premium</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/50">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  {!isEditing ? (
                    <>
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {userProfile?.fullname || "Chưa cập nhật"}
                      </h1>
                      <p className="text-white/90 text-lg">@{userProfile?.username}</p>
                    </>
                  ) : (
                    <div className="max-w-md mx-auto">
                      <input
                        type="text"
                        value={editForm.fullname}
                        onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
                        className="w-full text-center text-2xl font-bold bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/70 mb-4"
                        placeholder="Tên đầy đủ"
                      />
                      <p className="text-white/90 text-lg">@{userProfile?.username}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50">
                  {!isEditing ? (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:from-amber-700 hover:to-orange-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                        Chỉnh sửa profile
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={isUpdating}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white backdrop-blur-sm rounded-2xl border border-amber-200 shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <Settings className="w-5 h-5 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-bold text-amber-800">Thông tin cá nhân</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                      <Mail className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="text-sm text-amber-700 font-medium">Email</p>
                        <p className="text-amber-900">{userProfile?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                      <User className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="text-sm text-amber-700 font-medium">Giới tính</p>
                        {!isEditing ? (
                          <p className="text-amber-900">
                            {userProfile?.gender === "MALE" ? "Nam" : "Nữ"}
                          </p>
                        ) : (
                          <select
                            value={editForm.gender}
                            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as "MALE" | "FEMALE" })}
                            className="bg-white border border-amber-300 rounded-lg px-3 py-1 text-amber-900"
                          >
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                          </select>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="text-sm text-amber-700 font-medium">Ngày tham gia</p>
                        <p className="text-amber-900">{formatDate(userProfile?.createAt || "")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Statistics */}
                <div className="bg-white backdrop-blur-sm rounded-2xl border border-amber-200 shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-bold text-orange-800">Thống kê tài khoản</h2>
                  </div>

                  <div className="space-y-4">
                    {userProfile?.points !== undefined && (
                      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-orange-700 font-medium">Điểm tích lũy</p>
                          <p className="text-xl font-bold text-orange-900">{userProfile.points.toLocaleString("vi-VN")} điểm</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-orange-700 font-medium">Danh sách yêu thích</p>
                        <p className="text-xl font-bold text-orange-900">
                          {userProfile?.favoriteLists?.length || 0} danh sách
                        </p>
                      </div>
                    </div>

                    {isPremiumActive() && (
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl border border-yellow-300">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <Crown className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-yellow-700 font-medium">Premium hết hạn</p>
                          <p className="text-sm text-yellow-900">
                            {formatDate(userProfile?.premiumExpiredAt || "")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => router.push("/my-favorites")}
                  className="bg-white backdrop-blur-sm border border-amber-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 text-center group"
                >
                  <Heart className="w-6 h-6 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-amber-800">Yêu thích</p>
                </button>

                <button
                  onClick={() => router.push("/my-favorites")}
                  className="bg-white backdrop-blur-sm border border-amber-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 text-center group"
                >
                  <Music className="w-6 h-6 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-amber-800">Bài hát</p>
                </button>

                <button
                  onClick={() => router.push("/user-exchange-premium")}
                  className="bg-white backdrop-blur-sm border border-amber-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 text-center group"
                >
                  <Crown className="w-6 h-6 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-amber-800">Premium</p>
                </button>

                <button
                  onClick={() => router.push("/my-favorites")}
                  className="bg-white backdrop-blur-sm border border-amber-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 text-center group"
                >
                  <User className="w-6 h-6 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-amber-800">Album</p>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}