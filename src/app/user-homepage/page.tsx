"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import BottomBanner from '@/components/bottom_banner';


// Featured artist data for rotation
const featuredArtists = [
  {
    id: 1,
    name: "Mozart",
    years: "(1756 - 1791)",
    description: "Mozart was a child prodigy who amazed royal European courts. He composed over 600 works across many musical genres. His operas combined drama, humor, and brilliant musical composition.",
    image: "/artists/mozart-portrait.png",
    famousPieces: [
      "Requiem in D Minor, K. 626",
      "The Magic Flute",
      "Symphony No. 40 in G Minor"
    ]
  },
  {
    id: 2,
    name: "Beethoven",
    years: "(1770 - 1827)",
    description: "Beethoven was a German composer and pianist whose music bridged the Classical and Romantic eras. He is considered one of the most influential composers of all time.",
    image: "/artists/beethoven-portrait.png",
    famousPieces: [
      "Symphony No. 9 in D Minor",
      "Moonlight Sonata",
      "Für Elise"
    ]
  },
  {
    id: 3,
    name: "Bach",
    years: "(1685 - 1750)",
    description: "Bach was a German composer and musician of the Baroque period known for his instrumental compositions, keyboard works, and vocal music.",
    image: "/artists/bach-portrait.png",
    famousPieces: [
      "Brandenburg Concertos",
      "The Well-Tempered Clavier",
      "Mass in B Minor"
    ]
  }
];

// Background images for random rotation
const backgroundImages = [
  "/backgrounds/music-background-1.jpg",
  "/backgrounds/music-background-2.jpg",
  "/backgrounds/music-background-3.jpg",
  "/backgrounds/music-background-4.jpg",
  "/backgrounds/music-background-5.jpg"
];

// Playlists data
const playlistData = [
  {
    title: "Peaceful Piano",
    description: "Relax and indulge with beautiful piano pieces",
    image: "/playlist_imgs/peaceful_piano.jpg"
  },
  {
    title: "Deep Focus",
    description: "Keep calm and focus with ambient and post-",
    image: "/playlist_imgs/deep_focus.jpg"
  },
  {
    title: "Instrumental Study",
    description: "Focus with soft study music in the background",
    image: "/playlist_imgs/instrumental_study.jpg"
  },
  {
    title: "Jazz Vibes",
    description: "The original chill instrumental beats playlist",
    image: "/playlist_imgs/jazz_vibes.jpg"
  },
  {
    title: "Focus Flow",
    description: "Uptempo instrumental hip hop beats",
    image: "/playlist_imgs/focus_flow.jpg"
  }
];

// Podcast data
const podcastData = [
  {
    title: "Every Parent's Nightmare",
    image: "/podcast_imgs/the_letter.jpg",
    date: "Sep 2022",
    duration: "35 Min"
  },
  {
    title: "How the Pell Grant helped",
    image: "/podcast_imgs/pell_grant.jpg",
    date: "Sep 2022",
    duration: "29 Min"
  },
  {
    title: "After 10 Years",
    image: "/podcast_imgs/love_in_gravity.jpg",
    date: "Jul 2022",
    duration: "52 Min"
  },
  {
    title: "Book Exploder: Min Jin Le",
    image: "/podcast_imgs/min_jin_le.jpg",
    date: "Aug 2022",
    duration: "20 Min"
  },
  {
    title: "Healing Through Music w/",
    image: "/podcast_imgs/gift_of_failure.jpg",
    date: "Aug 2022",
    duration: "56 Min"
  }
];

// Reusable section component
const ContentSection = ({ title, children }) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-black">{title}</h2>
      <a href="#" className="text-sm text-gray-600">Show all &rsaquo;</a>
    </div>
    <div className="grid grid-cols-5 gap-4">
      {children}
    </div>
  </div>
);

