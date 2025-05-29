"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { FolderPlus, Music, UserIcon } from "lucide-react";
import { Download, Search, XCircle, Info } from "lucide-react";
import axios from "axios";
import { ADMIN_TOKEN } from "@/constant/adminToken";
import * as MusicType from "../../../types/search-music-type";
import ApproveModal from "./approve-modal-song";

export default function AdminApprovePage() {
  const [musics, setMusics] = useState<MusicType.Music[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [popup, setPopup] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<MusicType.Music | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState(0);

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
          `https://api.sonata.io.vn/api/v1/music/search/waiting-for-approve?rpp=${pageSize}&page=${currentPage}`,
          { filters, sorts: [{ key: "id", type: "DESC" }] },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
            },
          }
        );

        setMusics(response.data.data.items);
        setTotalCount(response.data.data.total);
      } catch (err) {
        console.error("Failed to fetch/search categories:", err);
      }
    };

    fetchCategories();
  }, [searchTerm, currentPage, pageSize, refreshKey]);

  // handle delete
  const handleReject = async (id: number) => {
    try {
      await axios.put(`https://api.sonata.io.vn/api/v1/music/reject/${id}`,{}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
        },
      });
      // Refetch current page so count & pages stay in sync
      setCurrentPage(1);
      console.log("Rejected succesfully.", id);
      alert("Successfully deleted.")
      setRefreshKey((prev) => (prev + 1));
    } catch (err) {
      console.error("Error rejecting music:", err);
      alert("Failed to reject music. Please try again.");
    }
  };

  const handleShowAll = () => {
    setPageSize(totalCount || 1);
    setCurrentPage(1);
  };

  const handleDownloadCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Artist",
      "Listen count",
      "Genres",
      "Release date (Create at)",
      "Composer name",
      "Periods",
    ];

    const rows = musics.map((c) => [
      c.id,
      c.name,
      c.artists.map((a) => a.name).join(", "),
      c.listenCount,
      c.genres.map((genre) => genre.name).join(", "),
      new Date(c.createAt).toLocaleDateString("en-CA"),
      c.composers.map((composer) => composer.name).join(", "),
      c.periods.map((period) => period.name).join(", "),
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
    a.download = "music_songs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCloseModal = () => {
    setPopup(false);
    setSelectedMusic(null);
    setRefreshKey((prev) => (prev + 1));
  };

  return (
    <AdminLayout>
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
                href="../admin-add-song"
                className="bg-white hover:bg-gray-50 text-gray-600 px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-all"
              >
                <Music className="w-4 h-4" />
                Add Songs
              </a>
              <a
                href="../admin-add-albums"
                className="bg-white hover:bg-gray-50 text-gray-600 px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-all"
              >
                <FolderPlus className="w-4 h-4" />
                Add Albums
              </a>
              <a href="../admin-view-all" className="bg-white hover:bg-gray-50 text-gray-600 px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-all">
                <UserIcon className="w-4 h-4" />
                View All
              </a>

              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-all hover:bg-blue-600">
                <UserIcon className="w-4 h-4" />
                Approve Music
              </button>
            </div>
          </div>

          {/* Main sections */}
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
                        "ID",
                        "Name",
                        "Artist",
                        "Listen count",
                        "Genres",
                        "Release date (Create at)",
                        "Composer name",
                        "Periods",
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
                    {musics.map((c) => (
                      <tr
                        key={c.id}
                        className="odd:bg-gray-50 even:bg-white hover:bg-gray-100"
                      >
                        <td className="px-3 py-2 text-black">{c.id}</td>
                        <td className="px-3 py-2 text-black">{c.name}</td>
                        <td className="px-3 py-2 text-black">
                          {c.artists.map((a) => a.name).join(", ")}
                        </td>
                        <td className="px-3 py-2 text-black">
                          {c.listenCount}
                        </td>
                        <td className="px-3 py-2 text-black">
                          {c.genres.map((genre) => genre.name).join(", ")}
                        </td>
                        <td className="px-3 py-2 text-black">
                          {new Date(c.createAt).toLocaleDateString("en-CA")}
                        </td>
                        <td className="px-3 py-2 text-black">
                          {c.composers
                            .map((composer) => composer.name)
                            .join(", ")}
                        </td>
                        <td className="px-3 py-2 text-black">
                          {c.periods.map((period) => period.name).join(", ")}
                        </td>
                        <td className="px-3 py-2 flex space-x-2">
                          <button onClick={() => handleReject(c.id)}>
                            <XCircle size={20} className="text-red-500" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMusic(c);
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-black"
                  }`}
                >
                  Next →
                </button>

                <button
                  onClick={handleShowAll}
                  className="ml-4 text-black underline"
                >
                  Show all
                </button>
              </div>
            </div>
            {popup && selectedMusic && (
              <ApproveModal
                musicId={selectedMusic.id}
                onClose={handleCloseModal}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
