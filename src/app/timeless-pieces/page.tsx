"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import CustomImage from "@/components/CustomImage";
import SearchBar from "@/components/SearchBar";
import BottomBanner from "@/components/bottom_banner";
import { getTimelessPieces } from "@/services/timelessService";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { 
  addToFavorite, 
  removeFromFavorite, 
  checkIsFavorite
} from "@/services/favoriteService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

// Interface cho bài hát timeless
interface TimelessSong {
  id: number;
  name: string;
  coverPhoto: string;
  resourceLink: string;
  description?: string;
  artists?: Array<{
    id: number;
    name: string;
  }>;
}

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

// Component thẻ bài hát
const TimelessSongCard: React.FC<{
  song: TimelessSong;
  onPlayClick: () => void;
}> = ({ song, onPlayClick }) => (
  <article className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
    <figure className="relative mb-4 rounded-md overflow-hidden">
      <CustomImage
        src={song.coverPhoto}
        alt={song.name || "Timeless Music"}
        width={500}
        height={500}
        className="w-full aspect-square object-cover grayscale-[20%] sepia-[10%] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:sepia-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {/* Play button */}
      <button
        onClick={onPlayClick}
        className="absolute bottom-4 right-4 bg-white text-[#3A2A24] rounded-full p-3 transform translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-[#C8A97E] hover:text-white"
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
      <div className="absolute top-3 left-3 bg-[#8B4513]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Timeless
      </div>
    </figure>
    <div className="flex-1 flex flex-col">
      <h3 className="font-semibold text-lg mb-1 text-[#3A2A24] truncate">
        {song.name}
      </h3>
      <p className="text-sm text-[#6D4C41] line-clamp-2">
        {song.description || "Tác phẩm bất hủ"}
      </p>
      {song.artists && song.artists.length > 0 && (
        <p className="text-xs text-[#8D6C61] mt-1">
          {song.artists.map(artist => artist.name).join(", ")}
        </p>
      )}
      <div className="mt-auto pt-3 flex justify-between items-center">
        <span className="text-xs text-[#8D6C61]">Classical</span>
        <div className="flex space-x-2">
          <FavoriteButton id={song.id} type="music" />
        </div>
      </div>
    </div>
  </article>
);

const TimelessPiecesPage: React.FC = () => {
  const [songs, setSongs] = useState<TimelessSong[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { playSongById } = useMusicPlayer();
  const router = useRouter();

  const songsPerPage = 20;

  // Fetch songs với pagination
  const fetchSongs = async (page: number) => {
    try {
      setLoading(true);
      
      // Lấy nhiều hơn số cần thiết để có thể phân trang
      const allSongs = await getTimelessPieces(100); 
      
      // Tính toán pagination
      const startIndex = (page - 1) * songsPerPage;
      const endIndex = startIndex + songsPerPage;
      const paginatedSongs = allSongs.slice(startIndex, endIndex);
      
      setSongs(paginatedSongs);
      setTotalPages(Math.ceil(allSongs.length / songsPerPage));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tác phẩm bất hủ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs(currentPage);
  }, [currentPage]);

  const handlePlayClick = (songId: number) => {
    playSongById(songId);
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
            <h1 className="text-4xl font-bold tracking-wide">Timeless Pieces</h1>
          </div>
          
          <p className="text-lg text-[#6D4C41] mb-8">
            Khám phá những tác phẩm bất hủ vượt thời gian
          </p>
        </section>

        {/* Content */}
        <section className="px-6">
          {loading ? (
            // Loading state
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array(songsPerPage)
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
          ) : songs.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {songs.map((song) => (
                  <TimelessSongCard
                    key={song.id}
                    song={song}
                    onPlayClick={() => handlePlayClick(song.id)}
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
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-[#3A2A24] mb-2">
                Không có tác phẩm nào
              </h3>
              <p className="text-[#6D4C41]">
                Hiện tại không có tác phẩm bất hủ nào. Vui lòng thử lại sau.
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

export default TimelessPiecesPage; 