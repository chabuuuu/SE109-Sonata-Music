"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
// Sample data for albums
const albumsData = [
  {
    id: 1,
    title: "Midnights",
    artist: "Taylor Swift",
    releaseYear: 2022,
    image: "/albums/midnights.jpg",
    tracks: 13,
    duration: "44 min",
    genres: ["Pop", "Synth-pop"],
    featured: true,
    background: "/backgrounds/midnights-bg.jpg"
  },
  {
    id: 2,
    title: "Un Verano Sin Ti",
    artist: "Bad Bunny",
    releaseYear: 2022,
    image: "/albums/un-verano-sin-ti.jpg",
    tracks: 23,
    duration: "1 hr 21 min",
    genres: ["Reggaeton", "Latin"],
    featured: false
  },
  {
    id: 3,
    title: "SOS",
    artist: "SZA",
    releaseYear: 2022,
    image: "/albums/sos.jpg",
    tracks: 23,
    duration: "1 hr 8 min",
    genres: ["R&B", "Neo Soul"],
    featured: false
  },
  {
    id: 4,
    title: "Renaissance",
    artist: "Beyoncé",
    releaseYear: 2022,
    image: "/albums/renaissance.jpg",
    tracks: 16,
    duration: "1 hr 2 min",
    genres: ["Dance", "Pop", "R&B"],
    featured: false
  }
];

// Shortened data for simplicity in this example
const albumFilters = ["All Albums", "Recent Releases", "Pop", "Hip-Hop", "R&B"];

const browseCategories = [
  { name: "Recently Added", color: "from-purple-500 to-indigo-700" },
  { name: "New Releases", color: "from-red-500 to-pink-700" },
  { name: "Trending Now", color: "from-yellow-500 to-orange-700" }
];

const categories = ["Playlists", "Artists", "Albums"];

