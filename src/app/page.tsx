"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import CustomImage from "@/components/CustomImage";
import SearchBar from "@/components/SearchBar";
import BottomBanner from "@/components/bottom_banner";
import { getRecommendedSongs, Song } from "@/services/recommendService";
import {
  getPopularAlbums,
  Album,
  searchAlbums,
  AlbumSearchResponse,
} from "@/services/albumService";
import { getTimelessPieces } from "@/services/timelessService";
import {
  getTopArtists,
  Artist,
  getArtistsForHome,
  getAllArtists,
} from "@/services/artistService";
import {
  getInstrumentSpotlight,
  InstrumentSpotlight,
  Instrument,
} from "@/services/instrumentService";
import { getErasAndStyles, EraStyle, Period } from "@/services/eraService";
import {
  addToFavorite,
  removeFromFavorite,
  checkIsFavorite,
  clearFavoriteStatusCache,
  favoriteEvents,
  followArtist,
  unfollowArtist,
  checkIsFollowingArtist,
  clearFollowStatusCache,
  likeAlbum,
  unlikeAlbum,
  checkIsLikedAlbum,
} from "@/services/favoriteService";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/services/authService";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

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
  "/music-background-1.jpg",
  "/music-background-2.jpg",
  "/music-background-3.jpg",
  "/music-background-4.jpg",
  "/music-background-5.jpg",
];

