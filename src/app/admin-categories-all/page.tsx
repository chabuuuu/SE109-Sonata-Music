"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import * as XLSX from "xlsx";
import {
  FolderPlus,
  Inbox,
  Download,
  Search,
  XCircle,
  Info,
} from "lucide-react";
import axios from "axios";
import DetailModal from "@/components/DetailModal";
import { ADMIN_TOKEN } from "@/constant/adminToken";

interface Category {
  id: string;
  name: string;
  songsCount: string;
  totalMusics: string;
  viewCount: string;
  views: string;
  releaseDate: string;
  createAt: string;
  createdBy: string;
  description: string;
  picture: string;
}

export default function AdminCategoriesAllPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [popup, setPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
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
          `https://api.sonata.io.vn/api/v1/category/search?rpp=${pageSize}&page=${currentPage}`,
          { filters, sorts: [{ key: "id", type: "DESC" }] },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
            },
          }
        );

        const { items, total } = response.data.data;

        // Map API items into our Category shape
        const mapped: Category[] = items.map((item: Category) => ({
          id: item.id,
          name: item.name || "Untitled",
          picture: item.picture || "default.jpg",
          songsCount: String(item.totalMusics ?? 0),
          views: String(item.viewCount ?? 0),
          releaseDate: item.createAt
            ? new Date(item.createAt).toLocaleDateString()
            : "Unknown",
          createAt: item.createAt || "",
          createdBy: "System",
          description: item.description || "Imported from API",
        }));

        setCategories(mapped);
        setTotalCount(total);
      } catch (err) {
        console.error("Failed to fetch/search categories:", err);
      }
    };

    fetchCategories();
  }, [searchTerm, currentPage, pageSize]);

  // handle delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://api.sonata.io.vn/api/v1/category/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
        },
      });
      // Refetch current page so count & pages stay in sync
      setCurrentPage(1);
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category. Please try again.");
    }
  };

  const handleShowAll = () => {
    setPageSize(totalCount || 1);
    setCurrentPage(1);
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      categories.map((c) => ({
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
            href="/admin-categories-add"
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

        {/* Main content */}
        <div className="h-full bg-white p-6 pt-32 flex flex-col overflow-hidden">
          {/* Header: Found + Search + Export */}
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
                {categories.map((c) => (
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
                      <button
                        onClick={() => {
                          setSelectedCategory(c);
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

            <button
              onClick={handleShowAll}
              className="ml-4 text-black underline"
            >
              Show all
            </button>
          </div>
        </div>
      </div>

      {popup && selectedCategory && (
        <DetailModal
          data={{
            id: selectedCategory.id,
            title: selectedCategory.name,
            createAt: selectedCategory.releaseDate,
            description: selectedCategory.description,
            songsCount: selectedCategory.songsCount,
            views: selectedCategory.views,
            createdBy: selectedCategory.createdBy,
            picture: selectedCategory.picture,
          }}
          onClose={() => {
            setPopup(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </AdminLayout>
  );
}
