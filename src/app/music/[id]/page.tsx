"use client";

import React, { useState, useRef, useEffect } from "react";
import CustomImage from "@/components/CustomImage";
import axios from "axios";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { getAuthHeaders, isAuthenticated } from "@/services/authService";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { 
  getUnansweredQuizzes, 
  answerQuiz, 
  type QuizQuestion 
} from "@/services/quizService";

// Interfaces
interface Genre {
  id: number;
  name: string;
  description: string;
  picture: string;
  createAt: string;
  updateAt: string;
  deleteAt: null | string;
}

interface Instrument {
  id: number;
  name: string;
  description: string;
  picture: string;
  createAt: string;
  updateAt: string;
  deleteAt: null | string;
}

interface Period {
  id: number;
  name: string;
  description: string;
  picture: string;
  createAt: string;
  updateAt: string;
  deleteAt: null | string;
}

interface Category {
  id: string;
  name: string;
  picture: string;
  createAt: string;
  updateAt: string;
  deleteAt: null | string;
}

interface Artist {
  id: number;
  name: string;
  description: string;
  picture: string;
  awardsAndHonors: string;
  nationality: string;
  teachingAndAcademicContributions: string;
  significantPerformences: string;
  roles: string[];
  dateOfBirth: string;
  dateOfDeath: null | string;
  viewCount: number;
  followers: number;
  genres: Genre[];
  createAt: string;
  updateAt: string;
  deleteAt: null | string;
}

interface Album {
  id: string;
  name: string;
}

interface Quiz {
  id: string;
  content: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
}

interface Music {
  id: number;
  name: string;
  description: string;
  approved: boolean;
  lyric: string;
  coverPhoto: string;
  resourceLink: string;
  listenCount: number;
  favoriteCount: number;
  approvedBy: {
    id: string;
    name: string;
  };
  uploadedBy: {
    id: string;
    fullname: string;
  };
  albums: Album[];
  quizzes: Quiz[];
  genres: Genre[];
  instruments: Instrument[];
  periods: Period[];
  categories: Category[];
  artists: Artist[];
  composers: Artist[];
  createAt: string;
  updateAt: string;
}

interface ApiResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: Music;
  errors: null | any;
}

// Enhanced theme với gradient và shadows
const theme = {
  primary: "#C8A97E",
  primaryHover: "#A67C52",
  secondary: "#F8F0E3",
  accent: "#E6D7C3",
  text: "#2D1B14",
  textSecondary: "#5D4037",
  border: "#D3B995",
  background: "#FEFCF8",
  glass: "rgba(255, 255, 255, 0.25)",
  glassBorder: "rgba(200, 169, 126, 0.2)",
};

// Enhanced Card component với glassmorphism
const Card = ({
  children,
  className = "",
  hover = false,
  glass = false,
  gradient = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  gradient?: boolean;
}) => (
  <div
    className={`
    ${
      glass
        ? "bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl"
        : gradient
        ? "bg-gradient-to-br from-white/95 via-white/90 to-[#F8F0E3]/80 backdrop-blur-sm border border-[#D3B995]/20"
        : "bg-white/95 backdrop-blur-sm border border-[#D3B995]/30"
    }
    rounded-3xl shadow-xl
    ${
      hover
        ? "hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 ease-out"
        : ""
    }
    ${className}
  `}
  >
    {children}
  </div>
);

