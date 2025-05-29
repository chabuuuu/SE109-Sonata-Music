"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Play, MoreHorizontal, Clock, Calendar, Headphones, X } from 'lucide-react';
import { getFavoriteList, removeFromFavorite, FavoriteMusic, favoriteEvents } from '@/services/favoriteService';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { toast } from 'react-hot-toast';

const MyFavoritePage: React.FC = () => {
  const [favoriteMusics, setFavoriteMusics] = useState<FavoriteMusic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [removeLoading, setRemoveLoading] = useState<number | null>(null);
  const pageSize = 20;
  
  const { playSongById } = useMusicPlayer();
  
  const totalPages = Math.ceil(totalCount / pageSize);

  // Fetch favorite list
  const fetchFavoriteList = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await getFavoriteList(pageSize, page);
      
      setFavoriteMusics(response.data.items);
      setTotalCount(response.data.total);
    } catch (error) {
      console.error('Lỗi khi tải danh sách yêu thích:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  // Handle remove from favorite
  const handleRemoveFromFavorite = async (musicId: number) => {
    try {
      setRemoveLoading(musicId);
      await removeFromFavorite(musicId);
      
      // Cập nhật state local
      setFavoriteMusics(prev => prev.filter(item => item.musicId !== musicId));
      setTotalCount(prev => prev - 1);
      
      // Emit global event để notify các component khác
      favoriteEvents.emit('favoriteStatusChanged', {
        type: 'music',
        id: musicId,
        action: 'removed',
        newStatus: false
      });
      
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      console.error('Lỗi khi xóa khỏi favorite:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể xóa khỏi danh sách yêu thích');
    } finally {
      setRemoveLoading(null);
    }
  };

  // Handle play music
  const handlePlayMusic = (musicId: number) => {
    playSongById(musicId);
  };

  // Format duration
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchFavoriteList(currentPage);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F0E3] via-[#E6D7C3] to-[#D3B995]">
        <div className="container mx-auto px-6 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-12 bg-[#D3B995] rounded-lg animate-pulse mb-4 w-1/3"></div>
            <div className="h-6 bg-[#D3B995] rounded-lg animate-pulse w-1/2"></div>
          </div>
          
          {/* List Skeleton */}
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-white/80 rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#D3B995] rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-[#D3B995] rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-[#D3B995] rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F0E3] via-[#E6D7C3] to-[#D3B995]">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#C8A97E] to-[#A67C52] rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#2D1B14] font-['Playfair_Display',serif]">
                My Favorite Songs
              </h1>
              <p className="text-[#5D4037] text-lg">
                {totalCount} bài hát yêu thích
              </p>
            </div>
          </div>
          
          {/* Play All Button */}
          {favoriteMusics.length > 0 && (
            <button 
              onClick={() => favoriteMusics.length > 0 && handlePlayMusic(favoriteMusics[0].musicId)}
              className="flex items-center gap-3 bg-[#C8A97E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#A67C52] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Play className="w-5 h-5 fill-white" />
              Phát tất cả
            </button>
          )}
        </div>

        {/* Music List */}
        {favoriteMusics.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-[#C8A97E] mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold text-[#2D1B14] mb-2 font-['Playfair_Display',serif]">
              Chưa có bài hát yêu thích
            </h3>
            <p className="text-[#5D4037] text-lg mb-6">
              Hãy khám phá và thêm những bài hát bạn yêu thích vào đây
            </p>
            <button 
              onClick={() => window.location.href = '/user-categories'}
              className="bg-[#C8A97E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#A67C52] transition-all duration-200"
            >
              Khám phá nhạc
            </button>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl mb-4 p-4 border border-[#D3B995]/30">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-[#5D4037] uppercase tracking-wide">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5">Bài hát</div>
                <div className="col-span-2">Thể loại</div>
                <div className="col-span-2">Ngày thêm</div>
                <div className="col-span-1 text-center">
                  <Headphones className="w-4 h-4 mx-auto" />
                </div>
                <div className="col-span-1 text-center">Thao tác</div>
              </div>
            </div>

            {/* Music Items */}
            <div className="space-y-2">
              {favoriteMusics.map((item, index) => (
                <div 
                  key={item.id}
                  className="group bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-xl p-4 transition-all duration-200 border border-[#D3B995]/20 hover:border-[#C8A97E]/40 hover:shadow-lg"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Index */}
                    <div className="col-span-1 text-center">
                      <span className="text-[#8D6C61] font-medium group-hover:hidden">
                        {(currentPage - 1) * pageSize + index + 1}
                      </span>
                      <button
                        onClick={() => handlePlayMusic(item.musicId)}
                        className="hidden group-hover:block w-8 h-8 bg-[#C8A97E] text-white rounded-full flex items-center justify-center hover:bg-[#A67C52] transition-colors mx-auto"
                      >
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </button>
                    </div>

                    {/* Song Info */}
                    <div className="col-span-5 flex items-center gap-3">
                      <img
                        src={item.music.coverPhoto}
                        alt={item.music.name}
                        className="w-12 h-12 rounded-lg object-cover shadow-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-music.jpg';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-[#2D1B14] truncate group-hover:text-[#C8A97E] transition-colors">
                          {item.music.name}
                        </h3>
                        <p className="text-sm text-[#6D4C41] truncate">
                          {item.music.artists.length > 0 
                            ? item.music.artists.map(a => a.name).join(', ')
                            : 'Nghệ sĩ chưa xác định'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Genre */}
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        {item.music.genres.slice(0, 2).map((genre, idx) => (
                          <span 
                            key={genre.id}
                            className="bg-[#E6D7C3] text-[#5D4037] px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {genre.name}
                          </span>
                        ))}
                        {item.music.genres.length > 2 && (
                          <span className="text-[#8D6C61] text-xs">+{item.music.genres.length - 2}</span>
                        )}
                      </div>
                    </div>

                    {/* Date Added */}
                    <div className="col-span-2 text-sm text-[#6D4C41]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(item.createAt)}
                      </div>
                    </div>

                    {/* Listen Count */}
                    <div className="col-span-1 text-center text-sm text-[#8D6C61]">
                      0 {/* Placeholder - API không trả về listen count cho favorite */}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 text-center">
                      <button
                        onClick={() => handleRemoveFromFavorite(item.musicId)}
                        disabled={removeLoading === item.musicId}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                        title="Xóa khỏi danh sách yêu thích"
                      >
                        {removeLoading === item.musicId ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/80 text-[#5D4037] rounded-lg border border-[#D3B995]/30 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Trước
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === currentPage;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        isActive
                          ? 'bg-[#C8A97E] text-white border-[#C8A97E]'
                          : 'bg-white/80 text-[#5D4037] border-[#D3B995]/30 hover:bg-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && (
                  <>
                    <span className="px-2 text-[#8D6C61]">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        currentPage === totalPages
                          ? 'bg-[#C8A97E] text-white border-[#C8A97E]'
                          : 'bg-white/80 text-[#5D4037] border-[#D3B995]/30 hover:bg-white'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/80 text-[#5D4037] rounded-lg border border-[#D3B995]/30 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyFavoritePage; 