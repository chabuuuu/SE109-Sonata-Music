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
    description:
      "Mozart was a child prodigy who amazed royal European courts. He composed over 600 works across many musical genres. His operas combined drama, humor, and brilliant musical composition.",
    image: "/artists/mozart-portrait.png",
    famousPieces: [
      "Requiem in D Minor, K. 626",
      "The Magic Flute",
      "Symphony No. 40 in G Minor",
    ],
  },
  {
    id: 2,
    name: "Beethoven",
    years: "(1770 - 1827)",
    description:
      "Beethoven was a German composer and pianist whose music bridged the Classical and Romantic eras. He is considered one of the most influential composers of all time.",
    image: "/artists/beethoven-portrait.png",
    famousPieces: [
      "Symphony No. 9 in D Minor",
      "Moonlight Sonata",
      "Für Elise",
    ],
  },
  {
    id: 3,
    name: "Bach",
    years: "(1685 - 1750)",
    description:
      "Bach was a German composer and musician of the Baroque period known for his instrumental compositions, keyboard works, and vocal music.",
    image: "/artists/bach-portrait.png",
    famousPieces: [
      "Brandenburg Concertos",
      "The Well-Tempered Clavier",
      "Mass in B Minor",
    ],
  },
];

// Background images for random rotation
const backgroundImages = [
  "/backgrounds/music-background-1.jpg",
  "/backgrounds/music-background-2.jpg",
  "/backgrounds/music-background-3.jpg",
  "/backgrounds/music-background-4.jpg",
  "/backgrounds/music-background-5.jpg",
];

// Playlists data
const playlistData = [
  {
    title: "Peaceful Piano",
    description: "Relax and indulge with beautiful piano pieces",
    image: "/playlist_imgs/peaceful_piano.jpg",
  },
  {
    title: "Deep Focus",
    description: "Keep calm and focus with ambient and post-",
    image: "/playlist_imgs/deep_focus.jpg",
  },
  {
    title: "Instrumental Study",
    description: "Focus with soft study music in the background",
    image: "/playlist_imgs/instrumental_study.jpg",
  },
  {
    title: "Jazz Vibes",
    description: "The original chill instrumental beats playlist",
    image: "/playlist_imgs/jazz_vibes.jpg",
  },
  {
    title: "Focus Flow",
    description: "Uptempo instrumental hip hop beats",
    image: "/playlist_imgs/focus_flow.jpg",
  },
];

// Podcast data
const podcastData = [
  {
    title: "Every Parent's Nightmare",
    image: "/podcast_imgs/the_letter.jpg",
    date: "Sep 2022",
    duration: "35 Min",
  },
  {
    title: "How the Pell Grant helped",
    image: "/podcast_imgs/pell_grant.jpg",
    date: "Sep 2022",
    duration: "29 Min",
  },
  {
    title: "After 10 Years",
    image: "/podcast_imgs/love_in_gravity.jpg",
    date: "Jul 2022",
    duration: "52 Min",
  },
  {
    title: "Book Exploder: Min Jin Le",
    image: "/podcast_imgs/min_jin_le.jpg",
    date: "Aug 2022",
    duration: "20 Min",
  },
  {
    title: "Healing Through Music w/",
    image: "/podcast_imgs/gift_of_failure.jpg",
    date: "Aug 2022",
    duration: "56 Min",
  },
];

/**
 * -----------------------------
 *  REUSABLE COMPONENTS
 * -----------------------------
 */

// Section wrapper with parchment style background
const ContentSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="p-6 font-['Playfair_Display',serif] text-[#3A2A24]">
    <header className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold tracking-wide">{title}</h2>
      <a
        href="#"
        className="text-sm text-[#6D4C41] hover:text-[#3A2A24] transition-colors"
      >
        Show all &rsaquo;
      </a>
    </header>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {children}
    </div>
  </section>
);

