"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import CustomImage from "@/components/CustomImage";
import {
  getPopularAlbums,
  searchAlbums,
  Album,
  AlbumSearchResponse,
} from "@/services/albumService";

/*****************************************************************
 *  CLASSICAL ALBUMS PAGE – Unified Top‑Bar + Working Grid/List
 *****************************************************************/

// Loại bỏ albumsData cũ vì không cần thiết
// Chỉ giữ lại albumFilters với "All Albums"
const albumFilters = ["All Albums"];

const navTabs: Array<"Categories" | "Artists" | "Albums"> = [
  "Categories",
  "Artists",
  "Albums",
];

/**************************
 *  ALBUM CARD COMPONENT  *
 **************************/
const AlbumCard: React.FC<{ album: Album }> = ({ album }) => (
  <Link href={`/album/${album.id}`} className="group">
    <div className="relative rounded-md overflow-hidden shadow hover:shadow-lg transition-all">
      <div className="relative w-full aspect-square">
        <CustomImage
          src={album.coverPhoto}
          alt={album.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button className="bg-white text-[#3A2A24] rounded-full p-3 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 4l10 6-10 6V4z" />
          </svg>
        </button>
      </div>
    </div>
    <h3 className="mt-2 font-semibold truncate">{album.name}</h3>
    <p className="text-sm text-[#6D4C41] truncate">{album.description}</p>
  </Link>
);

/**************************
 *  ALBUM ROW COMPONENT   *
 **************************/
const AlbumRow: React.FC<{ album: Album; index: number }> = ({
  album,
  index,
}) => (
  <Link href={`/album/${album.id}`} className="block">
    <div className="grid grid-cols-12 items-center px-4 py-3 hover:bg-[#E6D7C3] rounded-md cursor-pointer">
      <span className="col-span-1 text-sm text-[#6D4C41]">{index + 1}</span>
      <div className="col-span-6 flex items-center space-x-4">
        <div className="w-12 h-12 relative">
          <CustomImage
            src={album.coverPhoto}
            alt={album.name}
            fill
            className="rounded object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium truncate">{album.name}</h3>
          <p className="text-sm text-[#6D4C41] truncate">{album.description}</p>
        </div>
      </div>
      <span className="col-span-3 text-sm text-[#6D4C41] truncate">
        {album.albumType || "Album"}
      </span>
      <span className="col-span-2 text-right text-sm text-[#6D4C41]">
        {album.musics?.length || 0} tracks
      </span>
    </div>
  </Link>
);

// Helper function để viết hoa chữ cái đầu tiên
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**************************
 *  SEARCH BAR COMPONENT  *
 **************************/
const SearchBar: React.FC<{
  term: string;
  setTerm: (s: string) => void;
  isSearching?: boolean;
}> = ({ term, setTerm, isSearching = false }) => {
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
        placeholder="Tìm kiếm albums cổ điển..."
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

/**************************
 *   MAIN PAGE COMPONENT   *
 **************************/
export default function AlbumsPage() {
  const [tab, setTab] = useState<"Categories" | "Artists" | "Albums">("Albums");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedFilter, setSelectedFilter] = useState("All Albums");
  const [term, setTerm] = useState("");

  // API state management
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] =
    useState<AlbumSearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Featured album state - thêm state để quản lý featured album ngẫu nhiên
  const [featuredAlbum, setFeaturedAlbum] = useState<Album | null>(null);

  // Fetch popular albums on component mount
  useEffect(() => {
    const fetchPopularAlbums = async () => {
      try {
        setLoading(true);
        setError(null);
        const popularAlbums = await getPopularAlbums(20); // Lấy 20 albums phổ biến
        setAlbums(popularAlbums);

        // Set featured album ngẫu nhiên từ danh sách
        if (popularAlbums.length > 0) {
          const randomIndex = Math.floor(Math.random() * popularAlbums.length);
          setFeaturedAlbum(popularAlbums[randomIndex]);
        }
      } catch (err) {
        console.error("Lỗi khi tải albums:", err);
        setError("Không thể tải danh sách albums. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularAlbums();
  }, []);

  // Auto-rotate featured album every 30 seconds (chỉ khi không search)
  useEffect(() => {
    if (!term.trim() && albums.length > 0) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * albums.length);
        setFeaturedAlbum(albums[randomIndex]);
      }, 30000); // 30 giây

      return () => clearInterval(interval);
    }
  }, [albums, term]);

  // Search albums when search term changes
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (term.trim()) {
        try {
          setIsSearching(true);
          const results = await searchAlbums(term.trim(), 20, 1);
          setSearchResults(results);
          // Khi search, set featured album là kết quả đầu tiên
          if (results.items.length > 0) {
            setFeaturedAlbum(results.items[0]);
          }
        } catch (err) {
          console.error("Lỗi khi tìm kiếm albums:", err);
          setSearchResults({ total: 0, items: [] });
          setFeaturedAlbum(null);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
        // Quay lại featured album ngẫu nhiên từ danh sách gốc
        if (albums.length > 0) {
          const randomIndex = Math.floor(Math.random() * albums.length);
          setFeaturedAlbum(albums[randomIndex]);
        }
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(searchTimeout);
  }, [term, albums]);

  // Determine which albums to display
  const displayAlbums =
    term.trim() && searchResults ? searchResults.items : albums;

  const filteredAlbums = displayAlbums;

  return (
    <div className="flex h-screen bg-[#F8F0E3] text-[#3A2A24] font-['Playfair_Display',serif]">
      <Navbar />
      <main className="flex-1 overflow-y-auto pb-24">
        {/* TOP BAR */}
        <div className="sticky top-0 z-30 bg-[#D3B995] shadow-md px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <SearchBar
              term={term}
              setTerm={setTerm}
              isSearching={isSearching}
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
                        tab === t
                          ? "bg-[#C8A97E] text-white"
                          : "hover:bg-[#C8A97E]/30"
                      }`}
                      onClick={() => setTab(t)}
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
                    view === "grid"
                      ? "bg-[#C8A97E]/80"
                      : "hover:bg-[#C8A97E]/40"
                  }`}
                  onClick={() => setView("grid")}
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
                    view === "list"
                      ? "bg-[#C8A97E]/80"
                      : "hover:bg-[#C8A97E]/40"
                  }`}
                  onClick={() => setView("list")}
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

        {/* HEADER */}
        <section className="px-8 pt-6">
          <h1 className="text-3xl font-bold mb-6 tracking-wide">Albums</h1>

          {/* Featured Album - Hiển thị album ngẫu nhiên */}
          {featuredAlbum && (
            <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
              <div
                className="h-72 bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${featuredAlbum.coverPhoto})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#E6D7C3] via-[#C8A97E]/80 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col md:flex-row items-start md:items-center">
                  <div className="relative w-48 h-48 md:w-56 md:h-56 mb-4 md:mb-0 md:mr-8">
                    <CustomImage
                      src={featuredAlbum.coverPhoto}
                      alt={featuredAlbum.name}
                      fill
                      className="rounded-md shadow-xl object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold flex items-center gap-2">
                      <span className="animate-pulse">🎵</span>
                      Featured Album
                    </p>
                    <h2 className="text-4xl font-bold mb-1 max-w-xl leading-snug">
                      {featuredAlbum.name}
                    </h2>
                    <p className="text-xl opacity-80 mb-4">
                      {featuredAlbum.description}
                    </p>
                    <p className="mb-6">
                      {new Date(featuredAlbum.releaseDate).getFullYear()} •{" "}
                      {featuredAlbum.musics?.length || 0} tracks •{" "}
                      {featuredAlbum.albumType || "Album"}
                    </p>
                    <div className="flex space-x-4">
                      <Link href={`/album/${featuredAlbum.id}`}>
                        <button className="bg-[#C8A97E] hover:bg-[#A67C52] text-white font-medium rounded-full px-8 py-3 shadow-lg transition-colors">
                          Nghe ngay
                        </button>
                      </Link>
                      <button className="border border-[#C8A97E] text-[#3A2A24] font-medium rounded-full px-8 py-3 hover:bg-[#C8A97E]/20 transition-colors">
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A97E] mx-auto mb-4"></div>
              <p className="text-[#6D4C41]">Đang tải albums...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#C8A97E] hover:bg-[#A67C52] text-white px-6 py-2 rounded-full"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Search results info */}
          {term.trim() && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-[#E6D7C3] to-[#F0E6D6] rounded-lg p-4 border border-[#D3B995]/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#C8A97E]"></div>
                        <p className="text-[#3A2A24] font-medium">
                          Đang tìm kiếm albums...
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
                            {searchResults.total}
                          </span>{" "}
                          album cho
                          <span className="text-[#6D4C41] font-semibold ml-1">
                            "{term}"
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
                          Không tìm thấy album nào
                        </p>
                      </>
                    )}
                  </div>

                  {term && (
                    <button
                      onClick={() => setTerm("")}
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
              </div>
            </div>
          )}

          {/* Filter chips - chỉ hiển thị "All Albums" */}
          <div className="flex overflow-x-auto space-x-2 pb-4 mb-6 border-b border-[#D3B995]">
            {albumFilters.map((f) => (
              <button
                key={f}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  selectedFilter === f
                    ? "bg-[#C8A97E] text-white"
                    : "bg-[#E6D7C3] text-[#3A2A24] hover:bg-[#D3B995]"
                }`}
                onClick={() => setSelectedFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Album grid / list */}
          {view === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {filteredAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="hidden md:grid grid-cols-12 px-4 py-2 text-[#6D4C41] text-xs font-semibold tracking-wider">
                <span className="col-span-1">#</span>
                <span className="col-span-6">TITLE</span>
                <span className="col-span-3">GENRE</span>
                <span className="col-span-2 text-right">DURATION</span>
              </div>
              {filteredAlbums.map((album, idx) => (
                <AlbumRow key={album.id} album={album} index={idx} />
              ))}
            </div>
          )}

          {/* Hiển thị thông báo nếu không có albums */}
          {!loading && filteredAlbums.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-[#6D4C41] mb-2">
                {term.trim()
                  ? "Không tìm thấy album phù hợp"
                  : "Chưa có albums nào"}
              </h3>
              <p className="text-[#8D6E63]">
                {term.trim() ? "Hãy thử từ khóa khác" : "Vui lòng quay lại sau"}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
