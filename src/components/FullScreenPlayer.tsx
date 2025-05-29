"use client";

import { useMusicPlayer } from "@/context/MusicPlayerContext";
import CustomImage from "@/components/CustomImage";
import { useState } from "react";

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
    playlist,
    currentTrackIndex,
    playSongById,
    isLoading,
    toggleFavorite,
    selectedQuality,
    isUserPremium,
    changeSelectedQuality,
  } = useMusicPlayer();

  const [showLyrics, setShowLyrics] = useState(false);

  if (!currentMusic) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleToggleFavorite = () => {
    if (currentMusic) {
      toggleFavorite(currentMusic.id); // Giả sử toggleFavorite trong context đã được triển khai
    }
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
          <CustomImage
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

        {/* THÊM MỚI: Stats (Lượt nghe, Yêu thích) */}
        {(currentMusic.fullApiData ||
          currentMusic.favoriteCount !== undefined) && (
          <div className="flex items-center justify-center gap-4 text-xs md:text-sm text-[#5D4037] mb-3 md:mb-4">
            {currentMusic.fullApiData?.listenCount !== undefined && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 opacity-70"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>
                  {currentMusic.fullApiData.listenCount.toLocaleString()}
                </span>
              </div>
            )}
            {currentMusic.favoriteCount !== undefined && (
              <div className="flex items-center gap-1">
                <svg
                  className={`w-4 h-4 transition-all ${
                    currentMusic.isFavorite
                      ? "text-red-500 fill-current"
                      : "opacity-70"
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
                <span>{currentMusic.favoriteCount.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {/* THÊM MỚI: Description */}
        {currentMusic.fullApiData?.description && (
          <p className="text-xs md:text-sm text-[#5D4037] max-w-xl mx-auto mb-4 md:mb-6 leading-relaxed px-4">
            {currentMusic.fullApiData.description}
          </p>
        )}

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

            {/* THÊM MỚI: Nút yêu thích */}
            <button
              onClick={handleToggleFavorite}
              className="p-2"
              disabled={isLoading}
            >
              <svg
                className={`w-6 h-6 md:w-7 md:h-7 transition-all ${
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

          <div className="flex items-center justify-center gap-2 pt-2 md:pt-3">
            <span className="text-xs md:text-sm text-[#5D4037] mr-1 md:mr-2">
              Chất lượng:
            </span>
            <button
              onClick={() => changeSelectedQuality("128kbps")}
              disabled={isLoading} // Vô hiệu hóa khi player đang load bài khác
              className={`px-2.5 py-1 text-xs md:text-sm rounded-full border transition-colors
                ${
                  selectedQuality === "128kbps"
                    ? "bg-[#A67C52] text-white border-[#A67C52]"
                    : "bg-transparent text-[#5D4037] border-[#D3B995] hover:bg-[#E6D7C3]"
                }
              `}
            >
              128kbps
            </button>
            <button
              onClick={() => changeSelectedQuality("320kbps")}
              disabled={isLoading || isUserPremium === false}
              title={
                isUserPremium === false
                  ? "Chất lượng 320kbps yêu cầu tài khoản Premium"
                  : ""
              }
              className={`relative group px-2.5 py-1 text-xs md:text-sm rounded-full border transition-colors
                ${
                  selectedQuality === "320kbps"
                    ? "bg-[#A67C52] text-white border-[#A67C52]"
                    : "bg-transparent text-[#5D4037] border-[#D3B995] hover:bg-[#E6D7C3]"
                }
                ${
                  isUserPremium === false ? "opacity-60 cursor-not-allowed" : ""
                }
              `}
            >
              320kbps
              {isUserPremium !== null &&
                !isUserPremium && ( // Icon khóa nếu không phải premium
                  <svg
                    className="w-3 h-3 absolute -top-1 -right-1 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              {isUserPremium === true && ( // Icon premium nếu là premium user
                <svg
                  className="w-3 h-3 absolute -top-1 -right-1 text-amber-500 group-hover:text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </button>
          </div>

          {/* Nút xem lời bài hát */}
          {currentMusic.lyric && (
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              className="mt-4 text-sm text-[#A67C52] hover:text-[#8B5A3C] font-semibold py-2 px-4 rounded-full hover:bg-[#E6D7C3]/50 transition-colors"
            >
              {showLyrics ? "Ẩn Lời Bài Hát" : "Xem Lời Bài Hát"}
            </button>
          )}

          {/* THÊM MỚI: Khu vực hiển thị Lời Bài Hát (nếu showLyrics là true) */}
          {showLyrics && (
            <div className="w-full max-w-2xl mx-auto mt-2 mb-8 p-1 md:p-0">
              <div className="bg-[#E6D7C3]/30 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-inner max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#C8A97E]/70 scrollbar-track-transparent">
                <h4 className="text-md md:text-lg font-semibold text-[#3A2A24] mb-2 text-center">
                  Lời bài hát
                </h4>
                {currentMusic.lyric ? (
                  <p className="whitespace-pre-line text-sm md:text-base text-[#3A2A24] text-center leading-relaxed">
                    {currentMusic.lyric}
                  </p>
                ) : (
                  <p className="text-center text-sm text-[#5D4037]">
                    Không có lời cho bài hát này.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* BƯỚC 3: THÊM PHẦN HIỂN THỊ PLAYLIST */}
          <div className="w-full max-w-lg mx-auto mt-6 md:mt-8 pb-8">
            <h3 className="text-lg font-semibold text-[#3A2A24] mb-3 text-left px-2">
              Hàng chờ phát
            </h3>
            <div className="max-h-[20vh] md:max-h-[25vh] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-[#C8A97E]/70 scrollbar-track-[#F8F0E3]/50 rounded-lg">
              {playlist.length > 0 ? (
                playlist.map((song, index) => (
                  <button
                    key={`${song.id}-${index}`} // Đảm bảo key là duy nhất
                    onClick={() => {
                      if (currentTrackIndex !== index) {
                        // Chỉ gọi playSongById nếu click vào bài khác
                        playSongById(song.id);
                      } else {
                        togglePlayPause(); // Nếu click vào bài đang phát thì play/pause
                      }
                    }}
                    disabled={isLoading && currentMusic?.id === song.id} // Disable nút khi bài đó đang load
                    className={`w-full flex items-center p-2.5 rounded-xl transition-all duration-200 text-left group
                ${
                  isLoading && currentMusic?.id === song.id
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }
                ${
                  index === currentTrackIndex
                    ? "bg-[#C8A97E]/40 border border-[#A67C52]/60 shadow-sm"
                    : "hover:bg-[#E6D7C3]/70"
                }
              `}
                  >
                    <CustomImage
                      src={song.coverPhoto || "/default-cover.png"} // Thêm fallback
                      alt={song.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-lg object-cover mr-3 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-sm truncate ${
                          index === currentTrackIndex
                            ? "text-[#2D1B14]"
                            : "text-[#3A2A24] group-hover:text-[#2D1B14]"
                        }`}
                      >
                        {song.name}
                      </p>
                      <p
                        className={`text-xs truncate ${
                          index === currentTrackIndex
                            ? "text-[#5D4037]"
                            : "text-[#6D4C41] group-hover:text-[#5D4037]"
                        }`}
                      >
                        {song.artist}
                      </p>
                    </div>
                    {index === currentTrackIndex && (
                      <div className="ml-auto flex items-center">
                        {isPlaying ? (
                          <svg
                            className="w-5 h-5 text-[#A67C52]"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v14zM14 8v8M10 8v8" />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-[#A67C52]"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                          </svg>
                        )}
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-center text-sm text-[#5D4037] py-4">
                  Hàng chờ đang trống.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FullScreenPlayer;
