"use client";

import React from "react";
import { useState } from "react";
import { ChevronDown, Edit, Settings } from "lucide-react";
import songs from "./songs.json";
import Pagination from "@mui/material/Pagination";
import Image from "next/image";

export default function SongManagementAdmin() {
  const [currentPage, setCurrentPage] = useState(1);
  //setting the hooks for time but havent got function to change it

  // Sample data from the image
  const songsPerPage = 10;
  const totalPages = Math.ceil(songs.length / songsPerPage);

  function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
    setCurrentPage(value);
    console.log(event, value);
  }

  return (
    <div className="p-6 bg-gray-50 h-full">
      <div className="flex justify-between items-center mb-6">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium">
          Dashboard
        </button>
        <div className="flex gap-2">
          <button className="rounded-full p-2 border border-sky-900/70 bg-white">
            <Settings size={18} className="text-sky-900/70" />
          </button>
          <div>
            <button className="flex items-center gap-2 border border-sky-900/70 bg-white rounded-md px-3 py-1.5 text-sm text-sky-900/70">
              <p>Last 7 days</p>
              <ChevronDown size={16} />
            </button>
          </div>
          <button className="flex items-center gap-2 border border-sky-900/70 bg-white rounded-md px-3 py-1.5 text-sm text-sky-900/70">
            <Image
              src="../../Download_icon.svg"
              alt="download icon"
              width={20}
              height={20}
            />
            Download as CSV
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-black ">Uninspected Songs</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Songs
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Contributors
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-1">
                    Approved
                    <ChevronDown size={16} className="text-blue-600" />
                  </div>
                </th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {songs
                .slice(
                  (currentPage - 1) * songsPerPage,
                  currentPage * songsPerPage
                )
                .map((song) => (
                  <tr key={song.id} className="border-t border-gray-200">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {song.date}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {song.title}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {song.contributor}
                    </td>
                    <td className="py-3 px-4">
                      {song.approved === "pending" ? (
                        <div className="bg-yellow-500 text-white text-xs font-medium py-1 px-2 rounded-full w-16 text-center">
                          Pending
                        </div>
                      ) : (
                        <div className="bg-green-500 text-white text-xs font-medium py-1 px-1 rounded-full w-16 text-center">
                          Approved
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-500">
                        {/* using lucide icon */}
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="py-3 px-4 flex items-center justify-center border-t border-gray-200">
          {/* normal chosen css can change later on */}
          <div className="flex items-center gap-2">
            <Pagination
              count={totalPages}
              page={currentPage}
              // Pagination automatically know the value which is the page number the user click in.
              onChange={handlePageChange}
              siblingCount={1}
            />
          </div>
          <div>
            <button className="text-blue-500 text-sm hover:text-yellow-500 mb-1">
              Show all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
