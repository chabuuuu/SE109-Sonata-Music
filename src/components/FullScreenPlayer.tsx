"use client";

import { useMusicPlayer } from "@/context/MusicPlayerContext";
import Image from "next/image";

const FullScreenPlayer = () => {
  const {
    currentMusic,
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    seek,
    volume,
    changeVolume,
    toggleExpandPlayer,
    playNext,
    playPrevious,
  } = useMusicPlayer();

  if (!currentMusic) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gradient-to-br from-white via-[#F8F0E3] to-[#E6D7C3] p-8 flex flex-col justify-between overflow-y-auto h-full">
      <button
        onClick={toggleExpandPlayer}
        className="absolute top-6 right-6 w-12 h-12 bg-white/50 rounded-full flex items-center justify-center backdrop-blur-sm z-10 hover:bg-white/80 transition"
      >
        <svg
          className="w-6 h-6 text-[#5D4037]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      <div className="flex-grow flex flex-col items-center justify-center text-center pt-16">
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-[#C8A97E]/30 mb-8">
          <Image
            src={currentMusic.coverPhoto}
            alt={currentMusic.name}
            width={320}
            height={320}
            className="object-cover w-full h-full"
          />
        </div>
        <h2 className="font-bold text-[#2D1B14] text-4xl font-['Playfair_Display',serif] mb-2">
          {currentMusic.name}
        </h2>
        <p className="text-lg text-[#5D4037] mb-8">{currentMusic.artist}</p>
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center gap-4 text-sm font-medium text-[#5D4037]">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={(e) =>
                seek((parseFloat(e.target.value) / 100) * duration)
              }
              className="w-full h-2 bg-[#E6D7C3] rounded-full appearance-none cursor-pointer"
            />
            <span>{formatTime(duration)}</span>
          </div>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={playPrevious}
              className="p-2 text-[#5D4037] hover:text-black"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.445 14.832A1 1 0 0010 14.132V5.868a1 1 0 00-1.555-.832L4 8.168V6a1 1 0 00-2 0v8a1 1 0 002 0v-2.168l4.445 3.168z"></path>
              </svg>
            </button>
            <button
              onClick={togglePlayPause}
              className="w-20 h-20 bg-gradient-to-r from-[#C8A97E] to-[#A67C52] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
            >
              {/* Icon play/pause */}
            </button>
            <button
              onClick={playNext}
              className="p-2 text-[#5D4037] hover:text-black"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11.555 5.168A1 1 0 0010 5.868v8.264a1 1 0 001.555.832l4.445-3.168V14a1 1 0 002 0V6a1 1 0 00-2 0v2.168l-4.445-3.168z"></path>
              </svg>
            </button>
          </div>
          {/* THANH ĐIỀU KHIỂN ÂM LƯỢNG */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <svg
              className="w-5 h-5 text-[#5D4037]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-4.242a1 1 0 010 1.414"
              ></path>
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              value={Number(volume) * 100}
              onChange={(e) => changeVolume(parseFloat(e.target.value) / 100)}
              className="w-32 h-1.5 bg-[#E6D7C3] rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default FullScreenPlayer;