// Search component
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  return (
    <div className="relative z-20">
      <div className="relative">
        <div className={`flex items-center bg-[#1D3A63] rounded-full text-white overflow-hidden transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-white ring-opacity-50' : ''}`}>
          <svg 
            className="w-5 h-5 text-white ml-3 opacity-70" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm albums, nghệ sĩ hoặc bài hát..."
            className="bg-transparent border-none focus:outline-none text-sm py-2 px-3 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="mr-3 p-1 rounded-full hover:bg-[#2D5484] transition-colors"
            >
              <svg className="w-4 h-4 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>
        
        {/* Search suggestions */}
        {isSearchFocused && searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#2D5484] rounded-md shadow-xl border border-[#39639D] overflow-hidden">
            <div className="p-3">
              <h3 className="text-xs text-white text-opacity-70 uppercase font-semibold mb-2">Kết quả tìm kiếm</h3>
              
              <div className="space-y-1">
                {/* Album results */}
                {albumsData
                  .filter(album => album.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  album.artist.toLowerCase().includes(searchTerm.toLowerCase()))
                  .slice(0, 3)
                  .map(album => (
                    <div key={album.id} className="flex items-center p-2 hover:bg-[#39639D] rounded cursor-pointer">
                      <img src={album.image} alt={album.title} className="w-10 h-10 rounded mr-3" />
                      <div>
                        <p className="text-white text-sm font-medium">{album.title}</p>
                        <p className="text-white text-opacity-70 text-xs">Album • {album.artist}</p>
                      </div>
                    </div>
                  ))}
                  
                {/* No results message */}
                {albumsData.filter(album => 
                  album.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  album.artist.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <p className="text-white text-opacity-70 text-sm p-2">Không tìm thấy kết quả phù hợp</p>
                )}
              </div>
              
              <div className="mt-2 pt-2 border-t border-[#39639D]">
                <button className="text-xs text-white text-opacity-80 hover:text-opacity-100 px-2 py-1">
                  Xem tất cả kết quả cho "{searchTerm}"
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AlbumsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Albums");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Albums");
  const [currentProgress, setCurrentProgress] = useState(50);
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [activeView, setActiveView] = useState("grid");

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Filter albums based on selected filter
  const filteredAlbums = selectedFilter === "All Albums" 
    ? albumsData 
    : selectedFilter === "Recent Releases"
      ? albumsData.filter(album => album.releaseYear >= 2022)
      : albumsData.filter(album => 
          album.genres.some(genre => genre === selectedFilter)
        );

  // Get featured album
  const featuredAlbum = albumsData.find(album => album.featured) || albumsData[0];

  return (
    <div className="flex h-screen bg-white text-black relative">
      {/* Left sidebar - Navbar component */}
      <Navbar />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pb-20">
        {/* Search Bar - Added above the navigation bar */}
        <div className="bg-[#39639D] px-8 py-3 sticky top-0 z-30">
          <SearchBar />
        </div>
        
        {/* Top navigation bar */}
        <div className="sticky top-12 bg-gradient-to-b from-[#39639D] to-[#2D5484] bg-opacity-95 backdrop-blur-sm z-20 px-8 py-4 flex justify-between items-center">
          {/* Back/Forward buttons */}
          <div className="flex items-center">
            <button className="bg-black bg-opacity-30 text-white rounded-full p-1 mr-2 hover:bg-opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="bg-black bg-opacity-30 text-white rounded-full p-1 hover:bg-opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Category tabs */}
            <div className="ml-8 flex space-x-4">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    selectedCategory === category
                      ? "bg-black bg-opacity-30"
                      : "hover:bg-black hover:bg-opacity-20"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* View toggle buttons */}
          <div className="flex items-center mr-4">
            <div className="bg-black bg-opacity-20 rounded-lg p-1 flex">
              <button 
                className={`p-2 rounded ${activeView === 'grid' ? 'bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveView('grid')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                className={`p-2 rounded ${activeView === 'list' ? 'bg-white bg-opacity-20' : ''}`}
                onClick={() => setActiveView('list')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* User profile with dropdown */}
          <div className="relative">
            <button 
              className="bg-black bg-opacity-30 rounded-full p-1 flex items-center text-sm font-medium text-white"
              onClick={toggleProfileMenu}
            >
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2">
                <span>RB</span>
              </div>
              <span className="mr-2">Rajarshi B</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Profile dropdown menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <div className="border-t border-gray-200 my-1"></div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Log out</a>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="px-8 pt-4">
          <h1 className="text-3xl font-bold mb-6 text-black">Albums</h1>

          {/* Featured album banner */}
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <div 
              className="h-72 relative bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${featuredAlbum.background || featuredAlbum.image})`,
                backgroundSize: 'cover'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70"></div>
              <div className="absolute inset-0 p-8 flex items-center">
                <div className="mr-8">
                  <img 
                    src={featuredAlbum.image} 
                    alt={featuredAlbum.title} 
                    className="w-56 h-56 shadow-xl rounded-md"
                  />
                </div>
                <div className="flex-1 text-white">
                  <p className="text-sm uppercase font-semibold mb-2">Featured Album</p>
                  <h2 className="text-5xl font-bold mb-2">{featuredAlbum.title}</h2>
                  <p className="text-2xl opacity-80 mb-4">{featuredAlbum.artist}</p>
                  <p className="mb-6">
                    {featuredAlbum.releaseYear} • {featuredAlbum.tracks} songs, {featuredAlbum.duration}
                  </p>
                  <div className="flex space-x-4">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-full px-8 py-3">
                      Play
                    </button>
                    <button className="border border-white text-white font-medium rounded-full px-8 py-3 hover:bg-white hover:bg-opacity-10">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Browse Categories */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
            <div className="grid grid-cols-3 gap-4">
              {browseCategories.map((category, index) => (
                <div 
                  key={index} 
                  className={`bg-gradient-to-r ${category.color} h-24 rounded-xl p-5 text-white cursor-pointer hover:shadow-lg transition-shadow`}
                >
                  <h3 className="text-xl font-bold">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Albums filter */}
          <div className="flex justify-between items-center mb-6">
            <div className="overflow-x-auto whitespace-nowrap pb-2">
              <div className="inline-flex space-x-2">
                {albumFilters.map(filter => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-full text-sm ${
                      selectedFilter === filter
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Albums Grid View */}
          {activeView === 'grid' && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
              {filteredAlbums.map(album => (
                <div key={album.id} className="group">
                  <div className="mb-4 relative bg-gray-100 rounded-md shadow-md overflow-hidden aspect-square">
                    <img 
                      src={album.image}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-green-500 rounded-full p-3 text-white shadow-lg transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold mb-1 truncate">{album.title}</h3>
                  <p className="text-sm text-gray-600">{album.artist}</p>
                </div>
              ))}
            </div>
          )}

          {/* Albums List View */}
          {activeView === 'list' && (
            <div className="mb-8">
              <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-600 font-medium grid grid-cols-12 mb-2">
                <div className="col-span-1">#</div>
                <div className="col-span-6">TITLE</div>
                <div className="col-span-3">GENRE</div>
                <div className="col-span-2 text-right">DURATION</div>
              </div>
              
              {filteredAlbums.map((album, index) => (
                <div 
                  key={album.id} 
                  className={`px-4 py-3 grid grid-cols-12 items-center hover:bg-gray-100 rounded-md cursor-pointer ${
                    expandedAlbum === album.id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setExpandedAlbum(expandedAlbum === album.id ? null : album.id)}
                >
                  <div className="col-span-1 text-gray-500">{index + 1}</div>
                  <div className="col-span-6 flex items-center">
                    <img src={album.image} alt={album.title} className="w-12 h-12 mr-4 rounded" />
                    <div>
                      <h3 className="font-medium">{album.title}</h3>
                      <p className="text-sm text-gray-600">{album.artist}</p>
                    </div>
                  </div>
                  <div className="col-span-3 text-gray-600">
                    {album.genres.join(', ')}
                  </div>
                  <div className="col-span-2 text-right text-gray-600">
                    {album.duration}
                  </div>
                  
                  {/* Expanded album details */}
                  {expandedAlbum === album.id && (
                    <div className="col-span-12 mt-4 bg-white rounded-lg p-4 shadow-md">
                      <div className="flex">
                        <img src={album.image} alt={album.title} className="w-40 h-40 rounded-md" />
                        <div className="ml-6">
                          <h3 className="text-xl font-bold mb-2">{album.title}</h3>
                          <p className="text-gray-700 mb-1">By {album.artist}</p>
                          <p className="text-gray-600 mb-1">Released: {album.releaseYear}</p>
                          <p className="text-gray-600 mb-1">{album.tracks} tracks • {album.duration}</p>
                          <p className="text-gray-600 mb-4">Genres: {album.genres.join(', ')}</p>
                          <div className="flex space-x-3">
                            <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
                              Play
                            </button>
                            <button className="border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100">
                              Save to Library
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Player bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 h-20 z-40 flex items-center px-4">
        <div className="flex items-center w-1/4">
          <img src="/podcast-thumbnail.jpg" alt="Current playing" className="h-14 w-14 mr-3" />
          <div>
            <p className="text-sm font-medium text-white">Competing with giants</p>
            <p className="text-xs text-gray-400">Lenny's Podcast</p>
          </div>
        </div>
        
        <div className="w-2/4 flex flex-col items-center">
          <div className="flex items-center mb-1 space-x-4">
            <button className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M14.8 10a2 2 0 0 0-.6-1.4l-4-4a2 2 0 0 0-2.8 2.8L9.2 10l-2.8 2.8a2 2 0 0 0 2.8 2.8l4-4A2 2 0 0 0 14.8 10z" transform="rotate(180 10 10)" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="bg-white rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M14.8 10a2 2 0 0 0-.6-1.4l-4-4a2 2 0 0 0-2.8 2.8L9.2 10l-2.8 2.8a2 2 0 0 0 2.8 2.8l4-4A2 2 0 0 0 14.8 10z" />
              </svg>
            </button>
          </div>
          
          <div className="w-full flex items-center">
            <span className="text-xs text-gray-400 mr-2">0:53</span>
            <div className="flex-1 h-1 bg-gray-700 rounded-full">
              <div 
                className="h-1 bg-gray-300 rounded-full"
                style={{ width: `${currentProgress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400 ml-2">1:28:37</span>
          </div>
        </div>
        
        <div className="w-1/4 flex justify-end items-center space-x-3">
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              <path d="M14 4h-4v10h4a2 2 0 002-2V6a2 2 0 00-2-2z" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a1 1 0 011-1h8a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V4z" />
            </svg>
          </button>
          <div className="w-20 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
            </svg>
            <div className="flex-1 h-1 bg-gray-700 rounded-full mx-1">
              <div className="h-1 bg-gray-300 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}