// Enhanced Loading với skeleton animation
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#FEFCF8] via-[#F8F0E3] to-[#E6D7C3] flex">
    <div className="fixed left-0 top-0 z-50">
      <Navbar />
    </div>
    <div className="flex-1 ml-48 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#C8A97E]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#A67C52]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="container mx-auto px-6 py-8 max-w-7xl relative">
        <div className="space-y-8">
          {/* Hero skeleton với wave animation */}
          <div className="h-[500px] bg-gradient-to-r from-[#E6D7C3]/50 via-[#D3B995]/30 to-[#C8A97E]/50 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>

          {/* Content skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gradient-to-r from-[#E6D7C3]/50 to-[#D3B995]/50 rounded-3xl relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="xl:col-span-1 space-y-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 bg-gradient-to-r from-[#E6D7C3]/50 to-[#D3B995]/50 rounded-3xl relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
);

// Enhanced Error component
const ErrorDisplay = ({ error }: { error: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-[#FEFCF8] via-[#F8F0E3] to-[#E6D7C3] flex">
    <div className="fixed left-0 top-0 z-50">
      <Navbar />
    </div>
    <div className="flex-1 ml-48 relative">
      <main className="container mx-auto px-6 py-16 flex items-center justify-center min-h-screen">
        <Card className="text-center max-w-lg p-12" glass hover>
          <div className="relative">
            <div className="text-8xl mb-6 animate-bounce">🎵</div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <h2 className="text-3xl font-bold text-[#2D1B14] mb-4 font-['Playfair_Display',serif]">
            {error || "Không tìm thấy bài hát"}
          </h2>
          <p className="text-[#5D4037] mb-8 text-lg leading-relaxed">
            Có vẻ như bài hát này đã biến mất vào không gian âm nhạc. Hãy thử
            khám phá những giai điệu khác né!
          </p>
          <a
            href="/"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C8A97E] to-[#A67C52] text-white rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-[#C8A97E]/50"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Khám phá âm nhạc
          </a>
        </Card>
      </main>
    </div>
  </div>
);

// Component thông báo đẹp hơn thay vì alert
const NotificationModal = ({ 
  isOpen, 
  message, 
  type = "info", 
  onClose 
}: { 
  isOpen: boolean; 
  message: string; 
  type?: "info" | "success" | "error"; 
  onClose: () => void; 
}) => {
  if (!isOpen) return null;

  const iconMap = {
    info: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const colorMap = {
    info: "from-blue-50 to-blue-100 border-blue-200",
    success: "from-green-50 to-green-100 border-green-200", 
    error: "from-red-50 to-red-100 border-red-200",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`max-w-md w-full p-6 bg-gradient-to-br ${colorMap[type]} border`} glass>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {iconMap[type]}
          </div>
          <div className="flex-1">
            <p className="text-gray-800 text-lg leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#C8A97E] hover:bg-[#A67C52] text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Đóng
          </button>
        </div>
      </Card>
    </div>
  );
};

// Revolutionary Hero section với advanced glassmorphism
const Hero = ({
  music,
  isPlaying,
  isLoading,
  onPlayPause,
  onShowLyrics,
  showLyrics,
  onQuiz,
  hasQuiz,
  isLoadingQuizzes,
}: any) => {
  const isAuth = isAuthenticated();

  return (
    <section className="relative h-[600px] rounded-3xl overflow-hidden mb-12 group shadow-2xl">
      {/* Background Image với parallax effect */}
      <div className="absolute inset-0 transform transition-transform duration-700 group-hover:scale-110">
        <CustomImage
          src={music.coverPhoto}
          alt={music.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Multi-layer gradients cho depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8A97E]/30 via-transparent to-[#A67C52]/20" />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black/40" />

      {/* Floating elements với animation */}
      <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-8 left-8 w-24 h-24 bg-[#C8A97E]/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full blur-xl animate-pulse delay-2000"></div>

      {/* Glassmorphism content container */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <div className="max-w-5xl">
          {/* Glassmorphism info card */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="space-y-6">
              {/* Title với enhanced typography */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-[#C8A97E] rounded-full animate-pulse"></div>
                  <span className="text-white/80 text-sm font-medium tracking-wider uppercase">
                    Đang phát
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-['Playfair_Display',serif] leading-tight drop-shadow-2xl tracking-tight">
                  {music.name}
                </h1>
                <p className="text-xl md:text-2xl text-white/95 max-w-4xl leading-relaxed drop-shadow-lg font-light">
                  {music.description}
                </p>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
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
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728"
                    />
                  </svg>
                  <span className="font-medium">
                    {music.listenCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
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
                  <span className="font-medium">
                    {music.favoriteCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action buttons */}
          <div className="flex flex-wrap items-center gap-4">
            {isAuth ? (
              <button
                onClick={onPlayPause}
                disabled={isLoading} // BƯỚC 2: VÔ HIỆU HÓA NÚT KHI ĐANG LOADING
                className={`group relative flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#C8A97E] to-[#A67C52] text-white rounded-full font-bold text-lg transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 shadow-2xl overflow-hidden
                  ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:from-[#A67C52] hover:to-[#8B5A3C] focus:ring-[#C8A97E]/50 hover:shadow-[#C8A97E]/50"
                  }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-4">
                  <div className="relative w-8 h-8">
                    {" "}
                    {/* Đảm bảo icon có kích thước cố định */}
                    {/* BƯỚC 3: HIỂN THỊ ICON VÀ TEXT DỰA TRÊN isLoading VÀ isPlaying */}
                    {isLoading ? (
                      <svg
                        className="animate-spin h-full w-full text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : isPlaying ? (
                      <svg
                        className="h-full w-full transition-transform group-hover:scale-110"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 9v6m4-6v6"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-full w-full transition-transform group-hover:scale-110"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-xl font-semibold">
                    {isLoading
                      ? "Đang xử lý..."
                      : isPlaying
                      ? "Tạm dừng"
                      : "Phát nhạc"}
                  </span>
                </div>
              </button>
            ) : (
              <a
                href="/user-login"
                className="group relative flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#C8A97E] to-[#A67C52] hover:from-[#A67C52] hover:to-[#8B5A3C] text-white rounded-full font-bold transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-[#C8A97E]/50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-xl font-semibold">
                    Đăng nhập để nghe
                  </span>
                </div>
              </a>
            )}

            <button
              onClick={onShowLyrics}
              className="group flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-xl border-2 border-white/30 text-white rounded-full hover:bg-white/30 hover:border-white/50 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl"
            >
              <svg
                className="w-6 h-6 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-lg">
                {showLyrics ? "Ẩn lời bài hát" : "Xem lời bài hát"}
              </span>
            </button>

            {/* Quiz button - chỉ hiển thị khi đã đăng nhập */}
            {isAuth && (
              <button
                onClick={onQuiz}
                disabled={isLoadingQuizzes}
                className={`group flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-xl border-2 border-white/30 text-white rounded-full hover:bg-white/30 hover:border-white/50 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl ${
                  isLoadingQuizzes ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoadingQuizzes ? (
                  <svg
                    className="w-6 h-6 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <span className="text-lg">
                  {isLoadingQuizzes ? "Đang tải..." : "Trắc nghiệm"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Lyrics component
const LyricsDisplay = ({ lyrics }: { lyrics: string }) => (
  <Card className="p-8" glass hover>
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-2xl flex items-center justify-center shadow-xl">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-[#2D1B14] font-['Playfair_Display',serif]">
          Lời bài hát
        </h2>
        <p className="text-[#5D4037] mt-1">
          Thưởng thức từng câu từ của giai điệu
        </p>
      </div>
    </div>
    <div className="relative">
      <div className="prose prose-lg max-w-none text-[#2D1B14] leading-relaxed whitespace-pre-line bg-gradient-to-br from-[#F8F0E3]/50 via-white/30 to-[#E6D7C3]/30 backdrop-blur-sm p-8 rounded-xl border border-[#D3B995]/30 shadow-inner font-medium text-lg">
        {lyrics || (
          <div className="text-center py-12 text-[#5D4037]">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
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
            <p className="text-xl font-medium">Chưa có lời bài hát</p>
            <p className="text-sm mt-2 opacity-70">
              Hãy để giai điệu tự kể câu chuyện của nó
            </p>
          </div>
        )}
      </div>
    </div>
  </Card>
);

// Enhanced Quiz component với API tích hợp
const QuizDisplay = ({
  quiz,
  onClose,
  onAnswerSubmitted,
}: {
  quiz: QuizQuestion;
  onClose: () => void;
  onAnswerSubmitted?: () => void;
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ result: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const answers = [
    { key: "A", value: quiz.answerA },
    { key: "B", value: quiz.answerB },
    { key: "C", value: quiz.answerC },
    { key: "D", value: quiz.answerD },
  ];

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      const answerResult = await answerQuiz(quiz.id, selectedAnswer as "A" | "B" | "C" | "D");
      setResult(answerResult);
      setShowResult(true);
      
      // Gọi callback nếu có để cập nhật danh sách quiz
      if (onAnswerSubmitted) {
        onAnswerSubmitted();
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi submit câu trả lời");
      console.error("Error submitting quiz answer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-8" glass hover>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-2xl flex items-center justify-center shadow-xl">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#2D1B14] font-['Playfair_Display',serif]">
              Câu hỏi trắc nghiệm
            </h2>
            <p className="text-[#5D4037] mt-1">
              Kiểm tra hiểu biết của bạn về bài hát
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-3 hover:bg-[#F8F0E3] rounded-2xl transition-all duration-300 group"
        >
          <svg
            className="w-7 h-7 text-[#5D4037] group-hover:text-[#2D1B14] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-[#F8F0E3]/50 via-white/30 to-[#E6D7C3]/30 backdrop-blur-sm p-8 rounded-xl border border-[#D3B995]/30 shadow-inner">
          <p className="text-lg font-medium text-[#2D1B14] leading-relaxed">
            {quiz.content}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {answers.map((answer, index) => (
            <button
              key={answer.key}
              onClick={() => !showResult && !isSubmitting && setSelectedAnswer(answer.key)}
              className={`p-4 text-left rounded-xl transition-all duration-300 border-2 ${
                selectedAnswer === answer.key
                  ? "bg-[#C8A97E] text-white border-[#C8A97E] shadow-lg transform scale-105"
                  : "bg-white hover:bg-[#F8F0E3] border-[#D3B995]/30 hover:border-[#C8A97E]/50 text-[#2D1B14]"
              } ${(showResult || isSubmitting) ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
              disabled={showResult || isSubmitting}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="font-bold text-lg">{answer.key}.</span>{" "}
              <span className="ml-2">{answer.value}</span>
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Submit button */}
        {selectedAnswer && !showResult && (
          <div className="text-center">
            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform shadow-lg ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#C8A97E] hover:bg-[#A67C52] hover:scale-105 text-white"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </div>
              ) : (
                "Gửi câu trả lời"
              )}
            </button>
          </div>
        )}

        {/* Result display */}
        {showResult && result && (
          <div className={`text-center p-6 rounded-xl border ${
            result.result 
              ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200" 
              : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
          }`}>
            <div className="flex items-center justify-center mb-4">
              {result.result ? (
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className={`text-lg font-bold mb-2 ${result.result ? "text-green-700" : "text-red-700"}`}>
              {result.result ? "🎉 Chính xác!" : "😔 Chưa đúng"}
            </p>
            <p className="text-lg text-[#2D1B14] mb-2">
              Bạn đã chọn đáp án:{" "}
              <span className="font-bold text-[#C8A97E]">{selectedAnswer}</span>
            </p>
            <p className={`text-sm ${result.result ? "text-green-600" : "text-red-600"}`}>
              {result.message}
            </p>
            <p className="text-sm text-[#5D4037] mt-3">
              Cảm ơn bạn đã tham gia! Hãy tiếp tục khám phá thêm nhiều bài hát thú vị khác.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

// Enhanced Artists section
const ArtistsSection = ({
  artists,
  title,
  subtitle,
  icon,
}: {
  artists: Artist[];
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) => (
  <Card className="p-8" glass hover>
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-2xl flex items-center justify-center shadow-xl">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-[#2D1B14] font-['Playfair_Display',serif]">
          {title}
        </h3>
        <p className="text-[#5D4037] mt-1">{subtitle}</p>
      </div>
    </div>

    <div className="space-y-6">
      {artists.map((artist, index) => (
        <div
          key={artist.id}
          className="group flex items-center gap-6 p-4 bg-gradient-to-r from-[#F8F0E3]/50 via-white/30 to-[#E6D7C3]/30 backdrop-blur-sm rounded-2xl border border-[#D3B995]/30 hover:shadow-md transition-all duration-300 cursor-pointer"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-3 border-[#C8A97E] shadow-lg">
              <CustomImage
                src={artist.picture}
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-[#2D1B14] text-lg">
              {artist.name}
            </h4>
            <p className="text-sm text-[#5D4037]">
              {artist.roles?.length > 0 ? artist.roles.join(", ") : subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// Enhanced Tags section
const TagsSection = ({ music }: { music: Music }) => {
  const tagSections = [
    {
      title: "Danh mục",
      items: music.categories,
      color: "from-blue-100 to-blue-200 text-blue-700",
    },
    {
      title: "Thể loại",
      items: music.genres,
      color: "from-purple-100 to-purple-200 text-purple-700",
    },
    {
      title: "Nhạc cụ",
      items: music.instruments,
      color: "from-green-100 to-green-200 text-green-700",
    },
    {
      title: "Thời kỳ",
      items: music.periods,
      color: "from-orange-100 to-orange-200 text-orange-700",
    },
  ].filter((section) => section.items.length > 0);

  if (tagSections.length === 0) return null;

  return (
    <Card className="p-6" glass hover>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#2D1B14] font-['Playfair_Display',serif]">
          Chi tiết
        </h3>
      </div>

      <div className="space-y-4">
        {tagSections.map((section, sectionIndex) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-semibold text-[#5D4037]">
                {section.title}
              </h4>
            </div>
            <div className="flex flex-wrap gap-1">
              {section.items.slice(0, 4).map((item: any) => (
                <span
                  key={item.id}
                  className={`px-2 py-1 bg-gradient-to-r ${section.color} rounded-lg text-xs font-medium border border-[#D3B995]/30 hover:shadow-sm transition-all duration-300`}
                >
                  {item.name}
                </span>
              ))}
              {section.items.length > 4 && (
                <span className="px-2 py-1 text-xs text-[#5D4037] bg-gray-100 rounded-lg">
                  +{section.items.length - 4}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Enhanced Stats Card
const StatsCard = ({ music }: { music: Music }) => (
  <Card className="p-6" glass hover>
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-lg flex items-center justify-center shadow-lg">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-bold text-[#2D1B14] font-['Playfair_Display',serif]">
          Thống kê
        </h3>
        <p className="text-[#5D4037] text-sm">Hiệu suất bài hát</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-4 bg-gradient-to-br from-[#F8F0E3]/50 to-[#E6D7C3]/30 rounded-xl">
        <div className="text-3xl font-bold text-[#C8A97E] mb-2">
          {music.listenCount.toLocaleString()}
        </div>
        <div className="text-sm text-[#5D4037]">Lượt nghe</div>
      </div>
      <div className="text-center p-4 bg-gradient-to-br from-[#F8F0E3]/50 to-[#E6D7C3]/30 rounded-xl">
        <div className="text-3xl font-bold text-[#C8A97E] mb-2">
          {music.favoriteCount.toLocaleString()}
        </div>
        <div className="text-sm text-[#5D4037]">Yêu thích</div>
      </div>
    </div>

    <div className="mt-6 p-4 bg-gradient-to-r from-[#F8F0E3]/30 to-[#E6D7C3]/30 rounded-xl border border-[#D3B995]/20">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-[#5D4037]">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Trạng thái</span>
        </div>
        <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full text-xs font-bold">
          {music.approved ? "✓ Đã duyệt" : "⏳ Chờ duyệt"}
        </span>
      </div>
    </div>
  </Card>
);

// Main component với enhanced layout
const MusicPlayer = () => {
  const params = useParams();
  const musicIdFromParam = params.id as string;

  // Lấy các hàm và state cần thiết từ Context
  const {
    playSongById, // Hàm mới để bắt đầu chuỗi API
    currentMusic, // Bài hát hiện tại trong player toàn cục
    isPlaying, // Trạng thái phát/dừng của player toàn cục
    isLoading: isPlayerLoading, // Trạng thái loading của player toàn cục
    togglePlayPause, // Để sử dụng khi bài hát đã được tải
  } = useMusicPlayer();

  // State của trang, dùng để fetch dữ liệu và quản lý UI cục bộ (lời bài hát, quiz)
  const [music, setMusic] = useState<Music | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLyrics, setShowLyrics] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [availableQuizzes, setAvailableQuizzes] = useState<QuizQuestion[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  
  // State cho notification
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: "info" | "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "info",
  });

  const showNotification = (message: string, type: "info" | "success" | "error" = "info") => {
    setNotification({ isOpen: true, message, type });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        setIsPageLoading(true);
        setError(null);
        const response = await axios.get<ApiResponse>(
          `https://api.sonata.io.vn/api/v1/music/${musicIdFromParam}`
        );
        if (response.data.success) {
          setMusic(response.data.data);
        } else {
          setError(response.data.message || "Không thể tải thông tin bài hát");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải thông tin bài hát");
        console.error("Error fetching music:", err);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchMusic();
  }, [musicIdFromParam]);

  const handlePlayButtonClick = () => {
    if (!music) return;

    // Nếu bài hát này đang được phát, chỉ cần toggle
    if (currentMusic?.id === music.id.toString()) {
      // Bạn cần thêm togglePlayPause vào context nếu muốn có hành vi này
      // Nếu không, click lần nữa sẽ chạy lại toàn bộ flow
    }

    // Gọi hàm duy nhất để bắt đầu chuỗi API
    playSongById(music.id);
  };

  const handlePlayPause = () => togglePlayPause();
  const handleShowLyrics = () => setShowLyrics(!showLyrics);
  
  // Cập nhật hàm handleQuiz để sử dụng API mới
  const handleQuiz = async () => {
    if (!music || !isAuthenticated()) return;

    try {
      setIsLoadingQuizzes(true);
      setError(null);
      
      const quizzes = await getUnansweredQuizzes(music.id);
      
      // Safety check: đảm bảo quizzes là array và có length
      if (Array.isArray(quizzes) && quizzes.length > 0) {
        setAvailableQuizzes(quizzes);
        setCurrentQuizIndex(0);
        setCurrentQuiz(quizzes[0]);
        setShowQuiz(true);
      } else {
        // Hiển thị thông báo không có quiz
        showNotification("Không có câu hỏi trắc nghiệm nào cho bài hát này hoặc bạn đã trả lời hết rồi!");
      }
    } catch (err: any) {
      console.error("Error loading quizzes:", err);
      showNotification(err.message || "Đã xảy ra lỗi khi tải quiz", "error");
    } finally {
      setIsLoadingQuizzes(false);
    }
  };

  // Hàm để chuyển sang quiz tiếp theo (nếu có)
  const handleNextQuiz = async () => {
    if (currentQuizIndex < availableQuizzes.length - 1) {
      const nextIndex = currentQuizIndex + 1;
      setCurrentQuizIndex(nextIndex);
      setCurrentQuiz(availableQuizzes[nextIndex]);
    } else {
      // Hết quiz, có thể load lại danh sách mới
      await handleQuiz();
    }
  };

  let isThisSongPlaying = false;

  if (music != null && currentMusic) {
    isThisSongPlaying = currentMusic?.id === music.id.toString() && isPlaying;
  }

  if (isPageLoading) return <LoadingSkeleton />;
  if (error || !music) return <ErrorDisplay error={error!} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEFCF8] via-[#F8F0E3] to-[#E6D7C3] flex relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#C8A97E]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#A67C52]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-2/3 w-64 h-64 bg-[#D3B995]/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Fixed Sidebar Navigation */}
      <div className="fixed left-0 top-0 z-50">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-48 relative">
        <main className="relative container mx-auto px-6 py-8 max-w-7xl min-h-screen">
          {/* Hero Section */}
          <div className="transform transition-all duration-1000 ease-out">
            {/* BƯỚC 8: TRUYỀN HÀM MỚI VÀ STATE MỚI VÀO HERO */}
            <Hero
              music={music}
              isPlaying={isPlayerLoading ? false : isThisSongPlaying} // Truyền trạng thái phát toàn cục
              isLoading={
                isPlayerLoading && currentMusic?.id === music.id.toString()
              }
              onPlayPause={handlePlayButtonClick} // Truyền hàm điều khiển toàn cục
              onShowLyrics={handleShowLyrics}
              showLyrics={showLyrics}
              onQuiz={handleQuiz}
              hasQuiz={music.quizzes?.length > 0}
              isLoadingQuizzes={isLoadingQuizzes}
            />
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 transition-all duration-500">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-3 space-y-8">
              {/* Dynamic Content */}
              <div className="space-y-8">
                {/* Lyrics */}
                {showLyrics && <LyricsDisplay lyrics={music.lyric} />}

                {/* Quiz */}
                {showQuiz && currentQuiz && (
                  <div className="space-y-4">
                    {/* Quiz Progress */}
                    {availableQuizzes.length > 1 && (
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-[#2D1B14] font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Câu {currentQuizIndex + 1} / {availableQuizzes.length}
                        </div>
                      </div>
                    )}
                    <QuizDisplay
                      quiz={currentQuiz}
                      onClose={() => setShowQuiz(false)}
                      onAnswerSubmitted={handleNextQuiz}
                    />
                  </div>
                )}

                {/* Album Info và Related Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Album/Related Songs */}
                  {music.albums && music.albums.length > 0 && (
                    <Card className="p-6" hover>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
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
                        </div>
                        <h3 className="text-xl font-bold text-[#3A2A24] font-['Playfair_Display',serif]">
                          Album
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {music.albums.map((album) => (
                          <div
                            key={album.id}
                            className="p-4 bg-gradient-to-r from-[#F8F0E3]/50 to-[#E6D7C3]/30 rounded-xl border border-[#D3B995]/30"
                          >
                            <h4 className="font-semibold text-[#3A2A24]">
                              {album.name}
                            </h4>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Music Statistics */}
                  <Card className="p-6" hover>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-[#3A2A24] font-['Playfair_Display',serif]">
                        Thống kê
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-[#F8F0E3]/50 to-[#E6D7C3]/30 rounded-xl">
                        <div className="text-3xl font-bold text-[#C8A97E] mb-2">
                          {music.listenCount.toLocaleString()}
                        </div>
                        <div className="text-sm text-[#5D4037]">Lượt nghe</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-[#F8F0E3]/50 to-[#E6D7C3]/30 rounded-xl">
                        <div className="text-3xl font-bold text-[#C8A97E] mb-2">
                          {music.favoriteCount.toLocaleString()}
                        </div>
                        <div className="text-sm text-[#5D4037]">Yêu thích</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Right Column - Enhanced Sticky Sidebar */}
            <div className="xl:col-span-1">
              <div className="sticky top-6 space-y-6 max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#C8A97E] scrollbar-track-[#F8F0E3] pr-2">
                {/* Gradient overlays for smooth scroll */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#FEFCF8] to-transparent pointer-events-none z-10"></div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#FEFCF8] to-transparent pointer-events-none z-10"></div>

                {/* Quick Info Card */}
                <Card
                  className="p-6 bg-gradient-to-br from-white via-[#FEFCF8] to-[#F8F0E3]"
                  glass
                  hover
                >
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-lg mb-4 ring-4 ring-[#C8A97E]/20">
                      <CustomImage
                        src={music.coverPhoto}
                        alt={music.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-[#3A2A24] font-['Playfair_Display',serif] line-clamp-2">
                      {music.name}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-[#D3B995]/30">
                      <span className="text-sm text-[#5D4037]">Trạng thái</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full text-xs font-bold">
                        {music.approved ? "✓ Đã duyệt" : "⏳ Chờ duyệt"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#D3B995]/30">
                      <span className="text-sm text-[#5D4037]">
                        Người tải lên
                      </span>
                      <span className="font-semibold text-[#3A2A24] text-sm text-right">
                        {music.uploadedBy.fullname}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-[#5D4037]">
                        Người duyệt
                      </span>
                      <span className="font-semibold text-[#3A2A24] text-sm text-right">
                        {music.approvedBy.name}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Artists */}
                {music.artists.length > 0 && (
                  <Card className="p-6" hover>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-[#3A2A24] font-['Playfair_Display',serif]">
                        Nghệ sĩ
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {music.artists.slice(0, 3).map((artist) => (
                        <div
                          key={artist.id}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#F8F0E3]/50 to-[#E6D7C3]/30 rounded-xl border border-[#D3B995]/30 hover:shadow-md transition-all duration-300"
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#C8A97E] shadow-md flex-shrink-0">
                            <CustomImage
                              src={artist.picture}
                              alt={artist.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#3A2A24] text-sm line-clamp-1">
                              {artist.name}
                            </h4>
                            <p className="text-xs text-[#5D4037] line-clamp-1">
                              {artist.roles?.length > 0
                                ? artist.roles.join(", ")
                                : "Nghệ sĩ"}
                            </p>
                          </div>
                        </div>
                      ))}
                      {music.artists.length > 3 && (
                        <div className="text-center pt-2">
                          <span className="text-sm text-[#5D4037]">
                            +{music.artists.length - 3} nghệ sĩ khác
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Composers */}
                {music.composers.length > 0 && (
                  <Card className="p-6" hover>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-[#3A2A24] font-['Playfair_Display',serif]">
                        Sáng tác
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {music.composers.slice(0, 2).map((composer) => (
                        <div
                          key={composer.id}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#F8F0E3]/50 to-[#E6D7C3]/30 rounded-xl border border-[#D3B995]/30"
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#C8A97E] shadow-md flex-shrink-0">
                            <CustomImage
                              src={composer.picture}
                              alt={composer.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#3A2A24] text-sm line-clamp-1">
                              {composer.name}
                            </h4>
                            <p className="text-xs text-[#5D4037]">Nhạc sĩ</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Compact Tags */}
                <TagsSection music={music} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
    </div>
  );
};

export default MusicPlayer;
