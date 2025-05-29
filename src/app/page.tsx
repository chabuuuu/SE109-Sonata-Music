"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import BottomBanner from '@/components/bottom_banner';
import { getRecommendedSongs, Song } from '@/services/recommendService';
import { getPopularAlbums, Album } from '@/services/albumService';
import { getTimelessPieces } from '@/services/timelessService';
import { getTopArtists, Artist } from '@/services/artistService';
import { getInstrumentSpotlight, InstrumentSpotlight, Instrument } from '@/services/instrumentService';
import { getErasAndStyles, EraStyle } from '@/services/eraService';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Interface cho dữ liệu nghệ sĩ từ API
interface FeaturedArtist {
  id: number;
  name: string;
  years: string;
  description: string;
  image: string;
  famousPieces: string[];
}

// Interface cho response từ API
interface ArtistApiResponse {
  id: number;
  name: string;
  description: string;
  picture: string;
  dateOfBirth: string | null;
  dateOfDeath: string | null;
  significantPerformences: string;
  awardsAndHonors: string;
}

// // Interface cho thông tin người dùng
// interface UserProfile {
//   id: string;
//   username: string;
//   fullname: string;
//   gender: string;
//   email: string;
//   createAt: string;
//   updateAt: string;
//   favoriteLists: any[];
// }

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
// const podcastData = [
//   {
//     title: "Every Parent's Nightmare",
//     image: "/podcast_imgs/the_letter.jpg",
//     date: "Sep 2022",
//     duration: "35 Min",
//   },
//   {
//     title: "How the Pell Grant helped",
//     image: "/podcast_imgs/pell_grant.jpg",
//     date: "Sep 2022",
//     duration: "29 Min",
//   },
//   {
//     title: "After 10 Years",
//     image: "/podcast_imgs/love_in_gravity.jpg",
//     date: "Jul 2022",
//     duration: "52 Min",
//   },
//   {
//     title: "Book Exploder: Min Jin Le",
//     image: "/podcast_imgs/min_jin_le.jpg",
//     date: "Aug 2022",
//     duration: "20 Min",
//   },
//   {
//     title: "Healing Through Music w/",
//     image: "/podcast_imgs/gift_of_failure.jpg",
//     date: "Aug 2022",
//     duration: "56 Min",
//   },
// ];

