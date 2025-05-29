"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar";
import CustomImage from "@/components/CustomImage";

// Sample data for playlists
const playlistsData = [
  {
    id: 1,
    title: "Liked Songs",
    description: "2 liked songs",
    artists: ["Ali Sethi", "Ranjish Hi Sahi", "Willum Maindo"],
    color: "bg-purple-600",
    image: "/playlists/liked-songs.png",
    isLiked: true,
  },
  {
    id: 2,
    title: "Your Episodes",
    description: "14 episodes",
    image: "/playlists/your-episodes.png",
    color: "bg-emerald-700",
  },
  {
    id: 3,
    title: "Bollywood Jazz",
    description: "The best of Jazz music from Bollywood. Cover-",
    image: "/playlists/bollywood-jazz.png",
    color: "bg-gray-800",
  },
  {
    id: 4,
    title: "Hangover Cure",
    description: "Trust us, you need this!",
    image: "/playlists/hangover-cure.png",
    color: "bg-gray-700",
  },
  {
    id: 5,
    title: "Your Top Songs 2022",
    image: "/playlists/top-2022.png",
    color: "bg-green-500",
  },
  {
    id: 6,
    title: "Desi Indie",
    image: "/playlists/desi-indie.png",
    color: "bg-red-500",
  },
  {
    id: 7,
    title: "Hindi Underground",
    image: "/playlists/hindi-underground.png",
    color: "bg-gray-800",
  },
  {
    id: 8,
    title: "Hindie Rock",
    image: "/playlists/hindie-rock.png",
    color: "bg-yellow-500",
  },
];

// Navigation categories
const categories = ["Playlists", "Artists", "Albums"];

const PlaylistPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Playlists");
  const firstPlaylist = playlistsData[0];
  const artists = firstPlaylist?.artists ?? [];
  //const [currentProgress, setCurrentProgress] = useState(50); // For the progress bar, 0-100
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="bg-black bg-opacity-30 text-white rounded-full p-1 hover:bg-opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Category tabs */}
            <div className="ml-8 flex space-x-4">
              {categories.map((category) => (
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Profile dropdown menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Account
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <div className="border-t border-gray-200 my-1"></div>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Log out
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="px-8 pt-4">
          <h1 className="text-3xl font-bold mb-6 text-black">Playlists</h1>

          {/* Featured playlist - large card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="col-span-2 bg-purple-600 rounded-lg overflow-hidden">
              <div className="p-5 flex flex-col h-full">
                <div className="flex-1">
                  <div className="text-sm opacity-80 mb-1 text-white">
                    {artists.map((artist, index) => (
                      <span key={index}>
                        {artist}
                        {index < artists.length - 1 ? " • " : ""}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-5xl font-bold mb-2 text-white">
                    {playlistsData[0].title}
                  </h2>
                  <p className="text-sm opacity-80 text-white">
                    {playlistsData[0].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Other playlists in grid */}
            {playlistsData.slice(1, 4).map((playlist) => (
              <div
                key={playlist.id}
                className={`${playlist.color} rounded-lg overflow-hidden p-4 flex flex-col text-white`}
              >
                <div className="mb-4 flex-grow">
                  <div className="w-full flex justify-center">
                    {playlist.id === 2 && (
                      <div className="w-20 h-32 bg-green-500 rounded-md flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-base">{playlist.title}</h3>
                <p className="text-sm opacity-80 mt-1">
                  {playlist.description}
                </p>
              </div>
            ))}
          </div>

          {/* Smaller playlist cards in grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {playlistsData.slice(4).map((playlist) => (
              <div
                key={playlist.id}
                className="bg-gray-100 rounded-lg overflow-hidden hover:bg-gray-200 transition-colors group"
              >
                <div className="p-4">
                  <div className="relative mb-4">
                    <div className="relative w-full aspect-square rounded shadow-md">
                      <CustomImage
                        src={playlist.image || "/placeholder-playlist.jpg"}
                        alt={playlist.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform translate-y-2 group-hover:translate-y-0">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="text-black"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </button>
                  </div>
                  <h3 className="font-bold text-base truncate">
                    {playlist.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Player bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 h-20 z-40 flex items-center px-4">
        <div className="flex items-center w-1/4">
          <div className="relative h-14 w-14 mr-3">
            <CustomImage
              src="/podcast-thumbnail.jpg"
              alt="Current playing"
              fill
              className="object-cover rounded" // optional: add "rounded" if needed
            />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              Competing with giants: An inside look at how Tinder...
            </p>
            <p className="text-xs text-gray-400">
              Lenny Podcast: Product | Growth | Career
            </p>
          </div>
        </div>

        <div className="w-2/4 flex flex-col items-center">
          <div className="flex items-center mb-1 space-x-4">
            <button className="text-gray-400 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M14.8 10a2 2 0 0 0-.6-1.4l-4-4a2 2 0 0 0-2.8 2.8L9.2 10l-2.8 2.8a2 2 0 0 0 2.8 2.8l4-4A2 2 0 0 0 14.8 10z"
                  transform="rotate(180 10 10)"
                />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="bg-white rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M14.8 10a2 2 0 0 0-.6-1.4l-4-4a2 2 0 0 0-2.8 2.8L9.2 10l-2.8 2.8a2 2 0 0 0 2.8 2.8l4-4A2 2 0 0 0 14.8 10z" />
              </svg>
            </button>
          </div>

          <div className="w-full flex items-center">
            <span className="text-xs text-gray-400 mr-2">0:53</span>
            <div className="flex-1 h-1 bg-gray-700 rounded-full">
              <div
                className="h-1 bg-gray-300 rounded-full"
                // style={{ width: `${currentProgress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400 ml-2">1:28:37</span>
          </div>
        </div>

        <div className="w-1/4 flex justify-end items-center space-x-3">
          <button className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              <path d="M14 4h-4v10h4a2 2 0 002-2V6a2 2 0 00-2-2z" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 4a1 1 0 011-1h8a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V4z" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
              <path d="M10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </button>

          <div className="w-20 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1 h-1 bg-gray-700 rounded-full mx-1">
              <div
                className="h-1 bg-gray-300 rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707A1 1 0 0110 3zm7.707 3.293a1 1 0 010 1.414L16.414 9l1.293 1.293a1 1 0 01-1.414 1.414L15 10.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 9l-1.293-1.293a1 1 0 011.414-1.414L15 7.586l1.293-1.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <button className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