// Reusable playlist card component
const PlaylistCard = ({ title, description, image }) => {
  return (
    <div className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all">
      <div className="relative mb-4 rounded-md overflow-hidden">
        <img src={image} alt={title} className="w-full aspect-square object-cover" />
        <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity shadow-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-black">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>
      </div>
      <h3 className="font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};

// Reusable podcast card component
const PodcastCard = ({ title, image, date, duration }) => {
  return (
    <div className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all">
      <div className="relative mb-4 rounded-md overflow-hidden">
        <img src={image} alt={title} className="w-full aspect-square object-cover" />
        <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity shadow-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-black">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>
      </div>
      <h3 className="font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{date} • {duration}</p>
    </div>
  );
};

// Search component
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleFocus = () => {
    setIsExpanded(true);
  };
  
  const handleBlur = () => {
    if (!searchTerm) {
      setIsExpanded(false);
    }
  };
  
  return (
    <div className={`sticky top-0 bg-white z-40 shadow-md transition-all duration-300 ${isExpanded ? 'py-4' : 'py-2'}`}>
      <div className="container mx-auto px-6">
        <div className="relative">
          <div className={`flex items-center bg-gray-100 rounded-full overflow-hidden transition-all duration-300 ${isExpanded ? 'pl-6 pr-4 py-3' : 'pl-4 pr-2 py-2'}`}>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-all ${isExpanded ? 'mr-3' : 'mr-2'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="-5 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm bài hát, nghệ sĩ, album..."
              className={`bg-transparent border-none focus:outline-none flex-grow transition-all text-black ${isExpanded ? 'text-base' : 'text-sm'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
          
          {/* Suggestions panel - only shows when expanded and has search term */}
          {isExpanded && searchTerm && (
            <div className="absolute top-full left-0 right-0 bg-white mt-2 rounded-lg shadow-xl border border-gray-200 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Đề xuất tìm kiếm</h3>
                <div className="space-y-2">
                  <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                      </svg>
                    </div>
                    <span className="text-black">{searchTerm} - Bài hát</span>
                  </div>
                  <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <span className="text-black">Nghệ sĩ với tên "{searchTerm}"</span>
                  </div>
                  <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                    </div>
                    <span className="text-black">Album chứa "{searchTerm}"</span>
                  </div>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:underline">Xem tất cả kết quả cho "{searchTerm}"</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const currentArtist = featuredArtists[currentArtistIndex];
  const currentBackground = backgroundImages[currentBackgroundIndex];

  // Auto-rotate featured artist every 10 seconds
  useEffect(() => {
    const artistInterval = setInterval(() => {
      setCurrentArtistIndex((prevIndex) => 
        (prevIndex + 1) % featuredArtists.length
      );
    }, 10000);
    
    return () => clearInterval(artistInterval);
  }, []);
  
  // Auto-rotate background image every 15 seconds
  useEffect(() => {
    const backgroundInterval = setInterval(() => {
      setCurrentBackgroundIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 15000);
    
    return () => clearInterval(backgroundInterval);
  }, []);
  
  // Function to manually change the featured artist
  const changeArtist = (direction) => {
    if (direction === "next") {
      setCurrentArtistIndex((prevIndex) => 
        (prevIndex + 1) % featuredArtists.length
      );
    } else {
      setCurrentArtistIndex((prevIndex) => 
        prevIndex === 0 ? featuredArtists.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="flex relative">
      {/* Left sidebar - Navbar component */}
      <Navbar />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto h-screen pb-28">
        {/* Search bar at the top of the page */}
        <SearchBar />
        
        {/* Hero section with dynamic background image */}
        <div 
          className="relative h-80 bg-cover bg-center transition-all duration-1000"
          style={{ 
            backgroundImage: `url(${currentBackground})`,
            backgroundSize: 'cover'
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3f4c6b] opacity-90"></div>
          
          {/* Artist info card - positioned at bottom of hero section */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 flex justify-between items-center">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold text-black mb-1">{currentArtist.name}</h1>
                <p className="text-sm text-gray-600">{currentArtist.years}</p>
                <p className="mt-4 text-sm text-black">
                  {currentArtist.description}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="overflow-hidden rounded-full w-36 h-36 border-4 border-white shadow-lg">
                  <img src={currentArtist.image} alt={`${currentArtist.name} portrait`} className="w-full h-full object-cover" />
                </div>
                <div className="w-60">
                  <h3 className="text-xl font-bold text-black mb-4">Famous pieces</h3>
                  <ul className="space-y-3">
                    {currentArtist.famousPieces.map((piece, index) => (
                      <li key={index} className="text-black">{piece}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Artist selection indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {featuredArtists.map((artist, index) => (
              <button
                key={artist.id}
                onClick={() => setCurrentArtistIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentArtistIndex ? "bg-white w-4" : "bg-white bg-opacity-50"
                }`}
                aria-label={`Switch to ${artist.name}`}
              />
            ))}
          </div>
        </div>
        
        {/* Rest of the content with white background */}
        <div className="bg-white">
          {/* Recommended Songs section */}
          <ContentSection title="Recommended Songs">
            {playlistData.map((playlist, index) => (
              <PlaylistCard
                key={index}
                title={playlist.title}
                description={playlist.description}
                image={playlist.image}
              />
            ))}
          </ContentSection>

          {/* Popular playlist section */}
          <ContentSection title="Popular playlist">
            {podcastData.map((podcast, index) => (
              <PodcastCard 
                key={index}
                title={podcast.title}
                image={podcast.image}
                date={podcast.date}
                duration={podcast.duration}
              />
            ))}
          </ContentSection>

          {/* Master of classicals section */}
          <ContentSection title="Master of classicals">
            {podcastData.map((podcast, index) => (
              <PodcastCard 
                key={index}
                title={podcast.title}
                image={podcast.image}
                date={podcast.date}
                duration={podcast.duration}
              />
            ))}
          </ContentSection>

          {/* Discover by country section */}
          <ContentSection title="Discover by country">
            {podcastData.map((podcast, index) => (
              <PodcastCard 
                key={index}
                title={podcast.title}
                image={podcast.image}
                date={podcast.date}
                duration={podcast.duration}
              />
            ))}
          </ContentSection>

          {/* Instrument spotlight section */}
          <ContentSection title="Instrument spotlight">
            {podcastData.map((podcast, index) => (
              <PodcastCard 
                key={index}
                title={podcast.title}
                image={podcast.image}
                date={podcast.date}
                duration={podcast.duration}
              />
            ))}
          </ContentSection>

          {/* Eras and Styles section */}
          <ContentSection title="Eras and Styles">
            {podcastData.map((podcast, index) => (
              <PodcastCard 
                key={index}
                title={podcast.title}
                image={podcast.image}
                date={podcast.date}
                duration={podcast.duration}
              />
            ))}
          </ContentSection>
        </div>
      </main>

      {/* Bottom banner - fixed at bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomBanner />
      </div>
    </div>
  );
};

export default HomePage;