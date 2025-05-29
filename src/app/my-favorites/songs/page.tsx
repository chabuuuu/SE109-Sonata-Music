"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Play, MoreHorizontal, Clock, Calendar, Headphones, X } from 'lucide-react';
import { getFavoriteList, removeFromFavorite, FavoriteMusic, favoriteEvents } from '@/services/favoriteService';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { toast } from 'react-hot-toast';

const FavoriteSongs: React.FC = () => {
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
    );
  }

  return (
    <div>
      {/* Header Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#2D1B14] font-['Playfair_Display',serif]">
              Favorite Songs
            </h2>
            <p className="text-[#5D4037]">
              {totalCount} bài hát yêu thích
            </p>
          </div>
          
          {/* Play All Button */}
          {favoriteMusics.length > 0 && (
            <button 
              onClick={() => favoriteMusics.length > 0 && handlePlayMusic(favoriteMusics[0].musicId)}
              className="flex items-center gap-3 bg-[#C8A97E] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#A67C52] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Play className="w-5 h-5 fill-white" />
              Phát tất cả
            </button>
          )}
        </div>
      </div>

      {/* Music List */}
      {favoriteMusics.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-[#C8A97E] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-[#2D1B14] mb-2 font-['Playfair_Display',serif]">
            Chưa có bài hát yêu thích
          </h3>
          <p className="text-[#5D4037] mb-6">
            Hãy khám phá và thêm những bài hát bạn yêu thích vào đây
          </p>
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
                        (e.target as HTMLImageElement).src = '/default-song.jpg';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[#2D1B14] truncate group-hover:text-[#C8A97E] transition-colors">
                        {item.music.name}
                      </h3>
                      <p className="text-sm text-[#5D4037] truncate">
                        {item.music.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}
                      </p>
                    </div>
                  </div>

                  {/* Genre */}
                  <div className="col-span-2">
                    <span className="text-sm text-[#6D4C41]">
                      {item.music.genres?.map(genre => genre.name).join(', ') || 'Không rõ'}
                    </span>
                  </div>

                  {/* Date Added */}
                  <div className="col-span-2">
                    <span className="text-sm text-[#6D4C41]">
                      {formatDate(item.createAt)}
                    </span>
                  </div>

                  {/* Listen Count */}
                  <div className="col-span-1 text-center">
                    <span className="text-sm text-[#6D4C41]">
                      {item.music.genres?.length || 0} thể loại
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => handleRemoveFromFavorite(item.musicId)}
                      disabled={removeLoading === item.musicId}
                      className="w-8 h-8 text-[#8D6C61] hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Xóa khỏi yêu thích"
                    >
                      {removeLoading === item.musicId ? (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-[#5D4037] hover:text-[#C8A97E] disabled:opacity-50 disabled:hover:text-[#5D4037] transition-colors"
              >
                ← Trước
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-[#C8A97E] text-white'
                          : 'text-[#5D4037] hover:bg-[#E6D7C3]'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-[#5D4037] hover:text-[#C8A97E] disabled:opacity-50 disabled:hover:text-[#5D4037] transition-colors"
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FavoriteSongs; 