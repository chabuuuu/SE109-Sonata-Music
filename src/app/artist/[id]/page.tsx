"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { getArtistById, Artist } from "@/services/artistService";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Eye, 
  Award, 
  Music, 
  BookOpen, 
  Heart,
  Share2,
  Play,
  ArrowLeft,
  Clock,
  User
} from "lucide-react";

const ArtistDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const artistId = parseInt(params.id as string);
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'biography' | 'works' | 'timeline'>('overview');

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
        } else {
          setError("Không tìm thấy thông tin nghệ sĩ");
        }
      } catch (err) {
        console.error('Lỗi khi tải thông tin nghệ sĩ:', err);
        setError("Có lỗi xảy ra khi tải thông tin nghệ sĩ");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDetails();
  }, [artistId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Không rõ";
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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
            <p className="text-lg text-[#3A2A24]">Đang tải thông tin nghệ sĩ...</p>
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
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#3A2A24] mb-2">Có lỗi xảy ra</h2>
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
            <Image
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
                    <Image
                      src={artist.picture}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Play Button Overlay */}
                  <button className="absolute bottom-6 right-6 w-16 h-16 bg-[#C8A97E] rounded-full flex items-center justify-center shadow-lg hover:bg-[#A67C52] transition-all duration-300 hover:scale-110">
                    <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
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
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isFollowing 
                        ? 'bg-[#C8A97E] text-white hover:bg-[#A67C52]'
                        : 'bg-white/80 text-[#3A2A24] hover:bg-[#C8A97E] hover:text-white border border-[#C8A97E]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                  </button>
                  
                  <button className="flex items-center gap-2 px-6 py-3 bg-white/80 text-[#3A2A24] rounded-xl font-semibold hover:bg-[#E6D7C3] transition-colors border border-[#D3B995]">
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
              { id: 'overview', label: 'Tổng quan', icon: BookOpen },
              { id: 'biography', label: 'Tiểu sử', icon: User },
              { id: 'works', label: 'Tác phẩm', icon: Music },
              { id: 'timeline', label: 'Thời gian', icon: Clock }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#C8A97E] text-white shadow-lg'
                    : 'text-[#6D4C41] hover:bg-[#E6D7C3]'
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
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Description */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-[#3A2A24] mb-4 font-['Playfair_Display',serif]">
                      Giới thiệu
                    </h3>
                    <p className="text-[#6D4C41] leading-relaxed text-lg">
                      {artist.description || "Chưa có thông tin mô tả cho nghệ sĩ này."}
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
                            <Image
                              src={genre.picture}
                              alt={genre.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-[#3A2A24]">{genre.name}</h4>
                              <p className="text-sm text-[#6D4C41] line-clamp-2">{genre.description}</p>
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
                            <Image
                              src={instrument.picture}
                              alt={instrument.name}
                              width={80}
                              height={80}
                              className="rounded-full mx-auto mb-3 object-cover"
                            />
                            <h4 className="font-semibold text-[#3A2A24]">{instrument.name}</h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'biography' && (
                <div className="space-y-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-[#3A2A24] mb-6 font-['Playfair_Display',serif]">
                      Thông tin cá nhân
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-[#3A2A24] mb-2">Ngày sinh</h4>
                        <p className="text-[#6D4C41]">{formatDate(artist.dateOfBirth)}</p>
                      </div>
                      {artist.dateOfDeath && (
                        <div>
                          <h4 className="font-semibold text-[#3A2A24] mb-2">Ngày mất</h4>
                          <p className="text-[#6D4C41]">{formatDate(artist.dateOfDeath)}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-[#3A2A24] mb-2">Quốc tịch</h4>
                        <p className="text-[#6D4C41]">{artist.nationality || "Không rõ"}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#3A2A24] mb-2">Vai trò</h4>
                        <p className="text-[#6D4C41]">{artist.roles?.join(", ") || "Không rõ"}</p>
                      </div>
                    </div>
                  </div>

                  {artist.awardsAndHonors && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                      <h3 className="text-2xl font-bold text-[#3A2A24] mb-4 font-['Playfair_Display',serif] flex items-center gap-3">
                        <Award className="w-6 h-6 text-[#C8A97E]" />
                        Giải thưởng & Danh hiệu
                      </h3>
                      <p className="text-[#6D4C41] leading-relaxed">{artist.awardsAndHonors}</p>
                    </div>
                  )}

                  {artist.teachingAndAcademicContributions && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                      <h3 className="text-2xl font-bold text-[#3A2A24] mb-4 font-['Playfair_Display',serif] flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-[#C8A97E]" />
                        Giảng dạy & Đóng góp học thuật
                      </h3>
                      <p className="text-[#6D4C41] leading-relaxed">{artist.teachingAndAcademicContributions}</p>
                    </div>
                  )}

                  {artist.significantPerformences && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                      <h3 className="text-2xl font-bold text-[#3A2A24] mb-4 font-['Playfair_Display',serif] flex items-center gap-3">
                        <Music className="w-6 h-6 text-[#C8A97E]" />
                        Các buổi biểu diễn quan trọng
                      </h3>
                      <p className="text-[#6D4C41] leading-relaxed">{artist.significantPerformences}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'works' && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-[#3A2A24] mb-6 font-['Playfair_Display',serif]">
                    Tác phẩm nổi bật
                  </h3>
                  <p className="text-[#6D4C41] text-center py-12">
                    Chức năng này đang được phát triển. Sẽ hiển thị danh sách các tác phẩm của nghệ sĩ.
                  </p>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-[#3A2A24] mb-6 font-['Playfair_Display',serif]">
                    Dòng thời gian
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-4 h-4 bg-[#C8A97E] rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-[#3A2A24]">Sinh ra</h4>
                        <p className="text-[#6D4C41]">{formatDate(artist.dateOfBirth)}</p>
                      </div>
                    </div>
                    {artist.dateOfDeath && (
                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 bg-gray-400 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-semibold text-[#3A2A24]">Qua đời</h4>
                          <p className="text-[#6D4C41]">{formatDate(artist.dateOfDeath)}</p>
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
                        <Image
                          src={period.picture}
                          alt={period.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                        <span className="font-medium text-[#3A2A24]">{period.name}</span>
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
                      <div key={orchestra.id} className="flex items-center gap-3">
                        <Image
                          src={orchestra.picture}
                          alt={orchestra.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                        <span className="font-medium text-[#3A2A24]">{orchestra.name}</span>
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
    </div>
  );
};

export default ArtistDetailPage; 