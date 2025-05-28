"use client";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";

// BƯỚC 1: IMPORT HOOK TỪ CONTEXT
import { useMusicPlayer } from "@/context/MusicPlayerContext";

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

/* ─────────── SearchBar (Không thay đổi) ─────────── */
const SearchBar: React.FC<{ term?: string; setTerm?: (s: string) => void }> = ({
  term = "",
  setTerm = () => {},
}) => {
  const [focus, setFocus] = useState(false);
  return (
    <div
      className={`flex items-center bg-[#E6D7C3] rounded-full overflow-hidden transition-shadow duration-200 ${
        focus ? "shadow-lg" : "shadow"
      }`}
    >
      <svg
        className="w-5 h-5 ml-3 text-[#6D4C41]"
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
        placeholder="Tìm kiếm chủ đề cổ điển..."
        className="flex-1 bg-transparent text-sm py-2 px-3 focus:outline-none placeholder-[#6D4C41]"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
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

/* ─────────── Data (Không thay đổi) ─────────── */
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
  { label: "Earliest", value: "yearAsc" },
  { label: "Latest", value: "yearDesc" },
  { label: "Country", value: "country" },
];

const composers = [
  {
    name: "Ludwig van Beethoven",
    image: "/images/composers/beethoven.jpg",
    era: "Classical/Romantic",
    years: "1770-1827",
    country: "Germany",
    instrument: "Piano",
    notableWorks: ["Symphony No. 9", "Moonlight Sonata", "Für Elise"],
    description:
      "Bridged the Classical and Romantic periods with revolutionary compositions",
    backgroundColor: "bg-[#48352F]",
  },
  {
    name: "Wolfgang Amadeus Mozart",
    image: "/images/composers/mozart.jpg",
    era: "Classical",
    years: "1756-1791",
    country: "Austria",
    instrument: "Piano",
    notableWorks: ["The Magic Flute", "Symphony No. 40", "Requiem"],
    description:
      "Child prodigy and master of classical form with over 600 compositions",
    backgroundColor: "bg-[#32435F]",
  },
  // ... (giữ nguyên các nhà soạn nhạc khác)
  {
    name: "Gustav Mahler",
    image: "/images/composers/mahler.jpg",
    era: "Romantic",
    years: "1860-1911",
    country: "Austria",
    instrument: "Orchestra",
    notableWorks: ["Symphony No. 5", "Das Lied von der Erde", "Symphony No. 2"],
    description:
      "Expanded orchestral music with monumental symphonies of intense emotion",
    backgroundColor: "bg-[#435360]",
  },
];

type Composer = (typeof composers)[0];

export default function ClassicalMusicArtistsPage() {
  // BƯỚC 2: KẾT NỐI VỚI MUSIC PLAYER CONTEXT
  // Chúng ta chỉ cần hàm `playMusic` từ context.
  // Mọi state khác (isPlaying, currentMusic...) đều được quản lý toàn cục.
  const { playMusic } = useMusicPlayer();

  // State cục bộ của trang này (bộ lọc, sắp xếp, tìm kiếm...) -> Giữ nguyên
  const [selectedTopTab, setSelectedTopTab] = useState<
    "Categories" | "Artists" | "Albums"
  >("Artists");
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");
  const [selectedEra, setSelectedEra] = useState("All Periods");
  const [selectedInstrument, setSelectedInstrument] =
    useState("All Instruments");
  const [sortBy, setSortBy] =
    useState<(typeof sortOptions)[0]["value"]>("alphaAsc");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // BƯỚC 3: XOÁ STATE CỤC BỘ CỦA PLAYER CŨ
  // Các dòng sau đây không còn cần thiết và đã được xoá:
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [currentComposer, setCurrentComposer] = useState<...>(null);
  // const [nowPlaying, setNowPlaying] = useState(...);
  // const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ────── Dropdown outside‑click helper (Không thay đổi) ────── */
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

  /* ────── Logic lọc và sắp xếp (Không thay đổi) ────── */
  const filteredComposers = composers.filter((c) => {
    const eraOK = selectedEra === "All Periods" || c.era.includes(selectedEra);
    const instOK =
      selectedInstrument === "All Instruments" ||
      c.instrument === selectedInstrument;
    const searchOK =
      !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.notableWorks.some((w) =>
        w.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return eraOK && instOK && searchOK;
  });

  const sortedComposers = [...filteredComposers].sort((a, b) => {
    switch (sortBy) {
      case "alphaAsc":
        return a.name.localeCompare(b.name);
      case "alphaDesc":
        return b.name.localeCompare(a.name);
      case "yearAsc":
        return +a.years.split("-")[0] - +b.years.split("-")[0];
      case "yearDesc":
        return +b.years.split("-")[0] - +a.years.split("-")[0];
      case "country":
        return a.country.localeCompare(b.country);
      default:
        return 0;
    }
  });

  // BƯỚC 4: TẠO HÀM MỚI ĐỂ GỌI GLOBAL PLAYER
  const handlePlayComposer = (composer: Composer) => {
    // Chuyển đổi dữ liệu từ `composer` sang định dạng `Music` mà context cần
    const musicToPlay: Music = {
      id: composer.name, // Dùng tên làm ID duy nhất cho đơn giản
      name: composer.notableWorks[0], // Lấy tác phẩm nổi bật đầu tiên làm tên bài hát
      artist: composer.name, // Tên nhà soạn nhạc là nghệ sĩ
      coverPhoto: composer.image, // Ảnh bìa
      // QUAN TRỌNG: Bạn cần cung cấp một đường dẫn thực tế đến file nhạc.
      // Ở đây chúng ta tạo một đường dẫn API giả định.
      resourceLink: `/api/music/${encodeURIComponent(composer.name)}`,
      favoriteCount: Math.floor(Math.random() * 10000), // Dữ liệu giả
    };

    // Gọi hàm `playMusic` từ context toàn cục
    playMusic(musicToPlay);
  };

  return (
    <div className="flex h-screen bg-[#F8F0E3] text-[#3A2A24] font-['Playfair_Display',serif]">
      <Navbar />

      {/* Thay đổi nhỏ: Xoá `pb-24` vì layout gốc đã xử lý việc này */}
      <main className="flex-1 overflow-y-auto">
        {/* TOP BAR (Không thay đổi) */}
        <div className="sticky top-0 z-30 bg-[#D3B995] shadow-md px-8 py-3">
          {/* ... code top bar giữ nguyên ... */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <SearchBar term={searchTerm} setTerm={setSearchTerm} />
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

        {/* SECOND BAR – FILTERS + SORT (Không thay đổi) */}
        <div className="sticky top-[64px] md:top-[60px] z-20 bg-[#E6D7C3] px-8 py-2 border-b border-[#D3B995] overflow-x-auto overflow-y-visible no-scrollbar">
          {/* ... code filter bar giữ nguyên ... */}
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
                {/* icon */}
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

        {/* ERA TIMELINE (Không thay đổi) */}
        <div className="px-8 pt-6 pb-2">
          {/* ... code timeline giữ nguyên ... */}
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

        {/* === MAIN CONTENT === */}
        <div className="px-8 pt-6">
          {activeView === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {sortedComposers.map((c) => (
                <div
                  key={c.name}
                  className="group flex flex-col items-center p-4 rounded-lg border border-transparent hover:border-[#B79E7A]/60 hover:bg-[#F0E6D6] transition"
                >
                  <div className="relative w-full max-w-[160px] aspect-square rounded-full overflow-hidden border-4 border-[#B79E7A]/70">
                    <div className="relative w-full h-full">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        className="object-cover grayscale-[30%] sepia-[10%]"
                      />
                    </div>

                    {/* BƯỚC 5: CẬP NHẬT ONCLICK EVENT */}
                    <button
                      onClick={() => handlePlayComposer(c)}
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
                  <h3 className="mt-3 text-sm font-medium group-hover:text-[#B79E7A] whitespace-nowrap">
                    {c.name}
                  </h3>
                  <p className="text-xs text-[#6D4C41] whitespace-nowrap">
                    {c.years}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {sortedComposers.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center p-4 rounded-lg border border-[#D3B995] hover:border-[#B79E7A] hover:bg-[#F0E6D6] transition"
                >
                  <div className="relative h-16 w-16 mr-4">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium">{c.name}</h4>
                    <p className="text-xs text-[#6D4C41]">{c.years}</p>
                  </div>
                  {/* BƯỚC 5: CẬP NHẬT ONCLICK EVENT */}
                  <button
                    onClick={() => handlePlayComposer(c)}
                    className="p-2 rounded-full bg-[#3A2A24] text-[#F8F0E3] hover:bg-[#6D4C41]"
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
              ))}
            </div>
          )}
        </div>

        {/* BƯỚC 6: XOÁ TOÀN BỘ PHẦN PLAYER BAR CŨ
          Toàn bộ khối div.fixed.bottom-0... đã được xoá khỏi đây.
          Nó sẽ được thay thế bằng <PersistentPlayerLayout /> trong file layout.tsx.
        */}
      </main>
    </div>
  );
}
