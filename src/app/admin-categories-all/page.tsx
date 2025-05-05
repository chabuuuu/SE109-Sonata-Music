"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import * as XLSX from "xlsx";
import {
  FolderPlus,
  Inbox,
  Cog,
  ChevronDown,
  Download,
  Search,
  XCircle,
  Info,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  songsCount: string;
  views: string;
  releaseDate: string;
  createdBy: string;
  description: string;
}

// Sample data
const initialData: Category[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `ENG${i + 1}`,
  name: `ABC app ${i + 1}`,
  songsCount: "ABCAPP",
  views: "In progress",
  releaseDate: "11.01.2008",
  createdBy: "11.01.2009",
  description: "ABCAPP TOP 1 SONG IN THE WORLD YOU CAN SEE HERE",
}));

export default function AdminCategoriesAllPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // set API

  useEffect(() => {
    fetch("https://api.sonata.io.vn/api/v1/category")
      .then((res) => res.json()) // Parse the response as JSON
      .then((data) => {
        // Assuming the 'data' field contains the categories
        if (data.success && data.data) {
          // Map the API response to match your Category interface
          const mappedData = data.data.map((category: any) => ({
            id: category.id,
            name: category.name,
            songsCount: "N/A", // Modify this as needed based on the actual data
            views: "N/A", // Modify this as needed based on the actual data
            releaseDate: category.createAt, // You can adjust this field as per your requirement
            createdBy: category.updateAt, // You can adjust this field as per your requirement
            description: "N/A", // Modify this as needed based on the actual data
          }));

          setCategories(mappedData); // Store the mapped data in the state
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Filter logic
  const filtered = useMemo(
    () =>
      categories.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.id.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [categories, searchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filtered.length, totalPages, currentPage]);

  // Paginate
  const paginatedData = useMemo(() => {
    if (pageSize >= filtered.length) return filtered;
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Handlers
  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };
  const handleShowAll = () => {
    setPageSize(filtered.length || 1);
    setCurrentPage(1);
  };
  const handleDownloadCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Songs count",
      "Views",
      "Release date",
      "Created by",
      "Description",
    ];
    const rows = filtered.map((c) => [
      c.id,
      c.name,
      c.songsCount,
      c.views,
      c.releaseDate,
      c.createdBy,
      c.description,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "categories.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map((c) => ({
        ID: c.id,
        Name: c.name,
        "Songs count": c.songsCount,
        Views: c.views,
        "Release date": c.releaseDate,
        "Created by": c.createdBy,
        Description: c.description,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Categories");
    XLSX.writeFile(wb, "categories.xlsx");
  };

  return (
    <AdminLayout>
      <div className="h-full bg-gray-100 p-6 relative">
        {/* Left action buttons */}
        <div className="absolute top-6 left-6 flex space-x-4">
          <Link
            href="/admincategories"
            className="w-36 h-20 bg-white text-gray-600 rounded-xl border border-gray-200 flex flex-col items-center justify-center"
          >
            <FolderPlus size={24} className="mb-1 text-black" />
            <span className="text-sm font-medium text-black">
              Add Categories
            </span>
          </Link>
          <Link
            href="/adminall"
            className="w-36 h-20 bg-blue-600 text-white rounded-xl flex flex-col items-center justify-center"
          >
            <Inbox size={24} className="mb-1 text-white" />
            <span className="text-sm font-medium text-white">All</span>
          </Link>
        </div>

        {/* Top-right controls */}
        <div className="absolute top-6 right-6 flex items-center space-x-3">
          <button className="w-10 h-10 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center">
            <Cog size={20} className="text-black" />
          </button>
          <button className="inline-flex items-center bg-white rounded-lg shadow border border-gray-200 px-3 h-10">
            <span className="text-sm text-black">Last 7 days</span>
            <ChevronDown size={16} className="ml-1 text-black" />
          </button>
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center bg-white rounded-lg shadow border border-gray-200 px-3 h-10"
          >
            <span className="text-sm text-black">Download as CSV</span>
            <Download size={16} className="ml-1 text-black" />
          </button>
        </div>

        {/* Main content */}
        <div className="h-full bg-white p-6 pt-32 flex flex-col overflow-hidden">
          {/* Header: Found + Search + Export */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-black">
                Found: {filtered.length}
              </span>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8 pr-12 h-10 bg-gray-100 rounded-lg text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 border border-transparent"
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

            {/* ← Export to Excel */}
            <button
              onClick={handleExportExcel}
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
                    "Songs count",
                    "Views",
                    "Release date",
                    "Created by",
                    "Description",
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
                {paginatedData.map((c) => (
                  <tr
                    key={c.id}
                    className="odd:bg-gray-50 even:bg-white hover:bg-gray-100"
                  >
                    <td className="px-3 py-2 text-black">{c.id}</td>
                    <td className="px-3 py-2 text-black">{c.name}</td>
                    <td className="px-3 py-2 text-black">{c.songsCount}</td>
                    <td className="px-3 py-2 text-black">{c.views}</td>
                    <td className="px-3 py-2 text-black">{c.releaseDate}</td>
                    <td className="px-3 py-2 text-black">{c.createdBy}</td>
                    <td className="px-3 py-2 text-black">{c.description}</td>
                    <td className="px-3 py-2 flex space-x-2">
                      <button onClick={() => handleDelete(c.id)}>
                        <XCircle size={20} className="text-red-500" />
                      </button>
                      <button>
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
            <button
              onClick={handleShowAll}
              className="ml-4 text-black underline"
            >
              Show all
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