// Playlists data
const playlistData = [
  {
    id: 1,
    title: "Peaceful Piano",
    description: "Relax and indulge with beautiful piano pieces",
    image: "/playlist_imgs/peaceful_piano.jpg",
  },
  {
    id: 2,
    title: "Deep Focus",
    description: "Keep calm and focus with ambient and post-",
    image: "/playlist_imgs/deep_focus.jpg",
  },
  {
    id: 3,
    title: "Instrumental Study",
    description: "Focus with soft study music in the background",
    image: "/playlist_imgs/instrumental_study.jpg",
  },
  {
    id: 4,
    title: "Jazz Vibes",
    description: "The original chill instrumental beats playlist",
    image: "/playlist_imgs/jazz_vibes.jpg",
  },
  {
    id: 5,
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
 *  FAVORITE BUTTON COMPONENT
 * -----------------------------
 */

// Interface cho FavoriteButton props
interface FavoriteButtonProps {
  id: number;
  type: "music" | "artist" | "album";
  className?: string;
  iconSize?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  id,
  type,
  className = "text-[#C8A97E] hover:text-[#A67C52] transition-colors",
  iconSize = "h-5 w-5",
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const { isLoggedIn } = useAuth();

  // Tạo ref để track component mount status
  const isMounted = useRef(true);

  // Function để check favorite status
  const checkFavoriteStatus = async () => {
    if (!isLoggedIn || !isMounted.current) {
      setIsCheckingStatus(false);
      return;
    }

    try {
      setIsCheckingStatus(true);
      let status = false;
      if (type === "music") {
        status = await checkIsFavorite(id);
      } else if (type === "artist") {
        status = await checkIsFollowingArtist(id);
      } else if (type === "album") {
        status = await checkIsLikedAlbum(id);
      }

      if (isMounted.current) {
        setIsFavorited(status);
      }
    } catch (error) {
      console.error("❤️ Lỗi khi kiểm tra trạng thái favorite:", error);
      // Không hiển thị toast cho lỗi check status để tránh spam
    } finally {
      if (isMounted.current) {
        setIsCheckingStatus(false);
      }
    }
  };

  // Kiểm tra trạng thái favorite khi component mount
  useEffect(() => {
    isMounted.current = true;
    checkFavoriteStatus();

    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [id, type, isLoggedIn]);

  // Thêm listener cho window focus để re-check status khi user quay lại tab/page
  useEffect(() => {
    const handleFocus = () => {
      // Delay một chút để đảm bảo API calls khác đã hoàn thành
      setTimeout(() => {
        if (isLoggedIn && isMounted.current) {
          checkFavoriteStatus();
        }
      }, 500);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && isLoggedIn && isMounted.current) {
        setTimeout(() => {
          checkFavoriteStatus();
        }, 500);
      }
    };

    // Listen to global favorite events để đồng bộ trạng thái
    const handleFavoriteStatusChanged = (data: any) => {
      // Chỉ update nếu event match với component hiện tại
      if (data.type === type && data.id === id && isMounted.current) {
        console.log(`🔄 Global event received for ${type} ${id}:`, data);

        // Cập nhật state trực tiếp từ event để tránh delay
        if (data.action === "added" || data.action === "followed") {
          setIsFavorited(true);
        } else if (data.action === "removed" || data.action === "unfollowed") {
          setIsFavorited(false);
        }

        // Force re-check sau một khoảng thời gian ngắn để đảm bảo consistency
        setTimeout(() => {
          if (isMounted.current) {
            checkFavoriteStatus();
          }
        }, 1000);
      }
    };

    const handleAllFavoritesCleared = (data: any) => {
      // Clear trạng thái nếu type phù hợp
      if (data.type === type && isMounted.current) {
        console.log(`🔄 All favorites cleared for ${type}`);
        checkFavoriteStatus();
      }
    };

    // Handle force refresh all event
    const handleForceRefreshAll = () => {
      if (isMounted.current) {
        console.log(`🔄 Force refresh triggered for ${type} ${id}`);
        // Clear cache trước khi refresh
        if (type === "artist") {
          clearFollowStatusCache(id);
        } else {
          clearFavoriteStatusCache(id);
        }
        // Force check lại status
        checkFavoriteStatus();
      }
    };

    // Add event listeners
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    favoriteEvents.on("favoriteStatusChanged", handleFavoriteStatusChanged);
    favoriteEvents.on("allFavoritesCleared", handleAllFavoritesCleared);
    favoriteEvents.on("forceRefreshAll", handleForceRefreshAll);

    // Cleanup
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      favoriteEvents.off("favoriteStatusChanged", handleFavoriteStatusChanged);
      favoriteEvents.off("allFavoritesCleared", handleAllFavoritesCleared);
      favoriteEvents.off("forceRefreshAll", handleForceRefreshAll);
    };
  }, [isLoggedIn, id, type]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    // Optimistic update
    const previousState = isFavorited;
    setIsFavorited(!isFavorited);

    try {
      if (type === "music") {
        if (previousState) {
          await removeFromFavorite(id);
          toast.success("Đã xóa khỏi danh sách yêu thích");
        } else {
          await addToFavorite(id);
          toast.success("Đã thêm vào danh sách yêu thích");
        }
      } else if (type === "artist") {
        if (previousState) {
          await unfollowArtist(id);
          toast.success("Đã hủy theo dõi nghệ sĩ");
        } else {
          const result = await followArtist(id);
          if (result.success) {
            toast.success("Đã theo dõi nghệ sĩ");
          }
        }
      } else if (type === "album") {
        if (previousState) {
          await unlikeAlbum(id);
          toast.success("Đã bỏ thích album");
        } else {
          await likeAlbum(id);
          toast.success("Đã thích album");
        }
      }

      // Force re-check status sau khi thực hiện action thành công
      setTimeout(() => {
        if (isMounted.current) {
          checkFavoriteStatus();
        }
      }, 1000);
    } catch (error: any) {
      console.error("❤️ Lỗi khi toggle favorite:", error);

      // Revert optimistic update
      if (isMounted.current) {
        setIsFavorited(previousState);
      }

      const errorMessage =
        error.message || "Có lỗi xảy ra khi thực hiện thao tác";

      // Xử lý trường hợp đã follow/favorite rồi
      if (
        errorMessage.includes("Đã follow") ||
        errorMessage.includes("đã follow") ||
        errorMessage.includes("Đã theo dõi") ||
        errorMessage.includes("đã theo dõi") ||
        errorMessage.includes("Đã thích") ||
        errorMessage.includes("đã thích") ||
        errorMessage.includes("already") ||
        errorMessage.includes("duplicate") ||
        errorMessage.includes("exists")
      ) {
        console.warn("Action already performed:", errorMessage);
        // Set state dựa trên thông báo lỗi
        if (isMounted.current) {
          setIsFavorited(true);
        }
        // Clear cache để force fresh check
        if (type === "artist") {
          clearFollowStatusCache(id);
        } else {
          clearFavoriteStatusCache(id);
        }
        // Force re-check để đảm bảo state đúng
        setTimeout(() => {
          if (isMounted.current) {
            checkFavoriteStatus();
          }
        }, 500);

        // Hiển thị thông báo thành công thay vì lỗi
        if (type === "artist") {
          toast.success("Đã theo dõi nghệ sĩ này rồi");
        } else if (type === "music") {
          toast.success("Đã thêm vào yêu thích rồi");
        } else if (type === "album") {
          toast.success("Đã thích album này rồi");
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  // Hiển thị loading khi đang check status
  if (isCheckingStatus) {
    return (
      <div className={iconSize}>
        <svg
          className={`${iconSize} animate-pulse text-[#D3B995]`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading || !isLoggedIn}
      className={`${className} ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      } ${!isLoggedIn ? "opacity-50" : ""} relative group`}
      title={
        !isLoggedIn
          ? "Vui lòng đăng nhập"
          : type === "artist"
          ? isFavorited
            ? "Bỏ theo dõi"
            : "Theo dõi nghệ sĩ"
          : isFavorited
          ? "Bỏ khỏi yêu thích"
          : "Thêm vào yêu thích"
      }
    >
      {isLoading ? (
        <svg
          className={`${iconSize} animate-spin`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${iconSize} transition-transform duration-200 ${
            isFavorited ? "scale-110" : "group-hover:scale-110"
          }`}
          viewBox="0 0 20 20"
          fill={isFavorited ? "currentColor" : "none"}
          stroke="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
            strokeWidth={isFavorited ? "0" : "2"}
          />
        </svg>
      )}
    </button>
  );
};

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
      <CustomImage
        src={image}
        alt={title || "Music"}
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
          {songId && <FavoriteButton id={songId} type="music" />}
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
//       <CustomImage
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
        <CustomImage
          src={album.coverPhoto}
          alt={album.name || "Album"}
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
        <p className="text-sm text-[#6D4C41] line-clamp-2">
          {album.description}
        </p>
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
            <FavoriteButton
              id={typeof album.id === "string" ? parseInt(album.id) : album.id}
              type="album"
            />
          </div>
        </div>
      </div>
    </article>
  </Link>
);

// Artist card component
const ArtistCard: React.FC<{
  artist: Artist;
}> = ({ artist }) => {
  // State cho follow functionality
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followStatusChecked, setFollowStatusChecked] = useState(false);

  // Check follow status khi component mount
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!artist?.id) return;
      
      try {
        const status = await checkIsFollowingArtist(artist.id);
        setIsFollowing(status);
      } catch (error) {
        console.error("Lỗi khi kiểm tra follow status:", error);
      } finally {
        setFollowStatusChecked(true);
      }
    };

    checkFollowStatus();
  }, [artist?.id]);

  // Handle follow/unfollow
  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!artist?.id) return;
    
    try {
      setFollowLoading(true);

      if (isFollowing) {
        await unfollowArtist(artist.id);
        setIsFollowing(false);
        toast.success(`Đã hủy theo dõi ${artist.name}`);
      } else {
        await followArtist(artist.id);
        setIsFollowing(true);
        toast.success(`Đã theo dõi ${artist.name}`);
      }
    } catch (error) {
      console.error("Lỗi khi follow/unfollow:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Không thể thực hiện thao tác này");
      }
    } finally {
      setFollowLoading(false);
    }
  };

  // Kiểm tra an toàn cho artist object
  if (!artist || !artist.id) {
    return (
      <article className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg h-full flex flex-col">
        <div className="w-full aspect-square bg-[#D3B995] mb-4 rounded-md animate-pulse"></div>
        <div className="flex-1 flex flex-col">
          <div className="h-5 bg-[#D3B995] rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-[#D3B995] rounded w-1/2"></div>
        </div>
      </article>
    );
  }

  // Xử lý ảnh fallback nếu picture bị thiếu hoặc không hợp lệ
  const artistImage =
    artist.picture && artist.picture.trim() !== ""
      ? artist.picture
      : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjBFNkQ2Ii8+CjxwYXRoIGQ9Ik0yNTAgMjAwQzI3NyAyMDAgMzAwIDIyMyAzMDAgMjUwQzMwMCAyNzcgMjc3IDMwMCAyNTAgMzAwQzIyMyAzMDAgMjAwIDI3NyAyMDAgMjUwQzIwMCAyMjMgMjIzIDIwMCAyNTAgMjAwWiIgZmlsbD0iI0Q5QjdBQSIvPgo8cGF0aCBkPSJNMzUwIDM4MEM0MDAgMzUwIDQ1MCAzMDAgNDUwIDI1MEMzOTggMjUwIDM3MyAyNzUgMzUwIDMwMEMzMjcgMzI1IDMwMiAzNTAgMjUwIDM1MEM0MzEgMzQ5IDQ1MCAzNjUgMzUwIDM4MFoiIGZpbGw9IiNEOUI3QUEiLz4KPHBhdGggZD0iTTE1MCAzODBDMTAwIDM1MCA1MCAzMDAgNTAgMjUwQzEwMiAyNTAgMTI3IDI3NSAxNTAgMzAwQzE3MyAzMjUgMTk4IDM1MCAyNTAgMzUwQzE5IDM0OSA1MCAzNjUgMTUwIDM4MFoiIGZpbGw9IiNEOUI3QUEiLz4KPHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMjYiIHk9IjIyNiI+CjxwYXRoIGQ9Ik0yNCA0QzM1IDQgNDQgMTMgNDQgMjRDNDQgMzUgMzUgNDQgMjQgNDRDMTMgNDQgNCAzNSA0IDI0QzQgMTMgMTMgNCAyNCA0WiIgZmlsbD0iIzNBMkEyNCIvPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjIwIiByPSI2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMzRDMTIgMjggMTcuMzcgMjQgMjQgMjRDMzAuNjMgMjQgMzYgMjggMzYgMzQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4KPC9zdmc+"; // SVG placeholder của artist

  return (
    <Link href={`/artist/${artist.id}`} className="block h-full">
      <article className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg hover:shadow-lg transition-all duration-300 group h-full flex flex-col cursor-pointer">
        <figure className="relative mb-4 rounded-md overflow-hidden">
          <CustomImage
            src={artistImage}
            alt={artist.name || "Artist"}
            width={500}
            height={500}
            className="w-full aspect-square object-cover grayscale-[20%] sepia-[10%] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:sepia-0"
            onError={(e) => {
              // Fallback nếu ảnh load lỗi
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjBFNkQ2Ii8+CjxwYXRoIGQ9Ik0yNTAgMjAwQzI3NyAyMDAgMzAwIDIyMyAzMDAgMjUwQzMwMCAyNzcgMjc3IDMwMCAyNTAgMzAwQzIyMyAzMDAgMjAwIDI3NyAyMDAgMjUwQzIwMCAyMjMgMjIzIDIwMCAyNTAgMjAwWiIgZmlsbD0iI0Q5QjdBQSIvPgo8cGF0aCBkPSJNMzUwIDM4MEM0MDAgMzUwIDQ1MCAzMDAgNDUwIDI1MEMzOTggMjUwIDM3MyAyNzUgMzUwIDMwMEMzMjcgMzI1IDMwMiAzNTAgMjUwIDM1MEM0MzEgMzQ5IDQ1MCAzNjUgMzUwIDM4MFoiIGZpbGw9IiNEOUI3QUEiLz4KPHBhdGggZD0iTTE1MCAzODBDMTAwIDM1MCA1MCAzMDAgNTAgMjUwQzEwMiAyNTAgMTI3IDI3NSAxNTAgMzAwQzE3MyAzMjUgMTk4IDM1MCAyNTAgMzUwQzE5IDM0OSA1MCAzNjUgMTUwIDM4MFoiIGZpbGw9IiNEOUI3QUEiLz4KPHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMjYiIHk9IjIyNiI+CjxwYXRoIGQ9Ik0yNCA0QzM1IDQgNDQgMTMgNDQgMjRDNDQgMzUgMzUgNDQgMjQgNDRDMTMgNDQgNCAzNSA0IDI0QzQgMTMgMTMgNCAyNCA0WiIgZmlsbD0iIzNBMkEyNCIvPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjIwIiByPSI2IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMzRDMTIgMjggMTcuMzcgMjQgMjQgMjRDMzAuNjMgMjQgMzYgMjggMzYgMzQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4KPC9zdmc+";
            }}
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
          
          {/* Follow button */}
          <button
            onClick={handleFollowToggle}
            disabled={followLoading || !followStatusChecked}
            className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isFollowing
                ? "bg-[#C8A97E] text-white hover:bg-[#A67C52]"
                : "bg-white/90 border border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-white"
            } transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100`}
          >
            {followLoading ? (
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                viewBox="0 0 20 20"
                fill={isFollowing ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {followLoading
              ? "..."
              : isFollowing
              ? "Đã theo dõi"
              : "Theo dõi"}
          </button>
          
          <div className="absolute top-3 left-3 bg-[#3A2A24]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Artist
          </div>
        </figure>
        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-1 text-[#3A2A24] truncate">
            {artist.name || "Unknown Artist"}
          </h3>
          <p className="text-sm text-[#6D4C41] line-clamp-2">
            {artist.description || "No description available"}
          </p>
          <div className="mt-auto pt-3 flex justify-between items-center">
            <span className="text-xs text-[#8D6C61]">
              {artist.followers !== undefined && artist.followers !== null
                ? artist.followers > 0
                  ? `${artist.followers.toLocaleString()} followers`
                  : "New artist"
                : "No followers info"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

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
//           <CustomImage
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

// Search bar (classical theme)
const SearchBarComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { isLoggedIn, userProfile } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Tạo avatar từ fullname
  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div
      className={`sticky top-0 bg-[#F8F0E3] z-40 shadow-md transition-all duration-300 ${
        isExpanded ? "py-4" : "py-2"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center bg-[#E6D7C3] rounded-full overflow-hidden transition-all duration-300 flex-1 mr-4 ${
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
              placeholder="Search for songs, artists, albums..."
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

          {/* Hiển thị nút Login/Register hoặc Avatar của người dùng */}
          {!isLoggedIn ? (
            // Chưa đăng nhập: Hiển thị nút Login/Register
            <div className="flex items-center space-x-3">
              <a
                href="/user-login"
                className="text-[#3A2A24] hover:text-[#C8A97E] transition-colors px-3 py-1.5 text-sm font-medium flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Login
              </a>
              <a
                href="/user-register"
                className="bg-[#C8A97E] hover:bg-[#A67C52] text-white transition-colors rounded-full px-5 py-1.5 text-sm font-medium shadow-md hover:shadow-lg flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Register
              </a>
            </div>
          ) : (
            // Đã đăng nhập: Hiển thị avatar người dùng
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C8A97E] to-[#A67C52] flex items-center justify-center text-white font-semibold">
                  {userProfile?.fullname
                    ? getInitials(userProfile.fullname)
                    : "U"}
                </div>
                <span className="text-[#3A2A24] text-sm font-medium hidden md:block">
                  {userProfile?.fullname || userProfile?.username || "User"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#6D4C41]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#F0E6D6] border border-[#D3B995] rounded-lg shadow-lg py-2 z-50">
                  <a
                    href="/user-profile"
                    className="block px-4 py-2 text-[#3A2A24] hover:bg-[#E6D7C3] hover:text-[#6D4C41] transition-colors"
                  >
                    My Profile
                  </a>
                  <hr className="my-1 border-[#D3B995]" />
                  <button
                    onClick={() => {
                      localStorage.removeItem("accessToken");
                      localStorage.removeItem("userId");
                      window.location.href = "/user-login";
                    }}
                    className="block w-full text-left px-4 py-2 text-[#3A2A24] hover:bg-[#E6D7C3] hover:text-[#6D4C41] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InstrumentSpotlightSection: React.FC<{
  spotlights: InstrumentSpotlight[];
  loading: boolean;
  onPlayClick?: (songId: number) => void;
  onPlayCollection?: (songs: any[]) => void;
}> = ({ spotlights, loading, onPlayClick, onPlayCollection }) => {
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
            href="/instruments"
            className="text-sm text-[#6D4C41] hover:text-[#3A2A24] transition-colors"
          >
            Show all &rsaquo;
          </Link>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-[#F0E6D6] border border-[#D3B995] p-5 rounded-lg animate-pulse shadow-sm">
            <div className="h-10 bg-[#D3B995] rounded mb-6"></div>
            {[...Array(5)].map((_, i) => (
              <div
                key={`instrument-sidebar-loading-${i}`}
                className="flex items-center gap-4 mb-4"
              >
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
                key={`instrument-songs-loading-${i}`}
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
            href="/instruments"
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
          href="/instruments"
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
                <CustomImage
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
                  <button 
                    onClick={() => onPlayCollection && onPlayCollection(songs)}
                    disabled={songs.length === 0}
                    className="bg-[#F0E6D6] hover:bg-white text-[#3A2A24] font-medium rounded-full px-8 py-3 shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Play Collection
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
                    <CustomImage
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
                    <CustomImage
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
                      <FavoriteButton id={song.id} type="music" />
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
      <ContentSection title="Eras and Styles" showAllLink="/eras">
        {[...Array(5)].map((_, index) => (
          <div key={`era-loading-${index}`} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
            <div className="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>
            <div className="bg-gray-200 rounded h-4 w-1/2"></div>
          </div>
        ))}
      </ContentSection>
    );
  }

  return (
    <ContentSection title="Eras and Styles" showAllLink="/eras">
      {eraStyles.map((eraStyle) => (
        <Link
          key={eraStyle.period.id}
          href={`/period/${eraStyle.period.id}`}
          className="block"
        >
          <article className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg hover:shadow-lg transition-all duration-300 group h-full flex flex-col cursor-pointer hover:scale-105">
            <figure className="relative mb-4 rounded-md overflow-hidden">
              <CustomImage
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
                {/* Bỏ nút tim theo yêu cầu */}
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
  const { playCollection } = useMusicPlayer();
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

  // Clear cache khi component mount hoặc window focus để đảm bảo data fresh
  useEffect(() => {
    const handleFocus = () => {
      // Clear cả follow status cache và favorite status cache khi user quay lại page để force refresh
      clearFollowStatusCache();
      clearFavoriteStatusCache();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Clear cache khi page trở thành visible
        clearFollowStatusCache();
        clearFavoriteStatusCache();
      }
    };

    // Listen to favorite events để force refresh Top Artists khi có thay đổi
    const handleFavoriteStatusChanged = (data: any) => {
      if (data.type === "artist") {
        console.log(
          "🔄 Artist follow status changed, force refreshing Top Artists"
        );
        // Clear cache và force refresh all favorite buttons
        clearFollowStatusCache();
        favoriteEvents.forceRefreshAll();
      }
    };

    // Add event listeners
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    favoriteEvents.on("favoriteStatusChanged", handleFavoriteStatusChanged);

    // Cleanup
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      favoriteEvents.off("favoriteStatusChanged", handleFavoriteStatusChanged);
    };
  }, []);

  // Handle play click function
  const handlePlayClick = (songId: number) => {
    router.push(`/music/${songId}`);
  };

  // Handle play collection function
  const handlePlayCollection = async (songs: any[]) => {
    if (songs && songs.length > 0) {
      await playCollection(songs);
    }
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
  const fetchRecommendedSongs = useCallback(async () => {
    try {
      setLoading(true);

      const songs = await getRecommendedSongs(5); // Chỉ lấy 5 bài hát
      setRecommendedSongs(songs);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài hát gợi ý:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendedSongs();
  }, [fetchRecommendedSongs]);

  // Fetch popular albums
  const fetchPopularAlbums = useCallback(async () => {
    try {
      setAlbumsLoading(true);
      setApiError(null);

      const albums = await getPopularAlbums(5); // Chỉ lấy 5 albums
      setPopularAlbums(albums);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách album phổ biến:", error);
      setApiError("Không thể tải danh sách album. Vui lòng thử lại sau.");
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
        setApiError(null);

        // Chỉ lấy 5 nghệ sĩ đầu tiên
        const artistsResponse = await getAllArtists(1, 5);
        console.log("🎭 All Artists data from API:", artistsResponse);

        if (artistsResponse.success && artistsResponse.data.items.length > 0) {
          setTopArtists(artistsResponse.data.items);
        } else {
          console.warn("Không có dữ liệu artists từ API getAllArtists");
          setTopArtists([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nghệ sĩ:", error);
        setApiError("Không thể tải danh sách nghệ sĩ. Vui lòng thử lại sau.");
        setTopArtists([]);
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
                  <CustomImage
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
          <ContentSection title="Recommended Songs" showAllLink="/recommended-songs">
            {loading
              ? // Loading state
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={`recommended-loading-${i}`}
                      className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg animate-pulse"
                    >
                      <div className="w-full aspect-square bg-[#D3B995] mb-4 rounded-md"></div>
                      <div className="h-5 bg-[#D3B995] rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-[#D3B995] rounded w-1/2"></div>
                    </div>
                  ))
              : recommendedSongs.length > 0
              ? recommendedSongs.slice(0, 5).map((song) => (
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
                playlistData.slice(0, 5).map((p) => <PlaylistCard key={p.id} {...p} />)}
          </ContentSection>

          {/* Popular Albums */}
          <ContentSection title="Popular Albums" showAllLink="/user-albums">
            {albumsLoading ? (
              // Loading state
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={`albums-loading-${i}`}
                    className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg animate-pulse"
                  >
                    <div className="w-full aspect-square bg-[#D3B995] mb-4 rounded-md"></div>
                    <div className="h-5 bg-[#D3B995] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#D3B995] rounded w-1/2"></div>
                  </div>
                ))
            ) : popularAlbums.length > 0 ? (
              popularAlbums.slice(0, 5).map((album) => (
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
          <ContentSection title="Timeless Pieces" showAllLink="/timeless-pieces">
            {timelessLoading ? (
              // Loading state
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={`timeless-loading-${i}`}
                    className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg animate-pulse"
                  >
                    <div className="w-full aspect-square bg-[#D3B995] mb-4 rounded-md"></div>
                    <div className="h-5 bg-[#D3B995] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#D3B995] rounded w-1/2"></div>
                  </div>
                ))
            ) : timelessPieces.length > 0 ? (
              timelessPieces.slice(0, 5).map((song) => (
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
          <ContentSection title="Top Artists" showAllLink="/user-artists">
            {artistsLoading ? (
              // Loading state
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={`artists-loading-${i}`}
                    className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg animate-pulse"
                  >
                    <div className="w-full aspect-square bg-[#D3B995] mb-4 rounded-md"></div>
                    <div className="h-5 bg-[#D3B995] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#D3B995] rounded w-1/2"></div>
                  </div>
                ))
            ) : topArtists.length > 0 ? (
              topArtists.slice(0, 5).map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="italic text-lg text-[#6D4C41]">
                  {apiError ||
                    "Không có nghệ sĩ nào hiện tại. Vui lòng thử lại sau."}
                </p>
                <button
                  onClick={async () => {
                    try {
                      setArtistsLoading(true);
                      setApiError(null);
                      // Chỉ lấy 5 nghệ sĩ
                      const artistsResponse = await getAllArtists(1, 5);
                      if (
                        artistsResponse.success &&
                        artistsResponse.data.items.length > 0
                      ) {
                        setTopArtists(artistsResponse.data.items);
                      }
                    } catch (error) {
                      console.error("Retry failed:", error);
                      setApiError(
                        "Không thể tải danh sách nghệ sĩ. Vui lòng thử lại sau."
                      );
                    } finally {
                      setArtistsLoading(false);
                    }
                  }}
                  className="mt-4 px-6 py-3 bg-[#C8A97E] text-white rounded-full hover:bg-[#A67C52] transition-colors"
                  disabled={artistsLoading}
                >
                  {artistsLoading ? "Đang tải..." : "Thử lại"}
                </button>
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
            onPlayCollection={handlePlayCollection}
          />
        </div>
      </main>

      {/* Bottom Banner */}
      <BottomBanner />
    </div>
  );
};

export default HomePage;
