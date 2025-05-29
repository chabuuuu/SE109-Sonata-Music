"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CustomImage from "@/components/CustomImage";
import Link from "next/link";
import Navbar from "@/components/navbar";
import SearchBar from "@/components/SearchBar";
import BottomBanner from "@/components/bottom_banner";
import {
  getPeriodById,
  getMusicsByPeriodId,
  Period,
} from "@/services/periodService";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

/**
 * Component trang chi tiết period với layout nhất quán
 */
const PeriodDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const periodId = params.id as string;
  const { playSongById } = useMusicPlayer();

  const [period, setPeriod] = useState<Period | null>(null);
  const [musics, setMusics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [musicsLoading, setMusicsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalMusics, setTotalMusics] = useState(0);

  /**
   * Fetch thông tin period
   */
  useEffect(() => {
    const fetchPeriod = async () => {
      try {
        setLoading(true);
        setError(null);

        const periodData = await getPeriodById(periodId);

        if (periodData) {
          setPeriod(periodData);
        } else {
          setError("Không tìm thấy thời kỳ âm nhạc này");
        }
      } catch (err) {
        console.error("Lỗi khi tải period:", err);
        setError("Có lỗi xảy ra khi tải thời kỳ âm nhạc");
      } finally {
        setLoading(false);
      }
    };

    if (periodId) {
      fetchPeriod();
    }
  }, [periodId]);

  /**
   * Fetch danh sách nhạc của period
   */
  useEffect(() => {
    const fetchMusics = async () => {
      try {
        setMusicsLoading(true);

        const musicData = await getMusicsByPeriodId(periodId, 20, page);

        if (page === 1) {
          setMusics(musicData.items);
        } else {
          setMusics((prev) => [...prev, ...musicData.items]);
        }
        setTotalMusics(musicData.total);
      } catch (err) {
        console.error("Lỗi khi tải danh sách nhạc:", err);
      } finally {
        setMusicsLoading(false);
      }
    };

    if (periodId) {
      fetchMusics();
    }
  }, [periodId, page]);

  /**
   * Handle play music
   */
  const handlePlayMusic = (musicId: number) => {
    if (playSongById) {
      playSongById(musicId);
    }
  };

  /**
   * Component Loading với style parchment
   */
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#F0E6D6] border border-[#D3B995] rounded-lg p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#D3B995] border-t-[#C8A97E] mb-4"></div>
      <p className="text-[#6D4C41] font-['Playfair_Display',serif] text-lg">
        Đang tải thông tin thời kỳ âm nhạc...
      </p>
    </div>
  );

  /**
   * Component Error với style parchment
   */
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 bg-[#F0E6D6] border border-[#D3B995] rounded-lg p-8">
      <div className="text-center">
        <svg
          className="w-20 h-20 mx-auto mb-4 text-[#A67C52]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold mb-2 text-[#3A2A24] font-['Playfair_Display',serif]">
          Oops!
        </h2>
        <p className="text-[#6D4C41] font-['Playfair_Display',serif]">
          {message}
        </p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-[#C8A97E] hover:bg-[#A67C52] text-white rounded-full font-semibold transition-colors shadow-md hover:shadow-lg font-['Playfair_Display',serif]"
        >
          Quay lại
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 border-2 border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-white rounded-full font-semibold transition-colors font-['Playfair_Display',serif]"
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  /**
   * Component Music Row với style vintage
   */
  const MusicRow = ({ music, index }: { music: any; index: number }) => (
    <div
      className={`grid grid-cols-12 items-center px-6 py-4 hover:bg-[#E6D7C3] rounded-lg transition-all duration-300 cursor-pointer group ${
        currentTrack === index ? "bg-[#E6D7C3] shadow-md" : ""
      }`}
      onClick={() => {
        setCurrentTrack(currentTrack === index ? null : index);
        handlePlayMusic(music.id);
      }}
    >
      {/* Số thứ tự hoặc nút play */}
      <div className="col-span-1 flex items-center justify-center">
        {currentTrack === index ? (
          <button className="w-10 h-10 bg-[#C8A97E] text-white rounded-full flex items-center justify-center hover:bg-[#A67C52] transition-colors shadow-md">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
            </svg>
          </button>
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#F0E6D6] border border-[#D3B995] flex items-center justify-center group-hover:bg-[#C8A97E] group-hover:text-white transition-all duration-300">
            <span className="text-sm text-[#6D4C41] group-hover:hidden font-['Playfair_Display',serif] font-semibold">
              {index + 1}
            </span>
            <svg
              className="w-4 h-4 hidden group-hover:block"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        )}
      </div>

      {/* Thông tin bài hát */}
      <div className="col-span-7 flex items-center space-x-4">
        <div className="w-12 h-12 relative flex-shrink-0 rounded-lg overflow-hidden border-2 border-[#D3B995]">
          <CustomImage
            src={music.coverPhoto}
            alt={music.name}
            fill
            className="object-cover grayscale-[20%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-[#3A2A24] truncate font-['Playfair_Display',serif] text-lg">
            {music.name}
          </h4>
          <p className="text-sm text-[#6D4C41] truncate font-['Playfair_Display',serif]">
            {music.artists?.map((artist: any) => artist.name).join(", ") ||
              "Unknown Artist"}
          </p>
        </div>
      </div>

      {/* Views */}
      <div className="col-span-2 text-right">
        <span className="text-sm text-[#6D4C41] font-['Playfair_Display',serif]">
          {music.viewCount ? `${music.viewCount} views` : "0 views"}
        </span>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="p-2 rounded-full hover:bg-[#D3B995] transition-colors">
          <svg
            className="w-5 h-5 text-[#6D4C41]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        <Link
          href={`/music/${music.id}`}
          className="p-2 rounded-full hover:bg-[#D3B995] transition-colors"
        >
          <svg
            className="w-5 h-5 text-[#6D4C41]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex relative font-['Playfair_Display',serif] text-[#3A2A24] bg-[#F8F0E3]">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen pb-28">
        {/* Search Bar */}
        <SearchBar />

        <div className="p-6">
          {/* Breadcrumb với style parchment */}
          <nav className="flex items-center space-x-2 text-sm text-[#6D4C41] mb-6 bg-[#F0E6D6] border border-[#D3B995] rounded-lg px-4 py-3">
            <Link
              href="/"
              className="hover:text-[#C8A97E] transition-colors font-medium"
            >
              Trang chủ
            </Link>
            <span className="text-[#D3B995]">/</span>
            <span className="hover:text-[#C8A97E] transition-colors font-medium">
              Thời kỳ âm nhạc
            </span>
            <span className="text-[#D3B995]">/</span>
            <span className="text-[#C8A97E] font-semibold">
              {period?.name || "Loading..."}
            </span>
          </nav>

          {loading && <LoadingSpinner />}

          {error && <ErrorMessage message={error} />}

          {period && !loading && (
            <div className="space-y-8">
              {/* Period Header với style vintage */}
              <div className="bg-[#F0E6D6] border border-[#D3B995] rounded-xl shadow-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Period Image */}
                  <div className="lg:w-80 lg:h-80 w-full h-64 relative flex-shrink-0">
                    <CustomImage
                      src={period.picture}
                      alt={period.name}
                      fill
                      className="object-cover grayscale-[20%] sepia-[10%]"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3A2A24]/60 via-transparent to-transparent" />

                    {/* Play overlay button */}
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-8 h-8 text-[#3A2A24] ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </button>
                  </div>

                  {/* Period Info */}
                  <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="px-4 py-2 bg-[#C8A97E] text-white text-sm rounded-full font-semibold shadow-md">
                          Thời kỳ âm nhạc
                        </span>
                      </div>

                      <h1 className="text-4xl lg:text-5xl font-bold text-[#3A2A24] mb-4 tracking-wide">
                        {period.name}
                      </h1>

                      <p className="text-[#6D4C41] mb-6 leading-relaxed text-lg">
                        {period.description ||
                          "Khám phá những tác phẩm âm nhạc tiêu biểu của thời kỳ này."}
                      </p>

                      <div className="flex flex-wrap items-center gap-6 text-sm text-[#6D4C41] mb-6">
                        <div className="flex items-center space-x-2 bg-[#E6D7C3] px-3 py-2 rounded-full">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                          </svg>
                          <span className="font-semibold">
                            {totalMusics} bài hát
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 bg-[#E6D7C3] px-3 py-2 rounded-full">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="font-semibold">Cổ điển</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons với style vintage */}
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={() =>
                          musics.length > 0 && handlePlayMusic(musics[0].id)
                        }
                        className="px-8 py-4 bg-[#C8A97E] text-white rounded-full font-bold hover:bg-[#A67C52] transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                        <span>Phát tất cả</span>
                      </button>

                      <button className="px-6 py-4 border-2 border-[#C8A97E] text-[#C8A97E] rounded-full font-bold hover:bg-[#C8A97E] hover:text-white transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span>Yêu thích</span>
                      </button>

                      <button className="p-4 border-2 border-[#C8A97E] text-[#C8A97E] rounded-full hover:bg-[#C8A97E] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Music List với style parchment */}
              <div className="bg-[#F0E6D6] border border-[#D3B995] rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-[#D3B995] bg-gradient-to-r from-[#E6D7C3] to-[#D3B995]">
                  <h2 className="text-2xl font-bold text-[#3A2A24] tracking-wide">
                    Danh sách bài hát
                  </h2>
                  <p className="text-[#6D4C41] mt-1">
                    Khám phá những tác phẩm tiêu biểu của thời kỳ {period.name}
                  </p>
                </div>

                <div className="p-6">
                  {musics.length > 0 ? (
                    <div className="space-y-2">
                      {/* Header */}
                      <div className="grid grid-cols-12 items-center px-6 py-3 text-sm font-bold text-[#6D4C41] border-b border-[#D3B995] bg-[#E6D7C3] rounded-lg">
                        <span className="col-span-1">#</span>
                        <span className="col-span-7">Tên bài hát</span>
                        <span className="col-span-2 text-right">Lượt xem</span>
                        <span className="col-span-2 text-center">
                          Hành động
                        </span>
                      </div>

                      {/* Tracks */}
                      <div className="space-y-1">
                        {musics.map((music, index) => (
                          <MusicRow
                            key={music.id}
                            music={music}
                            index={index}
                          />
                        ))}
                      </div>

                      {/* Load More Button */}
                      {musics.length < totalMusics && (
                        <div className="text-center pt-6">
                          <button
                            onClick={() => setPage((prev) => prev + 1)}
                            disabled={musicsLoading}
                            className="px-8 py-3 bg-[#C8A97E] hover:bg-[#A67C52] text-white rounded-full font-semibold transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {musicsLoading ? "Đang tải..." : "Tải thêm"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <svg
                        className="w-20 h-20 mx-auto mb-6 text-[#A67C52]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                      <h3 className="text-2xl font-bold text-[#3A2A24] mb-3">
                        Chưa có bài hát
                      </h3>
                      <p className="text-[#6D4C41] text-lg mb-6">
                        Thời kỳ này chưa có bài hát nào được thêm vào.
                      </p>
                      <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-[#C8A97E] hover:bg-[#A67C52] text-white rounded-full font-semibold transition-colors shadow-md"
                      >
                        Khám phá thời kỳ khác
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Banner */}
      <BottomBanner />
    </div>
  );
};

export default PeriodDetailPage;
