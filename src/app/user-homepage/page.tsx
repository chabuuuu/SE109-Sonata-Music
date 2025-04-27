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