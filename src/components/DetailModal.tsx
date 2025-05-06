"use client";

import { useRef } from "react";
import { X, Clock, Eye, User, Music } from "lucide-react";
import Image from "next/image";

type DetailModalProps = {
  onClose: () => void;
  data: {
    id: string;
    title: string;
    description: string;
    createAt?: string;
    views: string;
    createdBy: string;
    picture: string;
    songsCount: string
  };
};

const DetailModal = ({ onClose, data }: DetailModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 bg-opacity-70 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-3/4 max-w-2xl overflow-hidden border border-gray-200"
      >
        {/* Image Header Section */}
        <div className="relative h-56 w-full overflow-hidden">
          <Image 
            src={data.picture} 
            alt={data.title} 
            fill 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-all duration-300 text-white"
            onClick={onClose}
          >
            <X size={18} />
          </button>
          
          {/* Title on image */}
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-2xl font-bold text-white drop-shadow-md">
              {data.title || "Detail"}
            </h2>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6">
          {/* Stats Row */}
          <div className="flex items-center justify-between mb-6 px-2 py-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center space-x-1 text-gray-700">
              <Clock size={16} className="text-indigo-500" />
              <span className="text-sm">{data.createAt || "Recent"}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-700">
              <Eye size={16} className="text-indigo-500" />
              <span className="text-sm">{data.views} views</span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-700">
              <User size={16} className="text-indigo-500" />
              <span className="text-sm">{data.createdBy}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-700">
              <Music size={16} className="text-indigo-500" />
              <span className="text-sm">{data.songsCount} songs</span>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
              {data.description}
            </p>
          </div>
          
          {/* Additional Fields - hidden the ones we already show */}
          <div className="space-y-1">
            {Object.entries(data).map(([key, value]) => {
              if (
                ["id", "title", "description", "createAt", "views", "createdBy", "picture", "songsCount"].includes(key)
              )
                return null;
              return (
                <div key={key} className="text-sm text-gray-600 flex justify-between border-b border-gray-100 py-2">
                  <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> 
                  <span className="text-gray-800">{String(value)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <X size={18} className="mr-1" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;