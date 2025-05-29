"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CustomImage from "@/components/CustomImage";
import Link from "next/link";
import Navbar from "@/components/navbar";
import BottomBanner from "@/components/bottom_banner";
import { getArtistById, Artist } from "@/services/artistService";
import { searchMusicsByArtist, Music } from "@/services/musicService";
import {
  followArtist,
  unfollowArtist,
  checkIsFollowingArtist,
} from "@/services/favoriteService";
import { toast } from "react-hot-toast";
import {
  Calendar,
  MapPin,
  Users,
  Eye,
  Award,
  Music as MusicIcon,
  BookOpen,
  Heart,
  Share2,
  Play,
  ArrowLeft,
  Clock,
  User,
  Headphones,
} from "lucide-react";

const ArtistDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const artistId = parseInt(params.id as string);

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "biography" | "works" | "timeline"
  >("overview");
  const [musics, setMusics] = useState<Music[]>([]);
  const [musicsLoading, setMusicsLoading] = useState(false);
  const [musicsError, setMusicsError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchArtistDetails = async () => {
      if (!artistId || isNaN(artistId)) {
        setError("ID nghệ sĩ không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const artistData = await getArtistById(artistId);

        if (artistData) {
          setArtist(artistData);
          // Kiểm tra follow status
          const followStatus = await checkIsFollowingArtist(artistId);
          setIsFollowing(followStatus);
        } else {
          setError("Không tìm thấy thông tin nghệ sĩ");
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin nghệ sĩ:", err);
        setError("Có lỗi xảy ra khi tải thông tin nghệ sĩ");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDetails();
  }, [artistId]);

  // Fetch tác phẩm khi activeTab là 'works' và có artistId
  useEffect(() => {
    const fetchArtistMusics = async () => {
      if (activeTab !== "works" || !artistId || isNaN(artistId)) {
        return;
      }

      try {
        setMusicsLoading(true);
        setMusicsError(null);
        console.log(`🎼 Fetching musics for artist ${artistId}...`);

        const response = await searchMusicsByArtist(artistId, 20, 1); // Lấy 20 tác phẩm đầu tiên

        if (response.success && response.data.items) {
          setMusics(response.data.items);
          console.log(
            `✅ Loaded ${response.data.items.length} musics for artist ${artistId}`
          );
        } else {
          setMusicsError("Không thể tải danh sách tác phẩm");
          console.warn("⚠️ API không trả về dữ liệu hợp lệ:", response);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải tác phẩm của nghệ sĩ:", err);
        setMusicsError("Có lỗi xảy ra khi tải danh sách tác phẩm");
      } finally {
        setMusicsLoading(false);
      }
    };

    fetchArtistMusics();
  }, [activeTab, artistId]);

  // Close share modal when clicking outside or pressing ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowShareMenu(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (showShareMenu && target.closest('.share-modal-content')) {
        return; // Click inside modal, don't close
      }
      if (showShareMenu) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      setFollowLoading(true);

      if (isFollowing) {
        await unfollowArtist(artistId);
        setIsFollowing(false);
        toast.success("Đã hủy theo dõi nghệ sĩ");
        // Cập nhật số followers
        if (artist) {
          setArtist((prev) =>
            prev ? { ...prev, followers: prev.followers - 1 } : prev
          );
        }
      } else {
        await followArtist(artistId);
        setIsFollowing(true);
        toast.success("Đã theo dõi nghệ sĩ");
        // Cập nhật số followers
        if (artist) {
          setArtist((prev) =>
            prev ? { ...prev, followers: prev.followers + 1 } : prev
          );
        }
      }
    } catch (error) {
      console.error("Lỗi khi follow/unfollow:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Không thể thực hiện thao tác này");
      }
    } finally {
      setFollowLoading(false);
    }
  };

  // Handle share functionality
  const handleShare = async (platform?: string) => {
    if (!artist) return;

    const shareUrl = window.location.href;
    const shareTitle = `${artist.name} - Sonata Music`;
    const shareText = `Khám phá thông tin về nghệ sĩ ${artist.name} trên Sonata Music`;

    try {
      if (platform === 'native' && navigator.share) {
        // Native Web Share API
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Đã chia sẻ thành công!");
        return;
      }

      // Platform specific sharing
      let targetUrl = '';
      
      switch (platform) {
        case 'facebook':
          targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
          break;
        case 'twitter':
          targetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
          break;
        case 'telegram':
          targetUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
          break;
        case 'whatsapp':
          targetUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
          break;
        case 'copy':
          // Copy to clipboard
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Đã copy link vào clipboard!");
          setShowShareMenu(false);
          return;
        default:
          // Fallback to native share or copy
          if (navigator.share) {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              url: shareUrl,
            });
            toast.success("Đã chia sẻ thành công!");
          } else {
            await navigator.clipboard.writeText(shareUrl);
            toast.success("Đã copy link vào clipboard!");
          }
          setShowShareMenu(false);
          return;
      }

      if (targetUrl) {
        window.open(targetUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        toast.success("Đã mở cửa sổ chia sẻ!");
        setShowShareMenu(false);
      }
    } catch (error) {
      console.error('Lỗi khi chia sẻ:', error);
      // Fallback to copy link
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Đã copy link vào clipboard!");
      } catch (copyError) {
        toast.error("Không thể chia sẻ hoặc copy link");
      }
      setShowShareMenu(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Không rõ";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const calculateAge = (birthDate: string, deathDate?: string | null) => {
    if (!birthDate) return null;

    try {
      const birth = new Date(birthDate);
      const end = deathDate ? new Date(deathDate) : new Date();
      const age = end.getFullYear() - birth.getFullYear();
      return age;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F0E3] to-[#E6D7C3]">
        <Navbar />
        <div className="pt-20 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#C8A97E] border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg text-[#3A2A24]">
              Đang tải thông tin nghệ sĩ...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F0E3] to-[#E6D7C3]">
        <Navbar />
        <div className="pt-20 flex items-center justify-center h-screen">
          <div className="text-center max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#3A2A24] mb-2">
              Có lỗi xảy ra
            </h2>
            <p className="text-[#6D4C41] mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-[#C8A97E] text-white rounded-lg hover:bg-[#A67C52] transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const age = calculateAge(artist.dateOfBirth, artist.dateOfDeath);

  return (
    <div className="flex relative font-['Playfair_Display',serif] text-[#3A2A24] bg-gradient-to-br from-[#F8F0E3] to-[#E6D7C3]">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen pb-8">
        {/* Hero Section */}
        <div className="relative">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <CustomImage
              src={artist.picture}
              alt={artist.name}
              fill
              className="object-cover opacity-20 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#F8F0E3]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-12">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="mb-8 flex items-center gap-2 text-[#3A2A24] hover:text-[#C8A97E] transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Quay lại</span>
            </button>

            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Artist Image */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-sm">
                    <CustomImage
                      src={artist.picture}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Play Button Overlay */}
                  <button className="absolute bottom-6 right-6 w-16 h-16 bg-[#C8A97E] rounded-full flex items-center justify-center shadow-lg hover:bg-[#A67C52] transition-all duration-300 hover:scale-110">
                    <Play
                      className="w-6 h-6 text-white ml-1"
                      fill="currentColor"
                    />
                  </button>
                </div>
              </div>

              {/* Artist Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-[#3A2A24] mb-4 font-['Playfair_Display',serif]">
                    {artist.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-[#6D4C41] mb-6">
                    {artist.roles?.length > 0 && (
                      <span className="text-lg font-medium text-[#C8A97E]">
                        {artist.roles.join(" • ")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-[#C8A97E] rounded-xl mb-2 mx-auto">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#3A2A24]">
                      {artist.followers?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-[#6D4C41]">Người theo dõi</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-[#C8A97E] rounded-xl mb-2 mx-auto">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#3A2A24]">
                      {artist.viewCount?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-[#6D4C41]">Lượt xem</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-[#C8A97E] rounded-xl mb-2 mx-auto">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#3A2A24]">
                      {age || "N/A"}
                    </div>
                    <div className="text-sm text-[#6D4C41]">
                      {artist.dateOfDeath ? "Tuổi thọ" : "Tuổi"}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-[#C8A97E] rounded-xl mb-2 mx-auto">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-lg font-bold text-[#3A2A24]">
                      {artist.nationality || "N/A"}
                    </div>
                    <div className="text-sm text-[#6D4C41]">Quốc tịch</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isFollowing
                        ? "bg-[#C8A97E] text-white hover:bg-[#A67C52]"
                        : "bg-white/80 text-[#3A2A24] hover:bg-[#C8A97E] hover:text-white border border-[#C8A97E]"
                    }`}
                  >
                    {followLoading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Heart
                        className={`w-5 h-5 ${
                          isFollowing ? "fill-current" : ""
                        }`}
                      />
                    )}
                    {followLoading
                      ? "Đang xử lý..."
                      : isFollowing
                      ? "Đang theo dõi"
                      : "Theo dõi"}
                  </button>

                  <button
                    onClick={() => setShowShareMenu(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/80 text-[#3A2A24] rounded-xl font-semibold hover:bg-[#E6D7C3] transition-colors border border-[#D3B995]">
                    <Share2 className="w-5 h-5" />
                    Chia sẻ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 py-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 bg-white/80 p-2 rounded-2xl backdrop-blur-sm">
            {[
              { id: "overview", label: "Tổng quan", icon: BookOpen },
              { id: "biography", label: "Tiểu sử", icon: User },
              { id: "works", label: "Tác phẩm", icon: MusicIcon },
              { id: "timeline", label: "Thời gian", icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#C8A97E] text-white shadow-lg"
                    : "text-[#6D4C41] hover:bg-[#E6D7C3]"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Description */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-[#3A2A24] mb-4 font-['Playfair_Display',serif]">
                      Giới thiệu
                    </h3>
                    <p className="text-[#6D4C41] leading-relaxed text-lg">
                      {artist.description ||
                        "Chưa có thông tin mô tả cho nghệ sĩ này."}
                    </p>
                  </div>

                  {/* Genres */}
                  {artist.genres?.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                      <h3 className="text-2xl font-bold text-[#3A2A24] mb-6 font-['Playfair_Display',serif]">
                        Thể loại âm nhạc
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {artist.genres.map((genre) => (
                          <div
                            key={genre.id}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#F8F0E3] to-[#E6D7C3] rounded-xl hover:shadow-md transition-shadow"
                          >
                            <CustomImage
                              src={genre.picture}
                              alt={genre.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-[#3A2A24]">
                                {genre.name}
                              </h4>
                              <p className="text-sm text-[#6D4C41] line-clamp-2">
                                {genre.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instruments */}
                  {artist.instruments?.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                      <h3 className="text-2xl font-bold text-[#3A2A24] mb-6 font-['Playfair_Display',serif]">
                        Nhạc cụ
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {artist.instruments.map((instrument) => (
                          <div
                            key={instrument.id}
                            className="text-center p-6 bg-gradient-to-br from-[#F8F0E3] to-[#E6D7C3] rounded-xl hover:shadow-md transition-shadow"
                          >
                            <CustomImage
                              src={instrument.picture}
                              alt={instrument.name}
                              width={80}
                              height={80}
                              className="rounded-full mx-auto mb-3 object-cover"
                            />
                            <h4 className="font-semibold text-[#3A2A24]">
                              {instrument.name}
                            </h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "biography" && (
                <div className="space-y-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-[#3A2A24] mb-6 font-['Playfair_Display',serif]">
                      Thông tin cá nhân
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-[#3A2A24] mb-2">
                          Ngày sinh
                        </h4>
                        <p className="text-[#6D4C41]">
                          {formatDate(artist.dateOfBirth)}
                        </p>
                      </div>
                      {artist.dateOfDeath && (
                        <div>
                          <h4 className="font-semibold text-[#3A2A24] mb-2">
                            Ngày mất
                          </h4>
                          <p className="text-[#6D4C41]">
                            {formatDate(artist.dateOfDeath)}
                          </p>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-[#3A2A24] mb-2">
                          Quốc tịch
                        </h4>
                        <p className="text-[#6D4C41]">
                          {artist.nationality || "Không rõ"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#3A2A24] mb-2">
                          Vai trò
                        </h4>
                        <p className="text-[#6D4C41]">
                          {artist.roles?.join(", ") || "Không rõ"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {artist.awardsAndHonors && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                      <h3 className="text-2xl font-bold text-[#3A2A24] mb-4 font-['Playfair_Display',serif] flex items-center gap-3">
                        <Award className="w-6 h-6 text-[#C8A97E]" />
                        Giải thưởng & Danh hiệu
                      </h3>
                      <p className="text-[#6D4C41] leading-relaxed">
                        {artist.awardsAndHonors}
                      </p>
                    </div>
                  )}

                  {artist.teachingAndAcademicContributions && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                      <h3 className="text-2xl font-bold text-[#3A2A24] mb-4 font-['Playfair_Display',serif] flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-[#C8A97E]" />
                        Giảng dạy & Đóng góp học thuật
                      </h3>
                      <p className="text-[#6D4C41] leading-relaxed">
                        {artist.teachingAndAcademicContributions}
                      </p>
                    </div>
                  )}

                  {artist.significantPerformences && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                      <h3 className="text-2xl font-bold text-[#3A2A24] mb-4 font-['Playfair_Display',serif] flex items-center gap-3">
                        <MusicIcon className="w-6 h-6 text-[#C8A97E]" />
                        Các buổi biểu diễn quan trọng
                      </h3>
                      <p className="text-[#6D4C41] leading-relaxed">
                        {artist.significantPerformences}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "works" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-[#3A2A24] mb-6 font-['Playfair_Display',serif]">
                    Tác phẩm nổi bật
                  </h3>

                  {musicsLoading && (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C8A97E] border-t-transparent mx-auto mb-4"></div>
                      <p className="text-[#6D4C41]">
                        Đang tải danh sách tác phẩm...
                      </p>
                    </div>
                  )}

                  {musicsError && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MusicIcon className="w-8 h-8 text-red-500" />
                      </div>
                      <p className="text-[#6D4C41] mb-4">{musicsError}</p>
                      <button
                        onClick={() => {
                          setMusicsError(null);
                          // Trigger refetch by updating activeTab
                          const currentTab = activeTab;
                          setActiveTab("overview");
                          setTimeout(() => setActiveTab(currentTab), 100);
                        }}
                        className="px-4 py-2 bg-[#C8A97E] text-white rounded-lg hover:bg-[#A67C52] transition-colors"
                      >
                        Thử lại
                      </button>
                    </div>
                  )}

                  {!musicsLoading && !musicsError && musics.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MusicIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-[#6D4C41]">
                        Chưa có tác phẩm nào của nghệ sĩ này.
                      </p>
                    </div>
                  )}

                  {!musicsLoading && !musicsError && musics.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-[#6D4C41]">
                          Tìm thấy{" "}
                          <span className="font-semibold text-[#3A2A24]">
                            {musics.length}
                          </span>{" "}
                          tác phẩm
                        </p>
                      </div>

                      <div className="grid gap-4">
                        {musics.map((music) => (
                          <div
                            key={music.id}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#F8F0E3] to-[#E6D7C3] rounded-xl hover:shadow-lg transition-all duration-300 group"
                          >
                            {/* Cover Photo */}
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <CustomImage
                                src={music.coverPhoto}
                                alt={music.name}
                                fill
                                className="object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <Play
                                  className="w-6 h-6 text-white"
                                  fill="currentColor"
                                />
                              </div>
                            </div>

                            {/* Music Info */}
                            <div className="flex-grow min-w-0">
                              <h4 className="font-semibold text-[#3A2A24] text-lg truncate group-hover:text-[#C8A97E] transition-colors">
                                {music.name}
                              </h4>
                              <div className="flex items-center gap-4 mt-1 text-sm text-[#6D4C41]">
                                {music.albums?.length > 0 && (
                                  <span className="truncate">
                                    Album: {music.albums[0].name}
                                  </span>
                                )}
                                {music.genres?.length > 0 && (
                                  <span className="truncate">
                                    {music.genres.map((g) => g.name).join(", ")}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-sm text-[#6D4C41]">
                              <div className="flex items-center gap-1">
                                <Headphones className="w-4 h-4" />
                                <span>
                                  {music.listenCount.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                <span>
                                  {music.favoriteCount.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button className="w-10 h-10 bg-[#C8A97E] rounded-full flex items-center justify-center text-white hover:bg-[#A67C52] transition-colors opacity-0 group-hover:opacity-100">
                                <Play
                                  className="w-4 h-4 ml-0.5"
                                  fill="currentColor"
                                />
                              </button>
                              <Link
                                href={`/music/${music.id}`}
                                className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center text-[#3A2A24] hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>

                      {musics.length >= 20 && (
                        <div className="text-center pt-6">
                          <p className="text-[#6D4C41] text-sm">
                            Hiển thị 20 tác phẩm đầu tiên. Có thể có nhiều tác
                            phẩm khác của nghệ sĩ.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-[#3A2A24] mb-6 font-['Playfair_Display',serif]">
                    Dòng thời gian
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-4 h-4 bg-[#C8A97E] rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-[#3A2A24]">
                          Sinh ra
                        </h4>
                        <p className="text-[#6D4C41]">
                          {formatDate(artist.dateOfBirth)}
                        </p>
                      </div>
                    </div>
                    {artist.dateOfDeath && (
                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 bg-gray-400 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-semibold text-[#3A2A24]">
                            Qua đời
                          </h4>
                          <p className="text-[#6D4C41]">
                            {formatDate(artist.dateOfDeath)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Periods */}
              {artist.periods?.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-[#3A2A24] mb-4 font-['Playfair_Display',serif]">
                    Thời kỳ âm nhạc
                  </h3>
                  <div className="space-y-3">
                    {artist.periods.map((period) => (
                      <div key={period.id} className="flex items-center gap-3">
                        <CustomImage
                          src={period.picture}
                          alt={period.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                        <span className="font-medium text-[#3A2A24]">
                          {period.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orchestras */}
              {artist.orchestras?.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-[#3A2A24] mb-4 font-['Playfair_Display',serif]">
                    Dàn nhạc
                  </h3>
                  <div className="space-y-3">
                    {artist.orchestras.map((orchestra) => (
                      <div
                        key={orchestra.id}
                        className="flex items-center gap-3"
                      >
                        <CustomImage
                          src={orchestra.picture}
                          alt={orchestra.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                        <span className="font-medium text-[#3A2A24]">
                          {orchestra.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-[#3A2A24] mb-4 font-['Playfair_Display',serif]">
                  Thống kê nhanh
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6D4C41]">Tạo lúc:</span>
                    <span className="font-medium text-[#3A2A24]">
                      {formatDate(artist.createAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6D4C41]">Cập nhật:</span>
                    <span className="font-medium text-[#3A2A24]">
                      {formatDate(artist.updateAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Banner */}
      <BottomBanner />

      {/* Share Modal */}
      {showShareMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl share-modal-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#3A2A24] font-['Playfair_Display',serif]">
                Chia sẻ nghệ sĩ
              </h3>
              <button
                onClick={() => setShowShareMenu(false)}
                className="text-[#6D4C41] hover:text-[#3A2A24] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Artist info */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-[#F8F0E3] rounded-xl">
              <CustomImage
                src={artist?.picture || '/images/default-artist.jpg'}
                alt={artist?.name || 'Artist'}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-[#3A2A24]">{artist?.name}</h4>
                <p className="text-sm text-[#6D4C41]">{artist?.nationality}</p>
              </div>
            </div>

            {/* Share options */}
            <div className="space-y-3">
              {/* Native share (if supported) */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={() => handleShare('native')}
                  className="w-full flex items-center gap-4 p-4 hover:bg-[#F8F0E3] rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 bg-[#C8A97E] rounded-full flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-[#3A2A24]">Chia sẻ</span>
                </button>
              )}

              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-4 p-4 hover:bg-[#F8F0E3] rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="font-medium text-[#3A2A24]">Facebook</span>
              </button>

              {/* Twitter */}
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-4 p-4 hover:bg-[#F8F0E3] rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-[#1DA1F2] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <span className="font-medium text-[#3A2A24]">Twitter</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center gap-4 p-4 hover:bg-[#F8F0E3] rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"/>
                  </svg>
                </div>
                <span className="font-medium text-[#3A2A24]">WhatsApp</span>
              </button>

              {/* Telegram */}
              <button
                onClick={() => handleShare('telegram')}
                className="w-full flex items-center gap-4 p-4 hover:bg-[#F8F0E3] rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-[#0088CC] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <span className="font-medium text-[#3A2A24]">Telegram</span>
              </button>

              {/* Copy link */}
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center gap-4 p-4 hover:bg-[#F8F0E3] rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-[#6D4C41] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium text-[#3A2A24]">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistDetailPage;
