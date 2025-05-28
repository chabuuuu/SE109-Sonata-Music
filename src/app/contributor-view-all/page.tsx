"use client";

import React, { useState } from "react";
import ContributorLayout from "@/components/contributor-layout";
import { FolderPlus, Music, UserIcon } from "lucide-react";
import AllSongsPage from "./view-all-songs";
import AllAlbumsPage from "./view-all-albums";

export default function ContributorViewAllPage() {
  const [selectedTab, setSelectedTab] = useState("");

  return (
    <ContributorLayout>
      <div className="min-h-screen bg-gray-100 p-6 relative">
        <div className="h-full bg-white p-6 flex flex-col justify-start ">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Management
            </h1>
            <p className="text-gray-600">
              Add and organize your music collection
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border">
            {/* Main tab */}
            <div className="flex">
              <a
                href="../contributor-add-song"
                className="bg-white hover:bg-gray-50 text-gray-600 px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-all"
              >
                <Music className="w-4 h-4" />
                Add Songs
              </a>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-all hover:bg-blue-600">
                <UserIcon className="w-4 h-4" />
                View All
              </button>
            </div>
          </div>
          {/* Sub tabs */}
          <div className="flex items-center gap-2 mb-8 bg-white p-2 rounded-xl justify-center">
            <button
              onClick={() => setSelectedTab("songs")}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                selectedTab === "songs"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white border hover:bg-gray-300 text-gray-600"
              }`}
            >
              <Music className="w-4 h-4" />
              View all Songs
            </button>
            <button
              onClick={() => setSelectedTab("albums")}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                selectedTab === "albums"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white border hover:bg-gray-300 text-gray-600"
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              View all Albums
            </button>
          </div>
          {/* render which  */}
          {selectedTab === "songs" ? (
            <AllSongsPage />
          ) : selectedTab === "albums" ? (
            <AllAlbumsPage />
          ) : null}
        </div>
      </div>
    </ContributorLayout>
  );
}
