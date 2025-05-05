"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";

/*****************************************************************
 *  CLASSICAL CATEGORIES PAGE – Top‑bar unified with Albums page
 *  View‑toggle buttons now match Albums page styling
 *****************************************************************/

/******************************
 *  DATA – CATEGORY CARDS     *
 ******************************/
const categories = [
  // Row 1 – Dark → Light
  {
    title: "Choral Works",
    color: "bg-[#A67C52]/80",
    image: "/images/categories/choral.png",
  },
  {
    title: "Solo Violin",
    color: "bg-[#A67C52]/60",
    image: "/images/categories/violin.png",
  },
  {
    title: "Chamber Music",
    color: "bg-[#B08C66]/80",
    image: "/images/categories/chamber.png",
  },
  {
    title: "Minimalism",
    color: "bg-[#B08C66]/60",
    image: "/images/categories/minimalism.png",
  },
  {
    title: "Symphonies",
    color: "bg-[#C8A97E]/80",
    image: "/images/categories/symphony.png",
  },

  // Row 2 – Dark → Light
  {
    title: "Film Scores",
    color: "bg-[#C8A97E]/60",
    image: "/images/categories/filmscore.png",
  },
  {
    title: "Piano Works",
    color: "bg-[#C9AE8E]/80",
    image: "/images/categories/piano.png",
  },
  {
    title: "Renaissance",
    color: "bg-[#C9AE8E]/60",
    image: "/images/categories/renaissance.png",
  },
  {
    title: "Concertos",
    color: "bg-[#D3B995]/80",
    image: "/images/categories/concerto.png",
  },
  {
    title: "Modern Classical",
    color: "bg-[#DBC0A2]/80",
    image: "/images/categories/modern.png",
  },

  // Row 3 – Dark → Light
  {
    title: "Baroque Gems",
    color: "bg-[#D9C3A5]/80",
    image: "/images/categories/baroque.png",
  },
  {
    title: "Operas",
    color: "bg-[#E6D7C3]/80",
    image: "/images/categories/opera.png",
  },
  {
    title: "Oratorios",
    color: "bg-[#EDD7B7]/80",
    image: "/images/categories/oratorio.png",
  },
  {
    title: "Romantic Era",
    color: "bg-[#E8D8C1]/80",
    image: "/images/categories/romantic.png",
  },
  {
    title: "Ballet Suites",
    color: "bg-[#F0E6D6]/80",
    image: "/images/categories/ballet.png",
  },
];

const navTabs: Array<"Categories" | "Artists" | "Albums"> = [
  "Categories",
  "Artists",
  "Albums",
];

/******************************
 *  SEARCH BAR – Albums style *
 ******************************/
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

/******************************
 *    MAIN PAGE COMPONENT     *
 ******************************/
export default function CategoriesPage() {
  const [tab, setTab] = useState<"Categories" | "Artists" | "Albums">(
    "Categories"
  );
  const [view, setView] = useState<"grid" | "list">("grid");
  const [term, setTerm] = useState("");

  return (
    <div className="flex h-screen bg-[#F8F0E3] text-[#3A2A24] font-['Playfair_Display',serif]">
      {/* Sidebar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {/* TOP BAR – unified with Albums page */}
        <div className="sticky top-0 z-30 bg-[#D3B995] shadow-md px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <SearchBar term={term} setTerm={setTerm} />

            {/* Nav + View */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 gap-3">
              {/* Nav Tabs */}
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

              {/* View toggle – now matches Albums page */}
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
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="px-8 pt-6">
          <h2 className="text-3xl font-bold mb-6 tracking-wide">Explore All</h2>

          {/* GRID VIEW */}
          {view === "grid" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
              {categories.map((c) => (
                <Link
                  href={`/user-category/${c.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  key={c.title}
                  className="group"
                >
                  <div
                    className={`${c.color} relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow`}
                  >
                    <span className="absolute top-4 left-4 text-lg font-semibold drop-shadow text-[#F8F0E3]">
                      {c.title}
                    </span>
                    <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 rotate-12 w-24 h-24">
                      <Image
                        src={c.image}
                        alt={c.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {view === "list" && (
            <div className="space-y-3 mb-12">
              {categories.map((c) => (
                <Link
                  href={`/user-category/${c.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  key={c.title}
                  className="block"
                >
                  <div className="flex items-center bg-[#F0E6D6] border border-[#D3B995] rounded-xl p-4 hover:bg-[#E6D7C3]/70 transition-colors">
                    <div
                      className={`${c.color} w-16 h-16 rounded-lg mr-4 relative overflow-hidden flex-shrink-0`}
                    >
                      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 rotate-12 w-10 h-10">
                        <Image
                          src={c.image}
                          alt={c.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-[#3A2A24] group-hover:text-[#C8A97E] transition-colors duration-300">
                        {c.title}
                      </h3>
                      <p className="text-sm text-[#6D4C41]">
                        Khám phá {c.title.toLowerCase()} cổ điển
                      </p>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#6D4C41]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
