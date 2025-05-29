"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { searchAlbums, Album } from '@/services/albumService';
import { searchArtists, Artist } from '@/services/artistService';
import { searchCategories, CategorySearchResponse } from '@/services/categoryService';
import { Category } from '@/interfaces/category';
import { searchGenres, Genre } from '@/services/genreService';
import { searchMusics, Music } from '@/services/musicService';
import { searchInstruments, Instrument } from '@/services/instrumentService';
import { searchOrchestrasByKeyword, Orchestra } from '@/services/orchestraService';

const SearchBar: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { isLoggedIn, userProfile } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [albumResults, setAlbumResults] = useState<Album[]>([]);
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [categoryResults, setCategoryResults] = useState<Category[]>([]);
  const [genreResults, setGenreResults] = useState<Genre[]>([]);
  const [musicResults, setMusicResults] = useState<Music[]>([]);
  const [instrumentResults, setInstrumentResults] = useState<Instrument[]>([]);
  const [orchestraResults, setOrchestraResults] = useState<Orchestra[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Tạo avatar từ fullname
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Function để viết hoa chữ cái đầu tiên
  const capitalizeFirstLetter = (text: string) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  // Handle search input change với capitalize chữ cái đầu
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const capitalizedValue = capitalizeFirstLetter(value);
    setSearchTerm(capitalizedValue);
  };

  // Function để clear search và navigate
  const clearSearchAndNavigate = (url: string) => {
    setSearchTerm("");
    setShowResults(false);
    setIsExpanded(false);
    setAlbumResults([]);
    setArtistResults([]);
    setCategoryResults([]);
    setGenreResults([]);
    setMusicResults([]);
    setInstrumentResults([]);
    setOrchestraResults([]);
    router.push(url);
  };

  // Function tìm kiếm albums, artists, categories, genres và musics với debounce
  const performSearch = useCallback(async (term: string) => {
    const trimmedTerm = term.trim();
    
    // Chỉ cần gõ ít nhất 2 ký tự để bắt đầu tìm kiếm
    if (trimmedTerm.length < 2) {
      setAlbumResults([]);
      setArtistResults([]);
      setCategoryResults([]);
      setGenreResults([]);
      setMusicResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      console.log('🔍 Searching with term:', trimmedTerm);
      
      // Tìm kiếm song song tất cả các loại nội dung - gửi term gốc có dấu lên API
      const [albumResponse, artistResponse, categoryResponse, genreResponse, musicResponse, instrumentResponse, orchestraResponse] = await Promise.all([
        searchAlbums(trimmedTerm, 6, 1),
        searchArtists(trimmedTerm, 6, 1),
        searchCategories(trimmedTerm, 6, 1),
        searchGenres(trimmedTerm, 6, 1),
        searchMusics(trimmedTerm, 6, 1),
        searchInstruments(trimmedTerm, 6, 1),
        searchOrchestrasByKeyword(trimmedTerm, 6, 1)
      ]);
      
      console.log('📀 Album API Response:', albumResponse);
      console.log('🎤 Artist API Response:', artistResponse);
      console.log('🏷️ Category API Response:', categoryResponse);
      console.log('🎵 Genre API Response:', genreResponse);
      console.log('🎼 Music API Response:', musicResponse);
      console.log('🎹 Instrument API Response:', instrumentResponse);
      console.log('🎻 Orchestra API Response:', orchestraResponse);
      
      // Parse album results - API trả về trong albumResponse.items
      const allAlbums = albumResponse?.items || [];
      console.log('📀 Albums from API:', allAlbums.length, allAlbums);
      
      // Parse artist results - API trả về trong artistResponse.data.items
      const allArtists = artistResponse?.data?.items || [];
      console.log('🎤 Artists from API:', allArtists.length, allArtists);
      
      // Parse category results - API trả về trong categoryResponse.data.items
      const allCategories = categoryResponse?.data?.items || [];
      console.log('🏷️ Categories from API:', allCategories.length, allCategories);
      
      // Parse genre results - API trả về trong genreResponse.data.items
      const allGenres = genreResponse?.data?.items || [];
      console.log('🎵 Genres from API:', allGenres.length, allGenres);
      
      // Parse music results - API trả về trong musicResponse.data.items
      const allMusics = musicResponse?.data?.items || [];
      console.log('🎼 Musics from API:', allMusics.length, allMusics);
      
      // Parse instrument results - API trả về trong instrumentResponse.data.items
      const allInstruments = instrumentResponse?.data?.items || [];
      console.log('🎹 Instruments from API:', allInstruments.length, allInstruments);
      
      // Parse orchestra results - API trả về trong orchestraResponse.data.items
      const allOrchestras = orchestraResponse?.data?.items || [];
      console.log('🎻 Orchestras from API:', allOrchestras.length, allOrchestras);
      
      // Giới hạn số lượng kết quả hiển thị để UI không quá dài
      const displayAlbums = allAlbums.slice(0, 3);
      const displayArtists = allArtists.slice(0, 3);
      const displayCategories = allCategories.slice(0, 3);
      const displayGenres = allGenres.slice(0, 3);
      const displayMusics = allMusics.slice(0, 4);
      const displayInstruments = allInstruments.slice(0, 3);
      const displayOrchestras = allOrchestras.slice(0, 3);
      
      console.log('✅ Final Albums:', displayAlbums.length, displayAlbums);
      console.log('✅ Final Artists:', displayArtists.length, displayArtists);
      console.log('✅ Final Categories:', displayCategories.length, displayCategories);
      console.log('✅ Final Genres:', displayGenres.length, displayGenres);
      console.log('✅ Final Musics:', displayMusics.length, displayMusics);
      console.log('✅ Final Instruments:', displayInstruments.length, displayInstruments);
      console.log('✅ Final Orchestras:', displayOrchestras.length, displayOrchestras);
      
      setAlbumResults(displayAlbums);
      setArtistResults(displayArtists);
      setCategoryResults(displayCategories);
      setGenreResults(displayGenres);
      setMusicResults(displayMusics);
      setInstrumentResults(displayInstruments);
      setOrchestraResults(displayOrchestras);
      setShowResults(true);
    } catch (error) {
      console.error('❌ Lỗi khi tìm kiếm:', error);
      setAlbumResults([]);
      setArtistResults([]);
      setCategoryResults([]);
      setGenreResults([]);
      setMusicResults([]);
      setInstrumentResults([]);
      setOrchestraResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search với useEffect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, performSearch]);

  // Clear search khi click clear button
  const handleClearSearch = () => {
    setSearchTerm("");
    setAlbumResults([]);
    setArtistResults([]);
    setCategoryResults([]);
    setGenreResults([]);
    setMusicResults([]);
    setInstrumentResults([]);
    setOrchestraResults([]);
    setShowResults(false);
  };

  const hasResults = albumResults.length > 0 || artistResults.length > 0 || categoryResults.length > 0 || genreResults.length > 0 || musicResults.length > 0 || instrumentResults.length > 0 || orchestraResults.length > 0;
  const hasNoResults = !hasResults && searchTerm && !isSearching;

  return (
    <div
      className={`sticky top-0 bg-[#F8F0E3] z-40 shadow-md transition-all duration-300 ${
        isExpanded ? "py-4" : "py-2"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className={`relative flex-1 mr-4`}>
            <div
              className={`flex items-center bg-[#E6D7C3] rounded-full overflow-hidden transition-all duration-300 ${
                isExpanded ? "pl-6 pr-4 py-3" : "pl-4 pr-2 py-2"
              }`}
            >
              <svg
                className={`w-5 h-5 text-[#6D4C41] transition-all ${
                  isExpanded ? "mr-3" : "mr-2"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm bài hát, album, nghệ sĩ, thể loại, nhạc cụ, dàn nhạc..."
                className={`bg-transparent border-none focus:outline-none flex-grow text-[#3A2A24] font-['Playfair_Display',serif] transition-all ${
                  isExpanded ? "text-base" : "text-sm"
                }`}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsExpanded(true)}
                onBlur={(e) => {
                  if (!e.relatedTarget?.closest('.search-results')) {
                    if (!searchTerm) setIsExpanded(false);
                    setTimeout(() => setShowResults(false), 200);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowResults(false);
                    setIsExpanded(false);
                    e.currentTarget.blur();
                  }
                  if (e.key === 'Enter' && albumResults.length > 0) {
                    // Nếu nhấn Enter và có kết quả album, chuyển đến album đầu tiên
                    clearSearchAndNavigate(`/album/${albumResults[0].id}`);
                  }
                }}
              />
              {isSearching && (
                <div className="mr-2">
                  <svg className="animate-spin h-4 w-4 text-[#6D4C41]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="p-1 rounded-full hover:bg-[#D3B995] transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-[#6D4C41]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
            
            {/* Search Results Dropdown */}
            {showResults && hasResults && (
              <div className="search-results absolute top-full left-0 right-0 mt-2 bg-[#F0E6D6] border border-[#D3B995] rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                
                {/* Albums Section */}
                {albumResults.length > 0 && (
                  <div>
                    <div className="p-3 border-b border-[#D3B995] bg-gradient-to-r from-[#E6D7C3] to-[#D3B995]">
                      <h3 className="text-sm font-semibold text-[#3A2A24] font-['Playfair_Display',serif] flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        Albums ({albumResults.length} kết quả)
                      </h3>
                    </div>
                    {albumResults.map((album) => (
                      <div
                        key={`album-${album.id}`}
                        className="flex items-center p-3 hover:bg-[#E6D7C3] transition-all duration-300 cursor-pointer border-b border-[#E6D7C3] group"
                        onClick={() => clearSearchAndNavigate(`/album/${album.id}`)}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 border-2 border-[#D3B995] group-hover:border-[#C8A97E] transition-colors">
                          <img
                            src={album.coverPhoto}
                            alt={album.name}
                            className="w-full h-full object-cover grayscale-[20%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-album.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#3A2A24] truncate font-['Playfair_Display',serif] group-hover:text-[#C8A97E] transition-colors">
                            {album.name}
                          </h4>
                          <p className="text-xs text-[#6D4C41] truncate mt-1">
                            {album.description || 'Không có mô tả'}
                          </p>
                          <div className="flex items-center text-xs text-[#8D6C61] mt-1">
                            <span className="bg-[#E6D7C3] px-2 py-1 rounded-full mr-2">{album.albumType || 'Album'}</span>
                            {album.viewCount && (
                              <>
                                <span>{album.viewCount} lượt xem</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Artists Section */}
                {artistResults.length > 0 && (
                  <div>
                    <div className="p-3 border-b border-[#D3B995] bg-gradient-to-r from-[#E6D7C3] to-[#D3B995]">
                      <h3 className="text-sm font-semibold text-[#3A2A24] font-['Playfair_Display',serif] flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Nghệ sĩ ({artistResults.length} kết quả)
                      </h3>
                    </div>
                    {artistResults.map((artist) => (
                      <div
                        key={`artist-${artist.id}`}
                        className="flex items-center p-3 hover:bg-[#E6D7C3] transition-all duration-300 cursor-pointer border-b border-[#E6D7C3] group"
                        onClick={() => clearSearchAndNavigate(`/artist/${artist.id}`)}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-[#D3B995] group-hover:border-[#C8A97E] transition-colors">
                          <img
                            src={artist.picture}
                            alt={artist.name}
                            className="w-full h-full object-cover grayscale-[20%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-artist.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#3A2A24] truncate font-['Playfair_Display',serif] group-hover:text-[#C8A97E] transition-colors">
                            {artist.name}
                          </h4>
                          <p className="text-xs text-[#6D4C41] truncate mt-1">
                            {artist.description || 'Nghệ sĩ'}
                          </p>
                          <div className="flex items-center text-xs text-[#8D6C61] mt-1">
                            <span className="bg-[#E6D7C3] px-2 py-1 rounded-full mr-2">{artist.nationality || 'Nghệ sĩ'}</span>
                            {artist.followers > 0 && (
                              <span>{artist.followers} người theo dõi</span>
                            )}
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Categories Section */}
                {categoryResults.length > 0 && (
                  <div>
                    <div className="p-3 border-b border-[#D3B995] bg-gradient-to-r from-[#E6D7C3] to-[#D3B995]">
                      <h3 className="text-sm font-semibold text-[#3A2A24] font-['Playfair_Display',serif] flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Thể loại ({categoryResults.length} kết quả)
                      </h3>
                    </div>
                    {categoryResults.map((category) => (
                      <div
                        key={`category-${category.id}`}
                        className="flex items-center p-3 hover:bg-[#E6D7C3] transition-all duration-300 cursor-pointer border-b border-[#E6D7C3] group"
                        onClick={() => clearSearchAndNavigate(`/user-category/${category.id}`)}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 border-2 border-[#D3B995] group-hover:border-[#C8A97E] transition-colors">
                          <img
                            src={category.picture}
                            alt={category.name}
                            className="w-full h-full object-cover grayscale-[20%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-category.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#3A2A24] truncate font-['Playfair_Display',serif] group-hover:text-[#C8A97E] transition-colors">
                            {category.name}
                          </h4>
                          <p className="text-xs text-[#6D4C41] truncate mt-1">
                            {category.description || 'Thể loại'}
                          </p>
                          <div className="flex items-center text-xs text-[#8D6C61] mt-1">
                            <span className="bg-[#E6D7C3] px-2 py-1 rounded-full mr-2">{category.totalMusics || 0} bài hát</span>
                            {category.viewCount && (
                              <span>{category.viewCount} lượt xem</span>
                            )}
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Genres Section */}
                {genreResults.length > 0 && (
                  <div>
                    <div className="p-3 border-b border-[#D3B995] bg-gradient-to-r from-[#E6D7C3] to-[#D3B995]">
                      <h3 className="text-sm font-semibold text-[#3A2A24] font-['Playfair_Display',serif] flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        Phong cách ({genreResults.length} kết quả)
                      </h3>
                    </div>
                    {genreResults.map((genre) => (
                      <div
                        key={`genre-${genre.id}`}
                        className="flex items-center p-3 hover:bg-[#E6D7C3] transition-all duration-300 cursor-pointer border-b border-[#E6D7C3] group"
                        onClick={() => clearSearchAndNavigate(`/user-categories`)}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 border-2 border-[#D3B995] group-hover:border-[#C8A97E] transition-colors">
                          <img
                            src={genre.picture}
                            alt={genre.name}
                            className="w-full h-full object-cover grayscale-[20%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-genre.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#3A2A24] truncate font-['Playfair_Display',serif] group-hover:text-[#C8A97E] transition-colors">
                            {genre.name}
                          </h4>
                          <p className="text-xs text-[#6D4C41] truncate mt-1">
                            {genre.description || 'Thể loại nhạc'}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Musics Section */}
                {musicResults.length > 0 && (
                  <div>
                    <div className="p-3 border-b border-[#D3B995] bg-gradient-to-r from-[#E6D7C3] to-[#D3B995]">
                      <h3 className="text-sm font-semibold text-[#3A2A24] font-['Playfair_Display',serif] flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        Bài hát ({musicResults.length} kết quả)
                      </h3>
                    </div>
                    {musicResults.map((music) => (
                      <div
                        key={`music-${music.id}`}
                        className="flex items-center p-3 hover:bg-[#E6D7C3] transition-all duration-300 cursor-pointer border-b border-[#E6D7C3] group"
                        onClick={() => clearSearchAndNavigate(`/music/${music.id}`)}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 border-2 border-[#D3B995] group-hover:border-[#C8A97E] transition-colors">
                          <img
                            src={music.coverPhoto || '/default-music.jpg'}
                            alt={music.name}
                            className="w-full h-full object-cover grayscale-[20%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-music.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#3A2A24] truncate font-['Playfair_Display',serif] group-hover:text-[#C8A97E] transition-colors">
                            {music.name}
                          </h4>
                          <p className="text-xs text-[#6D4C41] truncate mt-1">
                            {music.artists.length > 0 ? music.artists[0].name : 'Bài hát'}
                          </p>
                          <div className="flex items-center text-xs text-[#8D6C61] mt-1">
                            <span className="bg-[#E6D7C3] px-2 py-1 rounded-full mr-2">{music.listenCount} lượt nghe</span>
                            {music.favoriteCount > 0 && (
                              <span>{music.favoriteCount} yêu thích</span>
                            )}
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                {albumResults.length > 0 && (
                  <div className="p-3 border-t border-[#D3B995] bg-[#E6D7C3]">
                    <button
                      onClick={() => clearSearchAndNavigate('/user-albums')}
                      className="w-full text-center text-sm text-[#6D4C41] hover:text-[#C8A97E] transition-colors font-['Playfair_Display',serif] font-medium"
                    >
                      Xem tất cả album →
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* No Results Message */}
            {showResults && hasNoResults && (
              <div className="search-results absolute top-full left-0 right-0 mt-2 bg-[#F0E6D6] border border-[#D3B995] rounded-lg shadow-lg z-50">
                <div className="p-6 text-center">
                  <svg className="w-16 h-16 text-[#8D6C61] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12M6 20.291A7.962 7.962 0 016 12m0 8.291zm12 0z"></path>
                  </svg>
                  <h3 className="text-lg font-semibold text-[#3A2A24] mb-2 font-['Playfair_Display',serif]">Không tìm thấy kết quả</h3>
                  <p className="text-sm text-[#6D4C41] font-['Playfair_Display',serif] mb-4">
                    Không tìm thấy bài hát, album, nghệ sĩ, thể loại, nhạc cụ hoặc dàn nhạc nào với từ khóa "{searchTerm}"
                  </p>
                  <button
                    onClick={() => clearSearchAndNavigate('/user-albums')}
                    className="px-4 py-2 bg-[#C8A97E] hover:bg-[#A67C52] text-white rounded-full font-semibold transition-colors shadow-md"
                  >
                    Khám phá album
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* User Authentication UI */}
          {!isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <a 
                href="/user-login"
                className="text-[#3A2A24] hover:text-[#C8A97E] transition-colors px-3 py-1.5 text-sm font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Đăng nhập
              </a>
              <a
                href="/user-register"
                className="bg-[#C8A97E] hover:bg-[#A67C52] text-white transition-colors rounded-full px-5 py-1.5 text-sm font-medium shadow-md hover:shadow-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Đăng ký
              </a>
            </div>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)} 
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C8A97E] to-[#A67C52] flex items-center justify-center text-white font-semibold">
                  {userProfile?.fullname ? getInitials(userProfile.fullname) : 'U'}
                </div>
                <span className="text-[#3A2A24] text-sm font-medium hidden md:block">
                  {userProfile?.fullname || userProfile?.username || 'User'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6D4C41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#F0E6D6] border border-[#D3B995] rounded-lg shadow-lg py-2 z-50">
                  <a 
                    href="/user-profile" 
                    className="block px-4 py-2 text-[#3A2A24] hover:bg-[#E6D7C3] hover:text-[#6D4C41] transition-colors"
                  >
                    Hồ sơ cá nhân
                  </a>
                  <hr className="my-1 border-[#D3B995]" />
                  <button 
                    onClick={() => {
                      localStorage.removeItem('accessToken');
                      localStorage.removeItem('userId');
                      window.location.href = '/user-login';
                    }}
                    className="block w-full text-left px-4 py-2 text-[#3A2A24] hover:bg-[#E6D7C3] hover:text-[#6D4C41] transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 