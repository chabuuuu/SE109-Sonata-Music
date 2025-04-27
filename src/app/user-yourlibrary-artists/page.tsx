"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';


// Sample data for artists
const artistsData = [
  {
    id: 1,
    name: "Taylor Swift",
    category: "Pop",
    followers: "82.5M",
    image: "/artists/taylor-swift.jpg",
    background: "/backgrounds/taylor-swift-bg.jpg",
    topSongs: ["Anti-Hero", "Cruel Summer", "Lover"],
    featured: true
  },
  {
    id: 2,
    name: "The Weeknd",
    category: "R&B & Soul",
    followers: "65.7M",
    image: "/artists/the-weeknd.jpg",
    topSongs: ["Blinding Lights", "Save Your Tears", "Starboy"]
  },
  {
    id: 3,
    name: "Billie Eilish",
    category: "Alternative",
    followers: "49.2M",
    image: "/artists/billie-eilish.jpg",
    topSongs: ["Bad Guy", "Happier Than Ever", "Everything I Wanted"]
  },
  {
    id: 4,
    name: "Drake",
    category: "Hip-Hop",
    followers: "75.3M",
    image: "/artists/drake.jpg",
    topSongs: ["God's Plan", "Hotline Bling", "One Dance"]
  },
  {
    id: 5,
    name: "BTS",
    category: "K-Pop",
    followers: "69.8M",
    image: "/artists/bts.jpg",
    topSongs: ["Dynamite", "Butter", "Boy With Luv"]
  },
  {
    id: 6,
    name: "Dua Lipa",
    category: "Pop",
    followers: "43.9M",
    image: "/artists/dua-lipa.jpg",
    topSongs: ["Levitating", "Don't Start Now", "New Rules"]
  },
  {
    id: 7,
    name: "Bad Bunny",
    category: "Reggaeton",
    followers: "58.2M",
    image: "/artists/bad-bunny.jpg",
    topSongs: ["Dakiti", "Yo Perreo Sola", "Callaita"]
  },
  {
    id: 8,
    name: "Ariana Grande",
    category: "Pop",
    followers: "72.1M",
    image: "/artists/ariana-grande.jpg",
    topSongs: ["7 Rings", "Positions", "Thank U, Next"]
  },
  {
    id: 9,
    name: "Ed Sheeran",
    category: "Pop",
    followers: "89.4M",
    image: "/artists/ed-sheeran.jpg",
    topSongs: ["Shape of You", "Perfect", "Bad Habits"]
  },
  {
    id: 10,
    name: "Olivia Rodrigo",
    category: "Pop",
    followers: "36.8M",
    image: "/artists/olivia-rodrigo.jpg",
    topSongs: ["Drivers License", "Good 4 U", "Deja Vu"]
  },
  {
    id: 11,
    name: "Post Malone",
    category: "Hip-Hop",
    followers: "45.6M",
    image: "/artists/post-malone.jpg",
    topSongs: ["Circles", "Rockstar", "Sunflower"]
  },
  {
    id: 12,
    name: "Kendrick Lamar",
    category: "Hip-Hop",
    followers: "38.9M",
    image: "/artists/kendrick-lamar.jpg",
    topSongs: ["Humble", "DNA", "Alright"]
  }
];

// Categories for filtering
const musicCategories = [
  "All", "Pop", "Hip-Hop", "R&B & Soul", "Rock", "Alternative", "Electronic", 
  "K-Pop", "Latin", "Reggaeton", "Classical", "Jazz", "Folk & Acoustic"
];

// Navigation categories
const categories = ["Playlists", "Artists", "Albums"];

const ArtistsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Artists");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedMusicCategory, setSelectedMusicCategory] = useState("All");
  const [currentProgress, setCurrentProgress] = useState(50); // For the progress bar, 0-100

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Filter artists based on selected music category
  const filteredArtists = selectedMusicCategory === "All" 
    ? artistsData 
    : artistsData.filter(artist => artist.category === selectedMusicCategory);

  // Get featured artist
  const featuredArtist = artistsData.find(artist => artist.featured) || artistsData[0];

  return (
    <div className="flex h-screen bg-white text-black relative">
      {/* Left sidebar - Navbar component */}
      <Navbar />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pb-20">
        {/* Top navigation bar */}
        <div className="sticky top-0 bg-gradient-to-b from-[#39639D] to-[#2D5484] bg-opacity-95 backdrop-blur-sm z-10 px-8 py-4 flex justify-between items-center">
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
          <h1 className="text-3xl font-bold mb-6 text-black">Artists</h1>

          {/* Featured artist banner */}
          <div className="mb-8 rounded-xl overflow-hidden">
            <div 
              className="h-64 relative bg-cover bg-center"
              style={{ backgroundImage: `url(${featuredArtist.background || featuredArtist.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
                <div className="mr-6">
                  <img 
                    src={featuredArtist.image} 
                    alt={featuredArtist.name} 
                    className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-white mb-2">{featuredArtist.name}</h2>
                  <p className="text-gray-300 mb-2">{featuredArtist.category} • {featuredArtist.followers} followers</p>
                  <div className="flex space-x-3">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-full px-8 py-2">
                      Play
                    </button>
                    <button className="border border-white text-white font-medium rounded-full px-8 py-2 hover:bg-white hover:bg-opacity-10">
                      Follow
                    </button>
                    <button className="text-white rounded-full p-2 hover:bg-white hover:bg-opacity-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Popular songs section */}
            <div className="bg-gray-100 p-6">
              <h3 className="text-xl font-bold mb-4">Popular</h3>
              <div className="space-y-2">
                {featuredArtist.topSongs.map((song, index) => (
                  <div key={index} className="flex items-center p-2 hover:bg-gray-200 rounded-md group">
                    <div className="w-8 text-gray-500 text-center">{index + 1}</div>
                    <div className="w-12 h-12 bg-gray-300 rounded mx-3 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium">{song}</p>
                      <p className="text-sm text-gray-500">Song • {featuredArtist.name}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-gray-600 hover:text-black p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-gray-700 font-medium hover:text-black">
                See more
              </button>
            </div>
          </div>

          {/* Categories filter */}
          <div className="mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <div className="inline-flex space-x-2">
              {musicCategories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-1 rounded-full text-sm ${
                    selectedMusicCategory === category
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={() => setSelectedMusicCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Artists Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            {filteredArtists.map(artist => (
              <div key={artist.id} className="group">
                <div className="rounded-full overflow-hidden mb-4 relative aspect-square bg-gray-200 shadow-md">
                  <img 
                    src={artist.image}
                    alt={artist.name}
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
                <h3 className="font-bold text-center mb-1">{artist.name}</h3>
                <p className="text-sm text-gray-600 text-center">{artist.category}</p>
              </div>
            ))}
          </div>

          {/* Recommended artists section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Fans also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {artistsData.slice(3, 9).map(artist => (
                <div key={artist.id} className="group">
                  <div className="rounded-full overflow-hidden mb-3 relative aspect-square bg-gray-200">
                    <img 
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-green-500 rounded-full p-2 text-white shadow-lg transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm text-center">{artist.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Player bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 h-20 z-40 flex items-center px-4">
        <div className="flex items-center w-1/4">
          <img src="/podcast-thumbnail.jpg" alt="Current playing" className="h-14 w-14 mr-3" />
          <div>
            <p className="text-sm font-medium text-white">Competing with giants: An inside look at how Tinder...</p>
            <p className="text-xs text-gray-400">Lenny's Podcast: Product | Growth | Career</p>
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
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
              <path d="M10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          <div className="w-20 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
            </svg>
            <div className="flex-1 h-1 bg-gray-700 rounded-full mx-1">
              <div className="h-1 bg-gray-300 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707A1 1 0 0110 3zm7.707 3.293a1 1 0 010 1.414L16.414 9l1.293 1.293a1 1 0 01-1.414 1.414L15 10.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 9l-1.293-1.293a1 1 0 011.414-1.414L15 7.586l1.293-1.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistsPage;