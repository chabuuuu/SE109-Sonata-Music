"use client";

import React, { useState } from "react";
import {
  Plus,
  Users
} from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import Add_artist from "./add_artist";
import All_artists from "./all_artists";

export default function ArtistsManagement() {
  const [selectedTab, setSelectedTab] = useState("all");

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
        </div>
      </div>

      {/* conditional rendering */}
      {selectedTab === "add" ? <Add_artist /> : <All_artists />}
    </AdminLayout>
  );
}
