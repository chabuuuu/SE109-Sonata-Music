"use client";

import React, { useState, useEffect } from "react";
import { Download, Search, XCircle, Info } from "lucide-react";
import axios from "axios";
import { ADMIN_TOKEN } from "@/constant/adminToken";
import * as AlbumType from "./album-api-type";
import AddAlbumsModal from "./edit-album-modal";

export default function AllAlbumsPage() {
  const [albums, setAlbums] = useState<AlbumType.Album[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [popup, setPopup] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumType.Album | null>(
    null
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Fetch (or search) whenever searchTerm, currentPage or pageSize change
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const filters = searchTerm
          ? [
              {
                operator: "like",
                key: "name",
                value: searchTerm,
              },
            ]
          : [];
        const response = await axios.post(
          `https://api.sonata.io.vn/api/v1/album/search?rpp=${pageSize}&page=${currentPage}`,
          { filters, sorts: [{ key: "id", type: "DESC" }] },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
            },
          }
        );

        setAlbums(response.data.data.items);
        setTotalCount(response.data.data.total);
      } catch (err) {
        console.error("Failed to fetch/search albums:", err);
      }
    };

    fetchCategories();
  }, [searchTerm, currentPage, pageSize]);

  // handle delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://api.sonata.io.vn/api/v1/album/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
        },
      });
      // Refetch current page so count & pages stay in sync
      setCurrentPage(1);
    } catch (err) {
      console.error("Error deleting music:", err);
      alert("Failed to delete music. Please try again.");
    }
  };

  const handleShowAll = () => {
    setPageSize(totalCount || 1);
    setCurrentPage(1);
  };

  const handleDownloadCSV = () => {
    const headers = [
      "Name",
      "Album Type",
      "Release date (Create at)",
      "Picture Link",
      "Description",
      
    ];

    const rows = albums.map((c) => [
      c.name,
      c.albumType,
      c.releaseDate,
      c.coverPhoto,
      c.description,
    ]);

    // Add BOM (Byte Order Mark) for proper UTF-8 encoding
    const BOM = "\uFEFF";
    const csv =
      BOM +
      [headers, ...rows]
        .map((r) =>
          r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Albums.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCloseModal = () => {
    setPopup(false);
    setSelectedAlbum(null);
  };


  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0"); // Month is 0-based
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  // Example usage
  const formatted = formatDate("1905-06-15T00:00:00.000Z");
  console.log(formatted); // "1905/06/15"

  return (
    <div className="">
      <div className="h-full bg-white p-6 flex flex-col justify-start ">
        {/* Main content */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 ">
            <span className="text-sm font-medium text-black w-1/5">
              Found: {totalCount}
            </span>
            <div className="relative w-full">
              {/* Remove flex, gap-5, w-100, space-around */}
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
              />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-20 h-10 bg-gray-100 rounded-lg text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 border border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-black"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center bg-white rounded-lg shadow-sm border border-blue-600 px-4 h-10"
          >
            <Download size={16} className="mr-2 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              Export to Excel
            </span>
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                {[
                  "Name",
                  "Album Type",
                  "Description",
                  "Release date (Create at)",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 font-semibold text-black text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {albums.map((c) => (
                <tr
                  key={c.name}
                  className="odd:bg-gray-50 even:bg-white hover:bg-gray-100"
                >
                  <td className="px-3 py-2 text-black">{c.name}</td>
                  <td className="px-3 py-2 text-black">{c.albumType}</td>
                  <td className="px-3 py-2 text-black">{c.description}</td>
                  <td className="px-3 py-2 text-black">{formatDate(c.releaseDate)}</td>
                  <td className="px-3 py-2 flex space-x-2">
                    <button onClick={() => handleDelete(c.id)}>
                      <XCircle size={20} className="text-red-500" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAlbum(c);
                        setPopup(true);
                      }}
                    >
                      <Info size={20} className="text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-4 space-x-2 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-2 py-1 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-black"
            }`}
          >
            ← Previous
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2 py-1 ${
                  page === currentPage
                    ? "bg-blue-600 text-white rounded"
                    : "text-black"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-black"
            }`}
          >
            Next →
          </button>

          <button onClick={handleShowAll} className="ml-4 text-black underline">
            Show all
          </button>
        </div>
      </div>
      {popup && selectedAlbum && (
        <AddAlbumsModal albumId={selectedAlbum.id} onClose={handleCloseModal} />
      )}
    </div>
  );
}
