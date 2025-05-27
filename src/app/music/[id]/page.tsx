"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { getAuthHeaders, isAuthenticated } from "@/services/authService";

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
  primary: '#C8A97E',
  primaryHover: '#A67C52',
  secondary: '#F8F0E3',
  accent: '#E6D7C3',
  text: '#2D1B14',
  textSecondary: '#5D4037',
  border: '#D3B995',
  background: '#FEFCF8',
  glass: 'rgba(255, 255, 255, 0.25)',
  glassBorder: 'rgba(200, 169, 126, 0.2)',
};

// Enhanced Card component với glassmorphism
const Card = ({ 
  children, 
  className = "", 
  hover = false, 
  glass = false,
  gradient = false 
}: { 
  children: React.ReactNode; 
  className?: string;
  hover?: boolean;
  glass?: boolean;
  gradient?: boolean;
}) => (
  <div className={`
    ${glass 
      ? 'bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl' 
      : gradient
        ? 'bg-gradient-to-br from-white/95 via-white/90 to-[#F8F0E3]/80 backdrop-blur-sm border border-[#D3B995]/20'
        : 'bg-white/95 backdrop-blur-sm border border-[#D3B995]/30'
    }
    rounded-3xl shadow-xl
    ${hover ? 'hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 ease-out' : ''}
    ${className}
  `}>
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
                <div key={i} className="h-32 bg-gradient-to-r from-[#E6D7C3]/50 to-[#D3B995]/50 rounded-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{animationDelay: `${i * 0.5}s`}}></div>
                </div>
              ))}
            </div>
            <div className="xl:col-span-1 space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 bg-gradient-to-r from-[#E6D7C3]/50 to-[#D3B995]/50 rounded-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{animationDelay: `${i * 0.3}s`}}></div>
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
            Có vẻ như bài hát này đã biến mất vào không gian âm nhạc. Hãy thử khám phá những giai điệu khác né!
          </p>
          <a
            href="/"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C8A97E] to-[#A67C52] text-white rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-[#C8A97E]/50"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Khám phá âm nhạc
          </a>
        </Card>
      </main>
    </div>
  </div>
);

