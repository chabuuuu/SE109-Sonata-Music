"use client";

import { useRef } from "react";
import { Search, X } from "lucide-react";

const SearchModal = ({onClose}:{onClose: () => void}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // treats the var e as a Node( DOM element) and call contais wont raise error
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleXButton = () => {
    onClose();
  }
  return (
    <div
      onClick={handleBackdropClick}
      className="w-3/4 h-6/7 rounded-lg border fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop-filter backdrop-brightness-75 backdrop-blur-md flex justify-center items-center"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden p-5"
      >
        <div className="bg-gray-100 p-3 flex items-center border-b rounded-xl shadow-xl mb-3">
          <Search className="text-gray-500 mr-2" size={20} />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent flex-grow outline-none text-gray-700"
          />
          <button className="p-1 rounded-full hover:bg-gray-200" onClick={handleXButton}>
            <X className="text-gray-500" size={20} />
          </button>
        </div>

        <div className="h-64 bg-gray-200">
          {/* Content area for search results would go here */}
        </div>

        <div className="p-3 bg-white flex justify-between">
          <button className="px-6 py-2 bg-red-700 text-white font-semibold rounded-full hover:bg-red-500 transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-green-700 text-white font-semibold w-25 rounded-full hover:bg-green-600 transition-colors">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
