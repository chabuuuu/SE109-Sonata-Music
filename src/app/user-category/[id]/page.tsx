"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import CustomImage from "@/components/CustomImage";
import Link from "next/link";
import { searchMusicsByCategory, Music } from "@/services/musicService";
import { getCategories } from "@/services/categoryService";
import { Category } from "@/interfaces/category";

/*****************************************************************
 *  CATEGORY DETAIL PAGE – Hiển thị nhạc theo category
 *  Thiết kế đẹp và hiện đại với music player tích hợp
 *****************************************************************/

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [musics, setMusics] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [musicLoading, setMusicLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMusics, setTotalMusics] = useState(0);
  const [itemsPerPage] = useState(12);
  const [currentPlayingId, setCurrentPlayingId] = useState<number | null>(null);

  // Hàm lấy danh sách nhạc theo trang
  const fetchMusics = useCallback(
    async (page: number) => {
      try {
        setMusicLoading(true);
        const response = await searchMusicsByCategory(
          categoryId,
          itemsPerPage,
          page
        );

        if (response.success) {
          setMusics(response.data.items);
          setTotalMusics(response.data.total);
          setCurrentPage(page);

          // Debug logging để so sánh số liệu
          console.log(`📊 Debug Category ${categoryId}:`, {
            categoryTotalMusics: category?.totalMusics,
            searchTotalMusics: response.data.total,
            currentPageItems: response.data.items.length,
            difference: category?.totalMusics
              ? Math.abs((category?.totalMusics || 0) - response.data.total)
              : 0,
          });
        } else {
          console.error("Lỗi khi lấy nhạc:", response.message);
          setMusics([]);
          setTotalMusics(0);
        }
      } catch (error) {
        console.error("Lỗi khi fetch nhạc:", error);
        setMusics([]);
        setTotalMusics(0);
      } finally {
        setMusicLoading(false);
      }
    },
    [categoryId, itemsPerPage, category?.totalMusics]
  );

  // Lấy thông tin category và danh sách nhạc
  const fetchCategoryAndMusics = useCallback(async () => {
    try {
      setLoading(true);

      // Lấy thông tin category
      const categoriesData = await getCategories();
      const foundCategory = categoriesData.find((cat) => cat.id === categoryId);
      setCategory(foundCategory || null);

      // Lấy danh sách nhạc của category
      await fetchMusics(1);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu category:", error);
    } finally {
      setLoading(false);
    }
  }, [categoryId, fetchMusics]);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryAndMusics();
    }
  }, [fetchCategoryAndMusics, categoryId]);

  // Hàm format số lượt nghe
  const formatPlayCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Handle phát nhạc
  const handlePlayMusic = (musicId: number, resourceLink: string) => {
    if (resourceLink && resourceLink !== "#" && resourceLink !== "") {
      setCurrentPlayingId(musicId);
      // Tích hợp với audio player ở đây
      console.log("Playing music:", musicId, resourceLink);
    } else {
      console.warn("Không có link nhạc hợp lệ");
    }
  };

  // Tính toán pagination
  const totalPages = Math.ceil(totalMusics / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalMusics);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F8F0E3]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C8A97E] mx-auto mb-4"></div>
            <p className="text-[#6D4C41] text-lg">Đang tải category...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex h-screen bg-[#F8F0E3]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#3A2A24] mb-4">
              Category không tồn tại
            </h2>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-[#C8A97E] text-white rounded-lg hover:bg-[#B8956E] transition-colors"
            >
              Quay lại
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F0E3] text-[#3A2A24] font-['Playfair_Display',serif]">
      <Navbar />

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Header với thông tin category */}
        <div className="relative h-80 overflow-hidden">
          {/* Background image với gradient overlay */}
          <div className="absolute inset-0">
            <CustomImage
              src={category.picture || "/images/default-category.jpg"}
              alt={category.name}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/default-category.jpg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
          </div>

          {/* Content overlay */}
          <div className="relative z-10 h-full flex items-end p-8">
            <div className="text-white">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-4 text-sm opacity-90">
                <Link href="/user-categories" className="hover:underline">
                  Categories
                </Link>
                <span>•</span>
                <span>{category.name}</span>
              </div>

              {/* Category info */}
              <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                {category.name}
              </h1>

              {category.description && (
                <p className="text-xl mb-4 max-w-2xl opacity-90 leading-relaxed">
                  {category.description}
                </p>
              )}

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {totalMusics} bài hát
                    {totalMusics !== category.totalMusics ? ` (có sẵn)` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{formatPlayCount(category.viewCount)} lượt xem</span>
                </div>
                {/* Hiển thị thông tin nếu có sự khác biệt */}
                {totalMusics !== category.totalMusics &&
                  category.totalMusics > 0 && (
                    <div className="flex items-center gap-2 text-xs opacity-75">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Tổng: {category.totalMusics}</span>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 z-20 p-3 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-all duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Music list section */}
        <div className="px-8 py-6">
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Danh sách bài hát</h2>
            {totalMusics > 0 && (
              <span className="text-sm text-[#6D4C41]">
                Hiển thị {startIndex}-{endIndex} trong {totalMusics} bài hát
              </span>
            )}
          </div>

          {/* Thông báo nếu có sự khác biệt số liệu */}
          {totalMusics !== category.totalMusics && category.totalMusics > 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">
                    Lưu ý về số lượng bài hát
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Tổng số bài hát trong category:{" "}
                    <strong>{category.totalMusics}</strong> | Bài hát có sẵn để
                    phát: <strong>{totalMusics}</strong>
                    {totalMusics < category.totalMusics && (
                      <span className="block mt-1 text-xs">
                        Một số bài hát có thể chưa được duyệt hoặc tạm thời
                        không khả dụng.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {musicLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8A97E]"></div>
              <span className="ml-3 text-[#6D4C41]">Đang tải nhạc...</span>
            </div>
          )}

          {/* No music found */}
          {!musicLoading && musics.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-[#E6D7C3] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-[#C8A97E]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <p className="text-[#6D4C41] text-lg">
                Chưa có bài hát nào trong category này
              </p>
            </div>
          )}

          {/* Music list */}
          {!musicLoading && musics.length > 0 && (
            <div className="space-y-2">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm text-[#6D4C41] border-b border-[#E6D7C3]">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Tên bài hát</div>
                <div className="col-span-2">Nghệ sĩ</div>
                <div className="col-span-2">Album</div>
                <div className="col-span-2 text-right">Lượt nghe</div>
              </div>

              {/* Info hint */}
              <div className="px-6 py-2 text-xs text-[#6D4C41] opacity-70">
                💡 Click vào bài hát để mở music player • Click vào nút ▶️ để
                phát nhạc nhanh
              </div>

              {/* Music items */}
              {musics.map((music, index) => {
                const isPlaying = currentPlayingId === music.id;
                return (
                  <div
                    key={music.id}
                    className={`group grid grid-cols-12 gap-4 px-6 py-4 rounded-lg hover:bg-[#E6D7C3]/50 transition-all duration-300 cursor-pointer relative ${
                      isPlaying ? "bg-[#C8A97E]/20" : ""
                    }`}
                    onClick={() => router.push(`/music/${music.id}`)}
                  >
                    {/* Index/Play button */}
                    <div className="col-span-1 flex items-center">
                      <div className="relative">
                        <span
                          className={`text-sm ${
                            isPlaying ? "opacity-0" : "group-hover:opacity-0"
                          } transition-opacity`}
                        >
                          {startIndex + index}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Ngăn event bubbling
                            handlePlayMusic(music.id, music.resourceLink);
                          }}
                          title={isPlaying ? "Dừng phát" : "Phát nhạc"}
                          className={`absolute inset-0 flex items-center justify-center ${
                            isPlaying
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          } transition-all duration-300 hover:scale-110 rounded-full hover:bg-[#C8A97E]/10 p-1`}
                        >
                          {isPlaying ? (
                            <svg
                              className="w-4 h-4 text-[#C8A97E]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4 text-[#3A2A24] group-hover:text-[#C8A97E] transition-colors"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Song info */}
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                        <CustomImage
                          src={music.coverPhoto || "/images/default-music.jpg"}
                          alt={music.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/default-music.jpg";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`font-semibold truncate group-hover:text-[#C8A97E] transition-colors duration-300 ${
                            isPlaying ? "text-[#C8A97E]" : "text-[#3A2A24]"
                          }`}
                        >
                          {music.name}
                        </h3>
                        <p className="text-sm text-[#6D4C41] truncate">
                          {music.genres.map((g) => g.name).join(", ") ||
                            "Chưa phân loại"}
                        </p>
                      </div>
                    </div>

                    {/* Artists */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-[#6D4C41] truncate">
                        {music.artists.length > 0
                          ? music.artists.map((a) => a.name).join(", ")
                          : "Không xác định"}
                      </span>
                    </div>

                    {/* Album */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-[#6D4C41] truncate">
                        {music.albums.length > 0
                          ? music.albums[0].name
                          : "Single"}
                      </span>
                    </div>

                    {/* Play count */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span className="text-sm text-[#6D4C41]">
                        {formatPlayCount(music.listenCount)}
                      </span>
                      {/* Open link icon - chỉ hiện khi hover */}
                      <svg
                        className="w-4 h-4 text-[#C8A97E] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>

                    {/* Subtle hover indicator với enhanced effects */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C8A97E]/20 rounded-lg transition-all duration-300 pointer-events-none group-hover:shadow-lg"></div>

                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C8A97E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg"></div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => fetchMusics(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-[#D3B995] text-[#6D4C41] hover:bg-[#E6D7C3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => fetchMusics(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === currentPage
                        ? "bg-[#C8A97E] text-white"
                        : "border border-[#D3B995] text-[#6D4C41] hover:bg-[#E6D7C3]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => fetchMusics(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-[#D3B995] text-[#6D4C41] hover:bg-[#E6D7C3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
