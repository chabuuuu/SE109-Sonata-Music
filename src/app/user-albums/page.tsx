"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";

/*****************************************************************
 *  CLASSICAL ALBUMS PAGE – Unified Top‑Bar + Working Grid/List
 *****************************************************************/

const albumsData = [
  {
    id: 1,
    title: "Symphony No. 9 in D minor, Op. 125",
    artist: "Ludwig van Beethoven",
    releaseYear: 1824,
    image: "/albums/beethoven9.jpg",
    tracks: 4,
    duration: "1 hr 5 min",
    genres: ["Symphony", "Classical"],
    featured: true,
    background: "/backgrounds/beethoven9-bg.jpg",
  },
  {
    id: 2,
    title: "Requiem in D minor, K. 626",
    artist: "Wolfgang Amadeus Mozart",
    releaseYear: 1791,
    image: "/albums/mozart_requiem.jpg",
    tracks: 14,
    duration: "55 min",
    genres: ["Choral", "Classical"],
    featured: false,
  },
  {
    id: 3,
    title: "The Four Seasons",
    artist: "Antonio Vivaldi",
    releaseYear: 1725,
    image: "/albums/vivaldi_four_seasons.jpg",
    tracks: 12,
    duration: "42 min",
    genres: ["Concerto", "Baroque"],
    featured: false,
  },
  {
    id: 4,
    title: "Swan Lake, Op. 20",
    artist: "Pyotr Ilyich Tchaikovsky",
    releaseYear: 1876,
    image: "/albums/tchaikovsky_swan_lake.jpg",
    tracks: 29,
    duration: "2 hr 35 min",
    genres: ["Ballet", "Romantic"],
    featured: false,
  },
];

const albumFilters = [
  "All Albums",
  "Recent Releases",
  "Symphony",
  "Concerto",
  "Choral",
  "Ballet",
];
const browseCategories = [
  { name: "Baroque Gems", color: "from-[#C8A97E] to-[#A67C52]" },
  { name: "Classical Highlights", color: "from-[#D3B995] to-[#B08C66]" },
  { name: "Romantic Masterpieces", color: "from-[#E6D7C3] to-[#C9AE8E]" },
];
const navTabs: Array<"Categories" | "Artists" | "Albums"> = [
  "Categories",
  "Artists",
  "Albums",
];

/**************************
 *  ALBUM CARD COMPONENT  *
 **************************/
const AlbumCard: React.FC<{ album: (typeof albumsData)[0] }> = ({ album }) => (
  <Link href={`/album/${album.id}`} className="group">
    <div className="relative rounded-md overflow-hidden shadow hover:shadow-lg transition-all">
      <div className="relative w-full aspect-square">
        <Image
          src={album.image}
          alt={album.title}
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
    <h3 className="mt-2 font-semibold truncate">{album.title}</h3>
    <p className="text-sm text-[#6D4C41] truncate">{album.artist}</p>
  </Link>
);

/**************************
 *  ALBUM ROW COMPONENT   *
 **************************/
const AlbumRow: React.FC<{ album: (typeof albumsData)[0]; index: number }> = ({
  album,
  index,
}) => (
  <Link href={`/album/${album.id}`} className="block">
    <div className="grid grid-cols-12 items-center px-4 py-3 hover:bg-[#E6D7C3] rounded-md cursor-pointer">
      <span className="col-span-1 text-sm text-[#6D4C41]">{index + 1}</span>
      <div className="col-span-6 flex items-center space-x-4">
        <div className="w-12 h-12">
          <Image src={album.image} alt={album.title} fill className="rounded" />
        </div>
        <div>
          <h3 className="font-medium truncate">{album.title}</h3>
          <p className="text-sm text-[#6D4C41] truncate">{album.artist}</p>
        </div>
      </div>
      <span className="col-span-3 text-sm text-[#6D4C41] truncate">
        {album.genres.join(", ")}
      </span>
      <span className="col-span-2 text-right text-sm text-[#6D4C41]">
        {album.duration}
      </span>
    </div>
  </Link>
);

/**************************
 *  SEARCH BAR COMPONENT  *
 **************************/
const SearchBar: React.FC<{ term: string; setTerm: (s: string) => void }> = ({
  term,
  setTerm,
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
        placeholder="Tìm kiếm albums..."
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

/**************************
 *   MAIN PAGE COMPONENT   *
 **************************/
export default function AlbumsPage() {
  const [tab, setTab] = useState<"Categories" | "Artists" | "Albums">("Albums");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedFilter, setSelectedFilter] = useState("All Albums");
  const [term, setTerm] = useState("");

  const filteredAlbums =
    selectedFilter === "All Albums"
      ? albumsData
      : selectedFilter === "Recent Releases"
      ? albumsData.filter((a) => a.releaseYear >= 1800)
      : albumsData.filter((a) => a.genres.includes(selectedFilter));

  const featured = albumsData.find((a) => a.featured) ?? albumsData[0];

  return (
    <div className="flex h-screen bg-[#F8F0E3] text-[#3A2A24] font-['Playfair_Display',serif]">
      <Navbar />
      <main className="flex-1 overflow-y-auto pb-24">
        {/* TOP BAR */}
        <div className="sticky top-0 z-30 bg-[#D3B995] shadow-md px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <SearchBar term={term} setTerm={setTerm} />
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

          {/* Featured */}
          <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
            <div
              className="h-72 bg-cover bg-center relative"
              style={{
                backgroundImage: `url(${
                  featured.background ?? featured.image
                })`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#E6D7C3] via-[#C8A97E]/80 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col md:flex-row items-start md:items-center">
                <div className="relative w-48 h-48 md:w-56 md:h-56 mb-4 md:mb-0 md:mr-8">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="rounded-md shadow-xl object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase font-semibold">
                    Featured Album
                  </p>
                  <h2 className="text-4xl font-bold mb-1 max-w-xl leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-xl opacity-80 mb-4">{featured.artist}</p>
                  <p className="mb-6">
                    {featured.releaseYear} • {featured.tracks} movements •{" "}
                    {featured.duration}
                  </p>
                  <div className="flex space-x-4">
                    <button className="bg-[#C8A97E] hover:bg-[#A67C52] text-white font-medium rounded-full px-8 py-3 shadow-lg">
                      Play
                    </button>
                    <button className="border border-[#C8A97E] text-[#3A2A24] font-medium rounded-full px-8 py-3 hover:bg-[#C8A97E]/20">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Browse categories */}
          <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {browseCategories.map((c) => (
              <Link
                href={`/browse/${c.name.toLowerCase().replace(/\s+/g, "-")}`}
                key={c.name}
              >
                <div
                  className={`bg-gradient-to-r ${c.color} h-24 rounded-xl p-5 text-white flex items-center justify-between hover:shadow-xl transition-shadow`}
                >
                  <h3 className="text-xl font-bold drop-shadow-md">{c.name}</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white/80"
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
                </div>
              </Link>
            ))}
          </div>

          {/* Filter chips */}
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
        </section>
      </main>
    </div>
  );
}
