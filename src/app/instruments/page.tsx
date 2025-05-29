"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import CustomImage from "@/components/CustomImage";
import SearchBar from "@/components/SearchBar";
import BottomBanner from "@/components/bottom_banner";
import { 
  getInstrumentSpotlight, 
  InstrumentSpotlight, 
  Instrument 
} from "@/services/instrumentService";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { 
  addToFavorite, 
  removeFromFavorite, 
  checkIsFavorite
} from "@/services/favoriteService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

// Interface cho nút yêu thích
interface FavoriteButtonProps {
  id: number;
  type: "music" | "artist" | "album";
  className?: string;
  iconSize?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  id,
  type,
  className = "text-[#C8A97E] hover:text-[#A67C52] transition-colors",
  iconSize = "h-5 w-5",
}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isLoggedIn } = useAuth();

  const checkFavoriteStatus = async () => {
    if (!isLoggedIn) return;
    
    try {
      const favorite = await checkIsFavorite(id);
      setIsFavorite(favorite);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  useEffect(() => {
    checkFavoriteStatus();
  }, [id, type, isLoggedIn]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorite(id);
        setIsFavorite(false);
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        await addToFavorite(id);
        setIsFavorite(true);
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-50' : ''}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={iconSize}
        viewBox="0 0 20 20"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={isFavorite ? "0" : "2"}
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

// Component thẻ nhạc cụ
const InstrumentCard: React.FC<{
  instrument: Instrument;
  onPlayCollection: (songs: any[]) => void;
}> = ({ instrument, onPlayCollection }) => {
  const defaultInstrumentImages: Record<string, string> = {
    piano: "/instruments/piano.jpg",
    violin: "/instruments/violin.jpg",
    guitar: "/instruments/guitar.jpg",
    drums: "/instruments/drums.jpg",
    saxophone: "/instruments/saxophone.jpg",
    trumpet: "/instruments/trumpet.jpg",
    flute: "/instruments/flute.jpg",
    default: "/instruments/default-instrument.jpg",
  };

  const instrumentGradients: Record<string, string> = {
    piano: "from-[#C8A97E] to-[#A67C52]",
    violin: "from-[#D3B995] to-[#A67C52]",
    guitar: "from-[#E6D7C3] to-[#C8A97E]",
    drums: "from-[#B9987D] to-[#8D6C61]",
    saxophone: "from-[#D7C3A7] to-[#A67C52]",
    trumpet: "from-[#E6D7C3] to-[#C8A97E]",
    flute: "from-[#D3B995] to-[#8D6C61]",
    default: "from-[#C8A97E] to-[#A67C52]",
  };

  const getInstrumentImage = () => {
    if (instrument.picture) return instrument.picture;
    const lowerName = instrument.name.toLowerCase();
    return defaultInstrumentImages[lowerName] || defaultInstrumentImages.default;
  };

  const getInstrumentGradient = () => {
    const lowerName = instrument.name.toLowerCase();
    return instrumentGradients[lowerName] || instrumentGradients.default;
  };

  const instrumentImage = getInstrumentImage();
  const gradient = getInstrumentGradient();

  return (
    <article className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
      <figure className="relative mb-4 rounded-md overflow-hidden">
        <div 
          className="w-full aspect-square bg-cover bg-center relative"
          style={{ backgroundImage: `url(${instrumentImage})` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Play button */}
          <button
            onClick={() => onPlayCollection(instrument.musics || [])}
            disabled={!instrument.musics || instrument.musics.length === 0}
            className="absolute bottom-4 right-4 bg-white text-[#3A2A24] rounded-full p-3 transform translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-[#C8A97E] hover:text-white disabled:opacity-50"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
          
          <div className="absolute top-3 left-3 bg-[#3A2A24]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Instrument
          </div>
        </div>
      </figure>
      
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-1 text-[#3A2A24] truncate">
          {instrument.name}
        </h3>
        <p className="text-sm text-[#6D4C41] line-clamp-2">
          {instrument.musics?.length || 0} bài hát có sẵn
        </p>
        <div className="mt-auto pt-3 flex justify-between items-center">
          <span className="text-xs text-[#8D6C61]">Classical</span>
          <div className="flex space-x-2">
            <button 
              onClick={() => onPlayCollection(instrument.musics || [])}
              disabled={!instrument.musics || instrument.musics.length === 0}
              className="text-[#C8A97E] hover:text-[#A67C52] transition-colors disabled:opacity-50"
              title="Phát tất cả bài hát"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const InstrumentsPage: React.FC = () => {
  const [spotlights, setSpotlights] = useState<InstrumentSpotlight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { playCollection } = useMusicPlayer();
  const router = useRouter();

  const instrumentsPerPage = 20;

  // Fetch instruments với pagination
  const fetchInstruments = async (page: number) => {
    try {
      setLoading(true);
      
      // Lấy nhiều hơn số cần thiết để có thể phân trang
      const allSpotlights = await getInstrumentSpotlight(100); 
      
      // Tính toán pagination
      const startIndex = (page - 1) * instrumentsPerPage;
      const endIndex = startIndex + instrumentsPerPage;
      const paginatedSpotlights = allSpotlights.slice(startIndex, endIndex);
      
      setSpotlights(paginatedSpotlights);
      setTotalPages(Math.ceil(allSpotlights.length / instrumentsPerPage));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhạc cụ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstruments(currentPage);
  }, [currentPage]);

  const handlePlayCollection = async (songs: any[]) => {
    if (songs && songs.length > 0) {
      await playCollection(songs);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-lg transition-colors ${
            i === currentPage
              ? "bg-[#C8A97E] text-white"
              : "bg-[#F0E6D6] text-[#3A2A24] hover:bg-[#E6D7C3]"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-8 mb-4">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 rounded-lg bg-[#F0E6D6] text-[#3A2A24] hover:bg-[#E6D7C3] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ««
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 rounded-lg bg-[#F0E6D6] text-[#3A2A24] hover:bg-[#E6D7C3] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ‹
        </button>
        
        {pages}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 rounded-lg bg-[#F0E6D6] text-[#3A2A24] hover:bg-[#E6D7C3] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ›
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 rounded-lg bg-[#F0E6D6] text-[#3A2A24] hover:bg-[#E6D7C3] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          »»
        </button>
      </div>
    );
  };

  return (
    <div className="flex relative font-['Playfair_Display',serif] text-[#3A2A24] bg-[#F8F0E3]">
      {/* Sidebar */}
      <Navbar />

      {/* Main */}
      <main className="flex-1 overflow-y-auto h-screen pb-28">
        {/* Search */}
        <SearchBar />

        {/* Header */}
        <section className="p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full bg-[#F0E6D6] hover:bg-[#E6D7C3] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#3A2A24]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-4xl font-bold tracking-wide">Instrument Spotlight</h1>
          </div>
          
          <p className="text-lg text-[#6D4C41] mb-8">
            Khám phá âm nhạc qua các nhạc cụ khác nhau
          </p>
        </section>

        {/* Content */}
        <section className="px-6">
          {loading ? (
            // Loading state
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array(instrumentsPerPage)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={`loading-${i}`}
                    className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg animate-pulse"
                  >
                    <div className="w-full aspect-square bg-[#D3B995] mb-4 rounded-md"></div>
                    <div className="h-5 bg-[#D3B995] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#D3B995] rounded w-1/2"></div>
                  </div>
                ))}
            </div>
          ) : spotlights.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {spotlights.map((spotlight) => (
                  <InstrumentCard
                    key={spotlight.instrument.id}
                    instrument={spotlight.instrument}
                    onPlayCollection={handlePlayCollection}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {renderPagination()}
            </>
          ) : (
            <div className="text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4 text-[#A67C52]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <h3 className="text-xl font-semibold text-[#3A2A24] mb-2">
                Không có nhạc cụ nào
              </h3>
              <p className="text-[#6D4C41]">
                Hiện tại không có nhạc cụ nào. Vui lòng thử lại sau.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Bottom Banner */}
      <BottomBanner />
    </div>
  );
};

export default InstrumentsPage; 