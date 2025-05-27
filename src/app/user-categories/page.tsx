"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/services/categoryService";
import { Category } from "@/interfaces/category";

/*****************************************************************
 *  CLASSICAL CATEGORIES PAGE – Tích hợp API Categories từ Sonata
 *  Thiết kế ảnh categories đẹp và hiện đại
 *****************************************************************/

const navTabs: Array<"Categories" | "Artists" | "Albums"> = [
  "Categories",
  "Artists", 
  "Albums",
];

/******************************
 *  SEARCH BAR COMPONENT      *
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
  const [tab, setTab] = useState<"Categories" | "Artists" | "Albums">("Categories");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [term, setTerm] = useState("");
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy categories từ API khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setApiCategories(data);
      } catch (error) {
        console.error('Lỗi khi lấy categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Lọc categories theo từ khóa tìm kiếm
  const filteredCategories = apiCategories.filter(category =>
    category.name.toLowerCase().includes(term.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F8F0E3] text-[#3A2A24] font-['Playfair_Display',serif]">
      {/* Sidebar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {/* TOP BAR */}
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

              {/* View toggle */}
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

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A97E]"></div>
              <span className="ml-3 text-[#6D4C41]">Đang tải categories...</span>
            </div>
          )}

          {/* No categories found */}
          {!loading && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#6D4C41] text-lg">
                {term ? `Không tìm thấy category nào với từ khóa "${term}"` : 'Không có categories nào'}
              </p>
            </div>
          )}

          {/* GRID VIEW - Thiết kế ảnh đẹp */}
          {!loading && view === "grid" && filteredCategories.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
              {filteredCategories.map((category: Category) => (
                <Link
                  href={`/user-category/${category.id}`}
                  key={category.id}
                  className="group"
                >
                  <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                    {/* Background image với zoom effect */}
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={category.picture || '/images/default-category.jpg'}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/default-category.jpg';
                        }}
                      />
                    </div>

                    {/* Gradient overlay đẹp */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>

                    {/* Floating decorative image ở góc với shadow và border */}
                    <div className="absolute top-4 right-4 w-16 h-16 z-20 group-hover:rotate-6 transition-transform duration-500">
                      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl ring-2 ring-white/30 backdrop-blur-sm">
                        <Image
                          src={category.picture || '/images/default-category.jpg'}
                          alt={category.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/default-category.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>
                    </div>
                    
                    {/* Content overlay với typography đẹp */}
                    <div className="absolute inset-0 p-5 flex flex-col justify-between z-20">
                      <div></div>
                      <div>
                        <h3 className="text-lg font-bold text-white drop-shadow-lg mb-2">
                          {category.name}
                        </h3>
                        <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 inline-block">
                          <span className="text-sm text-white/90 font-medium">
                            {category.totalMusics} bài • {category.viewCount} views
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subtle decorative dots */}
                    <div className="absolute bottom-3 left-3 flex space-x-1 z-20">
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* LIST VIEW - Thiết kế ảnh enhanced */}
          {!loading && view === "list" && filteredCategories.length > 0 && (
            <div className="space-y-4 mb-12">
              {filteredCategories.map((category: Category) => (
                <Link
                  href={`/user-category/${category.id}`}
                  key={category.id}
                  className="block group"
                >
                  <div className="flex items-center bg-[#F0E6D6] border border-[#D3B995] rounded-2xl p-5 hover:bg-[#E6D7C3]/70 hover:shadow-lg transition-all duration-300 group-hover:scale-[1.01]">
                    {/* Enhanced image container với multiple layers */}
                    <div className="relative w-20 h-20 rounded-2xl mr-6 overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      {/* Main background image */}
                      <Image
                        src={category.picture || '/images/default-category.jpg'}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/default-category.jpg';
                        }}
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      
                      {/* Floating mini image ở góc với border đẹp */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg overflow-hidden shadow-lg ring-2 ring-white/60 group-hover:rotate-12 transition-transform duration-300">
                        <Image
                          src={category.picture || '/images/default-category.jpg'}
                          alt={category.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/default-category.jpg';
                          }}
                        />
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute bottom-1 left-1 w-2 h-2 bg-white/50 rounded-full"></div>
                      <div className="absolute top-1 right-1 w-1 h-1 bg-white/70 rounded-full"></div>
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-[#3A2A24] group-hover:text-[#C8A97E] transition-colors duration-300 mb-2">
                        {category.name}
                      </h3>
                      
                      <div className="flex items-center gap-6 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#C8A97E]/20 flex items-center justify-center">
                            <svg className="w-3 h-3 text-[#C8A97E]" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-[#6D4C41]">
                            {category.totalMusics} bài hát
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#C8A97E]/20 flex items-center justify-center">
                            <svg className="w-3 h-3 text-[#C8A97E]" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-[#6D4C41]">
                            {category.viewCount} lượt xem
                          </span>
                        </div>
                      </div>
                      
                      {category.description && (
                        <p className="text-sm text-[#6D4C41]/80 line-clamp-2 leading-relaxed">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Enhanced arrow với background */}
                    <div className="ml-4 p-3 rounded-full bg-[#C8A97E]/10 group-hover:bg-[#C8A97E]/20 transition-all duration-300 group-hover:scale-110">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#C8A97E] group-hover:translate-x-1 transition-transform duration-300"
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
