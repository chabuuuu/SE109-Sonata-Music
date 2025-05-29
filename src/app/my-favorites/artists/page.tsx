"use client";

import React, { useState, useEffect } from "react";
import { Heart, User, Eye, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomImage from "@/components/CustomImage";
import { toast } from "react-hot-toast";
import {
  getMyFollowedArtists,
  unfollowArtist,
  FollowedArtist,
  favoriteEvents,
  clearFollowStatusCache,
} from "@/services/favoriteService";

const FavoriteArtists: React.FC = () => {
  const [favoriteArtists, setFavoriteArtists] = useState<FollowedArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [removeLoading, setRemoveLoading] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  // Fetch favorite artists từ API thực
  const fetchFavoriteArtists = async () => {
    try {
      setLoading(true);

      // Clear cache trước khi fetch để đảm bảo dữ liệu fresh
      clearFollowStatusCache();

      const response = await getMyFollowedArtists(50, 1); // Lấy 50 nghệ sĩ đầu tiên

      console.log("🎭 My Favorite Artists Response:", response);

      setFavoriteArtists(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nghệ sĩ yêu thích:", error);
      toast.error("Không thể tải danh sách nghệ sĩ yêu thích");
      setFavoriteArtists([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle remove from favorite (unfollow artist)
  const handleRemoveFromFavorite = async (artistId: number) => {
    try {
      setRemoveLoading(artistId);
      await unfollowArtist(artistId);

      setFavoriteArtists((prev) =>
        prev.filter((item) => item.artistId !== artistId)
      );
      setTotal((prev) => prev - 1);

      // Emit global event để notify các component khác
      favoriteEvents.emit("favoriteStatusChanged", {
        type: "artist",
        id: artistId,
        action: "unfollowed",
        newStatus: false,
      });

      toast.success("Đã hủy theo dõi nghệ sĩ");
    } catch (error) {
      console.error("Lỗi khi hủy theo dõi nghệ sĩ:", error);
      toast.error("Không thể hủy theo dõi nghệ sĩ");
    } finally {
      setRemoveLoading(null);
    }
  };

  // Handle navigate to artist detail
  const handleNavigateToArtist = (artistId: number) => {
    router.push(`/artist/${artistId}`);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get birth/death year
  const getBirthYear = (dateOfBirth: string): number => {
    return new Date(dateOfBirth).getFullYear();
  };

  const getDeathYear = (dateOfDeath: string | null): number => {
    if (!dateOfDeath) return new Date().getFullYear();
    return new Date(dateOfDeath).getFullYear();
  };

  useEffect(() => {
    fetchFavoriteArtists();

    // Listen to favorite status changes để auto-refresh
    const handleFavoriteStatusChanged = (data: any) => {
      if (data.type === "artist" && data.action === "followed") {
        console.log("🔄 New artist followed, refreshing favorite artists list");
        // Delay nhỏ để đảm bảo API đã được update
        setTimeout(() => {
          fetchFavoriteArtists();
        }, 1000);
      }
    };

    favoriteEvents.on("favoriteStatusChanged", handleFavoriteStatusChanged);

    return () => {
      favoriteEvents.off("favoriteStatusChanged", handleFavoriteStatusChanged);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white/80 rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-[#D3B995] rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-[#D3B995] rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-[#D3B995] rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-[#D3B995] rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header Info */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#2D1B14] font-['Playfair_Display',serif]">
          Nghệ Sĩ Yêu Thích
        </h2>
        <p className="text-[#5D4037]">{total} nghệ sĩ đang theo dõi</p>
      </div>

      {/* Artists List */}
      {favoriteArtists.length === 0 ? (
        <div className="text-center py-16">
          <User className="w-16 h-16 text-[#C8A97E] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-[#2D1B14] mb-2 font-['Playfair_Display',serif]">
            Chưa có nghệ sĩ yêu thích
          </h3>
          <p className="text-[#5D4037] mb-6">
            Hãy khám phá và theo dõi những nghệ sĩ bạn yêu thích
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favoriteArtists.map((item) => {
            const artist = item.artist;
            return (
              <div
                key={item.id}
                className="group bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-xl p-6 transition-all duration-200 border border-[#D3B995]/20 hover:border-[#C8A97E]/40 hover:shadow-lg"
              >
                <div className="flex items-center gap-6">
                  {/* Artist Avatar */}
                  <div
                    className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#C8A97E]/30 group-hover:border-[#C8A97E] transition-colors cursor-pointer"
                    onClick={() => handleNavigateToArtist(artist.id)}
                  >
                    <CustomImage
                      src={artist.picture || "/images/default-artist.jpg"}
                      alt={artist.name}
                      fill
                      className="object-cover grayscale-[20%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/default-artist.jpg";
                      }}
                    />
                  </div>

                  {/* Artist Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-xl font-bold text-[#2D1B14] truncate group-hover:text-[#C8A97E] transition-colors cursor-pointer font-['Playfair_Display',serif]"
                          onClick={() => handleNavigateToArtist(artist.id)}
                        >
                          {artist.name}
                        </h3>
                        <p className="text-sm text-[#5D4037] truncate mt-1">
                          {artist.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-[#6D4C41]">
                          <span>
                            {getBirthYear(artist.dateOfBirth)} -{" "}
                            {artist.dateOfDeath
                              ? getDeathYear(artist.dateOfDeath)
                              : "Present"}
                          </span>
                          <span>{artist.nationality}</span>
                          {artist.roles && artist.roles.length > 0 && (
                            <span className="text-[#C8A97E] font-medium">
                              {artist.roles.join(" • ")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleRemoveFromFavorite(artist.id)}
                        disabled={removeLoading === artist.id}
                        className="ml-4 w-10 h-10 text-[#8D6C61] hover:text-red-500 transition-colors disabled:opacity-50 flex items-center justify-center"
                        title="Hủy theo dõi"
                      >
                        {removeLoading === artist.id ? (
                          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-2 text-sm text-[#6D4C41]">
                        <Eye className="w-4 h-4" />
                        <span>
                          {artist.viewCount?.toLocaleString() || 0} lượt xem
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6D4C41]">
                        <Users className="w-4 h-4" />
                        <span>
                          {artist.followers?.toLocaleString() || 0} người theo
                          dõi
                        </span>
                      </div>
                    </div>

                    {/* Genres */}
                    {artist.genres && artist.genres.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {artist.genres.slice(0, 3).map((genre) => (
                            <span
                              key={genre.id}
                              className="px-2 py-1 bg-[#C8A97E]/20 text-[#8D6C61] text-xs rounded-full"
                            >
                              {genre.name}
                            </span>
                          ))}
                          {artist.genres.length > 3 && (
                            <span className="px-2 py-1 text-[#8D6C61] text-xs">
                              +{artist.genres.length - 3} thể loại khác
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Added Date */}
                    <div className="mt-3 pt-3 border-t border-[#E6D7C3]">
                      <span className="text-xs text-[#8D6C61]">
                        Đã theo dõi từ {formatDate(item.createAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoriteArtists;
