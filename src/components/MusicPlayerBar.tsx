"use client";

import { useMusicPlayer } from "@/context/MusicPlayerContext";
import CustomImage from "@/components/CustomImage";

const MusicPlayerBar = () => {
  const {
    currentMusic,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    playNext,
    playPrevious,
    toggleFavorite,
    seek,
    toggleExpandPlayer,
  } = useMusicPlayer();

  console.log("Current Music:", currentMusic);

  if (!currentMusic) return null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (duration) {
      seek((parseFloat(e.target.value) / 100) * duration);
    }
  };

  return (
    <div className="h-20 bg-white/70 backdrop-blur-lg shadow-2xl flex items-center px-4 border-t border-gray-200">
      {/* THANH TUA NHẠC (SEEK BAR) */}
      <input
        type="range"
        min="0"
        max="100"
        value={duration ? (currentTime / duration) * 100 : 0}
        onChange={handleSeek}
        className="absolute top-0 left-0 w-full h-1 appearance-none cursor-pointer slider-progress"
      />

      {/* Thông tin bài hát */}
      <div
        className="w-1/4 flex items-center min-w-0"
        onClick={toggleExpandPlayer}
        style={{ cursor: "pointer" }}
      >
        <div className="w-16 h-16 flex-shrink-0">
          <CustomImage
            src={currentMusic.coverPhoto}
            alt={currentMusic.name}
            width={64}
            height={64}
            className="rounded-md object-cover w-full h-full"
          />
        </div>
        <div className="ml-3 min-w-0">
          <p className="font-bold text-[#2D1B14] truncate">
            {currentMusic.name}
          </p>
          <p className="text-sm text-[#5D4037] truncate">
            {currentMusic.artist}
          </p>
        </div>
      </div>

      {/* Nút điều khiển trung tâm */}
      <div className="w-2/4 flex items-center justify-center gap-4">
        <button
          onClick={playPrevious}
          className="p-2 text-[#5D4037] hover:text-black"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14.132V5.868a1 1 0 00-1.555-.832L4 8.168V6a1 1 0 00-2 0v8a1 1 0 002 0v-2.168l4.445 3.168z"></path>
          </svg>
        </button>
        <button
          onClick={togglePlayPause}
          className="w-14 h-14 bg-gradient-to-r from-[#C8A97E] to-[#A67C52] text-white rounded-full flex items-center justify-center transition-transform hover:scale-110"
        >
          {isPlaying ? (
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V6zm8-2a2 2 0 00-2 2v8a2 2 0 002 2h2a2 2 0 002-2V6a2 2 0 00-2-2h-2z"></path>
            </svg>
          ) : (
            <svg
              className="w-7 h-7 ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.002v3.996a1 1 0 001.555.832l3.197-2a1 1 0 000-1.664l-3.197-2z"></path>
            </svg>
          )}
        </button>
        <button
          onClick={playNext}
          className="p-2 text-[#5D4037] hover:text-black"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11.555 5.168A1 1 0 0010 5.868v8.264a1 1 0 001.555.832l4.445-3.168V14a1 1 0 002 0V6a1 1 0 00-2 0v2.168l-4.445-3.168z"></path>
          </svg>
        </button>
      </div>

      {/* Điều khiển phụ (Yêu thích, Âm lượng...) */}
      <div className="w-1/4 flex items-center justify-end gap-4">
        <button onClick={() => toggleFavorite(currentMusic.id)} className="p-2">
          <svg
            className={`w-6 h-6 transition-all ${
              currentMusic.isFavorite
                ? "text-red-500 fill-current"
                : "text-[#5D4037] hover:text-red-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </button>
        {/* Nút Âm lượng sẽ được đặt trong FullScreenPlayer cho gọn */}
      </div>
    </div>
  );
};

export default MusicPlayerBar;
