"use client";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import CustomImage from "@/components/CustomImage";
import { toast } from "react-hot-toast";

// BƯỚC 1: IMPORT HOOK TỪ CONTEXT
import { useMusicPlayer } from "@/context/MusicPlayerContext";

// Import API services
import {
  getAllArtists,
  searchArtists,
  getArtistsByInstrument,
  Artist as ApiArtist,
  ArtistSearchResponse,
} from "@/services/artistService";

import {
  followArtist,
  unfollowArtist,
  getMyFollowedArtists,
  checkIsFollowingArtist,
} from "@/services/favoriteService";

// Import logic phân loại nghệ sĩ theo thời kỳ
import {
  filterArtistsByEra,
  getArtistMainEra,
  getArtistAllEras,
  getArtistEraDetails,
  ERA_VIETNAMESE_NAMES,
  getYear,
} from "@/utils/artistClassification";

// Giả sử bạn có một file định nghĩa type chung
// Nếu không, bạn có thể định nghĩa nó ở đây để TypeScript không báo lỗi
interface Music {
  id: string;
  name: string;
  artist: string;
  coverPhoto: string;
  resourceLink: string;
  favoriteCount: number;
  lyrics?: string;
}

// Helper function để viết hoa chữ cái đầu tiên
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/* ─────────── SearchBar đơn giản với viết hoa chữ cái đầu ─────────── */
const SearchBar: React.FC<{
  term?: string;
  setTerm?: (s: string) => void;
  isSearching?: boolean;
}> = ({ term = "", setTerm = () => {}, isSearching = false }) => {
  // Xử lý thay đổi input với tự động viết hoa chữ cái đầu
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Tự động viết hoa chữ cái đầu tiên
    const capitalizedValue = capitalizeFirstLetter(value);
    setTerm(capitalizedValue);
  };

  return (
    <div className="flex items-center bg-[#E6D7C3] rounded-full overflow-hidden shadow">
      <svg
        className={`w-5 h-5 ml-3 text-[#6D4C41] ${
          isSearching ? "animate-spin" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        placeholder="Tìm kiếm nghệ sĩ cổ điển..."
        className="flex-1 bg-transparent text-sm py-2 px-3 focus:outline-none placeholder-[#6D4C41]"
        value={term}
        onChange={handleInputChange}
      />
      {term && (
        <button
          onClick={() => setTerm("")}
          className="mr-3 p-1 rounded-full hover:bg-[#D3B995]"
        >
          <svg
            className="w-4 h-4 text-[#6D4C41]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

/* ─────────── Data (periods và instruments vẫn giữ nguyên) ─────────── */
const musicEras = [
  { name: "All Periods", years: "All Time" },
  { name: "Medieval", years: "500‑1400" },
  { name: "Renaissance", years: "1400‑1600" },
  { name: "Baroque", years: "1600‑1750" },
  { name: "Classical", years: "1750‑1820" },
  { name: "Romantic", years: "1820‑1900" },
  { name: "Modern", years: "1900‑1945" },
  { name: "Contemporary", years: "1945‑Present" },
];

const instrumentCategories = [
  "All Instruments",
  "Piano",
  "Violin",
  "Cello",
  "Orchestra",
  "Chamber",
  "Woodwinds",
  "Brass",
  "Vocal",
  "Organ",
  "Harpsichord",
];

const navTabs: Array<"Categories" | "Artists" | "Albums"> = [
  "Categories",
  "Artists",
  "Albums",
];

const sortOptions = [
  { label: "A → Z", value: "alphaAsc" },
  { label: "Z → A", value: "alphaDesc" },
  { label: "Popularity", value: "popularity" },
  { label: "Followers", value: "followers" },
  { label: "Views", value: "views" },
];

export default function ClassicalMusicArtistsPage() {
  const { playSongById } = useMusicPlayer();

  // State cục bộ của trang này
  const [selectedTopTab, setSelectedTopTab] = useState<
    "Categories" | "Artists" | "Albums"
  >("Artists");
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");
  const [selectedEra, setSelectedEra] = useState("All Periods");
  const [selectedInstrument, setSelectedInstrument] =
    useState("All Instruments");
  const [sortBy, setSortBy] =
    useState<(typeof sortOptions)[0]["value"]>("popularity");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // API state management
  const [artists, setArtists] = useState<ApiArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalArtists, setTotalArtists] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] =
    useState<ArtistSearchResponse | null>(null);

  // Follow state management
  const [followedArtists, setFollowedArtists] = useState<Set<number>>(
    new Set()
  );
  const [followLoading, setFollowLoading] = useState<Set<number>>(new Set());

  /* ────── Dropdown outside‑click helper ────── */
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowSortMenu(false);
      }
    }
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Load followed artists on mount
  useEffect(() => {
    const loadFollowedArtists = async () => {
      try {
        const response = await getMyFollowedArtists(100, 1); // Load first 100 followed artists
        const followedIds = new Set(
          response.data.items.map((item) => item.artistId)
        );
        setFollowedArtists(followedIds);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nghệ sĩ đã follow:", error);
      }
    };

    loadFollowedArtists();
  }, []);

  // Fetch all artists on component mount
  useEffect(() => {
    const fetchAllArtists = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAllArtists(1, 50); // Lấy 50 nghệ sĩ đầu tiên

        if (response.success && response.data.items) {
          setArtists(response.data.items);
          setTotalArtists(response.data.total);
        } else {
          setError("Không thể tải danh sách nghệ sĩ");
        }
      } catch (err) {
        console.error("Lỗi khi tải nghệ sĩ:", err);
        setError("Có lỗi xảy ra khi tải danh sách nghệ sĩ");
      } finally {
        setLoading(false);
      }
    };

    fetchAllArtists();
  }, []);

  // Search artists when search term changes
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchTerm.trim()) {
        try {
          setSearching(true);
          const results = await searchArtists(searchTerm.trim(), 50, 1);
          setSearchResults(results);
        } catch (err) {
          console.error("Lỗi khi tìm kiếm nghệ sĩ:", err);
          setSearchResults({
            status: "ERROR",
            code: 500,
            success: false,
            message: "Search failed",
            data: { total: 0, items: [] },
            errors: err,
          });
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults(null);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  // Filter artists by instrument when selectedInstrument changes
  useEffect(() => {
    const filterByInstrument = async () => {
      if (selectedInstrument !== "All Instruments" && !searchTerm) {
        try {
          setLoading(true);
          const results = await getArtistsByInstrument(
            selectedInstrument,
            1,
            50
          );

          if (results.success && results.data.items) {
            setArtists(results.data.items);
            setTotalArtists(results.data.total);
          }
        } catch (err) {
          console.error("Lỗi khi lọc nghệ sĩ theo instrument:", err);
        } finally {
          setLoading(false);
        }
      } else if (selectedInstrument === "All Instruments" && !searchTerm) {
        // Reload all artists
        const fetchAllArtists = async () => {
          try {
            setLoading(true);
            const response = await getAllArtists(1, 50);

            if (response.success && response.data.items) {
              setArtists(response.data.items);
              setTotalArtists(response.data.total);
            }
          } catch (err) {
            console.error("Lỗi khi tải lại nghệ sĩ:", err);
          } finally {
            setLoading(false);
          }
        };
        fetchAllArtists();
      }
    };

    filterByInstrument();
  }, [selectedInstrument, searchTerm]);

  // Get display artists - either search results or filtered artists
  const displayArtists =
    searchResults && searchTerm ? searchResults.data.items : artists;

  // Filter by era and sort - SỬ DỤNG LOGIC MỚI
  const filteredAndSortedArtists = [...displayArtists]
    .filter((artist) => {
      // Sử dụng logic phân loại mới từ artistClassification
      return filterArtistsByEra([artist], selectedEra).length > 0;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "alphaAsc":
          return a.name.localeCompare(b.name);
        case "alphaDesc":
          return b.name.localeCompare(a.name);
        case "popularity":
          return (b.viewCount || 0) - (a.viewCount || 0);
        case "followers":
          return (b.followers || 0) - (a.followers || 0);
        case "views":
          return (b.viewCount || 0) - (a.viewCount || 0);
        default:
          return 0;
      }
    });

  // BƯỚC 4: TẠO HÀM MỚI ĐỂ GỌI GLOBAL PLAYER
  const handlePlayArtist = async (artist: ApiArtist) => {
    try {
      // Sử dụng playSongById thay vì playMusic
      // Giả sử chúng ta lấy bài hát đầu tiên của nghệ sĩ hoặc sử dụng ID nghệ sĩ
      // Trong trường hợp thực tế, bạn cần API để lấy danh sách bài hát của nghệ sĩ
      console.log(
        `Playing music from artist: ${artist.name} (ID: ${artist.id})`
      );

      // Tạm thời sử dụng ID nghệ sĩ - trong thực tế cần có API lấy bài hát của nghệ sĩ
      await playSongById(artist.id);
    } catch (error) {
      console.error("Lỗi khi phát nhạc của nghệ sĩ:", error);
    }
  };

  // Handle follow/unfollow artist
  const handleFollowToggle = async (artistId: number, artistName: string) => {
    // Prevent event bubbling
    const isCurrentlyFollowing = followedArtists.has(artistId);

    // Add to loading set
    setFollowLoading((prev) => new Set(prev).add(artistId));

    try {
      if (isCurrentlyFollowing) {
        await unfollowArtist(artistId);
        setFollowedArtists((prev) => {
          const newSet = new Set(prev);
          newSet.delete(artistId);
          return newSet;
        });
        toast.success(`Đã hủy theo dõi ${artistName}`);
      } else {
        await followArtist(artistId);
        setFollowedArtists((prev) => new Set(prev).add(artistId));
        toast.success(`Đã theo dõi ${artistName}`);
      }
    } catch (error) {
      console.error("Lỗi khi follow/unfollow:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Không thể thực hiện thao tác này");
      }
    } finally {
      // Remove from loading set
      setFollowLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(artistId);
        return newSet;
      });
    }
  };

  // Helper function để hiển thị năm sinh/mất
  const formatArtistYears = (dateOfBirth: string | null, dateOfDeath: string | null): string => {
    const birthYear = getYear(dateOfBirth);
    const deathYear = getYear(dateOfDeath);
    
    const birthDisplay = birthYear ? birthYear.toString() : "Unknown";
    const deathDisplay = deathYear ? deathYear.toString() : "Present";
    
    return `${birthDisplay} - ${deathDisplay}`;
  };

  return (
    <div className="flex h-screen bg-[#F8F0E3] text-[#3A2A24] font-['Playfair_Display',serif]">
      <Navbar />

      <main className="flex-1 overflow-y-auto">
        {/* TOP BAR */}
        <div className="sticky top-0 z-30 bg-[#D3B995] shadow-md px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <SearchBar
              term={searchTerm}
              setTerm={setSearchTerm}
              isSearching={searching}
            />
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 gap-3">
              <div className="flex space-x-3 order-2 md:order-1">
                {navTabs.map((t) => (
                  <Link
                    href={
                      t === "Albums"
                        ? "/user-albums"
                        : t === "Artists"
                        ? "/user-artists"
                        : "/user-categories"
                    }
                    key={t}
                  >
                    <button
                      className={`px-4 py-2 rounded-md text-sm transition-colors ${
                        selectedTopTab === t
                          ? "bg-[#C8A97E] text-white"
                          : "hover:bg-[#C8A97E]/30"
                      }`}
                      onClick={() => setSelectedTopTab(t)}
                    >
                      {t}
                    </button>
                  </Link>
                ))}
              </div>
              <div className="flex space-x-2 order-1 md:order-2 self-end md:self-auto">
                <button
                  aria-label="Grid view"
                  className={`p-2 rounded ${
                    activeView === "grid"
                      ? "bg-[#C8A97E]/80"
                      : "hover:bg-[#C8A97E]/40"
                  }`}
                  onClick={() => setActiveView("grid")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  aria-label="List view"
                  className={`p-2 rounded ${
                    activeView === "list"
                      ? "bg-[#C8A97E]/80"
                      : "hover:bg-[#C8A97E]/40"
                  }`}
                  onClick={() => setActiveView("list")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECOND BAR – FILTERS + SORT */}
        <div className="sticky top-[64px] md:top-[60px] z-20 bg-[#E6D7C3] px-8 py-2 border-b border-[#D3B995] overflow-x-auto overflow-y-visible no-scrollbar">
          <div className="flex items-center gap-3 min-w-max relative">
            {instrumentCategories.map((inst) => (
              <button
                key={inst}
                onClick={() => setSelectedInstrument(inst)}
                className={`px-3 py-1 text-xs whitespace-nowrap rounded-full border transition-colors ${
                  selectedInstrument === inst
                    ? "bg-[#3A2A24] text-[#F8F0E3] border-[#3A2A24]"
                    : "bg-transparent text-[#6D4C41] border-[#D3B995] hover:bg-[#F0E6D6]"
                }`}
              >
                {inst}
              </button>
            ))}

            {/* Filter / Sort button */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-1 px-3 py-1 text-xs rounded-full border border-[#D3B995] text-[#3A2A24] hover:bg-[#D3B995]/40 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSortMenu((s) => !s);
                }}
              >
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
                    strokeWidth={1.5}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Sort
              </button>
              {showSortMenu && (
                <ul className="absolute right-0 mt-2 w-40 bg-[#F8F0E3] border border-[#D3B995] rounded-lg shadow-lg text-sm z-50">
                  {sortOptions.map((opt) => (
                    <li key={opt.value}>
                      <button
                        className={`flex w-full px-4 py-2 text-left hover:bg-[#E6D7C3] ${
                          sortBy === opt.value
                            ? "text-[#3A2A24] font-medium"
                            : "text-[#6D4C41]"
                        }`}
                        onClick={() => {
                          setSortBy(opt.value as typeof sortBy);
                          setShowSortMenu(false);
                        }}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* ERA TIMELINE */}
        <div className="px-8 pt-6 pb-2">
          <h3 className="text-xs font-medium text-[#6D4C41] uppercase tracking-wider mb-3">
            Musical Periods
          </h3>
          <div className="relative mb-8">
            {/* Base line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#D3B995] -translate-y-1/2" />

            {/* Buttons container */}
            <div className="flex justify-between items-center relative z-10">
              {musicEras.map((era) => (
                <button
                  key={era.name}
                  onClick={() => setSelectedEra(era.name)}
                  className={`flex flex-col items-center px-2 md:px-3 py-1 rounded-md text-xs min-w-max transition-all ${
                    selectedEra === era.name
                      ? "bg-[#3A2A24] text-[#F8F0E3] shadow-md -translate-y-1"
                      : "bg-[#F0E6D6] text-[#6D4C41] hover:bg-[#E6D7C3]"
                  }`}
                >
                  <span className="font-medium leading-none">{era.name}</span>
                  <span className="opacity-75 leading-none">{era.years}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="px-8 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#C8A97E] hover:bg-[#A67C52] text-white px-4 py-2 rounded-full text-sm"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* SEARCH RESULTS INFO */}
        {searchTerm && !error && (
          <div className="px-8 mb-6">
            <div className="bg-gradient-to-r from-[#E6D7C3] to-[#F0E6D6] rounded-lg p-4 border border-[#D3B995]/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {searching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#C8A97E]"></div>
                      <p className="text-[#3A2A24] font-medium">
                        Đang tìm kiếm...
                      </p>
                    </>
                  ) : searchResults ? (
                    <>
                      <svg
                        className="w-5 h-5 text-[#C8A97E]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <p className="text-[#3A2A24] font-medium">
                        Tìm thấy{" "}
                        <span className="text-[#C8A97E] font-bold">
                          {searchResults.data.total}
                        </span>{" "}
                        kết quả cho
                        <span className="text-[#6D4C41] font-semibold ml-1">
                          "{searchTerm}"
                        </span>
                      </p>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 text-[#8D6E63]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <p className="text-[#6D4C41]">
                        Không tìm thấy kết quả nào
                      </p>
                    </>
                  )}
                </div>

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="flex items-center gap-1 text-[#6D4C41] hover:text-[#C8A97E] transition-colors text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Xóa
                  </button>
                )}
              </div>

              {/* Hiển thị thông tin bộ lọc nếu có */}
              {(selectedEra !== "All Periods" ||
                selectedInstrument !== "All Instruments") && (
                <div className="mt-3 pt-3 border-t border-[#D3B995]/30">
                  <p className="text-sm text-[#6D4C41] mb-2">
                    Bộ lọc đang áp dụng:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEra !== "All Periods" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C8A97E] text-white text-xs rounded-full">
                        Thời kỳ: {selectedEra}
                        <button
                          onClick={() => setSelectedEra("All Periods")}
                          className="hover:bg-white/20 rounded-full p-0.5"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    )}
                    {selectedInstrument !== "All Instruments" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#A67C52] text-white text-xs rounded-full">
                        Nhạc cụ: {selectedInstrument}
                        <button
                          onClick={() =>
                            setSelectedInstrument("All Instruments")
                          }
                          className="hover:bg-white/20 rounded-full p-0.5"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="px-8 py-12 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A97E]"></div>
              <span className="ml-3 text-[#6D4C41]">Đang tải nghệ sĩ...</span>
            </div>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && !error && filteredAndSortedArtists.length === 0 && (
          <div className="px-8 py-12 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-24 w-24 text-[#D3B995]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#3A2A24] mb-2">
              Không tìm thấy nghệ sĩ
            </h3>
            <p className="text-[#6D4C41] mb-4">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedEra("All Periods");
                setSelectedInstrument("All Instruments");
              }}
              className="bg-[#C8A97E] hover:bg-[#A67C52] text-white px-6 py-2 rounded-full"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* === MAIN CONTENT === */}
        {!loading && !error && filteredAndSortedArtists.length > 0 && (
          <div className="px-8 pt-6">
            {activeView === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {filteredAndSortedArtists.map((artist) => (
                  <Link
                    key={`${artist.id}-${artist.name}`}
                    href={`/artist/${artist.id}`}
                    className="block"
                  >
                    <div className="group flex flex-col items-center p-4 rounded-lg border border-transparent hover:border-[#B79E7A]/60 hover:bg-[#F0E6D6] transition cursor-pointer">
                      <div className="relative w-full max-w-[160px] aspect-square rounded-full overflow-hidden border-4 border-[#B79E7A]/70">
                        <div className="relative w-full h-full">
                          <CustomImage
                            src={artist.picture || "/images/default-artist.jpg"}
                            alt={artist.name}
                            fill
                            className="object-cover grayscale-[30%] sepia-[10%]"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/default-artist.jpg";
                            }}
                          />
                        </div>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handlePlayArtist(artist);
                          }}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-[#3A2A24]/60 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-[#F8F0E3]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 8l4 2-4 2V8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <h3 className="mt-3 text-sm font-medium group-hover:text-[#B79E7A] text-center line-clamp-2">
                        {artist.name}
                      </h3>
                      <p className="text-xs text-[#6D4C41] text-center">
                        {formatArtistYears(artist.dateOfBirth, artist.dateOfDeath)}
                      </p>
                      <p className="text-xs text-[#8D6E63] text-center mt-1">
                        {artist.nationality || "Unknown"}
                      </p>

                      {/* Follow Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFollowToggle(artist.id, artist.name);
                        }}
                        disabled={followLoading.has(artist.id)}
                        className={`mt-3 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                          followedArtists.has(artist.id)
                            ? "bg-[#C8A97E] text-white hover:bg-[#A67C52]"
                            : "bg-white border border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-white"
                        }`}
                      >
                        {followLoading.has(artist.id) ? (
                          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                            viewBox="0 0 20 20"
                            fill={
                              followedArtists.has(artist.id)
                                ? "currentColor"
                                : "none"
                            }
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
                        {followLoading.has(artist.id)
                          ? "Đang xử lý..."
                          : followedArtists.has(artist.id)
                          ? "Đã theo dõi"
                          : "Theo dõi"}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedArtists.map((artist) => (
                  <Link
                    key={`${artist.id}-${artist.name}`}
                    href={`/artist/${artist.id}`}
                    className="block"
                  >
                    <div className="flex items-center p-4 rounded-lg border border-[#D3B995] hover:border-[#B79E7A] hover:bg-[#F0E6D6] transition cursor-pointer">
                      <div className="relative h-16 w-16 mr-4">
                        <CustomImage
                          src={artist.picture || "/images/default-artist.jpg"}
                          alt={artist.name}
                          fill
                          className="rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/default-artist.jpg";
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium">{artist.name}</h4>
                        <p className="text-xs text-[#6D4C41]">
                          {formatArtistYears(artist.dateOfBirth, artist.dateOfDeath)}
                        </p>
                        <p className="text-xs text-[#8D6E63]">
                          {artist.nationality || "Unknown"} •{" "}
                          {artist.viewCount || 0} lượt xem
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Follow Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFollowToggle(artist.id, artist.name);
                          }}
                          disabled={followLoading.has(artist.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                            followedArtists.has(artist.id)
                              ? "bg-[#C8A97E] text-white hover:bg-[#A67C52]"
                              : "bg-white border border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-white"
                          }`}
                        >
                          {followLoading.has(artist.id) ? (
                            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3 h-3"
                              viewBox="0 0 20 20"
                              fill={
                                followedArtists.has(artist.id)
                                  ? "currentColor"
                                  : "none"
                              }
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
                          {followedArtists.has(artist.id)
                            ? "Đã theo dõi"
                            : "Theo dõi"}
                        </button>

                        {/* Play Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handlePlayArtist(artist);
                          }}
                          className="p-2 rounded-full bg-[#3A2A24] text-[#F8F0E3] hover:bg-[#6D4C41] transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 8l4 2-4 2V8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
