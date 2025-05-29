"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { getAuthHeaders } from "@/services/authService";
import { addToFavorite, removeFromFavorite, checkIsFavorite, clearFavoriteStatusCache, favoriteEvents } from "@/services/favoriteService";

// --- BƯỚC 1: ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU TỪ API ---

// Kiểu dữ liệu cho một nghệ sĩ trong API
interface ApiArtist {
  id: number;
  name: string;
  picture: string;
  // ... các trường khác nếu có
}

// Kiểu dữ liệu cho một bài hát trong API (cả trong queue và detail)
interface ApiMusic {
  id: number;
  name: string;
  coverPhoto: string;
  resourceLink: string;
  favoriteCount: number;
  listenCount: number;
  lyric?: string;
  artists?: ApiArtist[];
  // ... các trường khác từ API detail
}

// Kiểu dữ liệu cho một item trong streamQueue
interface ApiQueueItem {
  music: ApiMusic;
}

// --- KIỂU DỮ LIỆU NỘI BỘ CỦA PLAYER ---
// Đây là dữ liệu đã được chuẩn hóa để UI sử dụng
export interface GlobalMusic {
  id: string; // Luôn là string để nhất quán
  name: string;
  artist: string;
  coverPhoto: string;
  resourceLink: string;
  favoriteCount: number;
  isFavorite?: boolean;
  // Thêm các trường bạn muốn hiển thị chi tiết
  lyric?: string;
  fullApiData?: ApiMusic; // Lưu lại toàn bộ dữ liệu gốc từ API nếu cần
}

// --- STATE CỦA CONTEXT ---
interface MusicPlayerState {
  playlist: GlobalMusic[];
  currentTrackIndex: number | null;
  currentMusic: GlobalMusic | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean; // THÊM MỚI: Trạng thái loading toàn cục
  isExpanded: boolean;
  playSongById: (musicId: number | string) => Promise<void>; // THAY ĐỔI
  togglePlayPause: () => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  toggleFavorite: (songId: string) => Promise<void>;
  seek: (time: number) => void;
  toggleExpandPlayer: () => void;
  volume: number;
  changeVolume: (newVolume: number) => void;

  // ... các hàm khác nếu cần
}

const MusicPlayerContext = createContext<MusicPlayerState | undefined>(
  undefined
);

