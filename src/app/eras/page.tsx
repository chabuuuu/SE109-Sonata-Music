"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import CustomImage from "@/components/CustomImage";
import SearchBar from "@/components/SearchBar";
import BottomBanner from "@/components/bottom_banner";
import { 
  searchPeriods, 
  Period, 
  PeriodSearchResponse 
} from "@/services/periodService";
import Link from "next/link";

// Component thẻ Era/Period
const EraCard: React.FC<{
  period: Period;
}> = ({ period }) => (
  <Link href={`/period/${period.id}`} className="block h-full">
    <article className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg hover:shadow-lg transition-all duration-300 group h-full flex flex-col cursor-pointer">
      <figure className="relative mb-4 rounded-md overflow-hidden">
        <CustomImage
          src={period.picture || "/default-period.jpg"}
          alt={period.name || "Era"}
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
            // Navigate to period detail page
            window.location.href = `/period/${period.id}`;
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
        
        {/* Era label */}
        <div className="absolute top-3 left-3 bg-[#8B4513]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Era
        </div>
        
        {/* Created date */}
        {period.createAt && (
          <div className="absolute top-3 right-3 bg-[#3A2A24]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {new Date(period.createAt).getFullYear()}
          </div>
        )}
      </figure>
      
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-1 text-[#3A2A24] truncate group-hover:text-[#C8A97E] transition-colors">
          {period.name}
        </h3>
        <p className="text-sm text-[#6D4C41] line-clamp-3 mb-3">
          {period.description || "Khám phá âm nhạc từ thời kỳ này"}
        </p>
        
        <div className="mt-auto pt-3 flex justify-between items-center">
          <span className="text-xs text-[#8D6C61]">Musical Era</span>
          <div className="flex space-x-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Add to favorites functionality if needed
              }}
              className="text-[#C8A97E] hover:text-[#A67C52] transition-colors"
              title="Explore Era"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  </Link>
);

const ErasPage: React.FC = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const router = useRouter();

  const periodsPerPage = 20;

  // Fetch periods với pagination
  const fetchPeriods = async (page: number) => {
    try {
      setLoading(true);
      
      const response: PeriodSearchResponse = await searchPeriods(periodsPerPage, page);
      
      if (response.success && response.data) {
        setPeriods(response.data.items);
        setTotalItems(response.data.total);
        setTotalPages(Math.ceil(response.data.total / periodsPerPage));
      } else {
        console.warn("Failed to fetch periods:", response.message);
        setPeriods([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thời kỳ âm nhạc:", error);
      setPeriods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-lg transition-colors ${
            i === currentPage
              ? "bg-[#C8A97E] text-white shadow-md"
              : "bg-[#F0E6D6] text-[#3A2A24] hover:bg-[#E6D7C3] border border-[#D3B995]"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-8 mb-4">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 rounded-lg bg-[#F0E6D6] text-[#3A2A24] hover:bg-[#E6D7C3] disabled:opacity-50 disabled:cursor-not-allowed border border-[#D3B995]"
          title="First page"
        >
          ««
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 rounded-lg bg-[#F0E6D6] text-[#3A2A24] hover:bg-[#E6D7C3] disabled:opacity-50 disabled:cursor-not-allowed border border-[#D3B995]"
          title="Previous page"
        >
          ‹
        </button>
        
        {pages}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 rounded-lg bg-[#F0E6D6] text-[#3A2A24] hover:bg-[#E6D7C3] disabled:opacity-50 disabled:cursor-not-allowed border border-[#D3B995]"
          title="Next page"
        >
          ›
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 rounded-lg bg-[#F0E6D6] text-[#3A2A24] hover:bg-[#E6D7C3] disabled:opacity-50 disabled:cursor-not-allowed border border-[#D3B995]"
          title="Last page"
        >
          »»
        </button>
      </div>
    );
  };

  return (
    <div className="flex relative font-['Playfair_Display',serif] text-[#3A2A24] bg-[#F8F0E3]">
      {/* Sidebar */}
      <Navbar />

      {/* Main */}
      <main className="flex-1 overflow-y-auto h-screen pb-28">
        {/* Search */}
        <SearchBar />

        {/* Header */}
        <section className="p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full bg-[#F0E6D6] hover:bg-[#E6D7C3] transition-colors border border-[#D3B995]"
              title="Quay lại"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#3A2A24]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-4xl font-bold tracking-wide">Musical Eras & Styles</h1>
              <p className="text-lg text-[#6D4C41] mt-2">
                Khám phá các thời kỳ âm nhạc qua từng kỷ nguyên
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="bg-[#F0E6D6] border border-[#D3B995] rounded-lg p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#C8A97E]">{totalItems}</div>
                <div className="text-sm text-[#6D4C41]">Thời kỳ âm nhạc</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#C8A97E]">
                  {currentPage}/{totalPages}
                </div>
                <div className="text-sm text-[#6D4C41]">Trang hiện tại</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#C8A97E]">{periods.length}</div>
                <div className="text-sm text-[#6D4C41]">Đang hiển thị</div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="px-6">
          {loading ? (
            // Loading state
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array(periodsPerPage)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={`loading-${i}`}
                    className="bg-[#F0E6D6] border border-[#D3B995] p-4 rounded-lg animate-pulse"
                  >
                    <div className="w-full aspect-square bg-[#D3B995] mb-4 rounded-md"></div>
                    <div className="h-5 bg-[#D3B995] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#D3B995] rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-[#D3B995] rounded w-full"></div>
                  </div>
                ))}
            </div>
          ) : periods.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {periods.map((period) => (
                  <EraCard
                    key={period.id}
                    period={period}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {renderPagination()}
              
              {/* Results info */}
              <div className="text-center text-sm text-[#6D4C41] mt-4 mb-8">
                Hiển thị {((currentPage - 1) * periodsPerPage) + 1} - {Math.min(currentPage * periodsPerPage, totalItems)} trong số {totalItems} thời kỳ âm nhạc
              </div>
            </>
          ) : (
            <div className="text-center py-16">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-[#3A2A24] mb-2">
                Không có thời kỳ âm nhạc nào
              </h3>
              <p className="text-[#6D4C41] mb-4">
                Hiện tại không có thời kỳ âm nhạc nào được tìm thấy. Vui lòng thử lại sau.
              </p>
              <button
                onClick={() => fetchPeriods(1)}
                className="px-6 py-3 bg-[#C8A97E] hover:bg-[#A67C52] text-white rounded-lg transition-colors shadow-md"
              >
                Thử lại
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Bottom Banner */}
      <BottomBanner />
    </div>
  );
};

export default ErasPage; 