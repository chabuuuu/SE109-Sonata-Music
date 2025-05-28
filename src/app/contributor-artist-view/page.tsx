"use client";

import React, { useState } from "react";
import {
  Users,
  ChevronDown,
  Download,
  Settings,
  Loader2,
} from "lucide-react";

import ContributorLayout from "@/components/contributor-layout";
import All_artists from ".//all_artists";

// Loading spinner component
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-600 text-sm">Loading artists data...</p>
    </div>
  );
};

export default function ArtistsManagement() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Simulate API loading - replace with your actual API logic
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate 2 seconds loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <ContributorLayout>
      {/* Main container with consistent white background */}
      <div className="bg-white min-h-screen w-full">
        {/* Top Action Bar */}
        <div className="bg-white p-6 w-full mx-auto">
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-2 m-2 md:m-6">
            {/* Action Buttons */}
            <div className="flex space-x-2">
              <div
                onClick={() => setSelectedTab("all")}
                className={`flex flex-col items-center justify-center w-12 md:w-24 h-24 p-3 md:p-4 rounded-lg border shadow-md font-semibold transition-colors 
                  ${
                    selectedTab === "all"
                      ? "bg-blue-700 text-white"
                      : "bg-white text-black border-gray-200 hover:bg-gray-100"
                  }`}
              >
                <Users size={20} className="md:size-24 text-white-500" />
                <div className="text-xs mt-1">All Artists</div>
              </div>
            </div>

            {/* Utility Buttons */}
            <div className="flex md:ml-auto items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              <button 
                className="border border-gray-500 rounded-md p-2 flex-shrink-0 disabled:opacity-50"
                disabled={isLoading}
              >
                <Settings size={16} className="text-gray-500" />
              </button>

              <div className="border border-gray-500 rounded-md px-2 md:px-3 py-2 flex items-center flex-shrink-0">
                <span className="text-xs md:text-sm mr-1 md:mr-2 text-gray-500">
                  Last 7 days
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </div>

              <button 
                className="border border-gray-500 rounded-md px-2 md:px-3 py-2 flex items-center flex-shrink-0 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={16} className="text-gray-400 mr-1 md:mr-2 animate-spin" />
                ) : (
                  <Download size={16} className="text-gray-500 mr-1 md:mr-2" />
                )}
                <span className="text-xs md:text-sm text-gray-500">
                  Download as CSV
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content area with loading states */}
        <div className="bg-white">
          {isLoading ? (
            <LoadingSpinner />
            
          ) : (
            <All_artists />
          )}
        </div>
      </div>
    </ContributorLayout>
  );
}