// Fallback artists data nếu API fails
const fallbackArtists = [
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

/**
 * -----------------------------
 *  REUSABLE COMPONENTS
 * -----------------------------
 */

// Section wrapper with parchment style background
const ContentSection: React.FC<{
  title: string;
  children: React.ReactNode;
  showAllLink?: string;
}> = ({ title, children, showAllLink = "#" }) => (
  <section className="p-6 font-['Playfair_Display',serif] text-[#3A2A24]">
    <header className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold tracking-wide">{title}</h2>
      <Link
        href={showAllLink}
        className="text-sm text-[#6D4C41] hover:text-[#3A2A24] transition-colors"
      >
        Show all &rsaquo;
      </Link>
    </header>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {children}
    </div>
  </section>
);

// Playlist card with vintage tone
const PlaylistCard: React.FC<{
  title: string;
  description: string;
  image: string;
  songId?: number;
  onPlayClick?: () => void;
}> = ({ title, description, image, songId, onPlayClick }) => (
  <article className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
    <figure className="relative mb-4 rounded-md overflow-hidden">
      <Image
        src={image}
        alt={title}
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
      <div className="absolute top-3 left-3 bg-[#3A2A24]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {songId ? "Song" : "Playlist"}
      </div>
    </figure>
    <div className="flex-1 flex flex-col">
      <h3 className="font-semibold text-lg mb-1 text-[#3A2A24] truncate">
        {title}
      </h3>
      <p className="text-sm text-[#6D4C41] line-clamp-2">{description}</p>
      <div className="mt-auto pt-3 flex justify-between items-center">
        <span className="text-xs text-[#8D6C61]">Classical</span>
        <div className="flex space-x-2">
          <button className="text-[#C8A97E] hover:text-[#A67C52] transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="text-[#C8A97E] hover:text-[#A67C52] transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </article>
);

// Podcast card
// const PodcastCard: React.FC<{
//   title: string;
//   image: string;
//   date: string;
//   duration: string;
// }> = ({ title, image, date, duration }) => (
//   <article className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
//     <figure className="relative mb-4 rounded-md overflow-hidden">
//       <Image
//         src={image}
//         alt={title}
//         width={500}
//         height={500}
//         className="w-full aspect-square object-cover grayscale-[20%] sepia-[10%] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:sepia-0"
//       />
//       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//       {/* Play button */}
//       <button className="absolute bottom-4 right-4 bg-white text-[#3A2A24] rounded-full p-3 transform translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-[#C8A97E] hover:text-white">
//         <svg
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <polygon points="5 3 19 12 5 21 5 3"></polygon>
//         </svg>
//       </button>
//       <div className="absolute top-3 left-3 bg-[#3A2A24]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//         Podcast
//       </div>
//     </figure>
//     <div className="flex-1 flex flex-col">
//       <h3 className="font-semibold text-lg mb-1 text-[#3A2A24] truncate">
//         {title}
//       </h3>
//       <div className="mt-1 mb-3 flex items-center text-sm text-[#6D4C41]">
//         <span className="mr-2">{date}</span>
//         <span className="inline-block h-1 w-1 rounded-full bg-[#C8A97E]"></span>
//         <span className="ml-2">{duration}</span>
//       </div>
//       <div className="mt-auto pt-3 flex justify-between items-center">
//         <button className="text-xs text-[#8D6C61] hover:text-[#3A2A24] transition-colors flex items-center">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 mr-1"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//             />
//           </svg>
//           Add to Library
//         </button>
//         <div className="flex space-x-2">
//           <button className="text-[#C8A97E] hover:text-[#A67C52] transition-colors">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </button>
//           <button className="text-[#C8A97E] hover:text-[#A67C52] transition-colors">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   </article>
// );

// Album card component
const AlbumCard: React.FC<{
  album: Album;
}> = ({ album }) => (
  <Link href={`/album/${album.id}`} className="block h-full">
    <article className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg hover:shadow-lg transition-all duration-300 group h-full flex flex-col cursor-pointer">
      <figure className="relative mb-4 rounded-md overflow-hidden">
        <Image
          src={album.coverPhoto}
          alt={album.name}
          width={500}
          height={500}
          className="w-full aspect-square object-cover grayscale-[20%] sepia-[10%] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:sepia-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {/* Play button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Thêm logic phát nhạc album ở đây
          }}
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
        {/* Album type label */}
        <div className="absolute top-3 left-3 bg-[#3A2A24]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {album.albumType || "Album"}
        </div>

        {/* View count */}
        {album.viewCount && (
          <div className="absolute top-3 right-3 bg-[#3A2A24]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {album.viewCount}
          </div>
        )}
      </figure>
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-1 text-[#3A2A24] truncate">
          {album.name}
        </h3>
        <p className="text-sm text-[#6D4C41] line-clamp-2">{album.description}</p>
        <div className="mt-auto pt-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xs text-[#8D6C61]">
              {new Date(album.releaseDate).getFullYear() || "Năm phát hành"}
            </span>
            {album.likeCount !== undefined && (
              <span className="text-xs text-[#8D6C61] ml-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                {album.likeCount}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Thêm logic thích album ở đây
              }}
              className="text-[#C8A97E] hover:text-[#A67C52] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Thêm logic thêm vào playlist ở đây
              }}
              className="text-[#C8A97E] hover:text-[#A67C52] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  </Link>
);

