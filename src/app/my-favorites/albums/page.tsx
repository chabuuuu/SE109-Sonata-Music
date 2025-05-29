"use client";

import React, { useState, useEffect } from "react";
import { Heart, Disc, Play, Eye, X, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomImage from "@/components/CustomImage";
import { toast } from "react-hot-toast";
import {
  getMyLikedAlbums,
  unlikeAlbum,
  FavoriteAlbum,
  FavoriteAlbumListResponse,
} from "@/services/favoriteService";

const FavoriteAlbums: React.FC = () => {
  const [favoriteAlbums, setFavoriteAlbums] = useState<FavoriteAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [removeLoading, setRemoveLoading] = useState<string | number | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();

  // Fetch favorite albums từ API
  const fetchFavoriteAlbums = async (
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      if (!append) {
        setLoading(true);
      }

      const response: FavoriteAlbumListResponse = await getMyLikedAlbums(
        10,
        page
      );

      if (response.success && response.data) {
        const newAlbums = response.data.items;

        if (append) {
          setFavoriteAlbums((prev) => [...prev, ...newAlbums]);
        } else {
          setFavoriteAlbums(newAlbums);
        }

        setTotalCount(response.data.total);
        setHasMore(newAlbums.length === 10); // Nếu trả về đủ 10 items thì có thể còn page sau
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách album yêu thích:", error);
      toast.error("Không thể tải danh sách album yêu thích");
    } finally {
      setLoading(false);
    }
  };

  // Handle remove from favorite
  const handleRemoveFromFavorite = async (albumId: string | number) => {
    try {
      setRemoveLoading(albumId);

      // Gọi API unlike album
      await unlikeAlbum(Number(albumId));

      // Cập nhật state local
      setFavoriteAlbums((prev) =>
        prev.filter((album) => album.albumId !== albumId.toString())
      );
      setTotalCount((prev) => prev - 1);

      toast.success("Đã xóa album khỏi danh sách yêu thích");
    } catch (error: any) {
      console.error("Lỗi khi xóa album khỏi favorite:", error);
      toast.error(
        error.message || "Không thể xóa album khỏi danh sách yêu thích"
      );
    } finally {
      setRemoveLoading(null);
    }
  };

  // Handle navigate to album detail
  const handleNavigateToAlbum = (albumId: string | number) => {
    router.push(`/album/${albumId}`);
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

  // Format release year
  const getReleaseYear = (dateString: string): number => {
    return new Date(dateString).getFullYear();
  };

  // Load more albums
  const loadMoreAlbums = () => {
    if (hasMore && !loading) {
      fetchFavoriteAlbums(currentPage + 1, true);
    }
  };

  useEffect(() => {
    fetchFavoriteAlbums();
  }, []);

  if (loading && favoriteAlbums.length === 0) {
    return (
      <div className="space-y-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white/80 rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-[#D3B995] rounded-lg"></div>
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#2D1B14] font-['Playfair_Display',serif]">
              Favorite Albums
            </h2>
            <p className="text-[#5D4037]">{totalCount} album yêu thích</p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white/60 rounded-lg p-1 border border-[#D3B995]/30">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-[#C8A97E] text-white"
                  : "text-[#6D4C41] hover:bg-[#E6D7C3]"
              }`}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-[#C8A97E] text-white"
                  : "text-[#6D4C41] hover:bg-[#E6D7C3]"
              }`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Albums Display */}
      {favoriteAlbums.length === 0 ? (
        <div className="text-center py-16">
          <Disc className="w-16 h-16 text-[#C8A97E] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-[#2D1B14] mb-2 font-['Playfair_Display',serif]">
            Chưa có album yêu thích
          </h3>
          <p className="text-[#5D4037] mb-6">
            Hãy khám phá và thêm những album bạn yêu thích vào đây
          </p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteAlbums.map((albumItem) => (
                <div
                  key={albumItem.albumId}
                  className="group bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-xl p-4 transition-all duration-200 border border-[#D3B995]/20 hover:border-[#C8A97E]/40 hover:shadow-lg"
                >
                  <div className="relative">
                    {/* Album Cover */}
                    <div
                      className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 cursor-pointer"
                      onClick={() => handleNavigateToAlbum(albumItem.albumId)}
                    >
                      <CustomImage
                        src={albumItem.album.coverPhoto}
                        alt={albumItem.album.name}
                        fill
                        className="object-cover grayscale-[10%] sepia-[5%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/default-album.jpg";
                        }}
                      />

                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-[#C8A97E] text-white rounded-full p-3 shadow-lg hover:bg-[#A67C52] transition-colors">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </button>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() =>
                        handleRemoveFromFavorite(albumItem.albumId)
                      }
                      disabled={removeLoading === albumItem.albumId}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                      title="Xóa khỏi yêu thích"
                    >
                      {removeLoading === albumItem.albumId ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Album Info */}
                  <div>
                    <h3
                      className="font-bold text-[#2D1B14] truncate group-hover:text-[#C8A97E] transition-colors cursor-pointer font-['Playfair_Display',serif]"
                      onClick={() => handleNavigateToAlbum(albumItem.albumId)}
                    >
                      {albumItem.album.name}
                    </h3>
                    <p className="text-sm text-[#5D4037] truncate mt-1">
                      {albumItem.album.description || "No description"}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-[#6D4C41]">
                      <span>{getReleaseYear(albumItem.album.releaseDate)}</span>
                      <span>•</span>
                      <span>{albumItem.album.albumType}</span>
                    </div>

                    {/* Added date */}
                    <div className="mt-3 pt-3 border-t border-[#E6D7C3]">
                      <span className="text-xs text-[#8D6C61]">
                        Đã thêm {formatDate(albumItem.createAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {favoriteAlbums.map((albumItem, index) => (
                <div
                  key={albumItem.albumId}
                  className="group bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-xl p-4 transition-all duration-200 border border-[#D3B995]/20 hover:border-[#C8A97E]/40 hover:shadow-lg"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Index */}
                    <div className="col-span-1 text-center">
                      <span className="text-[#8D6C61] font-medium">
                        {index + 1}
                      </span>
                    </div>

                    {/* Album Info */}
                    <div className="col-span-6 flex items-center gap-4">
                      <div
                        className="relative w-12 h-12 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => handleNavigateToAlbum(albumItem.albumId)}
                      >
                        <CustomImage
                          src={albumItem.album.coverPhoto}
                          alt={albumItem.album.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/default-album.jpg";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3
                          className="font-semibold text-[#2D1B14] truncate group-hover:text-[#C8A97E] transition-colors cursor-pointer"
                          onClick={() =>
                            handleNavigateToAlbum(albumItem.albumId)
                          }
                        >
                          {albumItem.album.name}
                        </h3>
                        <p className="text-sm text-[#5D4037] truncate">
                          {albumItem.album.description || "No description"}
                        </p>
                      </div>
                    </div>

                    {/* Album Type & Year */}
                    <div className="col-span-2">
                      <span className="text-sm text-[#6D4C41]">
                        {albumItem.album.albumType}
                      </span>
                      <div className="text-xs text-[#8D6C61]">
                        {getReleaseYear(albumItem.album.releaseDate)}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-4 text-sm text-[#6D4C41]">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>
                            {albumItem.album.viewCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>
                            {albumItem.album.likeCount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-[#8D6C61] mt-1">
                        {formatDate(albumItem.createAt)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 text-center">
                      <button
                        onClick={() =>
                          handleRemoveFromFavorite(albumItem.albumId)
                        }
                        disabled={removeLoading === albumItem.albumId}
                        className="w-8 h-8 text-[#8D6C61] hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Xóa khỏi yêu thích"
                      >
                        {removeLoading === albumItem.albumId ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        ) : (
                          <X className="w-4 h-4 mx-auto" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Load More Button */}
      {hasMore && favoriteAlbums.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadMoreAlbums}
            disabled={loading}
            className="bg-[#C8A97E] hover:bg-[#A67C52] text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang tải...
              </div>
            ) : (
              "Tải thêm albums"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoriteAlbums;