// --- BƯỚC 2: TÁI CẤU TRÚC HOÀN TOÀN PROVIDER ---

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [playlist, setPlaylist] = useState<GlobalMusic[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
    null
  );
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // State loading mới
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement>(null);

  console.log("Current Track Index:", currentTrackIndex);
  console.log("Playlist:", playlist);

  const currentMusic =
    currentTrackIndex !== null ? playlist[currentTrackIndex] : null;

  // Hàm chuyển đổi dữ liệu từ API Queue sang định dạng GlobalMusic
  const mapApiQueueToGlobalMusic = (
    apiQueue: ApiQueueItem[]
  ): GlobalMusic[] => {
    console.log("Api Queue:", apiQueue);

    return apiQueue
      .filter(
        (item) =>
          item && // Đảm bảo 'item' không phải là null/undefined
          item.music && // Đảm bảo 'item.music' không phải là null/undefined <--- ĐIỀU KIỆN CỦA BẠN ĐÃ CÓ Ở ĐÂY
          typeof item.music.id === "number" && // Đảm bảo 'id' là số
          typeof item.music.name === "string" // Đảm bảo 'name' là chuỗi
      )
      .map((item) => {
        // Chỉ những item hợp lệ mới vào được hàm map này
        const musicData = item.music; // Lúc này, musicData chắc chắn không phải là null
        return {
          id: musicData.id.toString(),
          name: musicData.name,
          artist:
            musicData.artists && musicData.artists.length > 0
              ? musicData.artists[0].name
              : "Nghệ sĩ chưa xác định",
          coverPhoto: musicData.coverPhoto || "/default-cover.png",
          resourceLink: musicData.resourceLink || "", // Sẽ được cập nhật sau khi gọi API detail
          favoriteCount: musicData.favoriteCount || 0,
          isFavorite: false,
          lyric: musicData.lyric,
          fullApiData: musicData,
        };
      });
  };

  // Hàm chính điều phối chuỗi API
  const playSongById = async (musicId: number | string) => {
    setIsLoading(true);
    setError("");
    try {
      // 1. Gọi API Add to Queue
      const queueResponse = await axios.post(
        `https://api.sonata.io.vn/api/v1/stream-queue/add/${musicId}`,
        {},
        { headers: getAuthHeaders() }
      );

      if (!queueResponse.data.success)
        throw new Error("Không thể thêm vào hàng chờ.");

      const { streamQueue, currentPlaying } = queueResponse.data.data;

      // 2. Lấy musicId hiện tại và cập nhật playlist
      const currentPlayingId = currentPlaying.musicId;
      const newPlaylist = mapApiQueueToGlobalMusic(streamQueue);
      setPlaylist(newPlaylist);
      setCurrentTrackIndex(currentPlaying.index);

      // 3. Gọi API Get Music Detail
      const detailResponse = await axios.get(
        `https://api.sonata.io.vn/api/v1/music/${currentPlayingId}`,
        { headers: getAuthHeaders() }
      );

      if (!detailResponse.data.success)
        throw new Error("Không thể lấy chi tiết bài hát.");

      const detailedMusicData: ApiMusic = detailResponse.data.data;

      // 4. Cập nhật bài hát hiện tại trong playlist với dữ liệu chi tiết
      setPlaylist((prevPlaylist) => {
        const updatedPlaylist = [...prevPlaylist];
        const trackIndex = currentPlaying.index;
        if (updatedPlaylist[trackIndex]) {
          updatedPlaylist[trackIndex] = {
            ...updatedPlaylist[trackIndex], // Giữ lại thông tin cơ bản
            resourceLink: detailedMusicData.resourceLink, // Cập nhật link nhạc thật
            lyric: detailedMusicData.lyric,
            fullApiData: detailedMusicData, // Lưu lại toàn bộ data gốc
          };
        }
        return updatedPlaylist;
      });

      // 5. Fetch và phát audio từ `resourceLink` mới
      const audioBlobResponse = await axios.get(
        detailedMusicData.resourceLink,
        {
          headers: { ...getAuthHeaders() },
          responseType: "blob",
        }
      );
      const audioUrl = URL.createObjectURL(new Blob([audioBlobResponse.data]));

      if (audioSrc && audioSrc.startsWith("blob:")) {
        URL.revokeObjectURL(audioSrc);
      }
      setAudioSrc(audioUrl);
      setIsPlaying(true);

      console.log("Đã phát bài hát:", detailedMusicData.name);
    } catch (err) {
      console.error("Lỗi khi phát nhạc:", err);
      setError("Đã có lỗi xảy ra khi phát nhạc.");
      // Reset state
      setPlaylist([]);
      setCurrentTrackIndex(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm next/previous giờ đây sẽ gọi lại playSongById
  const playNext = async () => {
    if (currentTrackIndex === null || playlist.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    const nextSongId = playlist[nextIndex].id;
    await playSongById(nextSongId);
  };

  const playPrevious = async () => {
    if (currentTrackIndex === null || playlist.length === 0) return;
    const prevIndex =
      (currentTrackIndex - 1 + playlist.length) % playlist.length;
    const prevSongId = playlist[prevIndex].id;
    await playSongById(prevSongId);
  };

  // --- Các hàm và useEffect còn lại ---

  const togglePlayPause = () => {
    if (audioRef.current && audioRef.current.src) setIsPlaying(!isPlaying);
  };
  const seek = (time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  };
  const changeVolume = (newVolume: number) => {
    if (audioRef.current) audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };
  const toggleExpandPlayer = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && audio.src) {
      audio.play().catch((e) => console.error("Play error:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, audioSrc]);

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };
  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    playNext();
  };

  const toggleFavorite = async (songId: string) => {
    try {
      const musicId = parseInt(songId);
      if (isNaN(musicId)) {
        console.error('Invalid music ID:', songId);
        return;
      }

      // Tìm bài hát trong playlist hiện tại
      const currentSong = playlist.find(song => song.id === songId);
      if (!currentSong) {
        console.error('Song not found in playlist:', songId);
        return;
      }

      console.log(`🎵 Toggling favorite for song: ${currentSong.name} (ID: ${musicId})`);

      // Kiểm tra trạng thái favorite hiện tại
      const isFavorite = currentSong.isFavorite || false;

      if (isFavorite) {
        // Xóa khỏi favorite
        await removeFromFavorite(musicId);
        console.log('✅ Removed from favorites');
        
        // Emit global event
        favoriteEvents.emit('favoriteStatusChanged', {
          type: 'music',
          id: musicId,
          action: 'removed',
          newStatus: false
        });
      } else {
        // Thêm vào favorite
        await addToFavorite(musicId);
        console.log('✅ Added to favorites');
        
        // Emit global event
        favoriteEvents.emit('favoriteStatusChanged', {
          type: 'music',
          id: musicId,
          action: 'added',
          newStatus: true
        });
      }

      // Clear cache để force refresh status
      clearFavoriteStatusCache(musicId);

      // Cập nhật state local
      setPlaylist((prevPlaylist) =>
        prevPlaylist.map((song) =>
          song.id === songId ? { ...song, isFavorite: !isFavorite } : song
        )
      );

    } catch (error) {
      console.error('❌ Error toggling favorite:', error);
      // Clear cache trong trường hợp lỗi để force refresh
      const musicId = parseInt(songId);
      if (!isNaN(musicId)) {
        clearFavoriteStatusCache(musicId);
      }
      // Có thể thêm toast notification ở đây nếu cần
    }
  };

  const value = {
    playlist,
    currentTrackIndex,
    currentMusic,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    isExpanded,
    volume,
    playSongById,
    togglePlayPause,
    playNext,
    playPrevious,
    toggleFavorite,
    changeVolume,
    seek,
    toggleExpandPlayer,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={audioSrc || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = (): MusicPlayerState => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined)
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  return context;
};