// Artist card component
const ArtistCard: React.FC<{
  artist: Artist;
}> = ({ artist }) => (
  <Link href={`/artist/${artist.id}`} className="block h-full">
    <article className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg hover:shadow-lg transition-all duration-300 group h-full flex flex-col cursor-pointer">
      <figure className="relative mb-4 rounded-md overflow-hidden">
        <Image
          src={artist.picture}
          alt={artist.name}
          width={500}
          height={500}
          className="w-full aspect-square object-cover grayscale-[20%] sepia-[10%] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:sepia-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {/* Play button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Thêm logic phát nhạc của nghệ sĩ ở đây
          }}
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
        <div className="absolute top-3 left-3 bg-[#3A2A24]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Artist
        </div>
      </figure>
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-1 text-[#3A2A24] truncate">
          {artist.name}
        </h3>
        <p className="text-sm text-[#6D4C41] line-clamp-2">
          {artist.description}
        </p>
        <div className="mt-auto pt-3 flex justify-between items-center">
          <span className="text-xs text-[#8D6C61]">
            {artist.followers} followers
          </span>
          <div className="flex space-x-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Thêm logic thích nghệ sĩ ở đây
              }}
              className="text-[#C8A97E] hover:text-[#A67C52] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Thêm logic thêm vào playlist ở đây
              }}
              className="text-[#C8A97E] hover:text-[#A67C52] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  </Link>
);

// Instrument card component
// const InstrumentCard: React.FC<{
//   spotlight: InstrumentSpotlight;
// }> = ({ spotlight }) => {
//   const instrument = spotlight.instrument;
//   const songs = instrument.musics || [];

//   return (
//     <article className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg hover:shadow-lg transition-all">
//       <div className="mb-3">
//         <h3 className="font-semibold text-lg mb-1">{instrument.name}</h3>
//         <p className="text-sm text-[#6D4C41]">{songs.length} songs</p>
//       </div>

//       {songs.length > 0 && (
//         <figure className="relative rounded-md overflow-hidden">
//           <Image
//             src={songs[0].coverPhoto}
//             alt={songs[0].name}
//             width={500}
//             height={500}
//             className="w-full aspect-square object-cover grayscale-[20%] sepia-[10%]"
//           />
//           {/* Play button */}
//           <button className="absolute bottom-2 right-2 bg-[#C8A97E] rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity shadow-lg">
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               className="text-[#3A2A24]"
//             >
//               <polygon points="5 3 19 12 5 21 5 3"></polygon>
//             </svg>
//           </button>
//           <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#000000aa] to-transparent">
//             <h4 className="text-white font-medium truncate">{songs[0].name}</h4>
//           </div>
//         </figure>
//       )}
//     </article>
//   );
// };