// Playlist card with vintage tone
const PlaylistCard: React.FC<{
  title: string;
  description: string;
  image: string;
}> = ({ title, description, image }) => (
  <article className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg hover:shadow-lg transition-all">
    <figure className="relative mb-4 rounded-md overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full aspect-square object-cover grayscale-[20%] sepia-[10%]"
      />
      {/* Play button */}
      <button className="absolute bottom-2 right-2 bg-[#C8A97E] rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity shadow-lg">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-[#3A2A24]"
        >
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </button>
    </figure>
    <h3 className="font-semibold text-lg mb-1">{title}</h3>
    <p className="text-sm text-[#6D4C41]">{description}</p>
  </article>
);

// Podcast card
const PodcastCard: React.FC<{
  title: string;
  image: string;
  date: string;
  duration: string;
}> = ({ title, image, date, duration }) => (
  <article className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg hover:shadow-lg transition-all">
    <figure className="relative mb-4 rounded-md overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full aspect-square object-cover grayscale-[20%] sepia-[10%]"
      />
      {/* Play button */}
      <button className="absolute bottom-2 right-2 bg-[#C8A97E] rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity shadow-lg">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-[#3A2A24]"
        >
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </button>
    </figure>
    <h3 className="font-semibold text-lg mb-1">{title}</h3>
    <p className="text-sm text-[#6D4C41]">
      {date} • {duration}
    </p>
  </article>
);

// Search bar (classical theme)
const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`sticky top-0 bg-[#F8F0E3] z-40 shadow-md transition-all duration-300 ${
        isExpanded ? "py-4" : "py-2"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="relative">
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
              placeholder="Tìm kiếm bài hát, nghệ sĩ, album..."
              className={`bg-transparent border-none focus:outline-none flex-grow text-[#3A2A24] font-['Playfair_Display',serif] transition-all ${
                isExpanded ? "text-base" : "text-sm"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => !searchTerm && setIsExpanded(false)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
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
        </div>
      </div>
    </div>
  );
};

/**
 * -----------------------------
 *  MAIN PAGE COMPONENT
 * -----------------------------
 */

const HomePage: React.FC = () => {
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const currentArtist = featuredArtists[currentArtistIndex];
  const currentBackground = backgroundImages[currentBackgroundIndex];

  // Rotate featured artist every 10s
  useEffect(() => {
    const artistTimer = setInterval(() => {
      setCurrentArtistIndex((i) => (i + 1) % featuredArtists.length);
    }, 10000);
    return () => clearInterval(artistTimer);
  }, []);

  // Rotate background every 15s
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setCurrentBackgroundIndex((i) => (i + 1) % backgroundImages.length);
    }, 15000);
    return () => clearInterval(bgTimer);
  }, []);

  return (
    <div className="flex relative font-['Playfair_Display',serif] text-[#3A2A24] bg-[#F8F0E3]">
      {/* Sidebar */}
      <Navbar />

      {/* Main */}
      <main className="flex-1 overflow-y-auto h-screen pb-28">
        {/* Search */}
        <SearchBar />

        {/* Hero */}
        <section
          className="relative h-80 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${currentBackground})` }}
        >
          {/* Overlay parchment gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#E6D7C3] opacity-90"></div>

          {/* Artist card */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-[#F0E6D6] bg-opacity-90 backdrop-blur-sm rounded-xl p-6 flex justify-between items-center border border-[#D3B995] shadow-lg">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold mb-1 tracking-wide">
                  {currentArtist.name}
                </h1>
                <p className="text-sm text-[#6D4C41]">{currentArtist.years}</p>
                <p className="mt-4 text-sm leading-relaxed">
                  {currentArtist.description}
                </p>
              </div>
              <div className="flex items-center gap-8">
                {/* Portrait */}
                <div className="overflow-hidden rounded-full w-36 h-36 border-4 border-[#C8A97E] shadow-md">
                  <img
                    src={currentArtist.image}
                    alt={`${currentArtist.name} portrait`}
                    className="w-full h-full object-cover grayscale-[30%] sepia-[10%]"
                  />
                </div>
                {/* Works */}
                <div className="w-60">
                  <h3 className="text-xl font-bold mb-4">Famous pieces</h3>
                  <ul className="space-y-3">
                    {currentArtist.famousPieces.map((piece, i) => (
                      <li key={i}>{piece}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {featuredArtists.map((artist, idx) => (
              <button
                key={artist.id}
                onClick={() => setCurrentArtistIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentArtistIndex
                    ? "bg-[#C8A97E] w-4"
                    : "bg-[#C8A97E] bg-opacity-50 w-2"
                }`}
                aria-label={`Switch to ${artist.name}`}
              />
            ))}
          </div>
        </section>

        {/* Sections */}
        <div>
          <ContentSection title="Recommended Songs">
            {playlistData.map((p, i) => (
              <PlaylistCard key={i} {...p} />
            ))}
          </ContentSection>

          <ContentSection title="Popular Podcasts">
            {podcastData.map((p, i) => (
              <PodcastCard key={i} {...p} />
            ))}
          </ContentSection>

          <ContentSection title="Master of Classicals">
            {podcastData.map((p, i) => (
              <PodcastCard key={i} {...p} />
            ))}
          </ContentSection>

          <ContentSection title="Discover by Country">
            {podcastData.map((p, i) => (
              <PodcastCard key={i} {...p} />
            ))}
          </ContentSection>

          <ContentSection title="Instrument Spotlight">
            {podcastData.map((p, i) => (
              <PodcastCard key={i} {...p} />
            ))}
          </ContentSection>

          <ContentSection title="Eras and Styles">
            {podcastData.map((p, i) => (
              <PodcastCard key={i} {...p} />
            ))}
          </ContentSection>
        </div>
      </main>

      {/* Bottom banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomBanner />
      </div>
    </div>
  );
};

export default HomePage;
