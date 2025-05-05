"use client";

import React, { useActionState, useState } from "react";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  ChevronDown,
  Download,
  Settings,
} from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import Add_artist from "./add_artist";
import All_artists from "./all_artists";

export default function ArtistsManagement() {
  const [selectedTab, setSelectedTab] = useState("add");

  return (
    <AdminLayout>
      <div className="bg-white p-6 w-full mx-auto">
        {/* Top Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-2 m-2 md:m-6">
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <div
              onClick={() => setSelectedTab("add")}
              className={`flex flex-col items-center justify-center w-12 md:w-24 h-24 p-3 md:p-4 rounded-lg border shadow-md font-semibold transition-colors 
                ${
                  selectedTab === "add"
                    ? "bg-blue-700 text-white"
                    : "bg-white text-black border-gray-200 hover:bg-gray-100"
                }`}
            >
              <Plus size={20} className="md:size-24" />
              <div className="text-xs mt-1">Add Artist</div>
            </div>

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
            <button className="border border-gray-500 rounded-md p-2 flex-shrink-0">
              <Settings size={16} className="text-gray-500" />
            </button>

            <div className="border border-gray-500 rounded-md px-2 md:px-3 py-2 flex items-center flex-shrink-0">
              <span className="text-xs md:text-sm mr-1 md:mr-2 text-gray-500">
                Last 7 days
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </div>

            <button className="border border-gray-500 rounded-md px-2 md:px-3 py-2 flex items-center flex-shrink-0">
              <Download size={16} className="text-gray-500 mr-1 md:mr-2" />
              <span className="text-xs md:text-sm text-gray-500">
                Download as CSV
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* conditional rendering */}
      {selectedTab === "add" ? <Add_artist /> : <All_artists />}
    </AdminLayout>
  );
}