const InstrumentSpotlightSection: React.FC<{
  spotlights: InstrumentSpotlight[];
  loading: boolean;
  onPlayClick?: (songId: number) => void;
}> = ({ spotlights, loading, onPlayClick }) => {
  const [selectedInstrument, setSelectedInstrument] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (spotlights.length > 0 && selectedInstrument === null) {
      setSelectedInstrument(spotlights[0].instrument.id);
    }
  }, [spotlights, selectedInstrument]);

  const currentSpotlight =
    selectedInstrument !== null
      ? spotlights.find((spot) => spot.instrument.id === selectedInstrument)
      : null;

  const songs = currentSpotlight?.instrument.musics || [];

  const defaultInstrumentImages: Record<string, string> = {
    piano: "/instruments/piano.jpg",
    violin: "/instruments/violin.jpg",
    guitar: "/instruments/guitar.jpg",
    drums: "/instruments/drums.jpg",
    saxophone: "/instruments/saxophone.jpg",
    trumpet: "/instruments/trumpet.jpg",
    flute: "/instruments/flute.jpg",
    default: "/instruments/default-instrument.jpg",
  };

  // Màu gradient cho từng loại nhạc cụ
  const instrumentGradients: Record<string, string> = {
    piano: "from-[#C8A97E] to-[#A67C52]",
    violin: "from-[#D3B995] to-[#A67C52]",
    guitar: "from-[#E6D7C3] to-[#C8A97E]",
    drums: "from-[#B9987D] to-[#8D6C61]",
    saxophone: "from-[#D7C3A7] to-[#A67C52]",
    trumpet: "from-[#E6D7C3] to-[#C8A97E]",
    flute: "from-[#D3B995] to-[#8D6C61]",
    default: "from-[#C8A97E] to-[#A67C52]",
  };

  const getInstrumentImage = (instrument: Instrument) => {
    if (instrument.picture) return instrument.picture;
    const lowerName = instrument.name.toLowerCase();
    return (
      defaultInstrumentImages[lowerName] || defaultInstrumentImages.default
    );
  };

  const getInstrumentGradient = (instrument: Instrument) => {
    const lowerName = instrument.name.toLowerCase();
    return instrumentGradients[lowerName] || instrumentGradients.default;
  };

  if (loading) {
    return (
      <section className="p-6 font-['Playfair_Display',serif] text-[#3A2A24] w-full">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-wide">
            Instrument Spotlight
          </h2>
          <Link
            href="#"
            className="text-sm text-[#6D4C41] hover:text-[#3A2A24] transition-colors"
          >
            Show all &rsaquo;
          </Link>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-[#F0E6D6] border border-[#D3B995] p-5 rounded-lg animate-pulse shadow-sm">
            <div className="h-10 bg-[#D3B995] rounded mb-6"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-md bg-[#D3B995]"></div>
                <div className="flex-1">
                  <div className="h-5 bg-[#D3B995] rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-[#D3B995] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="md:col-span-3 grid grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-[#F0E6D6] border border-[#D3B995] p-5 rounded-lg animate-pulse shadow-sm"
              >
                <div className="w-full aspect-square bg-[#D3B995] mb-4 rounded-md"></div>
                <div className="h-5 bg-[#D3B995] rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-[#D3B995] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (spotlights.length === 0) {
    return (
      <section className="p-6 font-['Playfair_Display',serif] text-[#3A2A24] w-full">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-wide">
            Instrument Spotlight
          </h2>
          <Link
            href="#"
            className="text-sm text-[#6D4C41] hover:text-[#3A2A24] transition-colors"
          >
            Show all &rsaquo;
          </Link>
        </header>
        <div className="text-center py-12 text-[#6D4C41] bg-[#F0E6D6] border border-[#D3B995] rounded-lg">
          <p>No instruments available at the moment.</p>
        </div>
      </section>
    );
  }

  // Featured instrument
  const featuredInstrument = currentSpotlight?.instrument;
  const featuredImage = featuredInstrument
    ? getInstrumentImage(featuredInstrument)
    : defaultInstrumentImages.default;
  const gradient = featuredInstrument
    ? getInstrumentGradient(featuredInstrument)
    : instrumentGradients.default;

  return (
    <section className="p-6 font-['Playfair_Display',serif] text-[#3A2A24] w-full">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-wide">
          Instrument Spotlight
        </h2>
        <Link
          href="#"
          className="text-sm text-[#6D4C41] hover:text-[#3A2A24] transition-colors"
        >
          Show all &rsaquo;
        </Link>
      </header>

      {/* Featured instrument header - similar to featured album */}
      {featuredInstrument && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <div
            className="h-64 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${featuredImage})` }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-80`}
            />
            <div className="absolute inset-0 p-8 flex flex-col md:flex-row items-start md:items-center">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-md shadow-xl overflow-hidden mb-4 md:mb-0 md:mr-8 bg-[#F0E6D6] border-4 border-[#F0E6D6]">
                <Image
                  src={featuredImage}
                  alt={featuredInstrument.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-[#F0E6D6]">
                  Featured Instrument
                </p>
                <h2 className="text-4xl font-bold mb-1 max-w-xl leading-snug text-[#F0E6D6]">
                  {featuredInstrument.name}
                </h2>
                <p className="text-[#F0E6D6]/90 mb-4">
                  {songs.length} songs available
                </p>
                <div className="flex space-x-4">
                  <button className="bg-[#F0E6D6] hover:bg-white text-[#3A2A24] font-medium rounded-full px-8 py-3 shadow-lg transition-colors">
                    Play Collection
                  </button>
                  <button className="border border-[#F0E6D6] text-[#F0E6D6] font-medium rounded-full px-8 py-3 hover:bg-[#F0E6D6]/20 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Instrument categories */}
        <div className="bg-[#F0E6D6] border border-[#D3B995] rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#E6D7C3] to-[#D3B995] px-5 py-4">
            <h3 className="text-xl font-semibold text-[#3A2A24]">
              Instruments
            </h3>
          </div>
          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#D3B995] scrollbar-track-[#F0E6D6]">
            {spotlights.map((spotlight) => {
              const instrument = spotlight.instrument;
              const isSelected = selectedInstrument === instrument.id;

              return (
                <button
                  key={instrument.id}
                  onClick={() => setSelectedInstrument(instrument.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                    isSelected
                      ? `bg-[#D3B995] shadow-md`
                      : "hover:bg-[#D3B99520]"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                      isSelected ? "border-white shadow-lg" : "border-[#C8A97E]"
                    } flex-shrink-0`}
                  >
                    <Image
                      src={getInstrumentImage(instrument)}
                      alt={instrument.name}
                      width={500}
                      height={500}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isSelected ? "scale-110" : "scale-100"
                      }`}
                    />
                  </div>
                  <div className="text-left flex-1">
                    <h4
                      className={`font-medium transition-all duration-300 ${
                        isSelected ? "text-[#3A2A24] text-lg" : "text-[#6D4C41]"
                      }`}
                    >
                      {instrument.name}
                    </h4>
                    <p
                      className={`text-sm transition-all duration-300 ${
                        isSelected ? "text-[#3A2A24]" : "text-[#8D6C61]"
                      }`}
                    >
                      {instrument.musics?.length || 0} songs
                    </p>
                  </div>
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#3A2A24]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Songs grid */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {songs.length > 0 ? (
              songs.map((song) => (
                <article
                  key={song.id}
                  className="bg-[#F0E6D6] border border-[#D3B995] rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col"
                >
                  <figure className="relative overflow-hidden">
                    <Image
                      src={song.coverPhoto}
                      alt={song.name}
                      width={500}
                      height={500}
                      className="w-full aspect-square object-cover grayscale-[20%] sepia-[10%] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:sepia-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <button 
                      onClick={() => onPlayClick && onPlayClick(song.id)}
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
                  </figure>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="font-medium text-lg text-[#3A2A24] truncate">
                      {song.name}
                    </h4>
                    <p className="text-sm text-[#6D4C41] truncate mt-1 mb-3">
                      {song.description ||
                        `${currentSpotlight?.instrument.name} piece`}
                    </p>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="text-xs text-[#8D6C61]">3:45</div>
                      <button className="text-[#C8A97E] hover:text-[#A67C52] transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-3 text-center py-16 bg-[#F0E6D6] border border-[#D3B995] rounded-lg text-[#6D4C41]">
                <svg
                  className="w-20 h-20 mx-auto mb-4 text-[#D3B995]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  ></path>
                </svg>
                <p className="italic text-lg">
                  No songs available for this instrument yet.
                </p>
                <button className="mt-4 px-6 py-3 bg-[#C8A97E] hover:bg-[#A67C52] text-white rounded-full transition-colors shadow-md">
                  Browse Other Instruments
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Era and styles component
const EraStyleSection: React.FC<{
  eraStyles: EraStyle[];
  loading: boolean;
}> = ({ eraStyles, loading }) => {
  if (loading) {
    return (
      <ContentSection title="Eras and Styles" showAllLink="#">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
            <div className="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>
            <div className="bg-gray-200 rounded h-4 w-1/2"></div>
          </div>
        ))}
      </ContentSection>
    );
  }

  return (
    <ContentSection title="Eras and Styles" showAllLink="/user-categories">
      {eraStyles.map((eraStyle) => (
        <Link
          key={eraStyle.period.id}
          href={`/period/${eraStyle.period.id}`}
          className="block"
        >
          <article
            className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg hover:shadow-lg transition-all duration-300 group h-full flex flex-col cursor-pointer hover:scale-105"
          >
            <figure className="relative mb-4 rounded-md overflow-hidden">
              <Image
                src={eraStyle.period.picture || "/default-era.jpg"}
                alt={eraStyle.period.name}
                width={500}
                height={500}
                className="w-full aspect-square object-cover grayscale-[20%] sepia-[10%] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:sepia-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button 
                className="absolute bottom-4 right-4 bg-white text-[#3A2A24] rounded-full p-3 transform translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-[#C8A97E] hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle play functionality if needed
                }}
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
              <div className="absolute top-3 left-3 bg-[#3A2A24]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Era
              </div>
            </figure>
            <div className="flex-1 flex flex-col">
              <h3 className="font-semibold text-lg mb-1 text-[#3A2A24] truncate group-hover:text-[#C8A97E] transition-colors">
                {eraStyle.period.name}
              </h3>
              <p className="text-sm text-[#6D4C41] line-clamp-2">
                {eraStyle.period.musics.length} songs
              </p>
              <div className="mt-auto pt-3 flex justify-between items-center">
                <span className="text-xs text-[#8D6C61]">Classical</span>
                <div className="flex space-x-2">
                  <button 
                    className="text-[#C8A97E] hover:text-[#A67C52] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Handle favorite functionality
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button 
                    className="text-[#C8A97E] hover:text-[#A67C52] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Handle add to playlist functionality
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </ContentSection>
  );
};

/**
 * -----------------------------
 *  MAIN PAGE COMPONENT
 * -----------------------------
 */

const HomePage: React.FC = () => {
  const router = useRouter();
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [featuredArtists, setFeaturedArtists] =
    useState<FeaturedArtist[]>(fallbackArtists);
  const currentArtist = featuredArtists[currentArtistIndex];
  const currentBackground = backgroundImages[currentBackgroundIndex];

  // State for recommended songs
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [popularAlbums, setPopularAlbums] = useState<Album[]>([]);
  const [timelessPieces, setTimelessPieces] = useState<Song[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [instrumentSpotlights, setInstrumentSpotlights] = useState<
    InstrumentSpotlight[]
  >([]);
  const [eraStyles, setEraStyles] = useState<EraStyle[]>([]);

  // State for loading
  const [loading, setLoading] = useState(false);
  const [albumsLoading, setAlbumsLoading] = useState(false);
  const [timelessLoading, setTimelessLoading] = useState(false);
  const [, setFeaturedArtistsLoading] = useState(false);
  const [artistsLoading, setArtistsLoading] = useState(false);
  const [instrumentsLoading, setInstrumentsLoading] = useState(false);
  const [erasLoading, setErasLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Handle play click function
  const handlePlayClick = (songId: number) => {
    router.push(`/music/${songId}`);
  };

  // Fetch featured artists from API
  useEffect(() => {
    const fetchFeaturedArtists = async () => {
      try {
        setFeaturedArtistsLoading(true);

        const artistsList: FeaturedArtist[] = [];

        // Fetch 3 random artists
        for (let i = 0; i < 3; i++) {
          try {
            const response = await axios.get<{
              data: ArtistApiResponse;
              success: boolean;
            }>("https://api.sonata.io.vn/api/v1/recommender/random-artist");

            if (response.data.success && response.data.data) {
              const artist = response.data.data;

              // Format birth and death years
              let years = "";
              if (artist.dateOfBirth) {
                const birthYear = new Date(artist.dateOfBirth).getFullYear();
                years = `(${birthYear}`;

                if (artist.dateOfDeath) {
                  const deathYear = new Date(artist.dateOfDeath).getFullYear();
                  years += ` - ${deathYear})`;
                } else {
                  years += " - present)";
                }
              }

              // Parse significant performances into array
              const performances = artist.significantPerformences
                ? artist.significantPerformences
                    .split(",")
                    .map((p) => p.trim())
                    .filter((p) => p.length > 0)
                : [];

              // Add awards if performances array is too short
              if (performances.length < 2 && artist.awardsAndHonors) {
                performances.push(
                  ...artist.awardsAndHonors
                    .split(",")
                    .map((a) => a.trim())
                    .filter((a) => a.length > 0)
                );
              }

              // If still not enough items, add placeholders
              while (performances.length < 3) {
                performances.push(`Notable work ${performances.length + 1}`);
              }

              artistsList.push({
                id: artist.id,
                name: artist.name,
                years: years || "(Unknown)",
                description:
                  artist.description || "Notable artist in the music world.",
                image: artist.picture || "/artists/default-artist.png",
                famousPieces: performances.slice(0, 3),
              });
            }
          } catch (error) {
            console.error("Error fetching artist:", error);
            // Continue to next artist without failing
          }
        }

        // Use fetched artists if available, otherwise keep fallback
        if (artistsList.length > 0) {
          setFeaturedArtists(artistsList);
        }
      } catch (error) {
        console.error("Failed to fetch featured artists:", error);
        // Fallback is already set as initial state
      } finally {
        setFeaturedArtistsLoading(false);
      }
    };

    fetchFeaturedArtists();
  }, []);

  // Rotate featured artist every 10s
  useEffect(() => {
    const artistTimer = setInterval(() => {
      setCurrentArtistIndex((i) => (i + 1) % featuredArtists.length);
    }, 10000);
    return () => clearInterval(artistTimer);
  }, [featuredArtists.length]);

  // Rotate background every 15s
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setCurrentBackgroundIndex((i) => (i + 1) % backgroundImages.length);
    }, 15000);
    return () => clearInterval(bgTimer);
  }, []);

  // Fetch recommended songs
  useEffect(() => {
    const fetchRecommendedSongs = async () => {
      try {
        setLoading(true);
        setApiError(null);

        const songs = await getRecommendedSongs(5);
        setRecommendedSongs(songs);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài hát đề xuất:", error);
        setApiError("Không thể tải danh sách bài hát đề xuất");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedSongs();
  }, []);

  // Fetch popular albums theo API mới
  const fetchPopularAlbums = React.useCallback(async () => {
    try {
      setAlbumsLoading(true);
      setApiError(null);

      const albums = await getPopularAlbums(8); // Lấy 8 album phổ biến nhất

      if (albums && albums.length > 0) {
        console.log("Đã tải thành công:", albums.length, "album");
        setPopularAlbums(albums);
      } else {
        console.warn("Không có dữ liệu album từ API popular-albums");
        setPopularAlbums([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách album phổ biến:", error);
      setApiError(
        "Không thể tải danh sách album phổ biến. Vui lòng thử lại sau."
      );
      setPopularAlbums([]);
    } finally {
      setAlbumsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopularAlbums();
  }, [fetchPopularAlbums]);

  // Fetch timeless pieces
  useEffect(() => {
    const fetchTimelessPieces = async () => {
      try {
        setTimelessLoading(true);

        const songs = await getTimelessPieces(5);
        setTimelessPieces(songs);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài hát bất hủ:", error);
      } finally {
        setTimelessLoading(false);
      }
    };

    fetchTimelessPieces();
  }, []);

  // Fetch top artists
  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        setArtistsLoading(true);

        const artists = await getTopArtists(5);
        setTopArtists(artists);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nghệ sĩ hàng đầu:", error);
      } finally {
        setArtistsLoading(false);
      }
    };

    fetchTopArtists();
  }, []);

  // Fetch instrument spotlights
  useEffect(() => {
    const fetchInstrumentSpotlight = async () => {
      try {
        setInstrumentsLoading(true);

        const spotlights = await getInstrumentSpotlight(5);
        setInstrumentSpotlights(spotlights);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhạc cụ tiêu biểu:", error);
      } finally {
        setInstrumentsLoading(false);
      }
    };

    fetchInstrumentSpotlight();
  }, []);

  // Fetch eras and styles
  const fetchErasAndStyles = async () => {
    try {
      setErasLoading(true);
      const data = await getErasAndStyles(5);
      setEraStyles(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thời kỳ và phong cách:", error);
    } finally {
      setErasLoading(false);
    }
  };

  useEffect(() => {
    fetchErasAndStyles();
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
                  <Image
                    src={currentArtist.image}
                    alt={`${currentArtist.name} portrait`}
                    width={500}
                    height={500}
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
                key={`artist-${artist.id}-${idx}`}
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
          {/* Recommended Songs */}
          <ContentSection title="Recommended Songs" showAllLink="#">
            {loading
              ? // Loading state
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg animate-pulse"
                    >
                      <div className="w-full aspect-square bg-[#D3B995] mb-4 rounded-md"></div>
                      <div className="h-5 bg-[#D3B995] rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-[#D3B995] rounded w-1/2"></div>
                    </div>
                  ))
              : recommendedSongs.length > 0
              ? recommendedSongs.map((song) => (
                  <PlaylistCard
                    key={song.id}
                    title={song.name}
                    description={song.description || "Recommended for you"}
                    image={song.coverPhoto}
                    songId={song.id}
                    onPlayClick={() => handlePlayClick(song.id)}
                  />
                ))
              : // Fallback to default playlists if API fails
                playlistData.map((p, i) => <PlaylistCard key={i} {...p} />)}
          </ContentSection>

          {/* Popular Albums */}
          <ContentSection title="Popular Albums" showAllLink="/user-albums">
            {albumsLoading ? (
              // Loading state
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg animate-pulse"
                  >
                    <div className="w-full aspect-square bg-[#D3B995] mb-4 rounded-md"></div>
                    <div className="h-5 bg-[#D3B995] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#D3B995] rounded w-1/2"></div>
                  </div>
                ))
            ) : popularAlbums.length > 0 ? (
              popularAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))
            ) : (
              <div className="col-span-5 text-center py-16 bg-[#F0E6D6] border border-[#D3B995] rounded-lg text-[#6D4C41]">
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
                <p className="italic text-lg text-[#6D4C41]">
                  {apiError
                    ? apiError
                    : "Không có album nào hiện tại. Vui lòng thử lại sau."}
                </p>
                <button
                  onClick={() => fetchPopularAlbums()}
                  className="mt-4 px-6 py-3 bg-[#C8A97E] text-white rounded-full hover:bg-[#A67C52] transition-colors"
                >
                  Thử lại
                </button>
              </div>
            )}
          </ContentSection>

          {/* Timeless Pieces */}
          <ContentSection title="Timeless Pieces" showAllLink="#">
            {timelessLoading ? (
              // Loading state
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg animate-pulse"
                  >
                    <div className="w-full aspect-square bg-[#D3B995] mb-4 rounded-md"></div>
                    <div className="h-5 bg-[#D3B995] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#D3B995] rounded w-1/2"></div>
                  </div>
                ))
            ) : timelessPieces.length > 0 ? (
              timelessPieces.map((song) => (
                <PlaylistCard
                  key={song.id}
                  title={song.name}
                  description={song.description || "Timeless piece"}
                  image={song.coverPhoto}
                  songId={song.id}
                  onPlayClick={() => handlePlayClick(song.id)}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-[#F0E6D6] border border-[#D3B995] rounded-lg text-[#6D4C41]">
                <p className="italic text-lg">
                  No timeless pieces available at the moment.
                </p>
              </div>
            )}
          </ContentSection>

          {/* Top Artists */}
          <ContentSection title="Top Artists" showAllLink="#">
            {artistsLoading ? (
              // Loading state
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg animate-pulse"
                  >
                    <div className="w-full aspect-square bg-[#D3B995] mb-4 rounded-md"></div>
                    <div className="h-5 bg-[#D3B995] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#D3B995] rounded w-1/2"></div>
                  </div>
                ))
            ) : topArtists.length > 0 ? (
              topArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))
            ) : (
              <div className="text-center py-16 bg-[#F0E6D6] border border-[#D3B995] rounded-lg text-[#6D4C41]">
                <p className="italic text-lg">
                  No top artists available at the moment.
                </p>
              </div>
            )}
          </ContentSection>

          {/* Eras and Styles */}
          <EraStyleSection eraStyles={eraStyles} loading={erasLoading} />

          {/* Instrument Spotlight */}
          <InstrumentSpotlightSection
            spotlights={instrumentSpotlights}
            loading={instrumentsLoading}
            onPlayClick={handlePlayClick}
          />
        </div>
      </main>

      {/* Bottom Banner */}
      <BottomBanner />
    </div>
  );
};

export default HomePage;