// Revolutionary Hero section với advanced glassmorphism
const Hero = ({ music, isPlaying, onPlayPause, onShowLyrics, showLyrics, onQuiz, hasQuiz }: any) => {
  const isAuth = isAuthenticated();
  
  return (
    <section className="relative h-[600px] rounded-3xl overflow-hidden mb-12 group shadow-2xl">
      {/* Background Image với parallax effect */}
      <div className="absolute inset-0 transform transition-transform duration-700 group-hover:scale-110">
        <Image
          src={music.coverPhoto}
          alt={music.name}
          fill
          className="object-cover"
          priority
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
                  <span className="text-white/80 text-sm font-medium tracking-wider uppercase">Đang phát</span>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                  </svg>
                  <span className="font-medium">{music.listenCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-medium">{music.favoriteCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Action buttons */}
          <div className="flex flex-wrap items-center gap-4">
            {isAuth ? (
              <button
                onClick={onPlayPause}
                className="group relative flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#C8A97E] to-[#A67C52] hover:from-[#A67C52] hover:to-[#8B5A3C] text-white rounded-full font-bold text-lg transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#C8A97E]/50 shadow-2xl hover:shadow-[#C8A97E]/50 overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    {isPlaying ? (
                      <svg className="h-8 w-8 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                      </svg>
                    ) : (
                      <svg className="h-8 w-8 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xl font-semibold">{isPlaying ? "Tạm dừng" : "Phát nhạc"}</span>
                </div>
              </button>
            ) : (
              <a
                href="/login"
                className="group relative flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#C8A97E] to-[#A67C52] hover:from-[#A67C52] hover:to-[#8B5A3C] text-white rounded-full font-bold transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-[#C8A97E]/50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xl font-semibold">Đăng nhập để nghe</span>
                </div>
              </a>
            )}
            
            <button
              onClick={onShowLyrics}
              className="group flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-xl border-2 border-white/30 text-white rounded-full hover:bg-white/30 hover:border-white/50 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl"
            >
              <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-lg">{showLyrics ? "Ẩn lời bài hát" : "Xem lời bài hát"}</span>
            </button>

            {hasQuiz && (
              <button
                onClick={onQuiz}
                className="group flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-xl border-2 border-white/30 text-white rounded-full hover:bg-white/30 hover:border-white/50 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl"
              >
                <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg">Trắc nghiệm</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Revolutionary Audio Player với advanced UI
const AudioPlayer = ({ music, isPlaying, setIsPlaying }: { 
  music: Music; 
  isPlaying: boolean; 
  setIsPlaying: (playing: boolean) => void; 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [audioLoading, setAudioLoading] = useState<boolean>(true);
  const [audioError, setAudioError] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Fetch audio stream with authentication
  useEffect(() => {
    const fetchAudioStream = async () => {
      if (!music.resourceLink || !isAuthenticated()) {
        setAudioError("Vui lòng đăng nhập để nghe nhạc");
        setAudioLoading(false);
        return;
      }

      try {
        setAudioLoading(true);
        setAudioError("");
        
        const response = await axios.get(music.resourceLink, {
          headers: {
            ...getAuthHeaders(),
          },
          responseType: 'blob',
          timeout: 30000,
        });

        const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioSrc(audioUrl);
        
      } catch (error) {
        console.error("Error fetching audio stream:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setAudioError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
          } else if (error.response?.status === 403) {
            setAudioError("Bạn không có quyền truy cập bài hát này");
          } else {
            setAudioError("Không thể tải nhạc. Vui lòng thử lại sau");
          }
        } else {
          setAudioError("Đã xảy ra lỗi khi tải nhạc");
        }
      } finally {
        setAudioLoading(false);
      }
    };

    fetchAudioStream();

    return () => {
      if (audioSrc && audioSrc.startsWith('blob:')) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [music.resourceLink]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [isPlaying, audioSrc]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = (parseFloat(e.target.value) / 100) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  if (!isAuthenticated()) {
    return (
      <Card className="p-8" glass hover>
        <div className="text-center py-12">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-full flex items-center justify-center shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <h3 className="text-2xl font-bold text-[#2D1B14] mb-4 font-['Playfair_Display',serif]">
            Trải nghiệm âm nhạc đỉnh cao
          </h3>
          <p className="text-[#5D4037] mb-8 text-lg leading-relaxed max-w-md mx-auto">
            Đăng nhập để thưởng thức chất lượng âm thanh Hi-Fi và tính năng độc quyền
          </p>
          <a
            href="/login"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C8A97E] to-[#A67C52] text-white rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-[#C8A97E]/50"
          >
            <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Đăng nhập ngay
          </a>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-white/95 via-white/90 to-[#F8F0E3]/80" glass>
      {/* Header với enhanced album art */}
      <div className="flex items-center gap-8 mb-8">
        <div className="relative group">
          <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-[#C8A97E]/30 transition-all duration-300 group-hover:ring-[#C8A97E]/50 group-hover:shadow-[#C8A97E]/25">
            <Image
              src={music.coverPhoto}
              alt={music.name}
              width={112}
              height={112}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          {/* Enhanced playing indicator */}
          {isPlaying && audioSrc && (
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-[#C8A97E] to-[#A67C52] rounded-full flex items-center justify-center shadow-xl">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-bold text-[#2D1B14] text-2xl font-['Playfair_Display',serif] line-clamp-2">
              {music.name}
            </h3>
            {audioLoading && (
              <div className="w-6 h-6 border-3 border-[#C8A97E] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-[#5D4037] mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${audioSrc && !audioError ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="font-medium">
                {audioLoading ? "Đang tải..." : isPlaying ? "Đang phát" : audioSrc ? "Sẵn sàng" : "Chờ kết nối"}
              </span>
            </div>
            {audioSrc && !audioError && (
              <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full text-sm font-bold shadow-sm">
                ● Hi-Fi
              </span>
            )}
          </div>
          
          {audioError && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-200">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{audioError}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Enhanced Audio Player Section */}
      <div className="space-y-6">
        {audioLoading ? (
          <div className="w-full h-24 bg-gradient-to-r from-[#E6D7C3]/30 via-[#D3B995]/20 to-[#C8A97E]/30 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-[#D3B995]/20">
            <div className="flex items-center gap-4 text-[#5D4037]">
              <div className="w-8 h-8 border-4 border-[#C8A97E] border-t-transparent rounded-full animate-spin"></div>
              <div className="space-y-2">
                <div className="text-lg font-bold">Đang tải nhạc chất lượng cao...</div>
                <div className="text-sm opacity-70">Chuẩn bị trải nghiệm âm thanh tuyệt vời</div>
              </div>
            </div>
          </div>
        ) : audioError ? (
          <div className="w-full h-24 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-3xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg text-red-600 font-bold mb-2">{audioError}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="text-sm text-red-500 hover:text-red-700 underline font-medium"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : audioSrc ? (
          <div className="space-y-6">
            {/* Hidden native audio element */}
            <audio
              ref={audioRef}
              src={audioSrc}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setAudioError("Không thể phát nhạc")}
              className="hidden"
            />
            
            {/* Custom Player Controls */}
            <div className="bg-gradient-to-r from-[#F8F0E3]/50 via-white/30 to-[#E6D7C3]/50 backdrop-blur-xl border border-[#D3B995]/30 rounded-3xl p-6 shadow-xl">
              {/* Progress Bar */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[#5D4037] min-w-[3rem]">
                    {formatTime(currentTime)}
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={duration ? (currentTime / duration) * 100 : 0}
                      onChange={handleSeek}
                      className="w-full h-3 bg-[#E6D7C3] rounded-full appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #C8A97E 0%, #C8A97E ${duration ? (currentTime / duration) * 100 : 0}%, #E6D7C3 ${duration ? (currentTime / duration) * 100 : 0}%, #E6D7C3 100%)`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[#5D4037] min-w-[3rem]">
                    {formatTime(duration)}
                  </span>
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="group w-14 h-14 bg-gradient-to-r from-[#C8A97E] to-[#A67C52] hover:from-[#A67C52] hover:to-[#8B5A3C] text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-xl hover:shadow-[#C8A97E]/50"
                    >
                      {isPlaying ? (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {/* Volume Control */}
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#5D4037]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                    </svg>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume * 100}
                      onChange={handleVolumeChange}
                      className="w-24 h-2 bg-[#E6D7C3] rounded-full appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #C8A97E 0%, #C8A97E ${volume * 100}%, #E6D7C3 ${volume * 100}%, #E6D7C3 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Stats */}
            <div className="flex items-center justify-between text-sm text-[#5D4037] bg-gradient-to-r from-[#F8F0E3]/30 to-[#E6D7C3]/30 rounded-2xl p-4 border border-[#D3B995]/20">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Chất lượng cao • 320kbps</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                  </svg>
                  <span className="font-medium">Trạng thái</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-semibold text-[#2D1B14] text-sm text-right">
                  {music.favoriteCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

// Enhanced Lyrics component
const LyricsDisplay = ({ lyrics }: { lyrics: string }) => (
  <Card className="p-8" glass hover>
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-2xl flex items-center justify-center shadow-xl">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-[#2D1B14] font-['Playfair_Display',serif]">
          Lời bài hát
        </h2>
        <p className="text-[#5D4037] mt-1">Thưởng thức từng câu từ của giai điệu</p>
      </div>
    </div>
    <div className="relative">
      <div className="prose prose-lg max-w-none text-[#2D1B14] leading-relaxed whitespace-pre-line bg-gradient-to-br from-[#F8F0E3]/50 via-white/30 to-[#E6D7C3]/30 backdrop-blur-sm p-8 rounded-xl border border-[#D3B995]/30 shadow-inner font-medium text-lg">
        {lyrics || (
          <div className="text-center py-12 text-[#5D4037]">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-xl font-medium">Chưa có lời bài hát</p>
            <p className="text-sm mt-2 opacity-70">Hãy để giai điệu tự kể câu chuyện của nó</p>
          </div>
        )}
      </div>
    </div>
  </Card>
);

// Enhanced Quiz component
const QuizDisplay = ({ quiz, onClose }: { quiz: Quiz; onClose: () => void }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const answers = [
    { key: 'A', value: quiz.answerA },
    { key: 'B', value: quiz.answerB },
    { key: 'C', value: quiz.answerC },
    { key: 'D', value: quiz.answerD },
  ];

  return (
    <Card className="p-8" glass hover>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-2xl flex items-center justify-center shadow-xl">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#2D1B14] font-['Playfair_Display',serif]">
              Câu hỏi trắc nghiệm
            </h2>
            <p className="text-[#5D4037] mt-1">Kiểm tra hiểu biết của bạn về bài hát</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-3 hover:bg-[#F8F0E3] rounded-2xl transition-all duration-300 group"
        >
          <svg className="w-7 h-7 text-[#5D4037] group-hover:text-[#2D1B14] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
              onClick={() => !showResult && setSelectedAnswer(answer.key)}
              className={`p-4 text-left rounded-xl transition-all duration-300 border-2 ${
                selectedAnswer === answer.key
                  ? 'bg-[#C8A97E] text-white border-[#C8A97E] shadow-lg transform scale-105'
                  : 'bg-white hover:bg-[#F8F0E3] border-[#D3B995]/30 hover:border-[#C8A97E]/50'
              }`}
              disabled={showResult}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="font-bold text-lg">{answer.key}.</span>{" "}
              <span className="ml-2">{answer.value}</span>
            </button>
          ))}
        </div>
        
        {selectedAnswer && !showResult && (
          <div className="text-center">
            <button
              onClick={() => setShowResult(true)}
              className="px-8 py-3 bg-[#C8A97E] hover:bg-[#A67C52] text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Xem kết quả
            </button>
          </div>
        )}
        
        {showResult && (
          <div className="text-center p-6 bg-gradient-to-br from-[#F8F0E3] to-[#E6D7C3] rounded-xl border border-[#D3B995]/30">
            <p className="text-lg text-[#2D1B14]">
              Bạn đã chọn đáp án: <span className="font-bold text-[#C8A97E]">{selectedAnswer}</span>
            </p>
            <p className="text-sm text-[#5D4037] mt-2">
              Cảm ơn bạn đã tham gia! Hãy tiếp tục khám phá thêm nhiều bài hát thú vị khác.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

// Enhanced Artists section
const ArtistsSection = ({ artists, title, subtitle, icon }: { 
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
              <Image
                src={artist.picture}
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
      color: "from-blue-100 to-blue-200 text-blue-700"
    },
    { 
      title: "Thể loại", 
      items: music.genres, 
      color: "from-purple-100 to-purple-200 text-purple-700"
    },
    { 
      title: "Nhạc cụ", 
      items: music.instruments, 
      color: "from-green-100 to-green-200 text-green-700"
    },
    { 
      title: "Thời kỳ", 
      items: music.periods, 
      color: "from-orange-100 to-orange-200 text-orange-700"
    },
  ].filter(section => section.items.length > 0);

  if (tagSections.length === 0) return null;

  return (
    <Card className="p-6" glass hover>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
              <span className="text-sm">{section.icon}</span>
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
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
  const [music, setMusic] = useState<Music | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<ApiResponse>(`https://api.sonata.io.vn/api/v1/music/${params.id}`);
        if (response.data.success) {
          setMusic(response.data.data);
        } else {
          setError(response.data.message || "Không thể tải thông tin bài hát");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải thông tin bài hát");
        console.error("Error fetching music:", err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchMusic();
  }, [params.id]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleShowLyrics = () => setShowLyrics(!showLyrics);
  const handleQuiz = () => {
    if (music && music.quizzes && music.quizzes.length > 0) {
      setCurrentQuiz(music.quizzes[0]);
      setShowQuiz(true);
    }
  };

  if (loading) return <LoadingSkeleton />;
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
            <Hero
              music={music}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onShowLyrics={handleShowLyrics}
              showLyrics={showLyrics}
              onQuiz={handleQuiz}
              hasQuiz={music.quizzes?.length > 0}
            />
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 transition-all duration-500">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-3 space-y-8">
              {/* Sticky Audio Player */}
              <div className="sticky top-6 z-20 transform transition-all duration-300 hover:scale-[1.01]">
                <div className="bg-gradient-to-r from-[#FEFCF8] via-white to-[#F8F0E3] p-1 rounded-3xl shadow-2xl border border-[#C8A97E]/20 backdrop-blur-lg">
                  <AudioPlayer
                    music={music}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                  />
                </div>
              </div>

              {/* Dynamic Content */}
              <div className="space-y-8">
                {/* Lyrics */}
                {showLyrics && <LyricsDisplay lyrics={music.lyric} />}

                {/* Quiz */}
                {showQuiz && currentQuiz && (
                  <QuizDisplay
                    quiz={currentQuiz}
                    onClose={() => setShowQuiz(false)}
                  />
                )}
                
                {/* Album Info và Related Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Album/Related Songs */}
                  {music.albums && music.albums.length > 0 && (
                    <Card className="p-6" hover>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#3A2A24] font-['Playfair_Display',serif]">
                          Album
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {music.albums.map((album) => (
                          <div key={album.id} className="p-4 bg-gradient-to-r from-[#F8F0E3]/50 to-[#E6D7C3]/30 rounded-xl border border-[#D3B995]/30">
                            <h4 className="font-semibold text-[#3A2A24]">{album.name}</h4>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                  
                  {/* Music Statistics */}
                  <Card className="p-6" hover>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                <Card className="p-6 bg-gradient-to-br from-white via-[#FEFCF8] to-[#F8F0E3]" glass hover>
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-lg mb-4 ring-4 ring-[#C8A97E]/20">
                      <Image
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
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {music.approved ? "✓ Đã duyệt" : "⏳ Chờ duyệt"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#D3B995]/30">
                      <span className="text-sm text-[#5D4037]">Người tải lên</span>
                      <span className="font-semibold text-[#3A2A24] text-sm text-right">{music.uploadedBy.fullname}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-[#5D4037]">Người duyệt</span>
                      <span className="font-semibold text-[#3A2A24] text-sm text-right">{music.approvedBy.name}</span>
                    </div>
                  </div>
                </Card>

                {/* Artists */}
                {music.artists.length > 0 && (
                  <Card className="p-6" hover>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-[#3A2A24] font-['Playfair_Display',serif]">
                        Nghệ sĩ
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {music.artists.slice(0, 3).map((artist) => (
                        <div key={artist.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#F8F0E3]/50 to-[#E6D7C3]/30 rounded-xl border border-[#D3B995]/30 hover:shadow-md transition-all duration-300">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#C8A97E] shadow-md flex-shrink-0">
                            <Image
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
                              {artist.roles?.length > 0 ? artist.roles.join(", ") : "Nghệ sĩ"}
                            </p>
                          </div>
                        </div>
                      ))}
                      {music.artists.length > 3 && (
                        <div className="text-center pt-2">
                          <span className="text-sm text-[#5D4037]">+{music.artists.length - 3} nghệ sĩ khác</span>
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
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-[#3A2A24] font-['Playfair_Display',serif]">
                        Sáng tác
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {music.composers.slice(0, 2).map((composer) => (
                        <div key={composer.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#F8F0E3]/50 to-[#E6D7C3]/30 rounded-xl border border-[#D3B995]/30">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#C8A97E] shadow-md flex-shrink-0">
                            <Image
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
    </div>
  );
};

export default MusicPlayer;