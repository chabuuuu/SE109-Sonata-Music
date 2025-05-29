"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CustomImage from "@/components/CustomImage";
import Link from "next/link";
import Navbar from "@/components/navbar";
import SearchBar from "@/components/SearchBar";
import BottomBanner from "@/components/bottom_banner";
import { getAlbumById, Album } from "@/services/albumService";
import { 
  likeAlbum, 
  unlikeAlbum, 
  checkIsLikedAlbum 
} from "@/services/favoriteService";
import { toast } from "react-hot-toast";

/**
 * Component trang chi tiết album với layout nhất quán với Home
 */
const AlbumDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id as string;

  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  /**
   * Fetch thông tin album
   */
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        setError(null);

        const albumData = await getAlbumById(albumId);

        if (albumData) {
          setAlbum(albumData);
          
          // Check like status
          try {
            const likeStatus = await checkIsLikedAlbum(parseInt(albumId));
            setIsLiked(likeStatus);
          } catch (likeError) {
            console.error("Lỗi khi kiểm tra like status:", likeError);
          }
        } else {
          setError("Không tìm thấy album này");
        }
      } catch (err) {
        console.error("Lỗi khi tải album:", err);
        setError("Có lỗi xảy ra khi tải album");
      } finally {
        setLoading(false);
      }
    };

    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

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
        return;
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

  // Handle like/unlike album
  const handleLikeToggle = async () => {
    if (!album) return;
    
    try {
      setLikeLoading(true);
      
      if (isLiked) {
        await unlikeAlbum(parseInt(albumId));
        setIsLiked(false);
        toast.success("Đã hủy yêu thích album");
        // Update like count
        setAlbum(prev => prev ? {...prev, likeCount: (prev.likeCount || 0) - 1} : prev);
      } else {
        await likeAlbum(parseInt(albumId));
        setIsLiked(true);
        toast.success("Đã thêm album vào yêu thích");
        // Update like count
        setAlbum(prev => prev ? {...prev, likeCount: (prev.likeCount || 0) + 1} : prev);
      }
    } catch (error) {
      console.error("Lỗi khi like/unlike album:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Không thể thực hiện thao tác này");
      }
    } finally {
      setLikeLoading(false);
    }
  };

  // Handle share functionality
  const handleShare = async (platform?: string) => {
    if (!album) return;

    const shareUrl = window.location.href;
    const shareTitle = `${album.name} - Sonata Music`;
    const shareText = `Khám phá album "${album.name}" trên Sonata Music`;

    try {
      if (platform === 'native' && navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Đã chia sẻ thành công!");
        return;
      }

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
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Đã copy link vào clipboard!");
          setShowShareMenu(false);
          return;
        default:
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
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Đã copy link vào clipboard!");
      } catch (copyError) {
        toast.error("Không thể chia sẻ hoặc copy link");
      }
      setShowShareMenu(false);
    }
  };

  /**
   * Component Loading với style parchment
   */
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#F0E6D6] border border-[#D3B995] rounded-lg p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#D3B995] border-t-[#C8A97E] mb-4"></div>
      <p className="text-[#6D4C41] font-['Playfair_Display',serif] text-lg">
        Đang tải thông tin album...
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
   * Component Track Row với style vintage
   */
  const TrackRow = ({ track, index }: { track: any; index: number }) => (
    <div
      className={`grid grid-cols-12 items-center px-6 py-4 hover:bg-[#E6D7C3] rounded-lg transition-all duration-300 cursor-pointer group ${
        currentTrack === index ? "bg-[#E6D7C3] shadow-md" : ""
      }`}
      onClick={() => setCurrentTrack(currentTrack === index ? null : index)}
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
            src={track.coverPhoto}
            alt={track.name}
            fill
            className="object-cover grayscale-[20%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-[#3A2A24] truncate font-['Playfair_Display',serif] text-lg">
            {track.name}
          </h4>
          <p className="text-sm text-[#6D4C41] truncate font-['Playfair_Display',serif]">
            {track.description || "Bài hát cổ điển"}
          </p>
        </div>
      </div>

      {/* Duration placeholder */}
      <div className="col-span-2 text-right">
        <span className="text-sm text-[#6D4C41] font-['Playfair_Display',serif]">
          3:45
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
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
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
            <Link
              href="/user-albums"
              className="hover:text-[#C8A97E] transition-colors font-medium"
            >
              Albums
            </Link>
            <span className="text-[#D3B995]">/</span>
            <span className="text-[#C8A97E] font-semibold">
              {album?.name || "Loading..."}
            </span>
          </nav>

          {loading && <LoadingSpinner />}

          {error && <ErrorMessage message={error} />}

          {album && !loading && (
            <div className="space-y-8">
              {/* Album Header với style vintage */}
              <div className="bg-[#F0E6D6] border border-[#D3B995] rounded-xl shadow-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Album Cover */}
                  <div className="lg:w-80 lg:h-80 w-full h-64 relative flex-shrink-0">
                    <CustomImage
                      src={album.coverPhoto}
                      alt={album.name}
                      fill
                      className="object-cover grayscale-[20%] sepia-[10%]"
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

                  {/* Album Info */}
                  <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="px-4 py-2 bg-[#C8A97E] text-white text-sm rounded-full font-semibold shadow-md">
                          {album.albumType || "Album"}
                        </span>
                        {album.viewCount && (
                          <div className="flex items-center space-x-1 text-sm text-[#6D4C41]">
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <span>
                              {album.viewCount.toLocaleString()} lượt xem
                            </span>
                          </div>
                        )}
                      </div>

                      <h1 className="text-4xl lg:text-5xl font-bold text-[#3A2A24] mb-4 tracking-wide">
                        {album.name}
                      </h1>

                      <p className="text-[#6D4C41] mb-6 leading-relaxed text-lg">
                        {album.description ||
                          "Một tuyệt tác âm nhạc cổ điển đầy cảm xúc và nghệ thuật."}
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="font-semibold">
                            {new Date(album.releaseDate).getFullYear()}
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
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                          </svg>
                          <span className="font-semibold">
                            {album.musics?.length || 0} bài hát
                          </span>
                        </div>

                        {album.likeCount && (
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
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            <span className="font-semibold">
                              {album.likeCount.toLocaleString()} lượt thích
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons với style vintage */}
                    <div className="flex flex-wrap items-center gap-4">
                      <button className="px-8 py-4 bg-[#C8A97E] text-white rounded-full font-bold hover:bg-[#A67C52] transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                        <span>Phát tất cả</span>
                      </button>

                      <button 
                        onClick={handleLikeToggle}
                        disabled={likeLoading}
                        className={`px-6 py-4 border-2 rounded-full font-bold transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                          isLiked 
                            ? "bg-[#C8A97E] text-white border-[#C8A97E]" 
                            : "border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-white"
                        }`}>
                        {likeLoading ? (
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg
                            className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                            fill={isLiked ? "currentColor" : "none"}
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
                        )}
                        <span>{likeLoading ? "Đang xử lý..." : isLiked ? "Đã yêu thích" : "Yêu thích"}</span>
                      </button>

                      <button 
                        onClick={() => setShowShareMenu(true)}
                        className="p-4 border-2 border-[#C8A97E] text-[#C8A97E] rounded-full hover:bg-[#C8A97E] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
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

              {/* Track List với style parchment */}
              <div className="bg-[#F0E6D6] border border-[#D3B995] rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-[#D3B995] bg-gradient-to-r from-[#E6D7C3] to-[#D3B995]">
                  <h2 className="text-2xl font-bold text-[#3A2A24] tracking-wide">
                    Danh sách bài hát
                  </h2>
                  <p className="text-[#6D4C41] mt-1">
                    Khám phá những giai điệu tuyệt vời trong album này
                  </p>
                </div>

                <div className="p-6">
                  {album.musics && album.musics.length > 0 ? (
                    <div className="space-y-2">
                      {/* Header */}
                      <div className="grid grid-cols-12 items-center px-6 py-3 text-sm font-bold text-[#6D4C41] border-b border-[#D3B995] bg-[#E6D7C3] rounded-lg">
                        <span className="col-span-1">#</span>
                        <span className="col-span-7">Tên bài hát</span>
                        <span className="col-span-2 text-right">
                          Thời lượng
                        </span>
                        <span className="col-span-2 text-center">
                          Hành động
                        </span>
                      </div>

                      {/* Tracks */}
                      <div className="space-y-1">
                        {album.musics.map((track, index) => (
                          <TrackRow
                            key={track.id}
                            track={track}
                            index={index}
                          />
                        ))}
                      </div>
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
                        Album này chưa có bài hát nào được thêm vào.
                      </p>
                      <button className="px-6 py-3 bg-[#C8A97E] hover:bg-[#A67C52] text-white rounded-full font-semibold transition-colors shadow-md">
                        Khám phá album khác
                      </button>
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

      {/* Share Modal */}
      {showShareMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl share-modal-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#3A2A24] font-['Playfair_Display',serif]">
                Chia sẻ album
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

            {/* Album info */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-[#F8F0E3] rounded-xl">
              <CustomImage
                src={album?.coverPhoto || '/images/default-album.jpg'}
                alt={album?.name || 'Album'}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold text-[#3A2A24]">{album?.name}</h4>
                <p className="text-sm text-[#6D4C41]">{album?.albumType || 'Album'} • {new Date(album?.releaseDate || '').getFullYear()}</p>
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
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
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

export default AlbumDetailPage;
